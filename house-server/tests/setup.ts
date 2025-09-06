import { config } from '../src/config/app';

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/house_test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// 增加测试超时时间
jest.setTimeout(30000);

// 全局测试钩子
beforeAll(async () => {
  // 测试前的全局设置
});

afterAll(async () => {
  // 测试后的全局清理
});

beforeEach(async () => {
  // 每个测试前的设置
});

afterEach(async () => {
  // 每个测试后的清理
});