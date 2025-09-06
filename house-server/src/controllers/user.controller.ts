import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { collectionListSchema, updateProfileSchema, userProfileSchema, wechatLoginSchema } from '../schemas/user.schema';
import { UserService } from '../services/user.service';
import { WechatLoginRequest } from '../types';

export async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService(fastify);

  // 微信登录
  fastify.post('/auth/wechat', {
    schema: wechatLoginSchema,
    handler: async (
      request: FastifyRequest<{
        Body: WechatLoginRequest;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await userService.wechatLogin(request.body);

        reply.send({
          code: 200,
          message: '登录成功',
          data: result,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('微信登录失败:', error as any);
        reply.code(400).send({
          code: 400,
          message: error instanceof Error ? error.message : '登录失败',
          timestamp: Date.now()
        });
      }
    }
  });

  // 刷新 token
  fastify.post('/auth/refresh', {
    handler: async (
      request: FastifyRequest<{
        Body: { refreshToken: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { refreshToken } = request.body;

        // 验证 refresh token
        const decoded = fastify.jwt.verify(refreshToken) as any;
        if (decoded.type !== 'refresh') {
          throw new Error('无效的刷新令牌');
        }

        // 生成新的 access token
        const newToken = fastify.jwt.sign({ userId: decoded.userId }, { expiresIn: '7d' });

        reply.send({
          code: 200,
          message: '刷新成功',
          data: {
            token: newToken,
            expiresIn: 7 * 24 * 60 * 60
          },
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('刷新 token 失败:', error as any);
        reply.code(401).send({
          code: 401,
          message: '刷新令牌无效或已过期',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取用户信息
  fastify.get('/user/profile', {
    schema: userProfileSchema,
    preHandler: [fastify.authenticate],
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = (request.user as any).userId;
        const userInfo = await userService.getUserProfile(userId);

        if (!userInfo) {
          return reply.code(404).send({
            code: 404,
            message: '用户不存在',
            timestamp: Date.now()
          });
        }

        reply.send({
          code: 200,
          message: '获取成功',
          data: userInfo,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取用户信息失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 更新用户信息
  fastify.put('/user/profile', {
    schema: updateProfileSchema,
    preHandler: [fastify.authenticate],
    handler: async (
      request: FastifyRequest<{
        Body: {
          nickname?: string;
          avatar?: string;
          phone?: string;
          realName?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const userId = (request.user as any).userId;
        await userService.updateUserProfile(userId, request.body);

        reply.send({
          code: 200,
          message: '更新成功',
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('更新用户信息失败:', error as any);
        reply.code(400).send({
          code: 400,
          message: error instanceof Error ? error.message : '更新失败',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取收藏列表
  fastify.get('/user/collections', {
    schema: collectionListSchema,
    preHandler: [fastify.authenticate],
    handler: async (
      request: FastifyRequest<{
        Querystring: {
          page?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const userId = (request.user as any).userId;
        const { page = 1, pageSize = 10 } = request.query;

        const result = await userService.getUserCollections(userId, page, pageSize);

        reply.send({
          code: 200,
          message: '获取成功',
          data: result,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取收藏列表失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 添加收藏
  fastify.post('/user/collections', {
    preHandler: [fastify.authenticate],
    handler: async (
      request: FastifyRequest<{
        Body: { houseId: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const userId = (request.user as any).userId;
        const { houseId } = request.body;

        await userService.addCollection(userId, houseId);

        reply.send({
          code: 200,
          message: '收藏成功',
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('添加收藏失败:', error as any);
        reply.code(400).send({
          code: 400,
          message: error instanceof Error ? error.message : '收藏失败',
          timestamp: Date.now()
        });
      }
    }
  });

  // 取消收藏
  fastify.delete('/user/collections/:houseId', {
    preHandler: [fastify.authenticate],
    handler: async (
      request: FastifyRequest<{
        Params: { houseId: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const userId = (request.user as any).userId;
        const { houseId } = request.params;

        await userService.removeCollection(userId, houseId);

        reply.send({
          code: 200,
          message: '取消收藏成功',
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('取消收藏失败:', error as any);
        reply.code(400).send({
          code: 400,
          message: error instanceof Error ? error.message : '取消收藏失败',
          timestamp: Date.now()
        });
      }
    }
  });

  // 检查收藏状态
  fastify.get('/user/collections/status/:houseId', {
    preHandler: [fastify.authenticate],
    handler: async (
      request: FastifyRequest<{
        Params: { houseId: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const userId = (request.user as any).userId;
        const { houseId } = request.params;

        const isCollected = await userService.isCollected(userId, houseId);

        reply.send({
          code: 200,
          message: '获取成功',
          data: {
            isCollected
          },
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('检查收藏状态失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });
}
