import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { message as antMessage } from 'ant-design-vue'

// 请求响应接口
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: number
}

// 分页响应接口
export interface PageResponse<T = any> {
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

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 添加token
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message } = response.data

    // 请求成功
    if (code === 200) {
      return response
    }

    // 业务错误处理
    antMessage.error(message || '请求失败')
    return Promise.reject(new Error(message || '请求失败'))
  },
  error => {
    console.error('响应拦截器错误:', error)

    // 网络错误处理
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401:
          antMessage.error('未授权，请重新登录')
          // 清除token并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '/login'
          break
        case 403:
          antMessage.error('拒绝访问')
          break
        case 404:
          antMessage.error('请求的资源不存在')
          break
        case 500:
          antMessage.error('服务器内部错误')
          break
        default:
          antMessage.error(data?.message || `请求失败 (${status})`)
      }
    } else if (error.request) {
      antMessage.error('网络连接失败，请检查网络')
    } else {
      antMessage.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

// 封装请求方法
export const http = {
  async get<T = any>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await request.get(url, { params })
    return response.data
  },

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await request.post(url, data)
    return response.data
  },

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await request.put(url, data)
    return response.data
  },

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    const response = await request.delete(url)
    return response.data
  }
}

export default request