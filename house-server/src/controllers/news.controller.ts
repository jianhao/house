import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { NewsService } from '../services/news.service';

export async function newsRoutes(fastify: FastifyInstance) {
  const newsService = new NewsService(fastify);

  // 获取资讯分类
  fastify.get('/news/categories', {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const categories = await newsService.getCategories();

        reply.send({
          code: 200,
          message: '获取成功',
          data: categories,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取资讯分类失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取资讯列表
  fastify.get('/news', {
    handler: async (
      request: FastifyRequest<{
        Querystring: {
          keyword?: string;
          categoryId?: string;
          isTop?: boolean;
          page?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const params = request.query;
        const result = await newsService.getNewsList(params);

        reply.send({
          code: 200,
          message: '获取成功',
          data: result,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取资讯列表失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取资讯详情
  fastify.get('/news/:id', {
    handler: async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;
        const news = await newsService.getNewsDetail(id);

        if (!news) {
          reply.code(404).send({
            code: 404,
            message: '资讯不存在',
            timestamp: Date.now()
          });
          return;
        }

        reply.send({
          code: 200,
          message: '获取成功',
          data: news,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取资讯详情失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取热门资讯
  fastify.get('/news/hot', {
    handler: async (
      request: FastifyRequest<{
        Querystring: { limit?: number };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { limit = 5 } = request.query;
        const news = await newsService.getHotNews(limit);

        reply.send({
          code: 200,
          message: '获取成功',
          data: news,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取热门资讯失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 增加阅读量
  fastify.post('/news/:id/read', {
    handler: async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;
        await newsService.incrementReadCount(id);

        reply.send({
          code: 200,
          message: '操作成功',
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('增加阅读量失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });
}
