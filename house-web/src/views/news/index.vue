<template>
  <div class="news">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">资讯中心</h1>
        <p class="page-subtitle">了解最新的保障房政策和资讯动态</p>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-card">
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">分类筛选：</label>
              <a-radio-group
                v-model:value="filterForm.category"
                @change="handleFilter"
                button-style="solid"
              >
                <a-radio-button value="">全部</a-radio-button>
                <a-radio-button value="政策解读">政策解读</a-radio-button>
                <a-radio-button value="申请指南">申请指南</a-radio-button>
                <a-radio-button value="项目动态">项目动态</a-radio-button>
                <a-radio-button value="通知公告">通知公告</a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">时间筛选：</label>
              <a-radio-group
                v-model:value="filterForm.timeRange"
                @change="handleFilter"
                button-style="solid"
              >
                <a-radio-button value="">全部</a-radio-button>
                <a-radio-button value="week">最近一周</a-radio-button>
                <a-radio-button value="month">最近一月</a-radio-button>
                <a-radio-button value="quarter">最近三月</a-radio-button>
              </a-radio-group>
            </div>
            <div class="search-group">
              <a-input-search
                v-model:value="filterForm.keyword"
                placeholder="搜索资讯标题或内容"
                allow-clear
                @search="handleFilter"
                @pressEnter="handleFilter"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 资讯列表 -->
      <div class="news-section">
        <div v-if="loading" class="loading-container">
          <a-skeleton
            v-for="i in 6"
            :key="i"
            :paragraph="{ rows: 3 }"
            active
            class="news-skeleton"
          />
        </div>

        <div v-else-if="filteredNews.length > 0" class="news-list">
          <div
            v-for="article in filteredNews"
            :key="article.id"
            class="news-item"
            @click="goToDetail(article.id)"
          >
            <div class="news-image">
              <img :src="article.image" :alt="article.title" />
              <div class="category-tag" :class="getCategoryClass(article.category)">
                {{ article.category }}
              </div>
            </div>
            <div class="news-content">
              <h3 class="news-title">{{ article.title }}</h3>
              <p class="news-summary">{{ article.summary }}</p>
              <div class="news-meta">
                <div class="meta-left">
                  <span class="meta-item">
                    <CalendarOutlined />
                    {{ formatDate(article.publishTime) }}
                  </span>
                  <span class="meta-item">
                    <EyeOutlined />
                    {{ article.views }}次浏览
                  </span>
                </div>
                <div class="meta-right">
                  <span class="author">{{ article.author }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <a-empty description="暂无相关资讯" />
        </div>

        <!-- 分页 -->
        <div v-if="filteredNews.length > 0" class="pagination">
          <a-pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :page-size-options="['10', '20', '50']"
            :total="totalCount"
            show-size-changer
            show-quick-jumper
            show-total
            @change="handleCurrentChange"
            @showSizeChange="handleSizeChange"
          />
        </div>
      </div>

      <!-- 热门资讯侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-card">
          <h3 class="sidebar-title">热门资讯</h3>
          <div class="hot-news-list">
            <div
              v-for="(article, index) in hotNews"
              :key="article.id"
              class="hot-news-item"
              @click="goToDetail(article.id)"
            >
              <div class="hot-rank">{{ index + 1 }}</div>
              <div class="hot-content">
                <h4 class="hot-title">{{ article.title }}</h4>
                <div class="hot-meta">
                  <span class="hot-views">{{ article.views }}次浏览</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-title">政策导航</h3>
          <div class="policy-links">
            <router-link to="/policy/housing-conditions" class="policy-link">
              <FileTextOutlined />
              保障房申请条件
            </router-link>
            <router-link to="/policy/application-guide" class="policy-link">
              <FileTextOutlined />
              申请流程指南
            </router-link>
            <router-link to="/policy/rent-subsidy" class="policy-link">
              <FileTextOutlined />
              租金补贴政策
            </router-link>
            <router-link to="/policy/faq" class="policy-link">
              <FileTextOutlined />
              常见问题解答
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import NewsService from '@/service/news'
import type { NewsInfo } from '@/service/news/types'

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  category: string
  author: string
  publishTime: string
  views: number
  image: string
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 筛选表单
const filterForm = reactive({
  category: '',
  timeRange: '',
  keyword: ''
})

// 资讯数据
const newsList = ref<NewsArticle[]>([])
const allNews = ref<NewsArticle[]>([])

// 数据转换函数
const convertNewsData = (newsInfo: NewsInfo): NewsArticle => {
  return {
    id: newsInfo.id,
    title: newsInfo.title,
    summary: newsInfo.summary || '',
    content: newsInfo.content || '',
    category: newsInfo.category.name,
    author: newsInfo.author || '系统管理员',
    publishTime: newsInfo.publishTime,
    views: newsInfo.readCount,
    image:
      newsInfo.coverImage ||
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
}

// 热门资讯
const hotNews = computed(() => {
  return [...newsList.value].sort((a, b) => b.views - a.views).slice(0, 5)
})

// 筛选后的资讯
const filteredNews = computed(() => {
  return newsList.value
})

// 获取分类样式类
const getCategoryClass = (category: string) => {
  const classMap: Record<string, string> = {
    政策解读: 'category-policy',
    申请指南: 'category-guide',
    项目动态: 'category-project',
    通知公告: 'category-notice'
  }
  return classMap[category] || 'category-default'
}

// 格式化日期
const formatDate = (dateStr: string) => {
  return dayjs(dateStr).format('YYYY-MM-DD')
}

// 分类映射
const categoryMap: Record<string, string> = {
  政策解读: '1',
  申请指南: '3',
  项目动态: '4',
  通知公告: '5'
}

// 获取资讯列表
const fetchNews = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryId: filterForm.category ? categoryMap[filterForm.category] : undefined,
      keyword: filterForm.keyword || undefined
    }
    const response = await NewsService.getNewsList(params)
    const convertedNews = response.data.list.map(convertNewsData)
    newsList.value = convertedNews
    totalCount.value = response.data.total

    // 保存所有数据用于筛选
    if (currentPage.value === 1) {
      allNews.value = convertedNews
    } else {
      allNews.value = [...allNews.value, ...convertedNews]
    }
  } catch (error) {
    console.error('获取资讯列表失败:', error)
    // 错误处理已在request.ts中统一处理
  } finally {
    loading.value = false
  }
}

// 获取热门资讯
const fetchHotNews = async () => {
  try {
    await NewsService.getHotNews()
    // hotNews 通过 computed 计算，这里不需要单独设置
  } catch (error) {
    console.error('获取热门资讯失败:', error)
    // 错误处理已在request.ts中统一处理
  }
}

// 筛选处理
const handleFilter = () => {
  currentPage.value = 1
  fetchNews()
}

// 分页处理
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  fetchNews()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  fetchNews()
}

// 跳转到详情页
const goToDetail = (id: string) => {
  router.push(`/news/${id}`)
}

onMounted(() => {
  fetchNews()
  fetchHotNews()
})
</script>

<style lang="scss" scoped>
.news {
  min-height: calc(100vh - 64px - 200px);
  padding: $spacing-lg 0 $spacing-xxl;

  .container {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: $spacing-xl;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }
}

.page-header {
  grid-column: 1 / -1;
  margin-bottom: $spacing-xl;
  text-align: center;

  .page-title {
    margin-bottom: $spacing-md;
    color: $text-color-primary;
    font-weight: bold;
    font-size: 2.5rem;
  }

  .page-subtitle {
    color: $text-color-secondary;
    font-size: $font-size-large;
  }
}

.filter-section {
  grid-column: 1 / -1;
  margin-bottom: $spacing-xl;

  .filter-card {
    padding: $spacing-lg;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-base;

    .filter-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: $spacing-md;

      &:last-child {
        margin-bottom: 0;
      }

      .filter-group {
        display: flex;
        gap: $spacing-md;
        align-items: center;

        .filter-label {
          color: $text-color-primary;
          font-weight: 500;
          white-space: nowrap;
        }
      }

      .search-group {
        width: 300px;
      }
    }
  }
}

.news-section {
  .loading-container {
    .news-skeleton {
      margin-bottom: $spacing-lg;
      padding: $spacing-lg;
      background: $background-color-lighter;
      border-radius: $border-radius-base;
    }
  }

  .news-list {
    .news-item {
      display: flex;
      margin-bottom: $spacing-lg;
      overflow: hidden;
      background: $background-color-lighter;
      border-radius: $border-radius-large;
      box-shadow: $box-shadow-base;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        box-shadow: $box-shadow-light;
        transform: translateY(-2px);
      }

      .news-image {
        position: relative;
        flex-shrink: 0;
        width: 200px;
        height: 150px;
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

        .category-tag {
          position: absolute;
          top: $spacing-sm;
          left: $spacing-sm;
          padding: $spacing-xs $spacing-sm;
          color: white;
          font-weight: bold;
          font-size: $font-size-extra-small;
          border-radius: $border-radius-base;

          &.category-policy {
            background: $primary-color;
          }

          &.category-guide {
            background: $success-color;
          }

          &.category-project {
            background: $warning-color;
          }

          &.category-notice {
            background: $danger-color;
          }

          &.category-default {
            background: $info-color;
          }
        }
      }

      .news-content {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: $spacing-lg;

        .news-title {
          display: -webkit-box;
          margin-bottom: $spacing-md;
          overflow: hidden;
          color: $text-color-primary;
          font-weight: bold;
          font-size: $font-size-large;
          line-height: 1.4;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .news-summary {
          display: -webkit-box;
          flex: 1;
          margin-bottom: $spacing-md;
          overflow: hidden;
          color: $text-color-regular;
          line-height: 1.6;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .news-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: $text-color-secondary;
          font-size: $font-size-small;

          .meta-left {
            display: flex;
            gap: $spacing-md;

            .meta-item {
              display: flex;
              gap: $spacing-xs;
              align-items: center;
            }
          }

          .author {
            font-weight: 500;
          }
        }
      }
    }
  }

  .empty-state {
    padding: $spacing-xxl;
    text-align: center;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: $spacing-xl;
  }
}

.sidebar {
  .sidebar-card {
    margin-bottom: $spacing-lg;
    padding: $spacing-lg;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-base;

    .sidebar-title {
      margin-bottom: $spacing-md;
      padding-bottom: $spacing-sm;
      color: $text-color-primary;
      font-weight: bold;
      font-size: $font-size-large;
      border-bottom: 2px solid $primary-color;
    }
  }

  .hot-news-list {
    .hot-news-item {
      display: flex;
      align-items: flex-start;
      padding: $spacing-sm 0;
      border-bottom: 1px solid $border-color-extra-light;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover {
        background-color: $background-color-base;
      }

      &:last-child {
        border-bottom: none;
      }

      .hot-rank {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin-right: $spacing-sm;
        color: white;
        font-weight: bold;
        font-size: $font-size-small;
        background: $primary-color;
        border-radius: 50%;
      }

      .hot-content {
        flex: 1;
        min-width: 0;

        .hot-title {
          display: -webkit-box;
          margin-bottom: $spacing-xs;
          overflow: hidden;
          color: $text-color-primary;
          font-size: $font-size-small;
          line-height: 1.4;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .hot-meta {
          .hot-views {
            color: $text-color-secondary;
            font-size: $font-size-extra-small;
          }
        }
      }
    }
  }

  .policy-links {
    .policy-link {
      display: flex;
      align-items: center;
      margin-bottom: $spacing-xs;
      padding: $spacing-sm;
      color: $text-color-regular;
      text-decoration: none;
      border-radius: $border-radius-base;
      transition: all 0.3s;

      &:hover {
        color: $primary-color;
        background-color: $background-color-base;
      }

      .el-icon {
        margin-right: $spacing-sm;
      }
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .news {
    .container {
      grid-template-columns: 1fr;
      gap: $spacing-lg;
    }
  }

  .sidebar {
    order: -1;

    .sidebar-card {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: $spacing-lg;
      align-items: start;

      .sidebar-title {
        grid-column: 1 / -1;
      }
    }
  }
}

@media (max-width: $breakpoint-md) {
  .filter-section {
    .filter-card {
      .filter-row {
        flex-direction: column;
        gap: $spacing-md;
        align-items: stretch;

        .filter-group {
          flex-direction: column;
          align-items: stretch;

          .filter-label {
            margin-bottom: $spacing-xs;
          }
        }

        .search-group {
          width: 100%;
        }
      }
    }
  }

  .news-section {
    .news-list {
      .news-item {
        flex-direction: column;

        .news-image {
          width: 100%;
          height: 200px;
        }
      }
    }
  }

  .sidebar {
    .sidebar-card {
      grid-template-columns: 1fr;
    }
  }
}
</style>
