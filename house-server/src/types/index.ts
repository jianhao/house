// 通用响应格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应格式
export interface PageResponse<T> {
  code: number;
  message: string;
  data: {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
  timestamp: number;
}

// 房源基本信息
export interface HouseInfo {
  id: string;
  name: string;
  coverImage: string;
  images: string[];
  price: number;
  priceUnit: string;
  area: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  houseTypes: string[];
  deliveryTime: string;
  tags: string[];
  rating: number;
  developer: string;
  propertyCompany: string;
  buildingArea: number;
  plotRatio: number;
  greenRate: number;
  parkingRatio: string;
  schoolDistrict: string;
  status: 'available' | 'sold_out' | 'coming_soon';
  createdAt: string;
  updatedAt: string;
}

// 房源详情
export interface HouseDetail extends HouseInfo {
  description: string;
  nearbyFacilities: {
    type: string;
    name: string;
    distance: number;
    icon: string;
  }[];
  pros: string[];
  cons: string[];
  floorPlans: {
    type: string;
    area: number;
    rooms: number;
    image: string;
    price: number;
  }[];
  salesInfo: {
    salesPhone: string;
    salesAddress: string;
    openTime: string;
  };
}

// 房源搜索参数
export interface HouseSearchParams {
  keyword?: string;
  area?: string;
  priceMin?: number;
  priceMax?: number;
  houseType?: string;
  deliveryTime?: string;
  tags?: string[];
  sortBy?: 'price' | 'rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// 房源统计数据
export interface HouseStats {
  totalHouses: number;
  availableUnits: number;
  totalFamilies: number;
  districts: number;
}

// 轮播图数据
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  order: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 用户信息
export interface UserInfo {
  id: string;
  openid: string;
  unionid?: string;
  nickname: string;
  avatar: string;
  phone?: string;
  realName?: string;
  idCard?: string;
  registeredAt: string;
  lastLoginAt: string;
}

// 微信登录请求
export interface WechatLoginRequest {
  code: string;
  encryptedData?: string;
  iv?: string;
}

// 微信登录响应
export interface WechatLoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: UserInfo;
}

// 资讯分类
export interface NewsCategory {
  id: string;
  name: string;
  code: string;
  sort: number;
}

// 资讯信息
export interface NewsInfo {
  id: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: NewsCategory;
  author: string;
  publishTime: string;
  readCount: number;
  isTop: boolean;
  status: 'published' | 'draft' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// 咨询记录
export interface ConsultationRecord {
  id: string;
  userId: string;
  houseId?: string;
  house?: HouseInfo;
  type: 'general' | 'house' | 'policy';
  title: string;
  content: string;
  status: 'pending' | 'replied' | 'closed';
  reply?: string;
  replyTime?: string;
  createdAt: string;
}

// 看房预约
export interface ViewingAppointment {
  id: string;
  userId: string;
  houseId: string;
  house: HouseInfo;
  appointmentDate: string;
  appointmentTime: string;
  visitorName: string;
  visitorPhone: string;
  visitorCount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  remark?: string;
  createdAt: string;
}
