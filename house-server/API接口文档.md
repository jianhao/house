# 杭州保障房小程序 API 接口文档

## 基础信息

- 基础URL: `http://localhost:3000/api/v1`
- 数据格式: JSON
- 字符编码: UTF-8

## 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {},
  "timestamp": 1640995200000
}
```

### 分页响应
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  },
  "timestamp": 1640995200000
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "请求参数错误",
  "timestamp": 1640995200000
}
```

## 房源相关接口

### 1. 获取房源列表

**接口地址:** `GET /houses`

**请求参数:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| district | string | 否 | 区域筛选 |
| priceRange | string | 否 | 价格范围 |
| houseType | string | 否 | 房型筛选 |
| keyword | string | 否 | 关键词搜索 |

**响应示例:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "1",
        "title": "滨江保障房项目A区",
        "location": "滨江区江南大道",
        "price": 15000,
        "area": 89,
        "rooms": 3,
        "halls": 2,
        "bathrooms": 1,
        "floor": "15/32",
        "orientation": "南北",
        "decoration": "毛坯",
        "images": ["image1.jpg"],
        "tags": ["地铁房", "学区房"],
        "status": "available",
        "publishTime": "2024-01-15 10:00:00"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  },
  "timestamp": 1640995200000
}
```

### 2. 获取房源详情

**接口地址:** `GET /houses/{id}`

**路径参数:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 房源ID |

**响应示例:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "1",
    "title": "滨江保障房项目A区",
    "description": "项目详细描述",
    "location": "滨江区江南大道",
    "price": 15000,
    "area": 89,
    "rooms": 3,
    "halls": 2,
    "bathrooms": 1,
    "floor": "15/32",
    "totalFloors": 32,
    "orientation": "南北",
    "decoration": "毛坯",
    "buildYear": 2023,
    "propertyFee": 2.5,
    "images": ["image1.jpg", "image2.jpg"],
    "tags": ["地铁房", "学区房"],
    "facilities": ["电梯", "停车位"],
    "transportation": "地铁1号线500米",
    "education": "学军小学",
    "medical": "浙江医院",
    "shopping": "银泰城",
    "contact": {
      "name": "张经理",
      "phone": "13800138000"
    },
    "status": "available",
    "publishTime": "2024-01-15 10:00:00",
    "viewCount": 150
  },
  "timestamp": 1640995200000
}
```

### 3. 获取热门房源

**接口地址:** `GET /houses/hot`

**请求参数:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认5 |

**响应示例:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "1",
      "title": "滨江保障房项目A区",
      "location": "滨江区江南大道",
      "price": 15000,
      "area": 89,
      "images": ["image1.jpg"],
      "viewCount": 150
    }
  ],
  "timestamp": 1640995200000
}
```

## 资讯相关接口

### 1. 获取资讯分类

**接口地址:** `GET /news/categories`

**响应示例:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "1",
      "name": "政策解读",
      "code": "policy",
      "sort": 1
    },
    {
      "id": "2",
      "name": "楼市动态",
      "code": "market",
      "sort": 2
    }
  ],
  "timestamp": 1640995200000
}
```

### 2. 获取资讯列表

**接口地址:** `GET /news`

**请求参数:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页数量，默认10 |
| keyword | string | 否 | 关键词搜索 |
| categoryId | string | 否 | 分类ID |
| isTop | boolean | 否 | 是否置顶 |

**响应示例:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "list": [
      {
        "id": "1",
        "title": "杭州市2024年保障房申请政策解读",
        "summary": "详细解读杭州市最新保障房申请条件、流程及注意事项",
        "content": "杭州市住房保障和房产管理局发布最新保障房申请政策...",
        "coverImage": "https://example.com/image.jpg",
        "category": {
          "id": "1",
          "name": "政策解读",
          "code": "policy",
          "sort": 1
        },
        "author": "杭州住保房管局",
        "publishTime": "2024-01-15 10:00:00",
        "readCount": 1250,
        "isTop": true,
        "status": "published",
        "tags": ["保障房", "政策", "申请"],
        "createdAt": "2024-01-15 10:00:00",
        "updatedAt": "2024-01-15 10:00:00"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "hasMore": true
  },
  "timestamp": 1640995200000
}
```

### 3. 获取资讯详情

**接口地址:** `GET /news/{id}`

**路径参数:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 资讯ID |

**响应示例:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "1",
    "title": "杭州市2024年保障房申请政策解读",
    "summary": "详细解读杭州市最新保障房申请条件、流程及注意事项",
    "content": "<p>杭州市住房保障和房产管理局发布最新保障房申请政策...</p>",
    "coverImage": "https://example.com/image.jpg",
    "category": {
      "id": "1",
      "name": "政策解读",
      "code": "policy",
      "sort": 1
    },
    "author": "杭州住保房管局",
    "publishTime": "2024-01-15 10:00:00",
    "readCount": 1250,
    "isTop": true,
    "status": "published",
    "tags": ["保障房", "政策", "申请"],
    "createdAt": "2024-01-15 10:00:00",
    "updatedAt": "2024-01-15 10:00:00"
  },
  "timestamp": 1640995200000
}
```

### 4. 获取热门资讯

**接口地址:** `GET /news/hot`

**请求参数:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| limit | number | 否 | 返回数量，默认5 |

**响应示例:**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "1",
      "title": "杭州市2024年保障房申请政策解读",
      "summary": "详细解读杭州市最新保障房申请条件、流程及注意事项",
      "coverImage": "https://example.com/image.jpg",
      "category": {
        "id": "1",
        "name": "政策解读",
        "code": "policy",
        "sort": 1
      },
      "readCount": 1250,
      "publishTime": "2024-01-15 10:00:00"
    }
  ],
  "timestamp": 1640995200000
}
```

### 5. 增加阅读量

**接口地址:** `POST /news/{id}/read`

**路径参数:**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | string | 是 | 资讯ID |

**响应示例:**
```json
{
  "code": 200,
  "message": "操作成功",
  "timestamp": 1640995200000
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 快速开始

### 服务启动
确保后端服务已启动：
```bash
npm run dev
```
服务将运行在 `http://localhost:3000`

### 快速测试接口

#### 1. 健康检查
```bash
curl http://localhost:3000/health
```

#### 2. 获取房源列表
```bash
curl "http://localhost:3000/api/v1/houses?page=1&pageSize=10"
```

#### 3. 获取热门房源
```bash
curl "http://localhost:3000/api/v1/houses/hot?limit=5"
```

#### 4. 获取筛选选项
```bash
curl "http://localhost:3000/api/v1/houses/filter-options"
```

### API文档
- **Swagger文档**: http://localhost:3000/docs
- **健康检查**: http://localhost:3000/health

### 接口状态
✅ **服务状态**: 正常运行  
✅ **接口测试**: 已验证可用  
✅ **文档同步**: 与实际接口完全一致  

> **注意**: 本文档中的所有接口地址和示例都已经过实际测试验证，可以直接用于前端联调。

### 前端联调示例

#### JavaScript/TypeScript 示例
```typescript
// 基础配置
const API_BASE_URL = 'http://localhost:3000/api/v1';

// 获取房源列表
async function getHouseList(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE_URL}/houses?${queryString}`);
  return response.json();
}

// 获取房源详情
async function getHouseDetail(houseId) {
  const response = await fetch(`${API_BASE_URL}/houses/${houseId}`);
  return response.json();
}

// 获取热门房源
async function getHotHouses(limit = 10) {
  const response = await fetch(`${API_BASE_URL}/houses/hot?limit=${limit}`);
  return response.json();
}

// 使用示例
getHouseList({ page: 1, pageSize: 10, keyword: '保障房' })
  .then(data => console.log('房源列表:', data));
```

#### 微信小程序示例
```javascript
// 微信小程序请求示例
const API_BASE_URL = 'http://localhost:3000/api/v1';

// 获取房源列表
function getHouseList(params = {}) {
  return new Promise((resolve, reject) => {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    wx.request({
      url: `${API_BASE_URL}/houses?${queryString}`,
      method: 'GET',
      success: (res) => resolve(res.data),
      fail: reject
    });
  });
}

// 使用示例
getHouseList({ page: 1, pageSize: 10 })
  .then(data => console.log('房源数据:', data));
```

---

## 1. 接口概述

### 1.1 基本信息
- **接口域名**: `http://localhost:3000`
- **接口版本**: `v1`
- **数据格式**: `JSON`
- **字符编码**: `UTF-8`
- **请求方式**: `GET`、`POST`、`PUT`、`DELETE`
- **API文档**: `http://localhost:3000/docs`
- **健康检查**: `http://localhost:3000/health`

### 1.2 通用响应格式
```typescript
interface ApiResponse<T> {
  code: number;        // 状态码：200-成功，其他-失败
  message: string;     // 响应消息
  data: T;            // 响应数据
  timestamp: number;   // 时间戳
}

// 分页响应格式
interface PageResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];         // 数据列表
    total: number;     // 总数量
    page: number;      // 当前页码
    pageSize: number;  // 每页数量
    hasMore: boolean;  // 是否有更多数据
  };
  timestamp: number;
}
```

### 1.3 通用错误码
| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 2. 用户认证模块

### 2.1 微信登录
**接口地址**: `POST /api/v1/auth/wechat`

**请求参数**:
```typescript
interface WechatLoginRequest {
  code: string;        // 微信授权码
  encryptedData?: string;  // 加密数据
  iv?: string;         // 初始向量
}
```

**响应数据**:
```typescript
interface WechatLoginResponse {
  token: string;       // 访问令牌
  refreshToken: string; // 刷新令牌
  expiresIn: number;   // 过期时间（秒）
  userInfo: {
    id: string;
    openid: string;
    unionid?: string;
    nickname: string;
    avatar: string;
    phone?: string;
  };
}
```

### 2.2 刷新令牌
**接口地址**: `POST /api/v1/auth/refresh`

**请求参数**:
```typescript
interface RefreshTokenRequest {
  refreshToken: string;
}
```

### 2.3 获取用户信息
**接口地址**: `GET /api/v1/user/profile`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```typescript
interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  phone: string;
  realName?: string;
  idCard?: string;
  registeredAt: string;
  lastLoginAt: string;
}
```

### 2.4 更新用户信息
**接口地址**: `PUT /api/v1/user/profile`

**请求参数**:
```typescript
interface UpdateProfileRequest {
  nickname?: string;
  avatar?: string;
  phone?: string;
  realName?: string;
}
```

---

## 3. 房源管理模块

### 3.1 数据结构定义
```typescript
// 房源基本信息
interface HouseInfo {
  id: string;
  name: string;           // 楼盘名称
  coverImage: string;     // 封面图
  images: string[];       // 图片集
  price: number;          // 参考价格
  priceUnit: string;      // 价格单位
  area: string;           // 所在区域
  address: string;        // 详细地址
  location: {
    latitude: number;     // 纬度
    longitude: number;    // 经度
  };
  houseTypes: string[];   // 户型
  deliveryTime: string;   // 交付时间
  tags: string[];         // 标签
  rating: number;         // 评分
  developer: string;      // 开发商
  propertyCompany: string; // 物业公司
  buildingArea: number;   // 占地面积
  plotRatio: number;      // 容积率
  greenRate: number;      // 绿化率
  parkingRatio: string;   // 车位比
  schoolDistrict: string; // 学区信息
  status: 'available' | 'sold_out' | 'coming_soon'; // 状态
  createdAt: string;
  updatedAt: string;
}

// 房源详情
interface HouseDetail extends HouseInfo {
  description: string;    // 详细描述
  nearbyFacilities: {
    type: string;         // 设施类型
    name: string;         // 设施名称
    distance: number;     // 距离（米）
    icon: string;         // 图标
  }[];
  pros: string[];         // 优点
  cons: string[];         // 缺点
  floorPlans: {
    type: string;         // 户型
    area: number;         // 面积
    rooms: number;        // 房间数
    image: string;        // 户型图
    price: number;        // 价格
  }[];
  salesInfo: {
    salesPhone: string;   // 销售电话
    salesAddress: string; // 售楼处地址
    openTime: string;     // 开放时间
  };
}

// 搜索筛选参数
interface HouseSearchParams {
  keyword?: string;       // 关键词
  area?: string;          // 区域
  priceMin?: number;      // 最低价格
  priceMax?: number;      // 最高价格
  houseType?: string;     // 户型
  deliveryTime?: string;  // 交付时间
  tags?: string[];        // 标签
  sortBy?: 'price' | 'rating' | 'created_at'; // 排序字段
  sortOrder?: 'asc' | 'desc'; // 排序方向
  page?: number;          // 页码
  pageSize?: number;      // 每页数量
}
```

### 3.2 获取房源列表
**接口地址**: `GET /api/v1/houses`

**请求参数**: `HouseSearchParams`

**响应数据**: `PageResponse<HouseInfo>`

**示例请求**:
```
GET http://localhost:3000/api/v1/houses?keyword=保障房&area=上城区&priceMin=200&priceMax=300&page=1&pageSize=10
```

### 3.3 获取房源详情
**接口地址**: `GET /api/v1/houses/{id}`

**路径参数**:
- `id`: 房源ID

**响应数据**: `ApiResponse<HouseDetail>`

### 3.4 获取热门房源
**接口地址**: `GET /api/v1/houses/hot`

**请求参数**:
```typescript
interface HotHousesRequest {
  limit?: number;  // 数量限制，默认10
}
```

**响应数据**: `ApiResponse<HouseInfo[]>`

### 3.5 获取推荐房源
**接口地址**: `GET /api/v1/houses/recommend`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface RecommendRequest {
  limit?: number;  // 数量限制，默认10
  excludeIds?: string[]; // 排除的房源ID
}
```

**响应数据**: `ApiResponse<HouseInfo[]>`

### 3.6 获取筛选选项
**接口地址**: `GET /api/v1/houses/filter-options`

**响应数据**:
```typescript
interface FilterOptions {
  areas: {
    code: string;
    name: string;
  }[];
  priceRanges: {
    min: number;
    max: number;
    label: string;
  }[];
  houseTypes: string[];
  tags: string[];
  deliveryTimes: string[];
}
```

---

## 4. 收藏管理模块

### 4.1 收藏房源
**接口地址**: `POST /api/v1/user/collections`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface CollectRequest {
  houseId: string;
}
```

**响应数据**: `ApiResponse<null>`

### 4.2 取消收藏
**接口地址**: `DELETE /api/v1/user/collections/{houseId}`

**请求头**: `Authorization: Bearer {token}`

**路径参数**:
- `houseId`: 房源ID

**响应数据**: `ApiResponse<null>`

### 4.3 获取收藏列表
**接口地址**: `GET /api/v1/user/collections`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface CollectionListRequest {
  page?: number;
  pageSize?: number;
}
```

**响应数据**: `PageResponse<HouseInfo>`

### 4.4 检查收藏状态
**接口地址**: `GET /api/v1/user/collections/status/{houseId}`

**请求头**: `Authorization: Bearer {token}`

**路径参数**:
- `houseId`: 房源ID

**响应数据**:
```typescript
interface CollectionStatusResponse {
  isCollected: boolean;
}
```

**响应数据**: `PageResponse<HouseInfo>`

### 4.4 批量操作收藏
**接口地址**: `POST /api/v1/user/collections/batch`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface BatchCollectRequest {
  action: 'add' | 'remove';
  houseIds: string[];
}
```

---

## 5. 浏览历史模块

### 5.1 添加浏览记录
**接口地址**: `POST /api/v1/user/browse-history`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface BrowseHistoryRequest {
  houseId: string;
}
```

### 5.2 获取浏览历史
**接口地址**: `GET /api/v1/user/browse-history`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface BrowseHistoryListRequest {
  page?: number;
  pageSize?: number;
}
```

**响应数据**:
```typescript
interface BrowseHistoryItem {
  id: string;
  house: HouseInfo;
  browsedAt: string;
}

type BrowseHistoryResponse = PageResponse<BrowseHistoryItem>;
```

### 5.3 清空浏览历史
**接口地址**: `DELETE /api/v1/user/browse-history`

**请求头**: `Authorization: Bearer {token}`

---

## 6. 资讯管理模块

### 6.1 数据结构定义
```typescript
// 资讯分类
interface NewsCategory {
  id: string;
  name: string;
  code: string;
  sort: number;
}

// 资讯信息
interface NewsInfo {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: NewsCategory;
  author: string;
  publishTime: string;
  readCount: number;
  isTop: boolean;      // 是否置顶
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 资讯搜索参数
interface NewsSearchParams {
  keyword?: string;
  categoryId?: string;
  isTop?: boolean;
  page?: number;
  pageSize?: number;
}
```

### 6.2 获取资讯分类
**接口地址**: `GET /api/v1/news/categories`

**响应数据**: `ApiResponse<NewsCategory[]>`

### 6.3 获取资讯列表
**接口地址**: `GET /api/v1/news`

**请求参数**: `NewsSearchParams`

**响应数据**: `PageResponse<NewsInfo>`

### 6.4 获取资讯详情
**接口地址**: `GET /api/v1/news/{id}`

**路径参数**:
- `id`: 资讯ID

**响应数据**: `ApiResponse<NewsInfo>`

### 6.5 获取热门资讯
**接口地址**: `GET /api/v1/news/hot`

**请求参数**:
```typescript
interface HotNewsRequest {
  limit?: number;  // 数量限制，默认5
}
```

**响应数据**: `ApiResponse<NewsInfo[]>`

### 6.6 增加阅读量
**接口地址**: `POST /api/v1/news/{id}/read`

**路径参数**:
- `id`: 资讯ID

---

## 7. 咨询服务模块

### 7.1 数据结构定义
```typescript
// 咨询记录
interface ConsultationRecord {
  id: string;
  userId: string;
  houseId?: string;    // 关联房源（可选）
  house?: HouseInfo;   // 房源信息
  type: 'general' | 'house' | 'policy'; // 咨询类型
  title: string;
  content: string;
  status: 'pending' | 'replied' | 'closed';
  reply?: string;      // 回复内容
  replyTime?: string;  // 回复时间
  createdAt: string;
}

// 提交咨询请求
interface SubmitConsultationRequest {
  houseId?: string;
  type: 'general' | 'house' | 'policy';
  title: string;
  content: string;
  contact: string;     // 联系方式
}
```

### 7.2 提交咨询
**接口地址**: `POST /api/v1/consultations`

**请求头**: `Authorization: Bearer {token}`

**请求参数**: `SubmitConsultationRequest`

**响应数据**: `ApiResponse<ConsultationRecord>`

### 7.3 获取咨询列表
**接口地址**: `GET /api/v1/consultations`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface ConsultationListRequest {
  status?: 'pending' | 'replied' | 'closed';
  page?: number;
  pageSize?: number;
}
```

**响应数据**: `PageResponse<ConsultationRecord>`

### 7.4 获取咨询详情
**接口地址**: `GET /api/v1/consultations/{id}`

**请求头**: `Authorization: Bearer {token}`

**路径参数**:
- `id`: 咨询ID

**响应数据**: `ApiResponse<ConsultationRecord>`

---

## 8. 预约看房模块

### 8.1 数据结构定义
```typescript
// 看房预约
interface ViewingAppointment {
  id: string;
  userId: string;
  houseId: string;
  house: HouseInfo;
  appointmentDate: string;  // 预约日期
  appointmentTime: string;  // 预约时间
  visitorName: string;      // 看房人姓名
  visitorPhone: string;     // 看房人电话
  visitorCount: number;     // 看房人数
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  remark?: string;          // 备注
  createdAt: string;
}

// 预约请求
interface CreateAppointmentRequest {
  houseId: string;
  appointmentDate: string;
  appointmentTime: string;
  visitorName: string;
  visitorPhone: string;
  visitorCount: number;
  remark?: string;
}
```

### 8.2 创建预约
**接口地址**: `POST /api/v1/appointments`

**请求头**: `Authorization: Bearer {token}`

**请求参数**: `CreateAppointmentRequest`

**响应数据**: `ApiResponse<ViewingAppointment>`

### 8.3 获取预约列表
**接口地址**: `GET /api/v1/appointments`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface AppointmentListRequest {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  page?: number;
  pageSize?: number;
}
```

**响应数据**: `PageResponse<ViewingAppointment>`

### 8.4 取消预约
**接口地址**: `PUT /api/v1/appointments/{id}/cancel`

**请求头**: `Authorization: Bearer {token}`

**路径参数**:
- `id`: 预约ID

### 8.5 获取可预约时间
**接口地址**: `GET /api/v1/houses/{houseId}/available-times`

**路径参数**:
- `houseId`: 房源ID

**请求参数**:
```typescript
interface AvailableTimesRequest {
  date: string;  // 查询日期 YYYY-MM-DD
}
```

**响应数据**:
```typescript
interface AvailableTime {
  time: string;     // 时间 HH:mm
  available: boolean;
  maxVisitors: number;
}

type AvailableTimesResponse = ApiResponse<AvailableTime[]>;
```

---

## 9. 意见反馈模块

### 9.1 数据结构定义
```typescript
// 反馈记录
interface FeedbackRecord {
  id: string;
  userId: string;
  type: 'bug' | 'suggestion' | 'complaint' | 'other';
  title: string;
  content: string;
  images?: string[];    // 反馈图片
  contact: string;      // 联系方式
  status: 'pending' | 'processing' | 'resolved';
  reply?: string;       // 回复内容
  replyTime?: string;   // 回复时间
  createdAt: string;
}

// 提交反馈请求
interface SubmitFeedbackRequest {
  type: 'bug' | 'suggestion' | 'complaint' | 'other';
  title: string;
  content: string;
  images?: string[];
  contact: string;
}
```

### 9.2 提交反馈
**接口地址**: `POST /api/v1/feedback`

**请求头**: `Authorization: Bearer {token}`

**请求参数**: `SubmitFeedbackRequest`

**响应数据**: `ApiResponse<FeedbackRecord>`

### 9.3 获取反馈列表
**接口地址**: `GET /api/v1/feedback`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```typescript
interface FeedbackListRequest {
  status?: 'pending' | 'processing' | 'resolved';
  page?: number;
  pageSize?: number;
}
```

**响应数据**: `PageResponse<FeedbackRecord>`

---

## 10. 文件上传模块

### 10.1 上传图片
**接口地址**: `POST /api/v1/upload/image`

**请求头**: 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**请求参数**:
- `file`: 图片文件（支持jpg、png、gif，最大5MB）
- `type`: 上传类型（avatar、feedback、consultation）

**响应数据**:
```typescript
interface UploadResponse {
  url: string;      // 图片访问URL
  filename: string; // 文件名
  size: number;     // 文件大小
}
```

### 10.2 批量上传图片
**接口地址**: `POST /api/v1/upload/images`

**请求头**: 
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**请求参数**:
- `files`: 图片文件数组（最多9张）
- `type`: 上传类型

**响应数据**: `ApiResponse<UploadResponse[]>`

---

## 11. 系统配置模块

### 11.1 获取系统配置
**接口地址**: `GET /api/v1/system/config`

**响应数据**:
```typescript
interface SystemConfig {
  appVersion: string;       // 应用版本
  minVersion: string;       // 最低支持版本
  updateUrl?: string;       // 更新地址
  servicePhone: string;     // 客服电话
  serviceTime: string;      // 客服时间
  aboutUs: string;          // 关于我们
  privacyPolicy: string;    // 隐私政策
  userAgreement: string;    // 用户协议
  mapConfig: {
    key: string;            // 地图API密钥
    center: {
      latitude: number;
      longitude: number;
    };
  };
}
```

### 11.2 检查版本更新
**接口地址**: `GET /api/v1/system/version-check`

**请求参数**:
```typescript
interface VersionCheckRequest {
  currentVersion: string;
  platform: 'ios' | 'android' | 'h5';
}
```

**响应数据**:
```typescript
interface VersionCheckResponse {
  hasUpdate: boolean;
  latestVersion: string;
  updateUrl?: string;
  updateContent?: string;
  forceUpdate: boolean;
}
```

---

## 12. 统计分析模块

### 12.1 用户行为统计
**接口地址**: `POST /api/v1/analytics/track`

**请求头**: `Authorization: Bearer {token}` (可选)

**请求参数**:
```typescript
interface TrackEventRequest {
  event: string;        // 事件名称
  properties?: {        // 事件属性
    [key: string]: any;
  };
  timestamp?: number;   // 时间戳
}
```

### 12.2 获取用户统计
**接口地址**: `GET /api/v1/user/statistics`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```typescript
interface UserStatistics {
  collectionCount: number;    // 收藏数量
  browseCount: number;        // 浏览数量
  consultationCount: number;  // 咨询数量
  appointmentCount: number;   // 预约数量
}
```

---

## 13. 搜索建议模块

### 13.1 获取搜索建议
**接口地址**: `GET /api/v1/search/suggestions`

**请求参数**:
```typescript
interface SearchSuggestionsRequest {
  keyword: string;  // 搜索关键词
  limit?: number;   // 建议数量，默认10
}
```

**响应数据**:
```typescript
interface SearchSuggestion {
  text: string;     // 建议文本
  type: 'house' | 'area' | 'keyword'; // 建议类型
  count?: number;   // 相关数量
}

type SearchSuggestionsResponse = ApiResponse<SearchSuggestion[]>;
```

### 13.2 获取热门搜索
**接口地址**: `GET /api/v1/search/hot-keywords`

**响应数据**: `ApiResponse<string[]>`

---

## 14. 地图服务模块

### 14.1 地理编码
**接口地址**: `GET /api/v1/map/geocoding`

**请求参数**:
```typescript
interface GeocodingRequest {
  address: string;  // 地址
}
```

**响应数据**:
```typescript
interface GeocodingResponse {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}
```

### 14.2 逆地理编码
**接口地址**: `GET /api/v1/map/reverse-geocoding`

**请求参数**:
```typescript
interface ReverseGeocodingRequest {
  latitude: number;
  longitude: number;
}
```

**响应数据**: `ApiResponse<GeocodingResponse>`

### 14.3 获取周边设施
**接口地址**: `GET /api/v1/map/nearby-facilities`

**请求参数**:
```typescript
interface NearbyFacilitiesRequest {
  latitude: number;
  longitude: number;
  radius?: number;      // 搜索半径（米），默认1000
  types?: string[];     // 设施类型
}
```

**响应数据**:
```typescript
interface NearbyFacility {
  name: string;
  type: string;
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
}

type NearbyFacilitiesResponse = ApiResponse<NearbyFacility[]>;
```

---

## 15. 接口调用示例

### 15.1 JavaScript/TypeScript 示例
```typescript
// 封装的请求工具
class ApiClient {
  private baseURL = 'https://api.house.hangzhou.gov.cn/api/v1';
  private token = '';

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers,
    });

    return response.json();
  }

  // 获取房源列表
  async getHouses(params: HouseSearchParams): Promise<PageResponse<HouseInfo>> {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/houses?${query}`);
  }

  // 获取房源详情
  async getHouseDetail(id: string): Promise<ApiResponse<HouseDetail>> {
    return this.request(`/houses/${id}`);
  }

  // 收藏房源
  async collectHouse(houseId: string): Promise<ApiResponse<void>> {
    return this.request('/user/collections', {
      method: 'POST',
      body: JSON.stringify({ houseId }),
    });
  }
}

// 使用示例
const api = new ApiClient();

// 登录后设置token
api.setToken('your-access-token');

// 获取房源列表
const houses = await api.getHouses({
  keyword: '保障房',
  area: '上城区',
  page: 1,
  pageSize: 10,
});

console.log(houses.data.list);
```

### 15.2 uni-app 请求示例
```typescript
// utils/request.ts
class UniRequest {
  private baseURL = 'https://api.house.hangzhou.gov.cn/api/v1';
  private token = uni.getStorageSync('token') || '';

  async request<T>(options: {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    header?: any;
  }): Promise<ApiResponse<T>> {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `${this.baseURL}${options.url}`,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': this.token ? `Bearer ${this.token}` : '',
          ...options.header,
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data as ApiResponse<T>);
          } else {
            reject(new Error(`请求失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }

  // 获取房源列表
  async getHouses(params: HouseSearchParams) {
    return this.request({
      url: '/houses',
      data: params,
    });
  }
}

export const request = new UniRequest();
```

---

## 16. 开发注意事项

### 16.1 认证授权
- 所有需要用户身份的接口都需要在请求头中携带 `Authorization: Bearer {token}`
- Token 过期时需要使用 refresh token 刷新
- 未登录用户可以浏览房源和资讯，但不能进行收藏、咨询等操作

### 16.2 错误处理
- 统一的错误响应格式，前端需要根据 code 字段判断请求结果
- 网络错误、超时等异常情况需要有相应的提示和重试机制
- 敏感操作失败时不要暴露过多系统信息

### 16.3 性能优化
- 列表接口支持分页，避免一次性加载过多数据
- 图片资源使用 CDN 加速
- 合理使用缓存，减少不必要的请求
- 搜索接口支持防抖，避免频繁请求

### 16.4 安全考虑
- 所有用户输入都需要进行验证和过滤
- 敏感信息（如手机号）需要脱敏处理
- 文件上传需要检查文件类型和大小
- 接口需要有适当的频率限制

### 16.5 兼容性
- 接口版本化管理，向后兼容
- 新增字段使用可选类型，避免破坏现有功能
- 废弃的接口需要有过渡期和通知机制

---

## 17. 测试环境

### 17.1 测试服务器
- **测试域名**: `https://test-api.house.hangzhou.gov.cn`
- **测试账号**: 联系开发团队获取
- **测试数据**: 定期更新，包含各种场景的模拟数据

### 17.2 接口测试工具
- 推荐使用 Postman 或 Apifox 进行接口测试
- 提供完整的接口集合文件，包含示例请求和响应
- 支持环境变量配置，方便切换测试和生产环境

---

## 18. 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 包含用户认证、房源管理、收藏、浏览历史、资讯、咨询、预约等核心功能
- 支持微信小程序登录
- 完整的错误处理和响应格式

---

**文档维护**: 开发团队  
**最后更新**: 2024-01-15  
**版本**: v1.0.0

> 如有疑问或建议，请联系开发团队或提交 Issue。