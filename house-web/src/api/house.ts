import { apiClient, type ApiResponse, type PageResponse } from './index'

// 房源相关接口类型定义
export interface HouseInfo {
  id: string
  name: string
  coverImage: string
  images: string[]
  price: number
  priceUnit: string
  area: string
  address: string
  location: {
    latitude: number
    longitude: number
  }
  houseTypes: string[]
  deliveryTime: string
  tags: string[]
  rating: number
  developer: string
  propertyCompany: string
  buildingArea: number
  plotRatio: number
  greenRate: number
  parkingRatio: string
  schoolDistrict: string
  status: 'available' | 'sold_out' | 'coming_soon'
  createdAt: string
  updatedAt: string
}

export interface HouseDetail extends HouseInfo {
  description: string
  nearbyFacilities: {
    type: string
    name: string
    distance: number
    icon: string
  }[]
  pros: string[]
  cons: string[]
  floorPlans: {
    type: string
    area: number
    rooms: number
    image: string
    price: number
  }[]
  salesInfo: {
    salesPhone: string
    salesAddress: string
    openTime: string
  }
}

export interface HouseSearchParams {
  keyword?: string
  area?: string
  priceMin?: number
  priceMax?: number
  houseType?: string
  deliveryTime?: string
  tags?: string[]
  sortBy?: 'price' | 'rating' | 'created_at'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface FilterOptions {
  areas: {
    code: string
    name: string
  }[]
  priceRanges: {
    min: number
    max: number
    label: string
  }[]
  houseTypes: string[]
  tags: string[]
  deliveryTimes: string[]
}

export interface HouseStats {
  totalHouses: number
  availableUnits: number
  totalFamilies: number
  districts: number
}

// 房源API服务
export class HouseApi {
  // 获取房源列表
  static async getHouseList(params: HouseSearchParams = {}): Promise<PageResponse<HouseInfo>> {
    return apiClient.get('/houses', params)
  }

  // 获取房源详情
  static async getHouseDetail(id: string): Promise<ApiResponse<HouseDetail>> {
    return apiClient.get(`/houses/${id}`)
  }

  // 获取热门房源
  static async getHotHouses(limit = 10): Promise<ApiResponse<HouseInfo[]>> {
    return apiClient.get('/houses/hot', { limit })
  }

  // 获取推荐房源
  static async getRecommendHouses(
    limit = 10,
    excludeIds?: string[]
  ): Promise<ApiResponse<HouseInfo[]>> {
    return apiClient.get('/houses/recommend', { limit, excludeIds })
  }

  // 获取筛选选项
  static async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
    return apiClient.get('/houses/filter-options')
  }

  // 获取统计数据
  static async getHouseStats(): Promise<ApiResponse<HouseStats>> {
    return apiClient.get('/houses/stats')
  }
}
