import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { houseDetailSchema, houseListSchema } from '../schemas/house.schema';
import { HouseService } from '../services/house.service';
import { HouseSearchParams } from '../types';

export async function houseRoutes(fastify: FastifyInstance) {
  const houseService = new HouseService(fastify);

  // 获取房源列表
  fastify.get('/houses', {
    schema: houseListSchema,
    handler: async (
      request: FastifyRequest<{
        Querystring: HouseSearchParams;
      }>,
      reply: FastifyReply
    ) => {
      try {
        const result = await houseService.getHouseList(request.query);

        reply.send({
          code: 200,
          message: '获取成功',
          data: result,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取房源列表失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取房源详情
  fastify.get('/houses/:id', {
    schema: houseDetailSchema,
    handler: async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { id } = request.params;
        const house = await houseService.getHouseDetail(id);

        if (!house) {
          return reply.code(404).send({
            code: 404,
            message: '房源不存在',
            timestamp: Date.now()
          });
        }

        reply.send({
          code: 200,
          message: '获取成功',
          data: house,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取房源详情失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取热门房源
  fastify.get('/houses/hot', {
    handler: async (
      request: FastifyRequest<{
        Querystring: { limit?: number };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { limit = 10 } = request.query;
        const houses = await houseService.getHotHouses(limit);

        reply.send({
          code: 200,
          message: '获取成功',
          data: houses,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取热门房源失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取推荐房源
  fastify.get('/houses/recommend', {
    preHandler: [fastify.authenticate],
    handler: async (
      request: FastifyRequest<{
        Querystring: { limit?: number; excludeIds?: string[] };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { limit = 10, excludeIds = [] } = request.query;
        const userId = (request.user as any).userId;
        const houses = await houseService.getRecommendHouses(userId, limit, excludeIds);

        reply.send({
          code: 200,
          message: '获取成功',
          data: houses,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取推荐房源失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取筛选选项
  fastify.get('/houses/filter-options', {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const options = await houseService.getFilterOptions();

        reply.send({
          code: 200,
          message: '获取成功',
          data: options,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取筛选选项失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });

  // 获取统计数据
  fastify.get('/houses/stats', {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const stats = await houseService.getHouseStats();

        reply.send({
          code: 200,
          message: '获取成功',
          data: stats,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取统计数据失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });
}
