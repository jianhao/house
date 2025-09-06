import { FastifyInstance } from 'fastify';
import { PolicyController } from '../controllers/policy.controller';
import { policyCategoriesSchema, policyDetailSchema, policyListSchema } from '../schemas/policy.schema';
import { PolicyService } from '../services/policy.service';

export async function policyRoutes(fastify: FastifyInstance) {
  // 初始化服务和控制器
  const policyService = new PolicyService(fastify);
  const policyController = new PolicyController(policyService);

  // 获取政策列表
  fastify.get('/policies', {
    schema: policyListSchema,
    handler: policyController.getPolicyList.bind(policyController)
  });

  // 获取政策详情
  fastify.get('/policies/:id', {
    schema: policyDetailSchema,
    handler: policyController.getPolicyDetail.bind(policyController)
  });

  // 获取政策分类
  fastify.get('/policies/categories/list', {
    schema: policyCategoriesSchema,
    handler: policyController.getPolicyCategories.bind(policyController)
  });

  // 获取推荐政策
  fastify.get('/policies/featured/list', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 20, default: 5 }
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
            timestamp: { type: 'number' }
          }
        }
      }
    },
    handler: policyController.getFeaturedPolicies.bind(policyController)
  });
}