import Fastify from 'fastify';
import { config } from './config/app';
import { bannerRoutes } from './controllers/banner.controller';
import { houseRoutes } from './controllers/house.controller';
import { newsRoutes } from './controllers/news.controller';
import { userRoutes } from './controllers/user.controller';
import { registerPlugins } from './plugins';
import { mcpRoutes } from './routes/mcp.routes';
import { policyRoutes } from './routes/policy.routes';

// 创建 Fastify 实例
const fastify = Fastify({
  logger: {
    level: config.logLevel,
    transport:
      config.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname'
            }
          }
        : undefined
  }
});

// 注册插件和路由
fastify.register(async function (instance) {
  // 先注册插件
  await registerPlugins(instance);

  // 再注册路由
  await instance.register(bannerRoutes, { prefix: '/api/v1' });
  await instance.register(houseRoutes, { prefix: '/api/v1' });
  await instance.register(userRoutes, { prefix: '/api/v1' });
  await instance.register(newsRoutes, { prefix: '/api/v1' });
  await instance.register(policyRoutes, { prefix: '/api/v1' });
  await instance.register(mcpRoutes, { prefix: '/api/v1' });
});

// 健康检查
fastify.get('/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv
  };
});

// 根路径
fastify.get('/', async (request, reply) => {
  return {
    message: '杭州保障房小程序后端服务',
    version: '1.0.0',
    docs: '/documentation',
    health: '/health'
  };
});

// 错误处理
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error as any);

  // JWT 错误
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    reply.code(401).send({
      code: 401,
      message: '缺少授权令牌',
      timestamp: Date.now()
    });
    return;
  }

  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    reply.code(401).send({
      code: 401,
      message: '无效的授权令牌',
      timestamp: Date.now()
    });
    return;
  }

  // 验证错误
  if (error.validation) {
    reply.code(400).send({
      code: 400,
      message: '请求参数验证失败',
      errors: error.validation,
      timestamp: Date.now()
    });
    return;
  }

  // 默认错误
  reply.code(500).send({
    code: 500,
    message: config.nodeEnv === 'production' ? '服务器内部错误' : error.message,
    timestamp: Date.now()
  });
});

// 404 处理
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    code: 404,
    message: '接口不存在',
    path: request.url,
    timestamp: Date.now()
  });
});

// 启动服务器
const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: config.host });

    fastify.log.info(`服务器启动成功`);
    fastify.log.info(`服务地址: http://${config.host}:${config.port}`);
    fastify.log.info(`API 文档: http://${config.host}:${config.port}/docs`);
    fastify.log.info(`健康检查: http://${config.host}:${config.port}/health`);
  } catch (err) {
    console.error('服务器启动失败:', err);
    fastify.log.error('服务器启动失败:', err as any);
    process.exit(1);
  }
};

// 优雅关闭
process.on('SIGINT', async () => {
  fastify.log.info('收到 SIGINT 信号，正在关闭服务器...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  fastify.log.info('收到 SIGTERM 信号，正在关闭服务器...');
  await fastify.close();
  process.exit(0);
});

// 启动应用
if (require.main === module) {
  start();
}

export default fastify;
export { start };
