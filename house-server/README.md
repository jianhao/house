# 杭州保障房小程序后端服务

基于 Fastify + PostgreSQL + Redis 构建的高性能后端服务，为杭州保障房小程序提供完整的 API 支持。

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- Docker & Docker Compose
- Git

### 安装依赖

```bash
npm install
```

### 环境配置

1. 复制环境变量文件：
```bash
cp .env.example .env
```

2. 根据实际情况修改 `.env` 文件中的配置

### 启动服务

1. 启动数据库和 Redis：
```bash
docker-compose up -d
```

2. 初始化数据库：
```bash
# 连接到 PostgreSQL 容器
docker exec -i house-postgres psql -U postgres -d house_db < migrations/001_init.sql
```

3. 启动开发服务器：
```bash
npm run dev
```

服务将在 `http://localhost:3000` 启动

## 📚 API 文档

启动服务后，访问以下地址查看 API 文档：
- Swagger UI: http://localhost:3000/documentation
- 健康检查: http://localhost:3000/health

## 🏗️ 项目结构

```
src/
├── config/          # 配置文件
├── controllers/     # 控制器
├── services/        # 业务逻辑层
├── models/          # 数据模型
├── schemas/         # 请求/响应 Schema
├── plugins/         # Fastify 插件
├── utils/           # 工具函数
├── types/           # TypeScript 类型定义
└── app.ts           # 应用入口

migrations/          # 数据库迁移文件
seeds/              # 数据库种子文件
tests/              # 测试文件
docs/               # 项目文档
uploads/            # 文件上传目录
```

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 生产模式启动
npm start

# 运行测试
npm test

# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 🗄️ 数据库

### 主要数据表

- `users` - 用户信息
- `houses` - 房源信息
- `collections` - 用户收藏
- `browse_history` - 浏览历史
- `news` - 新闻资讯
- `consultations` - 咨询记录
- `viewing_appointments` - 预约看房
- `feedback` - 用户反馈

### 数据库管理

访问 http://localhost:8080 使用 Adminer 管理数据库
- 服务器: `postgres`
- 用户名: `postgres`
- 密码: `password`
- 数据库: `house_db`

## 🔐 认证授权

项目使用 JWT 进行用户认证：

1. 用户通过微信登录获取 `access_token` 和 `refresh_token`
2. 请求需要认证的接口时，在 Header 中携带：`Authorization: Bearer <access_token>`
3. Token 过期时使用 `refresh_token` 刷新

## 📝 主要功能模块

### 用户模块
- 微信登录
- 用户信息管理
- 收藏管理
- 浏览历史

### 房源模块
- 房源列表查询
- 房源详情
- 筛选和搜索
- 热门房源

### 新闻模块
- 新闻列表
- 新闻详情
- 分类管理

### 咨询模块
- 在线咨询
- 预约看房
- 用户反馈

## 🚀 部署

### Docker 部署

1. 构建镜像：
```bash
docker build -t house-server .
```

2. 使用 docker-compose 部署：
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 环境变量

生产环境需要配置以下环境变量：

```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=your-jwt-secret
DATABASE_URL=postgresql://user:password@host:port/database
REDIS_URL=redis://host:port
WECHAT_APPID=your-wechat-appid
WECHAT_SECRET=your-wechat-secret
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

## 📊 监控和日志

- 应用日志使用 Pino 记录
- 健康检查端点：`/health`
- 性能监控可集成 Prometheus + Grafana

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 📄 许可证

MIT License

## 🔗 相关链接

- [Fastify 文档](https://www.fastify.io/docs/)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Redis 文档](https://redis.io/documentation)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/)

## ❓ 常见问题

### 数据库连接失败

1. 确保 Docker 服务正在运行
2. 检查 `.env` 文件中的数据库配置
3. 确认数据库容器已启动：`docker-compose ps`

### Redis 连接失败

1. 检查 Redis 容器状态
2. 确认 Redis 配置正确
3. 检查防火墙设置

### 端口冲突

如果默认端口被占用，可以修改 `.env` 文件中的端口配置：

```bash
PORT=3001
DB_PORT=5433
REDIS_PORT=6380
```

## 📞 技术支持

如有问题，请提交 Issue 或联系开发团队。