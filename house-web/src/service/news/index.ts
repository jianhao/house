import { type ApiResponse, http, type PageResponse } from '@/utils/request'
import type { NewsCategory, NewsInfo, NewsSearchParams } from './types'

// 资讯API服务
export class NewsService {
  // 获取资讯分类
  static async getCategories(): Promise<ApiResponse<NewsCategory[]>> {
    return http.get('/news/categories')
  }

  // 获取资讯列表
  static async getNewsList(params: NewsSearchParams = {}): Promise<PageResponse<NewsInfo>> {
    return http.get('/news', params)
  }

  // 获取资讯详情
  static async getNewsDetail(id: string): Promise<ApiResponse<NewsInfo>> {
    return http.get(`/news/${id}`)
  }

  // 获取热门资讯
  static async getHotNews(limit = 5): Promise<ApiResponse<NewsInfo[]>> {
    return http.get('/news/hot', { limit })
  }

  // 增加阅读量
  static async increaseReadCount(id: string): Promise<ApiResponse<null>> {
    return http.post(`/news/${id}/read`, {})
  }
}

export default NewsService
