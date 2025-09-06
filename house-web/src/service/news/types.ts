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
