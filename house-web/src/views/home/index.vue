<template>
  <div class="home">
    <!-- 轮播图横幅 -->
    <section class="hero-section">
      <a-carousel :autoplay="true" :autoplay-speed="5000">
        <div v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})` }">
            <div class="banner-content">
              <h1 class="banner-title">{{ banner.title }}</h1>
              <p class="banner-subtitle">{{ banner.subtitle }}</p>
              <a-button type="primary" size="large" @click="scrollToHouses"> 查看保障房 </a-button>
            </div>
          </div>
        </div>
      </a-carousel>
    </section>

    <!-- 搜索筛选区域 -->
    <section class="search-section">
      <div class="container">
        <div class="search-card">
          <h2 class="section-title">查找保障房</h2>
          <div class="search-form">
            <a-row :gutter="20">
              <a-col :span="6">
                <a-select v-model:value="searchForm.district" placeholder="选择区域" allow-clear>
                  <a-select-option value="">全部区域</a-select-option>
                  <a-select-option value="西湖区">西湖区</a-select-option>
                  <a-select-option value="拱墅区">拱墅区</a-select-option>
                  <a-select-option value="江干区">江干区</a-select-option>
                  <a-select-option value="下城区">下城区</a-select-option>
                  <a-select-option value="上城区">上城区</a-select-option>
                  <a-select-option value="滨江区">滨江区</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6">
                <a-select v-model:value="searchForm.priceRange" placeholder="价格范围" allow-clear>
                  <a-select-option value="">全部价格</a-select-option>
                  <a-select-option value="0-1000">1000元以下</a-select-option>
                  <a-select-option value="1000-2000">1000-2000元</a-select-option>
                  <a-select-option value="2000-3000">2000-3000元</a-select-option>
                  <a-select-option value="3000-5000">3000-5000元</a-select-option>
                  <a-select-option value="5000-999999">5000元以上</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6">
                <a-select v-model:value="searchForm.status" placeholder="申请状态" allow-clear>
                  <a-select-option value="">全部状态</a-select-option>
                  <a-select-option value="可申请">可申请</a-select-option>
                  <a-select-option value="申请中">申请中</a-select-option>
                  <a-select-option value="已满额">已满额</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="6">
                <a-button type="primary" size="large" @click="handleSearch">
                  <SearchOutlined />
                  搜索
                </a-button>
              </a-col>
            </a-row>
          </div>
        </div>
      </div>
    </section>

    <!-- 保障房列表 -->
    <section ref="housesSection" class="houses-section">
      <div class="container">
        <h2 class="section-title">保障房项目</h2>
        <div class="houses-grid">
          <div
            v-for="house in filteredHouses"
            :key="house.id"
            class="house-card"
            @click="goToDetail(house.id)"
          >
            <div class="house-image">
              <img :src="house.image" :alt="house.name" />
              <div class="house-status" :class="getStatusClass(house.status)">
                {{ house.status }}
              </div>
            </div>
            <div class="house-content">
              <h3 class="house-name">{{ house.name }}</h3>
              <div class="house-info">
                <div class="info-item">
                  <EnvironmentOutlined />
                  <span>{{ house.district }}</span>
                </div>
                <div class="info-item">
                  <HomeOutlined />
                  <span>{{ house.type }}</span>
                </div>
                <div class="info-item">
                  <UserOutlined />
                  <span>{{ house.totalUnits }}套</span>
                </div>
              </div>
              <div class="house-price">
                <span class="price">{{ house.price }}</span>
                <span class="unit">元/月</span>
              </div>
              <p class="house-desc">{{ house.description }}</p>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="hasMore" class="load-more">
          <a-button :loading="loading" @click="loadMore"> 加载更多 </a-button>
        </div>
      </div>
    </section>

    <!-- 统计信息 -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalHouses }}</div>
            <div class="stat-label">保障房项目</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.availableUnits }}</div>
            <div class="stat-label">可申请房源</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalFamilies }}</div>
            <div class="stat-label">受益家庭</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.districts }}</div>
            <div class="stat-label">覆盖区域</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type Banner, BannerApi } from '@/api/banner'
import { HouseApi, type HouseInfo, type HouseStats } from '@/api/house'

interface House {
  id: string
  name: string
  district: string
  type: string
  status: string
  price: string
  totalUnits: number
  description: string
  image: string
}

const router = useRouter()
const housesSection = ref<HTMLElement>()
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 6

// 搜索表单
const searchForm = reactive({
  district: '',
  priceRange: '',
  status: ''
})

// 轮播图数据
const banners = ref<Banner[]>([])

// 保障房数据
const houses = ref<House[]>([])
const allHouses = ref<HouseInfo[]>([])

// 统计数据
const stats = ref<HouseStats>({
  totalHouses: 0,
  availableUnits: 0,
  totalFamilies: 0,
  districts: 0
})

// 显示的房源列表（不再需要前端过滤）
const filteredHouses = computed(() => {
  return houses.value
})

// 转换房源数据格式
const convertHouseData = (houseInfo: HouseInfo): House => {
  // 计算套数，确保不为NaN
  const calculateTotalUnits = (buildingArea: any): number => {
    if (!buildingArea) return 0
    const area = Number(buildingArea)
    if (isNaN(area) || area <= 0) {
      return 0
    }
    return Math.floor(area / 100)
  }

  return {
    id: houseInfo.id,
    name: houseInfo.name,
    district: houseInfo.area,
    type: houseInfo.houseTypes[0] || '保障房',
    status:
      houseInfo.status === 'available'
        ? '可申请'
        : houseInfo.status === 'sold_out'
          ? '已满额'
          : '申请中',
    price: houseInfo.price.toString(),
    totalUnits: calculateTotalUnits(houseInfo.buildingArea),
    description: `${houseInfo.name} - ${houseInfo.address}`,
    image:
      houseInfo.coverImage ||
      houseInfo.images[0] ||
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
  }
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case '可申请':
      return 'status-available'
    case '申请中':
      return 'status-applying'
    case '已满额':
      return 'status-full'
    default:
      return ''
  }
}

// 获取房源列表
const fetchHouses = async (isSearch = false) => {
  try {
    loading.value = true

    // 如果是搜索，重置页码
    if (isSearch) {
      currentPage.value = 1
    }

    // 构建搜索参数
    const searchParams: any = {
      page: currentPage.value,
      pageSize
    }

    // 添加搜索条件
    if (searchForm.district) {
      searchParams.area = searchForm.district
    }
    if (searchForm.priceRange) {
      const [minPrice, maxPrice] = searchForm.priceRange.split('-')
      searchParams.priceMin = parseInt(minPrice)
      searchParams.priceMax = parseInt(maxPrice)
    }
    // 注意：status字段需要转换为后端的格式
    if (searchForm.status) {
      if (searchForm.status === '可申请') {
        searchParams.status = 'available'
      } else if (searchForm.status === '已满额') {
        searchParams.status = 'sold_out'
      } else if (searchForm.status === '申请中') {
        searchParams.status = 'coming_soon'
      }
    }

    const response = await HouseApi.getHouseList(searchParams)

    if (response.code === 200) {
      if (isSearch) {
        // 搜索时替换数据
        allHouses.value = response.data.list
        houses.value = allHouses.value.map(convertHouseData)
      } else {
        // 加载更多时追加数据
        allHouses.value =
          currentPage.value === 1 ? response.data.list : [...allHouses.value, ...response.data.list]
        houses.value =
          currentPage.value === 1
            ? allHouses.value.map(convertHouseData)
            : [...houses.value, ...response.data.list.map(convertHouseData)]
      }
      hasMore.value = response.data.hasMore
    }
  } catch (error) {
    console.error('获取房源列表失败:', error)
    message.error('获取房源列表失败')
  } finally {
    loading.value = false
  }
}

// 获取轮播图数据
const fetchBanners = async () => {
  try {
    const response = await BannerApi.getBannerList()
    if (response.code === 200) {
      banners.value = response.data
    }
  } catch (error) {
    console.error('获取轮播图数据失败:', error)
  }
}

// 获取统计数据
const fetchStats = async () => {
  try {
    const response = await HouseApi.getHouseStats()
    if (response.code === 200) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 搜索处理
const handleSearch = async () => {
  await fetchHouses(true)
  scrollToHouses()
}

// 滚动到房源区域
const scrollToHouses = () => {
  housesSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 跳转到详情页
const goToDetail = (id: string) => {
  router.push(`/house/${id}`)
}

// 加载更多
const loadMore = async () => {
  if (loading.value || !hasMore.value) return

  currentPage.value++
  await fetchHouses(false)
}

onMounted(() => {
  fetchBanners()
  fetchHouses()
  fetchStats()
})
</script>

<style lang="scss" scoped>
.home {
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }

  .section-title {
    margin-bottom: $spacing-xl;
    color: $text-color-primary;
    font-weight: bold;
    font-size: $font-size-extra-large;
    text-align: center;
  }
}

// 轮播图区域
.hero-section {
  .banner-item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
    background-position: center;
    background-size: cover;

    &::before {
      position: absolute;
      inset: 0;
      background: rgb(0 0 0 / 0.4);
      content: '';
    }
  }

  .banner-content {
    z-index: 1;
    color: white;
    text-align: center;

    .banner-title {
      margin-bottom: $spacing-md;
      font-weight: bold;
      font-size: 3rem;
      text-shadow: 2px 2px 4px rgb(0 0 0 / 0.5);
    }

    .banner-subtitle {
      margin-bottom: $spacing-xl;
      font-size: $font-size-large;
      text-shadow: 1px 1px 2px rgb(0 0 0 / 0.5);
    }
  }
}

// 搜索区域
.search-section {
  padding: $spacing-xxl 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .search-card {
    padding: $spacing-xl;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-light;

    .section-title {
      margin-bottom: $spacing-lg;
      color: $primary-color;
    }
  }

  .search-form {
    :deep(.ant-select),
    :deep(.ant-btn) {
      width: 100%;
    }
  }
}

// 房源列表区域
.houses-section {
  padding: $spacing-xxl 0;

  .houses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: $spacing-xl;
    margin-bottom: $spacing-xl;
  }

  .house-card {
    overflow: hidden;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-base;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: $box-shadow-light;
      transform: translateY(-5px);
    }
  }

  .house-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .house-status {
    position: absolute;
    top: $spacing-md;
    right: $spacing-md;
    padding: $spacing-xs $spacing-sm;
    color: white;
    font-weight: bold;
    font-size: $font-size-small;
    border-radius: $border-radius-round;

    &.status-available {
      background: $success-color;
    }

    &.status-applying {
      background: $warning-color;
    }

    &.status-full {
      background: $danger-color;
    }
  }

  .house-content {
    padding: $spacing-lg;
  }

  .house-name {
    margin-bottom: $spacing-md;
    color: $text-color-primary;
    font-weight: bold;
    font-size: $font-size-large;
  }

  .house-info {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-md;
    margin-bottom: $spacing-md;

    .info-item {
      display: flex;
      align-items: center;
      color: $text-color-secondary;
      font-size: $font-size-small;

      .anticon {
        margin-right: $spacing-xs;
      }
    }
  }

  .house-price {
    margin-bottom: $spacing-md;

    .price {
      color: $primary-color;
      font-weight: bold;
      font-size: $font-size-extra-large;
    }

    .unit {
      margin-left: $spacing-xs;
      color: $text-color-secondary;
    }
  }

  .house-desc {
    color: $text-color-secondary;
    line-height: 1.6;
  }

  .load-more {
    text-align: center;
  }
}

// 统计区域
.stats-section {
  padding: $spacing-xxl 0;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-xl;
  }

  .stat-item {
    text-align: center;

    .stat-number {
      margin-bottom: $spacing-sm;
      font-weight: bold;
      font-size: 3rem;
    }

    .stat-label {
      font-size: $font-size-medium;
      opacity: 0.9;
    }
  }
}

@media (max-width: $breakpoint-md) {
  .hero-section {
    .banner-content {
      .banner-title {
        font-size: 2rem;
      }
    }
  }

  .search-section {
    .search-form {
      :deep(.el-col) {
        margin-bottom: $spacing-md;
      }
    }
  }

  .houses-section {
    .houses-grid {
      grid-template-columns: 1fr;
    }
  }

  .stats-section {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .stat-item {
      .stat-number {
        font-size: 2rem;
      }
    }
  }
}
</style>
