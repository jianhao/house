# 杭州保障房信息展示网站

## 项目简介

杭州保障房信息展示网站是一个现代化的 Web 应用程序，旨在为用户提供便捷的保障房信息查询和浏览服务。该项目采用 Vue 3 + TypeScript + Vite 技术栈构建，提供响应式设计和优秀的用户体验。

## 🚀 技术栈

### 核心框架
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具

### UI 组件库
- **Element Plus** - 基于 Vue 3 的桌面端组件库
- **Element Plus Icons** - 官方图标库

### 状态管理
- **Pinia** - Vue 3 官方推荐的状态管理库

### 路由管理
- **Vue Router 4** - Vue.js 官方路由管理器

### 样式处理
- **SCSS** - CSS 预处理器
- **现代 CSS** - 使用 CSS Grid 和 Flexbox 布局

### 开发工具
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Stylelint** - 样式代码检查
- **Husky** - Git hooks 管理
- **Commitlint** - 提交信息规范检查

## 📁 项目结构

```
src/
├── App.vue                 # 根组件
├── main.ts                 # 应用入口文件
├── shims-vue.d.ts         # Vue 类型声明
├── layout/                 # 布局组件
│   └── index.vue          # 主布局组件
├── router/                 # 路由配置
│   └── index.ts           # 路由定义
├── styles/                 # 全局样式
│   ├── index.scss         # 主样式文件
│   └── variables.scss     # SCSS 变量
└── views/                  # 页面组件
    ├── home/              # 首页
    ├── house-detail/      # 保障房详情页
    ├── news/              # 资讯列表页
    └── news-detail/       # 资讯详情页
```

## 🏗️ 系统架构

### 前端架构

```
┌─────────────────────────────────────────┐
│                 用户界面                  │
├─────────────────────────────────────────┤
│              Vue 3 组件层                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │  首页   │ │ 详情页  │ │ 资讯页  │    │
│  └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────┤
│               路由管理层                  │
│            Vue Router 4                 │
├─────────────────────────────────────────┤
│               状态管理层                  │
│               Pinia Store               │
├─────────────────────────────────────────┤
│               HTTP 请求层                │
│                 Axios                   │
├─────────────────────────────────────────┤
│               后端 API 服务              │
└─────────────────────────────────────────┘
```

### 核心特性

1. **响应式设计** - 适配桌面端和移动端设备
2. **组件化开发** - 高度可复用的 Vue 3 组件
3. **类型安全** - 完整的 TypeScript 类型定义
4. **现代化构建** - 基于 Vite 的快速开发和构建
5. **代码质量保证** - ESLint + Prettier + Stylelint 三重检查
6. **Git 工作流** - 规范化的提交和代码检查流程

## 🛠️ 开发环境设置

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用

### 构建生产版本

```bash
pnpm run build
```

### 预览生产构建

```bash
pnpm run preview
```

## 📋 可用脚本

| 命令 | 描述 |
|------|------|
| `pnpm run dev` | 启动开发服务器 |
| `pnpm run build` | 构建生产版本 |
| `pnpm run preview` | 预览生产构建 |
| `pnpm run lint` | 运行所有代码检查 |
| `pnpm run lint:eslint` | 运行 ESLint 检查 |
| `pnpm run lint:style` | 运行 Stylelint 检查 |
| `pnpm run lint:prettier` | 运行 Prettier 格式化 |

## 🎯 功能模块

### 1. 首页模块
- 保障房信息概览
- 快速搜索功能
- 热门推荐展示

### 2. 保障房详情模块
- 详细房源信息展示
- 图片轮播展示
- 位置地图显示
- 申请流程指引

### 3. 资讯中心模块
- 政策资讯列表
- 分类筛选功能
- 关键词搜索
- 资讯详情查看

### 4. 布局系统
- 响应式导航栏
- 面包屑导航
- 页脚信息展示

## 🔧 代码规范

### TypeScript 规范
- 严格的类型检查
- 完整的接口定义
- 使用 TS 工具类型（Partial、Required、Pick、Omit 等）

### Vue 3 规范
- 优先使用 `<script setup>` 语法糖
- 响应式数据：简单类型用 `ref()`，复杂对象用 `reactive()`
- 组件 props 必须有 TypeScript 类型声明

### 样式规范
- 使用 SCSS 预处理器
- 遵循 BEM 命名规范
- 响应式设计优先

### Git 提交规范
- 使用 Conventional Commits 规范
- 提交前自动运行代码检查
- 强制通过所有 lint 检查

## 🚀 部署说明

### 构建优化
- 代码分割和懒加载
- 静态资源压缩
- Tree-shaking 优化
- 现代浏览器优化

### 生产环境配置
- 环境变量配置
- API 接口配置
- CDN 资源配置
- 缓存策略配置

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

---

**杭州保障房信息展示网站** - 让保障房信息查询更简单、更便捷！