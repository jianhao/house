import Fastify, { FastifyInstance } from 'fastify';
import { registerPlugins } from '../src/plugins';
import { houseRoutes } from '../src/controllers/house.controller';
import { userRoutes } from '../src/controllers/user.controller';

// 构建测试应用实例
export function build(): FastifyInstance {
  const app = Fastify({
    logger: false // 测试时关闭日志
  });

  // 注册插件
  registerPlugins(app);

  // 注册路由
  app.register(async function (fastify) {
    await fastify.register(houseRoutes, { prefix: '/api' });
    await fastify.register(userRoutes, { prefix: '/api' });
  });

  return app;
}

// 创建测试用户token
export function createTestToken(app: FastifyInstance, userId: string = 'test-user-id') {
  return app.jwt.sign({ userId, openid: 'test-openid' });
}

// 测试数据清理
export async function cleanupTestData(app: FastifyInstance) {
  // 清理测试数据的逻辑
  // 在实际项目中，这里应该清理测试数据库中的数据
}

// 创建测试数据
export async function createTestData(app: FastifyInstance) {
  // 创建测试数据的逻辑
  // 在实际项目中，这里应该在测试数据库中创建必要的测试数据
}