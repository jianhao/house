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
  status:
    | 'planning'
    | 'design'
    | 'construction'
    | 'pre_sale'
    | 'selling'
    | 'delivered'
    | 'sold_out'
    | 'available'
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
