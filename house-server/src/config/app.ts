import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // 应用配置
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || '0.0.0.0',
  logLevel: process.env.LOG_LEVEL || 'info',

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // 数据库配置
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    name: process.env.DATABASE_NAME || 'house_db',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'password'
  },

  // Redis 配置
  redis: {
    url: process.env.REDIS_URL,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },

  // 微信配置
  wechat: {
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET
  },

  // 文件上传配置
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760')
  },

  // 加密配置
  encryptKey: process.env.ENCRYPT_KEY || 'default-encrypt-key-32-characters'
};

// 验证必要的环境变量
if (config.nodeEnv === 'production') {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL', 'WECHAT_APP_ID', 'WECHAT_APP_SECRET', 'ENCRYPT_KEY'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}
