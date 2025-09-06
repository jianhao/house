import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import sensible from '@fastify/sensible';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import { config } from '../config/app';
import authPlugin from './auth.plugin';
import databasePlugin from './database.plugin';
import redisPlugin from './redis.plugin';

export async function registerPlugins(fastify: FastifyInstance) {
  // CORS
  await fastify.register(cors, {
    origin: true,
    credentials: true
  });

  // 安全头
  await fastify.register(helmet);

  // 错误处理和实用工具
  await fastify.register(sensible);

  // JWT
  await fastify.register(jwt, {
    secret: config.jwt.secret
  });

  // 文件上传
  await fastify.register(multipart, {
    limits: {
      fileSize: config.upload.maxFileSize
    }
  });

  // Swagger 文档
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: '杭州保障房小程序 API',
        description: 'API 接口文档',
        version: '1.0.0'
      },
      host: `${config.host}:${config.port}`,
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    }
  });

  // 数据库
  await fastify.register(databasePlugin);

  // Redis
  await fastify.register(redisPlugin);

  // 认证
  await fastify.register(authPlugin);
}
