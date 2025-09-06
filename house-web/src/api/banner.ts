import { apiClient, type ApiResponse } from './index'

// 轮播图数据接口
export interface Banner {
  id: number
  title: string
  subtitle: string
  image: string
  link?: string
  order: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export class BannerApi {
  // 获取轮播图列表
  static async getBannerList(): Promise<ApiResponse<Banner[]>> {
    return apiClient.get('/banners')
  }
}
