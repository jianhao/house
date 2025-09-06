import { apiClient, type ApiResponse, type PageResponse } from './index'

// 资讯相关接口类型定义
export interface NewsCategory {
  id: string
  name: string
  code: string
  sort: number
}

export interface NewsInfo {
  id: string
  title: string
  summary: string
  content: string
  coverImage: string
  category: NewsCategory
  author: string
  publishTime: string
  readCount: number
  isTop: boolean
  status: 'published' | 'draft' | 'archived'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface NewsSearchParams {
  keyword?: string
  categoryId?: string
  isTop?: boolean
  page?: number
  pageSize?: number
}

// 资讯API服务
export class NewsApi {
  // 获取资讯分类
  static async getCategories(): Promise<ApiResponse<NewsCategory[]>> {
    return apiClient.get('/news/categories')
  }

  // 获取资讯列表
  static async getNewsList(params: NewsSearchParams = {}): Promise<PageResponse<NewsInfo>> {
    return apiClient.get('/news', params)
  }

  // 获取资讯详情
  static async getNewsDetail(id: string): Promise<ApiResponse<NewsInfo>> {
    return apiClient.get(`/news/${id}`)
  }

  // 获取热门资讯
  static async getHotNews(limit = 5): Promise<ApiResponse<NewsInfo[]>> {
    return apiClient.get('/news/hot', { limit })
  }

  // 增加阅读量
  static async increaseReadCount(id: string): Promise<ApiResponse<null>> {
    return apiClient.post(`/news/${id}/read`, {})
  }
}
