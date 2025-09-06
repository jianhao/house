import postgres from '@fastify/postgres';
import fp from 'fastify-plugin';
import { config } from '../config/app';

export default fp(async function (fastify) {
  await fastify.register(postgres, {
    connectionString: config.database.url,
    ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: false } : false
  });

  // 测试数据库连接
  try {
    const client = await fastify.pg.connect();
    const { rows } = await client.query('SELECT NOW()');
    fastify.log.info(`✅ Database connected at ${rows[0].now}`);
    client.release();
  } catch (err) {
    fastify.log.error('❌ Database connection failed:', err as any);
    throw err;
  }
});
