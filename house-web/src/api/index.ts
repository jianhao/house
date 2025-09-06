// API 基础配置
export const API_BASE_URL = 'http://localhost:3001/api/v1'

// 通用响应接口
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页响应接口
export interface PageResponse<T> {
  code: number
  message: string
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
    hasMore: boolean
  }
  timestamp: number
}

// HTTP 请求工具
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.code !== 200) {
        throw new Error(data.message || '请求失败')
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// 创建 API 客户端实例
export const apiClient = new ApiClient(API_BASE_URL)
