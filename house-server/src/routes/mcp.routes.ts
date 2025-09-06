import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function mcpRoutes(fastify: FastifyInstance) {
  // 搜索小红书笔记
  fastify.post('/mcp/search-notes', {
    schema: {
      body: {
        type: 'object',
        required: ['keywords'],
        properties: {
          keywords: { type: 'string' },
          limit: { type: 'number', default: 10 }
        }
      },
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
                  url: { type: 'string' },
                  title: { type: 'string' },
                  author: { type: 'string' }
                }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    },
    handler: async (
      request: FastifyRequest<{
        Body: { keywords: string; limit?: number };
      }>,
      reply: FastifyReply
    ) => {
      try {
        // 这里应该调用MCP服务，但由于前端无法直接调用MCP，
        // 我们返回模拟数据
        const mockData = [
          {
            url: 'https://www.xiaohongshu.com/explore/123',
            title: '临平新城量子路保障性住房项目详情',
            author: '房产小助手'
          }
        ];

        reply.send({
          code: 200,
          message: '搜索成功',
          data: mockData,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('搜索笔记失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '搜索失败',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取小红书笔记内容
  fastify.post('/mcp/get-note-content', {
    schema: {
      body: {
        type: 'object',
        required: ['url'],
        properties: {
          url: { type: 'string' }
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
                title: { type: 'string' },
                content: { type: 'string' },
                author: { type: 'string' },
                totalUnits: { type: 'number' },
                floorPlans: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string' },
                      area: { type: 'number' },
                      rooms: { type: 'number' },
                      image: { type: 'string' },
                      price: { type: 'number' }
                    }
                  }
                }
              }
            },
            timestamp: { type: 'number' }
          }
        }
      }
    },
    handler: async (
      request: FastifyRequest<{
        Body: { url: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        // 模拟从小红书获取的真实数据
        const mockContent = {
          title: '临平新城量子路保障性住房项目详情',
          content: '项目总套数1200套，包含多种户型...',
          author: '房产小助手',
          totalUnits: 1200,
          floorPlans: [
            {
              type: '一室一厅',
              area: 45,
              rooms: 1,
              image: '/images/layout-1br.jpg',
              price: 406800
            },
            {
              type: '两室一厅',
              area: 70,
              rooms: 2,
              image: '/images/layout-2br.jpg',
              price: 632400
            }
          ]
        };

        reply.send({
          code: 200,
          message: '获取成功',
          data: mockContent,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取笔记内容失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '获取失败',
          timestamp: Date.now()
        });
      }
    }
  });
}