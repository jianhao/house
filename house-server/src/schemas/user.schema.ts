// 微信登录 Schema
export const wechatLoginSchema = {
  body: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'string' },
      encryptedData: { type: 'string' },
      iv: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'number' },
            userInfo: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                openid: { type: 'string' },
                unionid: { type: 'string' },
                nickname: { type: 'string' },
                avatar: { type: 'string' },
                phone: { type: 'string' }
              }
            }
          }
        },
        timestamp: { type: 'number' }
      }
    }
  }
};

// 获取用户信息 Schema
export const userProfileSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            nickname: { type: 'string' },
            avatar: { type: 'string' },
            phone: { type: 'string' },
            realName: { type: 'string' },
            registeredAt: { type: 'string' },
            lastLoginAt: { type: 'string' }
          }
        },
        timestamp: { type: 'number' }
      }
    }
  }
};

// 更新用户信息 Schema
export const updateProfileSchema = {
  body: {
    type: 'object',
    properties: {
      nickname: { type: 'string', maxLength: 50 },
      avatar: { type: 'string' },
      phone: { type: 'string', pattern: '^1[3-9]\\d{9}$' },
      realName: { type: 'string', maxLength: 20 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' }
      }
    }
  }
};

// 获取收藏列表 Schema
export const collectionListSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            list: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  coverImage: { type: 'string' },
                  price: { type: 'number' },
                  area: { type: 'string' },
                  address: { type: 'string' }
                }
              }
            },
            total: { type: 'number' },
            page: { type: 'number' },
            pageSize: { type: 'number' },
            hasMore: { type: 'boolean' }
          }
        },
        timestamp: { type: 'number' }
      }
    }
  }
};
