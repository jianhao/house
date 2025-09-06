import redis from '@fastify/redis';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { config } from '../config/app';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(redis, {
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password
  });

  // 测试 Redis 连接
  try {
    await fastify.redis.ping();
    fastify.log.info('✅ Redis connected');
  } catch (err) {
    fastify.log.error('❌ Redis connection failed:', err as any);
    throw err;
  }
});
