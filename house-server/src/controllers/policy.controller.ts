import { FastifyReply, FastifyRequest } from 'fastify';
import { PolicyListQuery, PolicyService } from '../services/policy.service';

export class PolicyController {
  private policyService: PolicyService;

  constructor(policyService: PolicyService) {
    this.policyService = policyService;
  }

  /**
   * 获取政策列表
   */
  async getPolicyList(request: FastifyRequest<{ Querystring: PolicyListQuery }>, reply: FastifyReply) {
    try {
      const result = await this.policyService.getPolicyList(request.query);

      return reply.code(200).send({
        code: 200,
        message: '获取政策列表成功',
        data: result,
        timestamp: Date.now()
      });
    } catch (error) {
      request.log.error(`获取政策列表失败: ${error}`);
      return reply.code(500).send({
        code: 500,
        message: '获取政策列表失败'
      });
    }
  }

  /**
   * 获取政策详情
   */
  async getPolicyDetail(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const { id } = request.params;
      const policy = await this.policyService.getPolicyDetail(id);

      if (!policy) {
        return reply.code(404).send({
          code: 404,
          message: '政策不存在'
        });
      }

      return reply.code(200).send({
        code: 200,
        message: '获取政策详情成功',
        data: policy,
        timestamp: Date.now()
      });
    } catch (error) {
      request.log.error(`获取政策详情失败: ${error}`);
      return reply.code(500).send({
        code: 500,
        message: '获取政策详情失败'
      });
    }
  }

  /**
   * 获取政策分类
   */
  async getPolicyCategories(request: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await this.policyService.getPolicyCategories();

      return reply.code(200).send({
        code: 200,
        message: '获取政策分类成功',
        data: categories,
        timestamp: Date.now()
      });
    } catch (error) {
      request.log.error(`获取政策分类失败: ${error}`);
      return reply.code(500).send({
        code: 500,
        message: '获取政策分类失败'
      });
    }
  }

  /**
   * 获取推荐政策
   */
  async getFeaturedPolicies(request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) {
    try {
      const { limit = 5 } = request.query;
      const policies = await this.policyService.getFeaturedPolicies(limit);

      return reply.code(200).send({
        code: 200,
        message: '获取推荐政策成功',
        data: policies,
        timestamp: Date.now()
      });
    } catch (error) {
      request.log.error(`获取推荐政策失败: ${error}`);
      return reply.code(500).send({
        code: 500,
        message: '获取推荐政策失败'
      });
    }
  }
}