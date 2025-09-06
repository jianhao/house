# 杭州保障房小程序 API 接口文档

## 基础信息

- **服务器地址**: `http://localhost:3000`
- **API文档地址**: `http://localhost:3000/docs`
- **数据格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}, // 具体数据
  "timestamp": 1703123456789
}
```

### 错误响应
```json
{
  "code": 400, // 错误码
  "message": "错误信息",
  "timestamp": 1703123456789
}
```

## 认证机制

### JWT Token 认证
- 需要认证的接口在请求头中携带: `Authorization: Bearer <token>`
- Token 有效期: 7天
- 刷新Token有效期: 30天

## 接口列表

### 1. 用户认证相关

#### 1.1 微信登录
- **接口**: `POST /auth/wechat/login`
- **描述**: 微信小程序登录
- **请求参数**:
```json
{
  "code": "微信授权码",
  "nickname": "用户昵称",
  "avatar": "头像URL"
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nickname": "张小明",
      "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQqec4gAqPiaqx8rM8YN89WSjAiahGTaSxN7A1ia9q1C1lgckWqfBdBem8AgXXSEqmtFa7low/132"
    }
  },
  "timestamp": 1703123456789
}
```

#### 1.2 刷新Token
- **接口**: `POST /auth/refresh`
- **描述**: 刷新访问令牌
- **请求参数**:
```json
{
  "refreshToken": "刷新令牌"
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "新的访问令牌",
    "expiresIn": 604800
  },
  "timestamp": 1703123456789
}
```

### 2. 用户信息相关

#### 2.1 获取用户信息
- **接口**: `GET /user/profile`
- **描述**: 获取当前用户信息
- **认证**: 需要
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "nickname": "张小明",
    "avatar": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKxrUx7SQqec4gAqPiaqx8rM8YN89WSjAiahGTaSxN7A1ia9q1C1lgckWqfBdBem8AgXXSEqmtFa7low/132",
    "phone": "13800138001",
    "realName": "张明",
    "createdAt": "2024-11-20T10:30:00.000Z",
    "lastLoginAt": "2024-12-19T15:45:00.000Z"
  },
  "timestamp": 1703123456789
}
```

#### 2.2 更新用户信息
- **接口**: `PUT /user/profile`
- **描述**: 更新用户信息
- **认证**: 需要
- **请求参数**:
```json
{
  "nickname": "新昵称",
  "avatar": "新头像URL",
  "phone": "13800138001",
  "realName": "真实姓名"
}
```
- **响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "timestamp": 1703123456789
}
```

### 3. 房源相关

#### 3.1 获取房源列表
- **接口**: `GET /houses`
- **描述**: 获取房源列表，支持筛选和分页
- **查询参数**:
  - `page`: 页码，默认1
  - `pageSize`: 每页数量，默认10
  - `area`: 区域筛选
  - `priceMin`: 最低价格
  - `priceMax`: 最高价格
  - `houseType`: 房型筛选
  - `keyword`: 关键词搜索
- **请求示例**: `GET /houses?page=1&pageSize=10&area=西湖区&priceMin=200&priceMax=400`
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "西湖印象花园",
        "coverImage": "https://img.ljcdn.com/beike/ajk/b8c2e7e8-8b5a-4c5d-9f2e-1a3b4c5d6e7f.jpg",
        "price": 280.00,
        "priceUnit": "万元",
        "area": "西湖区",
        "address": "杭州市西湖区文三路123号西湖印象花园",
        "houseTypes": ["两室一厅", "三室两厅", "四室两厅"],
        "tags": ["地铁沟通", "学区房", "精装修", "南北通透"],
        "rating": 4.5,
        "viewCount": 1250,
        "createdAt": "2024-12-05T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 6,
      "totalPages": 1
    }
  },
  "timestamp": 1703123456789
}
```

#### 3.2 获取房源详情
- **接口**: `GET /houses/:id`
- **描述**: 获取指定房源的详细信息
- **路径参数**: `id` - 房源ID
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "西湖印象花园",
    "coverImage": "https://img.ljcdn.com/beike/ajk/b8c2e7e8-8b5a-4c5d-9f2e-1a3b4c5d6e7f.jpg",
    "images": [
      "https://img.ljcdn.com/beike/ajk/b8c2e7e8-8b5a-4c5d-9f2e-1a3b4c5d6e7f.jpg",
      "https://img.ljcdn.com/beike/ajk/c9d3f8f9-9c6b-5d6e-af3f-2b4c5d6e7f8g.jpg"
    ],
    "price": 280.00,
    "priceUnit": "万元",
    "area": "西湖区",
    "address": "杭州市西湖区文三路123号西湖印象花园",
    "location": {
      "longitude": 120.1551,
      "latitude": 30.2741
    },
    "houseTypes": ["两室一厅", "三室两厅", "四室两厅"],
    "deliveryTime": "2024年12月",
    "tags": ["地铁沟通", "学区房", "精装修", "南北通透"],
    "rating": 4.5,
    "developer": "绿城集团",
    "propertyCompany": "绿城物业",
    "buildingArea": "89-128㎡",
    "plotRatio": 2.5,
    "greenRate": 35.0,
    "parkingRatio": "1:1.2",
    "schoolDistrict": "文三街小学、十三中学区",
    "description": "位于西湖区核心地段，毗邻西湖风景区，交通便利，配套完善...",
    "nearbyFacilities": [
      "地铁1号线文三路站",
      "华润万家超市",
      "文三街小学"
    ],
    "pros": ["地理位置优越", "交通便利", "学区房"],
    "cons": ["价格相对较高", "车位紧张"],
    "floorPlans": [
      {
        "type": "两室一厅",
        "area": "89㎡",
        "price": "280万",
        "layout": "客厅朝南，主卧朝南"
      }
    ],
    "salesInfo": {
      "salesPhone": "0571-88888888",
      "salesAddress": "西湖区文三路123号售楼处",
      "openTime": "9:00-18:00",
      "discount": "首付3成，可贷款70%"
    },
    "viewCount": 1250,
    "createdAt": "2024-12-05T10:30:00.000Z"
  },
  "timestamp": 1703123456789
}
```

#### 3.3 获取热门房源
- **接口**: `GET /houses/hot/list`
- **描述**: 获取热门房源列表
- **查询参数**: `limit` - 返回数量，默认10
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440005",
      "name": "未来科技城",
      "coverImage": "https://img.ljcdn.com/beike/ajk/m9n3p8pj-jm6l-5n6o-kp3p-2l4m5n6o7p8q.jpg",
      "price": 380.00,
      "area": "余杭区",
      "tags": ["科技新城", "生态宜居"],
      "rating": 4.6,
      "viewCount": 2100
    }
  ],
  "timestamp": 1703123456789
}
```

#### 3.4 获取筛选选项
- **接口**: `GET /houses/filter/options`
- **描述**: 获取房源筛选的可选项
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "areas": ["西湖区", "上城区", "滨江区", "拱墅区", "余杭区", "萧山区"],
    "houseTypes": ["一室一厅", "两室一厅", "两室两厅", "三室两厅", "四室两厅", "别墅"],
    "priceRanges": [
      {"label": "200万以下", "min": 0, "max": 200},
      {"label": "200-300万", "min": 200, "max": 300},
      {"label": "300-400万", "min": 300, "max": 400},
      {"label": "400万以上", "min": 400, "max": 999999}
    ],
    "tags": ["地铁沟通", "学区房", "精装修", "江景房", "科技园区"]
  },
  "timestamp": 1703123456789
}
```

### 4. 收藏相关

#### 4.1 获取收藏列表
- **接口**: `GET /user/collections`
- **描述**: 获取用户收藏的房源列表
- **认证**: 需要
- **查询参数**:
  - `page`: 页码，默认1
  - `pageSize`: 每页数量，默认10
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "西湖印象花园",
        "coverImage": "https://img.ljcdn.com/beike/ajk/b8c2e7e8-8b5a-4c5d-9f2e-1a3b4c5d6e7f.jpg",
        "price": 280.00,
        "area": "西湖区",
        "tags": ["地铁沟通", "学区房"],
        "collectedAt": "2024-12-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 2,
      "totalPages": 1
    }
  },
  "timestamp": 1703123456789
}
```

#### 4.2 添加收藏
- **接口**: `POST /user/collections/:houseId`
- **描述**: 收藏指定房源
- **认证**: 需要
- **路径参数**: `houseId` - 房源ID
- **响应示例**:
```json
{
  "code": 200,
  "message": "收藏成功",
  "timestamp": 1703123456789
}
```

#### 4.3 取消收藏
- **接口**: `DELETE /user/collections/:houseId`
- **描述**: 取消收藏指定房源
- **认证**: 需要
- **路径参数**: `houseId` - 房源ID
- **响应示例**:
```json
{
  "code": 200,
  "message": "取消收藏成功",
  "timestamp": 1703123456789
}
```

#### 4.4 检查收藏状态
- **接口**: `GET /user/collections/:houseId/status`
- **描述**: 检查指定房源是否已收藏
- **认证**: 需要
- **路径参数**: `houseId` - 房源ID
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "isCollected": true
  },
  "timestamp": 1703123456789
}
```

### 5. 系统相关

#### 5.1 健康检查
- **接口**: `GET /health`
- **描述**: 系统健康检查
- **响应示例**:
```json
{
  "status": "ok",
  "timestamp": 1703123456789,
  "uptime": 3600,
  "database": "connected",
  "redis": "connected"
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 测试数据说明

系统已预置以下测试数据：

### 测试用户
- **用户1**: 张小明 (openid: wx_openid_001, phone: 13800138001)
- **用户2**: 李小红 (openid: wx_openid_002, phone: 13800138002)
- **用户3**: 王大华 (openid: wx_openid_003, phone: 13800138003)
- **用户4**: 陈小美 (openid: wx_openid_004, phone: 13800138004)
- **用户5**: 刘小强 (openid: wx_openid_005, phone: 13800138005)

### 测试房源
1. **西湖印象花园** - 西湖区，280万，学区房
2. **钱江新城公寓** - 上城区，350万，江景房
3. **滨江科技城** - 滨江区，420万，科技园区
4. **运河天地** - 拱墅区，220万，运河景观
5. **未来科技城** - 余杭区，380万，科技新城
6. **钱江世纪城** - 萧山区，320万，亚运村

### 测试新闻
- 杭州保障房政策最新解读
- 西湖区新增保障房项目开工建设
- 钱江新城人才公寓申请指南
- 滨江区保障房摇号结果公示
- 杭州住房租赁市场年度报告

## 联调建议

### 1. 开发环境配置
```bash
# 启动服务
docker-compose up -d  # 启动数据库和Redis
npm run dev          # 启动API服务
```

### 2. 接口测试工具
- **Swagger UI**: http://localhost:3000/docs
- **Postman**: 导入API文档进行测试
- **curl**: 命令行测试

### 3. 认证流程测试
```bash
# 1. 微信登录获取token
curl -X POST http://localhost:3000/auth/wechat/login \
  -H "Content-Type: application/json" \
  -d '{
    "code": "test_code",
    "nickname": "测试用户",
    "avatar": "https://example.com/avatar.jpg"
  }'

# 2. 使用token访问需要认证的接口
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. 数据库管理
- **Adminer**: http://localhost:8080
  - 服务器: house-postgres
  - 用户名: postgres
  - 密码: password
  - 数据库: house_db

### 5. 常见问题

#### Q: 如何重置测试数据？
A: 重新执行mock数据脚本
```bash
docker exec -i house-postgres psql -U postgres -d house_db < seeds/mock_data.sql
```

#### Q: 如何查看API文档？
A: 访问 http://localhost:3000/docs

#### Q: 如何调试接口？
A: 查看服务器日志，使用 `npm run dev` 启动开发模式

## 联系方式

如有问题，请联系开发团队或查看项目文档。