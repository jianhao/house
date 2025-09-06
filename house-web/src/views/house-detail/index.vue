<template>
  <div class="house-detail">
    <!-- 面包屑导航 -->
    <a-breadcrumb class="breadcrumb">
      <a-breadcrumb-item>
        <router-link to="/">首页</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item>房源详情</a-breadcrumb-item>
    </a-breadcrumb>

    <div v-if="loading" class="loading">
      <a-skeleton :paragraph="{ rows: 8 }" active />
    </div>

    <div v-else-if="houseDetail" class="detail-content">
      <!-- 房源图片 -->
      <div class="image-gallery">
        <div class="single-image">
          <img :src="houseDetail.coverImage" :alt="houseDetail.name" class="cover-image" />
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="basic-info">
        <div class="info-header">
          <h1 class="house-name">{{ houseDetail.name }}</h1>
          <span class="house-status" :class="getStatusClass(houseDetail.status)">
            {{ houseDetail.status }}
          </span>
        </div>

        <div class="price-info">
          <span class="price">{{ houseDetail.price }}</span>
          <span class="unit">{{ houseDetail.priceUnit }}</span>
        </div>

        <div class="detail-items">
          <div class="detail-item">
            <span class="label">地址：</span>
            <span class="value">{{ houseDetail.address }}</span>
          </div>
          <div class="detail-item">
            <span class="label">总套数：</span>
            <span class="value">{{ realTotalUnits || 'NaN' }}套</span>
          </div>
          <div class="detail-item">
            <span class="label">建成年份：</span>
            <span class="value">{{ houseDetail.buildYear }}年</span>
          </div>
        </div>
      </div>

      <!-- 位置模块 -->
      <div class="location-section">
        <h2 class="section-title">位置信息</h2>
        <div class="location-content">
          <div class="address-info">
            <div class="address-text">
              <EnvironmentOutlined />
              <span>{{ houseDetail.address }}</span>
            </div>
            <div class="map-actions">
              <a-button type="primary" @click="openMap" class="map-btn">
                <AimOutlined />
                查看地图
              </a-button>
              <a-button @click="planRoute" class="route-btn">
                <CarOutlined />
                路线规划
              </a-button>
            </div>
          </div>
          <div class="location-tags">
            <a-tag v-for="tag in houseDetail.tags" :key="tag" class="location-tag" color="blue">
              {{ tag }}
            </a-tag>
          </div>

          <!-- 地图组件 -->
          <HouseMap
            v-if="houseDetail"
            :address="houseDetail.address"
            :house-name="houseDetail.name"
            :latitude="houseDetail.location?.latitude"
            :longitude="houseDetail.location?.longitude"
          />
        </div>
      </div>

      <!-- 详情标签页 -->
      <div class="detail-tabs">
        <a-tabs v-model:active-key="activeTab">
          <a-tab-pane key="description" tab="项目介绍">
            <div class="description-content">
              <p>{{ houseDetail.description }}</p>
            </div>
          </a-tab-pane>

          <a-tab-pane key="layouts" tab="户型信息">
            <div class="layouts-content">
              <div
                v-if="houseDetail.floorPlans && houseDetail.floorPlans.length > 0"
                class="layout-list"
              >
                <div v-for="plan in houseDetail.floorPlans" :key="plan.type" class="layout-item">
                  <div class="layout-header">
                    <h3 class="layout-type">{{ plan.type }}</h3>
                    <span class="layout-area">{{ plan.area }}</span>
                  </div>
                  <div class="layout-details">
                    <div class="detail-row">
                      <span class="label">户型布局：</span>
                      <span class="value">{{ plan.layout }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">可售套数：</span>
                      <span class="value highlight">{{ plan.count }}套</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">单价：</span>
                      <span class="value price">{{ formatPrice(plan.price) }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="label">总价：</span>
                      <span class="value total-price">{{ plan.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="no-data">
                <p>暂无户型信息</p>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="facilities" tab="周边配套">
            <div class="facilities-content">
              <div class="surroundings-grid">
                <div class="facility-category">
                  <div class="category-header">
                    <CarOutlined />
                    <h3>地铁站</h3>
                  </div>
                  <ul class="facility-list">
                    <li
                      v-for="subway in houseDetail.surroundings.subway"
                      :key="subway.name"
                      class="facility-item"
                    >
                      <span class="name">{{ subway.name }}</span>
                      <span class="distance">{{ subway.distance }}</span>
                    </li>
                  </ul>
                </div>

                <div class="facility-category">
                  <div class="category-header">
                    <ShoppingOutlined />
                    <h3>购物中心</h3>
                  </div>
                  <ul class="facility-list">
                    <li
                      v-for="mall in houseDetail.surroundings.malls"
                      :key="mall.name"
                      class="facility-item"
                    >
                      <span class="name">{{ mall.name }}</span>
                      <span class="distance">{{ mall.distance }}</span>
                    </li>
                  </ul>
                </div>

                <div class="facility-category">
                  <div class="category-header">
                    <MedicineBoxOutlined />
                    <h3>医院</h3>
                  </div>
                  <ul class="facility-list">
                    <li
                      v-for="hospital in houseDetail.surroundings.hospitals"
                      :key="hospital.name"
                      class="facility-item"
                    >
                      <span class="name">{{ hospital.name }}</span>
                      <span class="distance">{{ hospital.distance }}</span>
                    </li>
                  </ul>
                </div>

                <div class="facility-category">
                  <div class="category-header">
                    <BookOutlined />
                    <h3>学校</h3>
                  </div>
                  <ul class="facility-list">
                    <li
                      v-for="school in houseDetail.surroundings.schools"
                      :key="school.name"
                      class="facility-item"
                    >
                      <span class="name">{{ school.name }}</span>
                      <span class="distance">{{ school.distance }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <a-tab-pane key="requirements" tab="申请条件">
            <div class="requirements-content">
              <ul class="requirement-list">
                <li v-for="requirement in houseDetail.requirements" :key="requirement">
                  {{ requirement }}
                </li>
              </ul>
            </div>
          </a-tab-pane>

          <a-tab-pane key="transport" tab="交通信息">
            <div class="transport-content">
              <div class="transport-group">
                <h3>地铁</h3>
                <ul class="transport-list">
                  <li v-for="subway in houseDetail.transport.subway" :key="subway">
                    {{ subway }}
                  </li>
                </ul>
              </div>
              <div class="transport-group">
                <h3>公交</h3>
                <ul class="transport-list">
                  <li v-for="bus in houseDetail.transport.bus" :key="bus">
                    {{ bus }}
                  </li>
                </ul>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AimOutlined,
  BookOutlined,
  CarOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  ShoppingOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import HouseMap from '@/components/HouseMap.vue'
import HouseService from '@/service/house'
import type { HouseDetail as ApiHouseDetail } from '@/service/house/types'

// 页面数据类型定义
interface HouseLayout {
  type: string
  area: number
  count: number
  rent: number
  image: string
}

interface Facility {
  type: string
  items: string[]
}

interface Transport {
  subway: string[]
  bus: string[]
}

interface FloorPlan {
  type: string
  area: string
  price: string
  layout: string
  count: number
}

interface SurroundingFacility {
  name: string
  distance: string
}

interface Surroundings {
  subway: SurroundingFacility[]
  malls: SurroundingFacility[]
  hospitals: SurroundingFacility[]
  schools: SurroundingFacility[]
}

interface HouseDetail {
  id: string
  name: string
  district: string
  address: string
  type: string
  status: string
  price: string
  priceUnit: string
  totalUnits: number
  buildYear: number
  description: string
  images: string[]
  coverImage: string
  layouts: HouseLayout[]
  floorPlans: FloorPlan[]
  facilities: Facility[]
  surroundings: Surroundings
  requirements: string[]
  transport: Transport
  tags: string[]
  location?: {
    latitude: number
    longitude: number
  }
  salesInfo?: {
    salesPhone: string
    salesAddress: string
    openTime: string
  }
}

const route = useRoute()
const activeTab = ref('description')
const houseDetail = ref<HouseDetail | null>(null)
const loading = ref(false)
const realTotalUnits = ref<string | null>(null)
const realFloorPlans = ref<any[]>([])

// 地图相关变量
const mapContainer = ref<HTMLDivElement>()
const mapLoading = ref(false)
const mapInstance = ref<any>(null)
const nearbyPOIs = ref<Array<{ name: string; distance: string; type: string }>>([])

// POI类型图标映射
const getFacilityIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    subway: '🚇',
    mall: '🛒',
    hospital: '🏥',
    school: '🏫',
    park: '🌳',
    bank: '🏦',
    restaurant: '🍽️',
    default: '📍'
  }
  return iconMap[type] || iconMap.default
}

// 格式化价格显示
const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price.replace(/[^\d.]/g, ''))
  if (numPrice >= 10000) {
    return `${(numPrice / 10000).toFixed(1)}万元`
  }
  return `${numPrice}万元`
}

// 初始化高德地图
const initMap = async () => {
  if (!mapContainer.value || !houseDetail.value) return

  mapLoading.value = true

  try {
    // 动态加载高德地图API
    if (!window.AMap) {
      await loadAmapScript()
    }

    // 地理编码获取坐标
    const geocoder = new window.AMap.Geocoder()
    geocoder.getLocation(houseDetail.value.address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes.length) {
        const location = result.geocodes[0].location

        // 创建地图实例
        mapInstance.value = new window.AMap.Map(mapContainer.value, {
          zoom: 15,
          center: [location.lng, location.lat],
          mapStyle: 'amap://styles/normal'
        })

        // 添加房源标记
        const marker = new window.AMap.Marker({
          position: [location.lng, location.lat],
          title: houseDetail.value.name,
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(32, 32),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
          })
        })
        mapInstance.value.add(marker)

        // 搜索周边设施
        searchNearbyPOIs(location)
      }
      mapLoading.value = false
    })
  } catch (error) {
    console.error('地图初始化失败:', error)
    mapLoading.value = false
  }
}

// 动态加载高德地图脚本
const loadAmapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src =
      'https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.Geocoder,AMap.PlaceSearch'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('高德地图加载失败'))
    document.head.appendChild(script)
  })
}

// 搜索周边POI
const searchNearbyPOIs = (center: any) => {
  const placeSearch = new window.AMap.PlaceSearch({
    pageSize: 10,
    pageIndex: 1,
    city: '杭州',
    map: mapInstance.value,
    panel: null
  })

  const keywords = ['地铁站', '商场', '医院', '学校']
  const poiResults: Array<{ name: string; distance: string; type: string }> = []

  keywords.forEach(keyword => {
    placeSearch.searchNearBy(keyword, center, 2000, (status: string, result: any) => {
      if (status === 'complete' && result.poiList.pois.length) {
        result.poiList.pois.slice(0, 3).forEach((poi: any) => {
          const distance = Math.round(poi.distance)
          let type = 'default'
          if (keyword.includes('地铁')) type = 'subway'
          else if (keyword.includes('商场')) type = 'mall'
          else if (keyword.includes('医院')) type = 'hospital'
          else if (keyword.includes('学校')) type = 'school'

          poiResults.push({
            name: poi.name,
            distance: `${distance}m`,
            type
          })
        })
        nearbyPOIs.value = poiResults
      }
    })
  })
}

// 打开高德地图
const openMap = () => {
  if (houseDetail.value) {
    const address = encodeURIComponent(houseDetail.value.address)
    const url = `https://uri.amap.com/search?query=${address}`
    window.open(url, '_blank')
  }
}

// 路线规划
const planRoute = () => {
  if (houseDetail.value) {
    const address = encodeURIComponent(houseDetail.value.address)
    const url = `https://uri.amap.com/navigation?to=${address}`
    window.open(url, '_blank')
  }
}

// 转换API数据为页面数据格式
const convertApiData = (apiData: ApiHouseDetail): HouseDetail => {
  return {
    id: apiData.id,
    name: apiData.name,
    district: apiData.area,
    address: apiData.address,
    type: apiData.houseTypes[0] || '保障房',
    status: getProjectStatus(apiData.status),
    price: apiData.price.toString(),
    priceUnit: apiData.priceUnit,
    totalUnits: apiData.buildingArea ? Math.floor(Number(apiData.buildingArea) / 100) : 0, // 估算套数
    buildYear: apiData.deliveryTime
      ? new Date(apiData.deliveryTime).getFullYear()
      : new Date().getFullYear(),
    description:
      apiData.description || `${apiData.name}位于${apiData.address}，是优质的保障房项目。`,
    images: apiData.images.length > 0 ? apiData.images : [apiData.coverImage],
    coverImage: apiData.coverImage,
    location: apiData.location,
    layouts:
      apiData.floorPlans?.map((plan: any) => ({
        type: plan.type,
        area: typeof plan.area === 'string' ? parseFloat(plan.area) || 0 : plan.area,
        count: plan.count || 1,
        rent: typeof plan.price === 'string' ? parseFloat(plan.price) || 0 : plan.price,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'
      })) || [],
    floorPlans:
      apiData.floorPlans?.map((plan: any) => ({
        type: plan.type,
        area: typeof plan.area === 'string' ? plan.area : plan.area?.toString() || '',
        price: typeof plan.price === 'string' ? plan.price : plan.price?.toString() || '',
        layout: plan.layout || plan.type,
        count: plan.count || 1
      })) || [],
    facilities: apiData.nearbyFacilities
      ? [
          {
            type: '周边设施',
            items: apiData.nearbyFacilities.map(f => `${f.name}(${f.distance}米)`)
          }
        ]
      : [],
    surroundings: {
      subway: apiData.nearbyFacilities
        ?.filter(f => f.name && f.name.includes('地铁'))
        .map(f => ({
          name: f.name,
          distance: `${f.distance}米`
        })) || [{ name: '地铁1号线', distance: '500米' }],
      malls: apiData.nearbyFacilities
        ?.filter(
          f =>
            f.name &&
            (f.name.includes('商场') || f.name.includes('万象城') || f.name.includes('购物'))
        )
        .map(f => ({
          name: f.name,
          distance: `${f.distance}米`
        })) || [{ name: '万象城', distance: '1200米' }],
      hospitals: apiData.nearbyFacilities
        ?.filter(f => f.name && f.name.includes('医院'))
        .map(f => ({
          name: f.name,
          distance: `${f.distance}米`
        })) || [{ name: '市第一人民医院', distance: '800米' }],
      schools: apiData.nearbyFacilities
        ?.filter(
          f =>
            f.name &&
            (f.name.includes('学校') || f.name.includes('小学') || f.name.includes('中学'))
        )
        .map(f => ({
          name: f.name,
          distance: `${f.distance}米`
        })) || [{ name: '实验小学', distance: '300米' }]
    },
    requirements: [
      '具有杭州市户籍或持有有效居住证',
      '家庭人均月收入不超过当地规定标准',
      '在杭州市无自有住房',
      '未享受过其他住房保障政策',
      '符合计划生育政策',
      '无违法犯罪记录',
      '申请人年满18周岁'
    ],
    transport: {
      subway: ['地铁信息待完善'],
      bus: ['公交信息待完善']
    },
    tags: apiData.tags || ['保障房', '人才房'],
    salesInfo: apiData.salesInfo
  }
}

// 获取楼盘阶段状态
const getProjectStatus = (status: string) => {
  switch (status) {
    case 'planning':
      return '规划中'
    case 'design':
      return '设计中'
    case 'construction':
      return '建设中'
    case 'pre_sale':
      return '待开盘'
    case 'selling':
      return '销售中'
    case 'delivered':
      return '已交付'
    case 'sold_out':
      return '已售罄'
    case 'available':
      return '销售中'
    default:
      return '待定'
  }
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case '规划中':
      return 'status-planning'
    case '设计中':
      return 'status-design'
    case '建设中':
      return 'status-construction'
    case '待开盘':
      return 'status-pre-sale'
    case '销售中':
      return 'status-selling'
    case '已交付':
      return 'status-delivered'
    case '已售罄':
      return 'status-sold-out'
    default:
      return 'status-unknown'
  }
}

// 查看路线处理
const handleViewMap = () => {
  if (houseDetail.value?.location) {
    const { latitude, longitude } = houseDetail.value.location
    const address = encodeURIComponent(houseDetail.value.address)
    // 使用高德地图或百度地图打开路线规划
    const mapUrl = `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${address}&src=myapp`
    window.open(mapUrl, '_blank')
  } else {
    message.info('暂无位置信息')
  }
}

// 咨询处理
const handleConsult = () => {
  if (houseDetail.value?.salesInfo) {
    const info = houseDetail.value.salesInfo
    Modal.info({
      title: '咨询方式',
      content: `咨询电话：${info.salesPhone}\n咨询时间：${info.openTime}\n地址：${info.salesAddress}`,
      okText: '知道了'
    })
  } else {
    Modal.info({
      title: '咨询方式',
      content:
        '咨询电话：0571-12345678\n咨询时间：工作日 9:00-17:00\n地址：杭州市西湖区保障房管理中心',
      okText: '知道了'
    })
  }
}

// 通过后端API获取真实房源信息
const fetchRealHouseInfo = async (houseName: string) => {
  try {
    // 搜索相关笔记
    const searchResponse = await fetch('/api/v1/mcp/search-notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        keywords: `${houseName} 保障房 总套数`,
        limit: 5
      })
    })

    if (searchResponse.ok) {
      const searchData = await searchResponse.json()
      if (searchData.notes && searchData.notes.length > 0) {
        // 获取第一个笔记的详细内容
        const noteResponse = await fetch('/api/v1/mcp/get-note-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            url: searchData.notes[0].url
          })
        })

        if (noteResponse.ok) {
          const noteData = await noteResponse.json()
          // 从内容中提取总套数信息
          const content = noteData.content || ''
          const totalUnitsMatch = content.match(/(\d+)套|总共(\d+)|共(\d+)套/)
          if (totalUnitsMatch) {
            realTotalUnits.value = totalUnitsMatch[1] || totalUnitsMatch[2] || totalUnitsMatch[3]
          }
        }
      }
    }
  } catch (error) {
    console.error('获取真实房源信息失败:', error)
  }
}

// 获取房源详情
const fetchHouseDetail = async (id: string) => {
  try {
    loading.value = true
    const response = await HouseService.getHouseDetail(id)
    houseDetail.value = convertApiData(response.data)

    // 获取真实房源信息
    if (houseDetail.value) {
      await fetchRealHouseInfo(houseDetail.value.name)
    }
  } catch (error) {
    console.error('获取房源详情失败:', error)
    // 错误处理已在request.ts中统一处理，这里只需要记录日志
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const id = route.params.id as string
  if (id) {
    await fetchHouseDetail(id)
    // 房源数据加载完成后初始化地图
    if (houseDetail.value) {
      setTimeout(() => {
        initMap()
      }, 500) // 延迟初始化确保DOM已渲染
    }
  }
})
</script>

<style lang="scss" scoped>
.house-detail {
  min-height: calc(100vh - 64px);
  padding-bottom: 100px; // 增加底部padding为底部操作栏留出空间
  background: #f5f7fa;

  .breadcrumb {
    margin: 0;
    padding: 16px 24px;
    background: white;
    border-bottom: 1px solid #e8e8e8;
  }

  .loading {
    margin: 24px;
    padding: 40px;
    background: white;
    border-radius: 8px;
  }
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  // 图片展示区域
  .image-gallery {
    margin-bottom: 24px;
    overflow: hidden;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);

    .single-image {
      width: 100%;
      height: 400px;
      overflow: hidden;
    }

    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  // 基本信息区域
  .basic-info {
    margin-bottom: 24px;
    padding: 32px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);

    .info-header {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;

      .house-name {
        margin: 0;
        color: #262626;
        font-weight: 600;
        font-size: 28px;
        line-height: 1.3;
      }

      .house-status {
        padding: 6px 16px;
        color: white;
        font-weight: 500;
        font-size: 14px;
        white-space: nowrap;
        border-radius: 20px;

        &.status-planning {
          background: linear-gradient(135deg, #722ed1, #9254de);
        }

        &.status-design {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
        }

        &.status-construction {
          background: linear-gradient(135deg, #fa8c16, #ffa940);
        }

        &.status-pre-sale {
          background: linear-gradient(135deg, #13c2c2, #36cfc9);
        }

        &.status-selling {
          background: linear-gradient(135deg, #52c41a, #73d13d);
        }

        &.status-delivered {
          background: linear-gradient(135deg, #096dd9, #1890ff);
        }

        &.status-sold-out {
          background: linear-gradient(135deg, #ff4d4f, #ff7875);
        }

        &.status-unknown {
          background: linear-gradient(135deg, #8c8c8c, #bfbfbf);
        }
      }
    }

    .price-info {
      margin-bottom: 32px;
      padding: 20px;
      background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
      border-left: 4px solid #1890ff;
      border-radius: 8px;

      .price {
        color: #1890ff;
        font-weight: 700;
        font-size: 36px;
        line-height: 1;
      }

      .unit {
        margin-left: 8px;
        color: #595959;
        font-weight: 500;
        font-size: 18px;
      }
    }

    .detail-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;

      .detail-item {
        display: flex;
        align-items: center;
        padding: 16px;
        background: #fafafa;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          background: #f0f9ff;
          transform: translateY(-2px);
        }

        .label {
          min-width: 80px;
          color: #8c8c8c;
          font-weight: 500;
          font-size: 14px;
        }

        .value {
          flex: 1;
          color: #262626;
          font-weight: 500;
          font-size: 15px;
        }
      }
    }
  }

  // 位置信息区域
  .location-section {
    margin-bottom: 24px;
    padding: 32px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);

    .section-title {
      margin-bottom: 24px;
      padding-bottom: 12px;
      color: #262626;
      font-weight: 600;
      font-size: 20px;
      border-bottom: 2px solid #f0f0f0;
    }

    .location-content {
      .address-info {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        padding: 16px;
        background: #f9f9f9;
        border-radius: 8px;

        .address-text {
          display: flex;
          flex: 1;
          align-items: center;
          color: #262626;
          font-weight: 500;
          font-size: 16px;

          .anticon {
            margin-right: 8px;
            color: #1890ff;
            font-size: 18px;
          }
        }

        .map-actions {
          display: flex;
          gap: 12px;

          .map-btn,
          .route-btn {
            height: 36px;
            padding: 0 20px;
            border-radius: 20px;
          }
        }
      }

      // 嵌入式地图样式
      .embedded-map {
        position: relative;
        margin: 24px 0;
        height: 300px;
        overflow: hidden;
        border: 1px solid #e8e8e8;
        border-radius: 12px;

        .map-container {
          width: 100%;
          height: 100%;
        }

        .map-loading {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: rgb(255 255 255 / 0.8);
        }
      }

      // 周边设施快速查看
      .nearby-facilities {
        margin-top: 24px;

        h3 {
          margin-bottom: 16px;
          color: #262626;
          font-weight: 600;
          font-size: 18px;
        }

        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;

          .facility-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: #f8f9fa;
            border: 1px solid #e8e8e8;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
              background: #e6f7ff;
              border-color: #1890ff;
            }

            .facility-icon {
              font-size: 20px;
            }

            .facility-info {
              flex: 1;

              .facility-name {
                margin-bottom: 4px;
                color: #262626;
                font-weight: 500;
                font-size: 14px;
              }

              .facility-distance {
                color: #8c8c8c;
                font-size: 12px;
              }
            }
          }
        }
      }

      .location-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .location-tag {
          padding: 4px 12px;
          font-size: 13px;
          border-radius: 16px;
        }
      }
    }
  }

  // 详情标签页区域
  .detail-tabs {
    padding: 0;
    overflow: hidden;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);

    :deep(.ant-tabs) {
      .ant-tabs-nav {
        margin: 0;
        padding: 0 32px;
        background: #fafafa;

        .ant-tabs-tab {
          padding: 16px 24px;
          font-weight: 500;
          font-size: 16px;
          border: none;

          &.ant-tabs-tab-active {
            margin-bottom: -1px;
            background: white;
            border-radius: 12px 12px 0 0;
          }
        }
      }

      .ant-tabs-content-holder {
        padding: 32px;
      }
    }

    // 项目介绍内容
    .description-content {
      p {
        margin: 0;
        padding: 20px;
        color: #595959;
        font-size: 16px;
        line-height: 1.8;
        background: #f9f9f9;
        border-left: 4px solid #1890ff;
        border-radius: 8px;
      }
    }

    // 户型信息内容
    .layouts-content {
      .layout-list {
        display: grid;
        gap: 20px;

        .layout-item {
          overflow: hidden;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
            transform: translateY(-2px);
          }

          .layout-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            color: white;
            background: linear-gradient(135deg, #1890ff, #40a9ff);

            .layout-type {
              margin: 0;
              font-weight: 600;
              font-size: 18px;
            }

            .layout-area {
              padding: 4px 12px;
              font-weight: 500;
              font-size: 16px;
              background: rgb(255 255 255 / 0.2);
              border-radius: 12px;
            }
          }

          .layout-details {
            padding: 24px;

            .detail-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #f0f0f0;

              &:last-child {
                border-bottom: none;
              }

              .label {
                color: #8c8c8c;
                font-weight: 500;
                font-size: 14px;
              }

              .value {
                color: #262626;
                font-weight: 500;
                font-size: 15px;

                &.highlight {
                  color: #1890ff;
                  font-weight: 600;
                }

                &.price {
                  color: #f5222d;
                  font-weight: 600;
                }

                &.total-price {
                  color: #fa541c;
                  font-weight: 700;
                  font-size: 16px;
                }
              }
            }
          }
        }
      }

      .no-data {
        padding: 60px 20px;
        color: #bfbfbf;
        text-align: center;

        p {
          margin: 0;
          font-size: 16px;
        }
      }
    }

    // 周边配套内容
    .facilities-content {
      .surroundings-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 24px;

        .facility-category {
          overflow: hidden;
          border: 1px solid #e8e8e8;
          border-radius: 12px;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 4px 12px rgb(0 0 0 / 0.1);
          }

          .category-header {
            display: flex;
            gap: 12px;
            align-items: center;
            padding: 16px 20px;
            background: #fafafa;
            border-bottom: 1px solid #e8e8e8;

            .anticon {
              color: #1890ff;
              font-size: 18px;
            }

            h3 {
              margin: 0;
              color: #262626;
              font-weight: 600;
              font-size: 16px;
            }
          }

          .facility-list {
            margin: 0;
            padding: 0;
            list-style: none;

            .facility-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 12px 20px;
              border-bottom: 1px solid #f0f0f0;
              transition: background 0.2s ease;

              &:hover {
                background: #f9f9f9;
              }

              &:last-child {
                border-bottom: none;
              }

              .name {
                color: #262626;
                font-weight: 500;
                font-size: 14px;
              }

              .distance {
                padding: 2px 8px;
                color: #1890ff;
                font-weight: 500;
                font-size: 13px;
                background: #f0f9ff;
                border-radius: 10px;
              }
            }
          }
        }
      }
    }

    // 申请条件内容
    .requirements-content {
      .requirement-list {
        margin: 0;
        padding: 0;
        list-style: none;

        li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 8px;
          padding: 16px 20px;
          color: #262626;
          font-size: 15px;
          line-height: 1.6;
          background: #f9f9f9;
          border-left: 4px solid #52c41a;
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            background: #f6ffed;
            transform: translateX(4px);
          }

          &::before {
            margin-top: 2px;
            margin-right: 12px;
            color: #52c41a;
            font-weight: bold;
            font-size: 14px;
            content: '✓';
          }
        }
      }
    }

    // 交通信息内容
    .transport-content {
      .transport-group {
        margin-bottom: 32px;

        &:last-child {
          margin-bottom: 0;
        }

        h3 {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          color: #262626;
          font-weight: 600;
          font-size: 18px;
          border-bottom: 2px solid #f0f0f0;

          &::before {
            width: 4px;
            height: 20px;
            margin-right: 12px;
            background: #1890ff;
            border-radius: 2px;
            content: '';
          }
        }

        .transport-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;

          li {
            padding: 12px 16px;
            color: #262626;
            font-weight: 500;
            font-size: 14px;
            background: #f0f9ff;
            border: 1px solid #d6e4ff;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
              background: #e6f7ff;
              border-color: #91d5ff;
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
}

@media (max-width: $breakpoint-md) {
  .detail-content {
    .info-section {
      grid-template-columns: 1fr;
      gap: $spacing-lg;

      .basic-info {
        .header {
          flex-direction: column;
          gap: $spacing-md;
          align-items: flex-start;
        }

        .action-buttons {
          flex-direction: column;
        }
      }
    }

    .detail-tabs {
      padding: $spacing-lg;

      .facilities {
        grid-template-columns: 1fr;
      }

      .layout-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
