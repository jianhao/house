import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { UserInfo, WechatLoginRequest } from '../types';

export class UserService {
  constructor(private fastify: FastifyInstance) {}

  /**
   * 微信登录
   */
  async wechatLogin(loginData: WechatLoginRequest) {
    const { code, encryptedData, iv } = loginData;

    try {
      // 1. 验证 code 是否存在
      if (!code) {
        throw new Error('微信授权码不能为空');
      }

      // 2. 通过 code 获取 session_key 和 openid
      const sessionResult = await this.getWechatSession(code);
      const { openid, session_key, unionid } = sessionResult;

      if (!openid) {
        throw new Error('获取用户标识失败');
      }

      // 3. 解密用户信息（如果提供了加密数据）
      let userInfo: any = { openid, unionid };
      if (encryptedData && iv && session_key) {
        try {
          const decryptedData = this.decryptWechatData(encryptedData, session_key, iv);
          userInfo = { ...userInfo, ...decryptedData };

          // 验证解密数据的完整性
          if (decryptedData.watermark && decryptedData.watermark.appid !== process.env.WECHAT_APPID) {
            this.fastify.log.warn('解密数据appid不匹配');
          }
        } catch (decryptError: any) {
          this.fastify.log.warn('解密用户信息失败，使用基础信息登录:', decryptError);
        }
      }

      // 4. 查找或创建用户
      let user = await this.findUserByOpenid(openid);
      if (!user) {
        user = await this.createUser({
          openid,
          unionid,
          nickname: userInfo.nickName || '微信用户',
          avatar: userInfo.avatarUrl || ''
        });
      } else {
        // 更新用户信息（如果有新的信息）
        if (userInfo.nickName || userInfo.avatarUrl) {
          await this.updateUserBasicInfo(user.id, {
            nickname: userInfo.nickName || user.nickname,
            avatar: userInfo.avatarUrl || user.avatar
          });
          // 重新获取更新后的用户信息
          user = await this.findUserByOpenid(openid);
        }
        // 更新最后登录时间
        await this.updateLastLogin(user.id);
      }

      // 5. 生成 JWT token
      const token = this.fastify.jwt.sign({ userId: user.id, openid: user.openid }, { expiresIn: '7d' });

      const refreshToken = this.fastify.jwt.sign({ userId: user.id, type: 'refresh' }, { expiresIn: '30d' });

      return {
        token,
        refreshToken,
        expiresIn: 7 * 24 * 60 * 60, // 7天（秒）
        user: {
          id: user.id,
          openid: user.openid,
          unionid: user.unionid,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone
        }
      };
    } catch (error) {
      this.fastify.log.error('微信登录失败:', error as any);

      // 根据不同错误类型返回不同的错误信息
      if (error instanceof Error) {
        if (error.message.includes('invalid code')) {
          throw new Error('微信授权码已过期，请重新登录');
        }
        if (error.message.includes('invalid appid')) {
          throw new Error('小程序配置错误，请联系管理员');
        }
        throw error;
      }

      throw new Error('登录失败，请重试');
    }
  }

  /**
   * 获取用户信息
   */
  async getUserProfile(userId: string): Promise<UserInfo | null> {
    const query = `
      SELECT 
        id, openid, unionid, nickname, avatar, phone, real_name as "realName",
        created_at as "registeredAt", last_login_at as "lastLoginAt"
      FROM users 
      WHERE id = $1
    `;

    const result = await this.fastify.pg.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  /**
   * 更新用户信息
   */
  async updateUserProfile(userId: string, updateData: Partial<UserInfo>) {
    const allowedFields = ['nickname', 'avatar', 'phone', 'real_name'];
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(updateData).forEach(([key, value]) => {
      const dbField = key === 'realName' ? 'real_name' : key;
      if (allowedFields.includes(dbField) && value !== undefined) {
        updates.push(`${dbField} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (updates.length === 0) {
      throw new Error('没有有效的更新字段');
    }

    updates.push(`updated_at = NOW()`);
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
    `;

    await this.fastify.pg.query(query, values);
  }

  /**
   * 获取用户收藏列表
   */
  async getUserCollections(userId: string, page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM collections c
      WHERE c.user_id = $1
    `;
    const countResult = await this.fastify.pg.query(countQuery, [userId]);
    const total = parseInt(countResult.rows[0].total);

    // 查询数据
    const dataQuery = `
      SELECT 
        h.id, h.name, h.cover_image as "coverImage", h.price, h.area, h.address,
        c.created_at as "collectedAt"
      FROM collections c
      JOIN houses h ON c.house_id = h.id
      WHERE c.user_id = $1 AND h.status = 'available'
      ORDER BY c.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const dataResult = await this.fastify.pg.query(dataQuery, [userId, pageSize, offset]);

    return {
      list: dataResult.rows,
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total
    };
  }

  /**
   * 添加收藏
   */
  async addCollection(userId: string, houseId: string) {
    // 检查房源是否存在
    const houseQuery = "SELECT id FROM houses WHERE id = $1 AND status = 'available'";
    const houseResult = await this.fastify.pg.query(houseQuery, [houseId]);

    if (houseResult.rows.length === 0) {
      throw new Error('房源不存在或已下架');
    }

    // 检查是否已收藏
    const existQuery = 'SELECT id FROM collections WHERE user_id = $1 AND house_id = $2';
    const existResult = await this.fastify.pg.query(existQuery, [userId, houseId]);

    if (existResult.rows.length > 0) {
      throw new Error('已经收藏过该房源');
    }

    // 添加收藏
    const insertQuery = `
      INSERT INTO collections (user_id, house_id, created_at)
      VALUES ($1, $2, NOW())
    `;

    await this.fastify.pg.query(insertQuery, [userId, houseId]);
  }

  /**
   * 取消收藏
   */
  async removeCollection(userId: string, houseId: string) {
    const query = 'DELETE FROM collections WHERE user_id = $1 AND house_id = $2';
    const result = await this.fastify.pg.query(query, [userId, houseId]);

    if (result.rowCount === 0) {
      throw new Error('收藏记录不存在');
    }
  }

  /**
   * 检查是否已收藏
   */
  async isCollected(userId: string, houseId: string): Promise<boolean> {
    const query = 'SELECT id FROM collections WHERE user_id = $1 AND house_id = $2';
    const result = await this.fastify.pg.query(query, [userId, houseId]);

    return result.rows.length > 0;
  }

  /**
   * 获取微信 session
   */
  private async getWechatSession(code: string) {
    const { WECHAT_APPID, WECHAT_SECRET } = process.env;

    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.errcode) {
      throw new Error(`微信登录失败: ${data.errmsg}`);
    }

    return data;
  }

  /**
   * 解密微信数据
   */
  private decryptWechatData(encryptedData: string, sessionKey: string, iv: string) {
    try {
      const decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(sessionKey, 'base64'), Buffer.from(iv, 'base64'));
      decipher.setAutoPadding(true);

      let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      this.fastify.log.error('解密微信数据失败:', error as any);
      throw new Error('数据解密失败');
    }
  }

  /**
   * 根据 openid 查找用户
   */
  private async findUserByOpenid(openid: string) {
    const query = `
      SELECT id, openid, unionid, nickname, avatar, phone, real_name as "realName"
      FROM users 
      WHERE openid = $1
    `;

    const result = await this.fastify.pg.query(query, [openid]);
    return result.rows[0] || null;
  }

  /**
   * 创建新用户
   */
  private async createUser(userData: { openid: string; unionid?: string; nickname: string; avatar: string }) {
    const query = `
      INSERT INTO users (openid, unionid, nickname, avatar, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, openid, unionid, nickname, avatar, phone, real_name as "realName"
    `;

    const result = await this.fastify.pg.query(query, [userData.openid, userData.unionid || null, userData.nickname, userData.avatar]);

    return result.rows[0];
  }

  /**
   * 更新用户基础信息
   */
  private async updateUserBasicInfo(userId: string, updateData: { nickname?: string; avatar?: string }) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updateData.nickname) {
      updates.push(`nickname = $${paramIndex}`);
      values.push(updateData.nickname);
      paramIndex++;
    }

    if (updateData.avatar) {
      updates.push(`avatar = $${paramIndex}`);
      values.push(updateData.avatar);
      paramIndex++;
    }

    if (updates.length > 0) {
      updates.push(`updated_at = NOW()`);
      const query = `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
      values.push(userId);
      await this.fastify.pg.query(query, values);
    }
  }

  /**
   * 更新最后登录时间
   */
  private async updateLastLogin(userId: string) {
    const query = 'UPDATE users SET last_login_at = NOW() WHERE id = $1';
    await this.fastify.pg.query(query, [userId]);
  }
}
