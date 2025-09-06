<template>
  <div class="house-map">
    <!-- 地图操作按钮 -->
    <div class="map-actions">
      <a-button type="primary" @click="showMap" :loading="mapLoading">
        <EnvironmentOutlined /> 查看地图
      </a-button>
      <a-button @click="openNavigation"> <CarOutlined /> 路线规划 </a-button>
    </div>

    <!-- 路线信息 -->
    <div v-if="routeInfo" class="route-info">
      <div class="route-header"><CarOutlined /> 路线信息</div>
      <div class="route-details">
        <div class="route-item">
          <span class="route-label">起点：</span>
          <span class="route-value">{{ routeInfo.startAddress }}</span>
        </div>
        <div class="route-item">
          <span class="route-label">终点：</span>
          <span class="route-value">{{ routeInfo.endAddress }}</span>
        </div>
        <div class="route-item">
          <span class="route-label">距离：</span>
          <span class="route-value highlight">{{ routeInfo.distance }}</span>
        </div>
        <div class="route-item">
          <span class="route-label">预计时间：</span>
          <span class="route-value highlight">{{ routeInfo.duration }}</span>
        </div>
      </div>
    </div>

    <!-- 嵌入式地图 -->
    <div v-if="showEmbeddedMap" class="embedded-map">
      <div ref="mapContainer" class="map-container"></div>
      <div v-if="mapLoading" class="map-loading">
        <a-spin size="large" />
      </div>
    </div>

    <!-- 周边设施快速查看 -->
    <div v-if="nearbyPOIs.length > 0" class="nearby-facilities">
      <h3>周边设施</h3>
      <div class="facilities-grid">
        <div v-for="poi in nearbyPOIs" :key="poi.name" class="facility-item">
          <span class="facility-icon">{{ getFacilityIcon(poi.type) }}</span>
          <div class="facility-info">
            <div class="facility-name">{{ poi.name }}</div>
            <div class="facility-distance">{{ poi.distance }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { CarOutlined, EnvironmentOutlined } from '@ant-design/icons-vue'

interface Props {
  address: string

  houseName: string
  latitude?: number
  longitude?: number
}

const props = defineProps<Props>()

const mapContainer = ref<HTMLElement>()
const mapLoading = ref(false)
const showEmbeddedMap = ref(false)
const mapInstance = ref<any>(null)
const nearbyPOIs = ref<Array<{ name: string; distance: string; type: string }>>([])

// 获取设施图标
const getFacilityIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    地铁站: '🚇',
    公交站: '🚌',
    医院: '🏥',
    学校: '🏫',
    购物中心: '🛒',
    银行: '🏦',
    餐厅: '🍽️',
    超市: '🛍️'
  }

  return iconMap[type] || '📍'
}

// 动态加载高德地图脚本
const loadAmapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=a7a90e05a37d3f6bf76d4a9032fc9129'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load AMap script'))
    document.head.appendChild(script)
  })
}

// 初始化地图
const initMap = async () => {
  if (!mapContainer.value) return

  try {
    mapLoading.value = true
    await loadAmapScript()

    // 地理编码获取坐标
    const geocoder = new window.AMap.Geocoder()
    geocoder.getLocation(props.address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes.length) {
        const location = result.geocodes[0].location

        // 创建地图实例
        mapInstance.value = new window.AMap.Map(mapContainer.value, {
          zoom: 15,
          center: [location.lng, location.lat]
        })

        // 添加标记
        new window.AMap.Marker({
          position: [location.lng, location.lat],
          title: props.houseName,
          map: mapInstance.value
        })

        // 搜索周边POI
        searchNearbyPOIs(location)
      }
      mapLoading.value = false
    })
  } catch (error) {
    console.error('地图初始化失败:', error)
    mapLoading.value = false
  }
}

// 搜索周边POI
const searchNearbyPOIs = (location: any) => {
  const placeSearch = new window.AMap.PlaceSearch({
    pageSize: 10,
    pageIndex: 1,
    city: '全国'
  })

  const keywords = ['地铁站', '医院', '学校', '购物中心']
  const allPOIs: any[] = []

  keywords.forEach(keyword => {
    placeSearch.searchNearBy(
      keyword,
      [location.lng, location.lat],
      1000,
      (status: string, result: any) => {
        if (status === 'complete' && result.poiList) {
          result.poiList.pois.slice(0, 2).forEach((poi: any) => {
            allPOIs.push({
              name: poi.name,
              distance: `${Math.round(poi.distance)}m`,
              type: keyword
            })
          })
          nearbyPOIs.value = allPOIs.slice(0, 8)
        }
      }
    )
  })
}

// 显示地图
const showMap = () => {
  showEmbeddedMap.value = true
  setTimeout(() => {
    initMap()
  }, 100)
}

// 路线规划信息
const routeInfo = ref<{
  distance: string
  duration: string
  startAddress: string
  endAddress: string
} | null>(null)

// 获取用户当前位置并计算路线
const calculateRoute = async () => {
  try {
    // 获取用户当前位置
    const position = await getCurrentPosition()
    const userLng = position.coords.longitude
    const userLat = position.coords.latitude

    // 使用MCP高德地图服务计算路线
    const origin = `${userLng},${userLat}`
    let destination = ''

    if (props.latitude && props.longitude) {
      destination = `${props.longitude},${props.latitude}`
    } else {
      // 如果没有经纬度，先进行地理编码
      const geocodeResult = await geocodeAddress(props.address)
      destination = `${geocodeResult.longitude},${geocodeResult.latitude}`
    }

    // 调用MCP高德地图路线规划API
    const routeResult = await planRoute(origin, destination)

    if (routeResult) {
      routeInfo.value = {
        distance: routeResult.distance,
        duration: routeResult.duration,
        startAddress: '当前位置',
        endAddress: props.address
      }
    }
  } catch (error) {
    console.error('路线规划失败:', error)
  }
}

// 获取当前位置
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('浏览器不支持地理定位'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000
    })
  })
}

// 地理编码
const geocodeAddress = async (
  address: string
): Promise<{ longitude: number; latitude: number }> => {
  // 这里可以调用MCP高德地图地理编码API
  return new Promise((resolve, reject) => {
    const geocoder = new window.AMap.Geocoder()
    geocoder.getLocation(address, (status: string, result: any) => {
      if (status === 'complete' && result.geocodes.length) {
        const location = result.geocodes[0].location
        resolve({
          longitude: location.lng,
          latitude: location.lat
        })
      } else {
        reject(new Error('地理编码失败'))
      }
    })
  })
}

// 路线规划
const planRoute = async (origin: string, destination: string) => {
  try {
    // 调用MCP高德地图驾车路线规划API
    const response = await fetch('/api/mcp/route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        server_name: 'mcp.config.usrlocalmcp.amap-amap-sse',
        tool_name: 'maps_direction_driving',
        args: {
          origin,
          destination
        }
      })
    })

    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data?.routes?.[0]) {
        const route = result.data.routes[0]
        const distance = Math.round((route.distance / 1000) * 10) / 10 // 转换为公里并保留一位小数
        const duration = Math.round(route.duration / 60) // 转换为分钟

        return {
          distance: `约${distance}公里`,
          duration: `约${duration}分钟`
        }
      }
    }

    // 如果API调用失败，返回默认值
    return {
      distance: '距离计算中...',
      duration: '时间计算中...'
    }
  } catch (error) {
    console.error('路线规划API调用失败:', error)
    return {
      distance: '距离计算失败',
      duration: '时间计算失败'
    }
  }
}

// 打开导航
const openNavigation = async () => {
  await calculateRoute()

  if (props.latitude && props.longitude) {
    const mapUrl = `https://uri.amap.com/marker?position=${props.longitude},${props.latitude}&name=${props.houseName}&src=myapp`
    window.open(mapUrl, '_blank')
  } else if (props.address) {
    const mapUrl = `https://uri.amap.com/marker?position=${props.address}&name=${props.houseName}&src=myapp`
    window.open(mapUrl, '_blank')
  }
}

// 监听地址变化
watch(
  () => props.address,
  () => {
    if (showEmbeddedMap.value && mapInstance.value) {
      initMap()
    }
  }
)
</script>

<style scoped>
.house-map {
  margin-top: 16px;
}

.map-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.route-info {
  background: #f0f8ff;
  border: 1px solid #1890ff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.route-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 12px;
}

.route-header .anticon {
  margin-right: 8px;
}

.route-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.route-item {
  display: flex;
  align-items: center;
}

.route-label {
  font-size: 14px;
  color: #666;
  margin-right: 8px;
  min-width: 60px;
}

.route-value {
  font-size: 14px;
  color: #333;
}

.route-value.highlight {
  font-weight: 600;
  color: #1890ff;
}

.embedded-map {
  position: relative;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  margin-bottom: 16px;
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.nearby-facilities {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
}

.nearby-facilities h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.facilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.facility-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.facility-icon {
  font-size: 20px;
  margin-right: 8px;
}

.facility-info {
  flex: 1;
}

.facility-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.facility-distance {
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .map-actions {
    flex-direction: column;
  }

  .facilities-grid {
    grid-template-columns: 1fr;
  }

  .embedded-map {
    height: 250px;
  }
}
</style>