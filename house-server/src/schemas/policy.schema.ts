// 政策列表查询 Schema
export const policyListSchema = {
  querystring: {
    type: 'object',
    properties: {
      page: { type: 'integer', minimum: 1, default: 1 },
      pageSize: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
      category: { type: 'string' },
      keyword: { type: 'string' }
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
                  title: { type: 'string' },
                  summary: { type: 'string' },
                  category: { type: 'string' },
                  coverImage: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  author: { type: 'string' },
                  source: { type: 'string' },
                  viewCount: { type: 'number' },
                  isFeatured: { type: 'boolean' },
                  publishedAt: { type: 'string' },
                  createdAt: { type: 'string' }
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

// 政策详情 Schema
export const policyDetailSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' }
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
            id: { type: 'string' },
            title: { type: 'string' },
            summary: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
            coverImage: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            author: { type: 'string' },
            source: { type: 'string' },
            viewCount: { type: 'number' },
            isFeatured: { type: 'boolean' },
            publishedAt: { type: 'string' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' }
          }
        },
        timestamp: { type: 'number' }
      }
    },
    404: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' }
      }
    }
  }
};

// 政策分类 Schema
export const policyCategoriesSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              category: { type: 'string' },
              name: { type: 'string' },
              count: { type: 'number' }
            }
          }
        },
        timestamp: { type: 'number' }
      }
    }
  }
};