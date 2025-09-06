import { type ApiResponse, http, type PageResponse } from '@/utils/request'
import type { FilterOptions, HouseDetail, HouseInfo, HouseSearchParams, HouseStats } from './types'

// 房源API服务
export class HouseService {
  // 获取房源列表
  static async getHouseList(params: HouseSearchParams = {}): Promise<PageResponse<HouseInfo>> {
    return http.get('/houses', params)
  }

  // 获取房源详情
  static async getHouseDetail(id: string): Promise<ApiResponse<HouseDetail>> {
    return http.get(`/houses/${id}`)
  }

  // 获取热门房源
  static async getHotHouses(limit = 10): Promise<ApiResponse<HouseInfo[]>> {
    return http.get('/houses/hot', { limit })
  }

  // 获取推荐房源
  static async getRecommendHouses(
    limit = 10,
    excludeIds?: string[]
  ): Promise<ApiResponse<HouseInfo[]>> {
    return http.get('/houses/recommend', { limit, excludeIds })
  }

  // 获取筛选选项
  static async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
    return http.get('/houses/filter-options')
  }

  // 获取房源统计信息
  static async getHouseStats(): Promise<ApiResponse<HouseStats>> {
    return http.get('/houses/stats')
  }
}

export default HouseService
