import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { BannerService } from '../services/banner.service';

export async function bannerRoutes(fastify: FastifyInstance) {
  const bannerService = new BannerService(fastify);

  // 获取轮播图列表
  fastify.get('/banners', {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const banners = await bannerService.getBannerList();

        reply.send({
          code: 200,
          message: '获取成功',
          data: banners,
          timestamp: Date.now()
        });
      } catch (error) {
        fastify.log.error('获取轮播图列表失败:', error as any);
        reply.code(500).send({
          code: 500,
          message: '服务器内部错误',
          timestamp: Date.now()
        });
      }
    }
  });
}