<template>
  <div class="news-detail">
    <div class="container">
      <!-- 面包屑导航 -->
      <div class="breadcrumb">
        <a-breadcrumb separator=">">
          <a-breadcrumb-item><router-link to="/">首页</router-link></a-breadcrumb-item>
          <a-breadcrumb-item><router-link to="/news">资讯中心</router-link></a-breadcrumb-item>
          <a-breadcrumb-item>{{ article?.title }}</a-breadcrumb-item>
        </a-breadcrumb>
      </div>

      <div class="content-wrapper">
        <!-- 主要内容区域 -->
        <div class="main-content">
          <div v-if="loading" class="loading-container">
            <a-skeleton :paragraph="{ rows: 10 }" active />
          </div>

          <article v-else-if="article" class="article">
            <!-- 文章头部 -->
            <header class="article-header">
              <div class="category-tag" :class="getCategoryClass(article.category)">
                {{ article.category }}
              </div>
              <h1 class="article-title">{{ article.title }}</h1>
              <div class="article-meta">
                <div class="meta-left">
                  <span class="meta-item">
                    <UserOutlined />
                    {{ article.author }}
                  </span>
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
                  <a-button-group>
                    <a-button size="small" @click="handleShare">
                      <ShareAltOutlined />
                      分享
                    </a-button>
                    <a-button size="small" @click="handleCollect">
                      <StarOutlined />
                      收藏
                    </a-button>
                  </a-button-group>
                </div>
              </div>
            </header>

            <!-- 文章摘要 -->
            <div class="article-summary">
              <p>{{ article.summary }}</p>
            </div>

            <!-- 文章主图 -->
            <div v-if="article.image" class="article-image">
              <img :src="article.image" :alt="article.title" />
            </div>

            <!-- 文章内容 -->
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="article-content" v-html="article.content"></div>

            <!-- 文章标签 -->
            <div v-if="article.tags && article.tags.length" class="article-tags">
              <span class="tags-label">标签：</span>
              <a-tag v-for="tag in article.tags" :key="tag" color="blue" class="tag-item">
                {{ tag }}
              </a-tag>
            </div>

            <!-- 最后更新时间 -->
            <div class="article-update-time">
              <span class="update-time"> 最后更新：{{ formatDate(article.updateTime) }} </span>
            </div>
          </article>

          <div v-else class="error-state">
            <el-result
              icon="warning"
              title="文章不存在"
              sub-title="您访问的文章可能已被删除或不存在"
            >
              <template #extra>
                <el-button type="primary" @click="$router.push('/news')"> 返回资讯列表 </el-button>
              </template>
            </el-result>
          </div>

          <!-- 相关文章推荐 -->
          <div v-if="relatedArticles.length" class="related-articles">
            <h3 class="related-title">相关推荐</h3>
            <div class="related-list">
              <div
                v-for="related in relatedArticles"
                :key="related.id"
                class="related-item"
                @click="goToArticle(related.id)"
              >
                <div class="related-image">
                  <img :src="related.image" :alt="related.title" />
                </div>
                <div class="related-content">
                  <h4 class="related-item-title">{{ related.title }}</h4>
                  <div class="related-meta">
                    <span class="related-date">
                      {{ formatDate(related.publishTime) }}
                    </span>
                    <span class="related-views">{{ related.views }}次浏览</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <aside class="sidebar">
          <!-- 目录导航 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">文章目录</h3>
            <div class="toc-list">
              <a
                v-for="(heading, index) in tocList"
                :key="index"
                :href="`#${heading.id}`"
                :class="['toc-item', `toc-level-${heading.level}`]"
                @click="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </a>
            </div>
          </div>

          <!-- 热门文章 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">热门文章</h3>
            <div class="hot-articles">
              <div
                v-for="(hot, index) in hotArticles"
                :key="hot.id"
                class="hot-item"
                @click="goToArticle(hot.id)"
              >
                <div class="hot-rank">{{ index + 1 }}</div>
                <div class="hot-content">
                  <h4 class="hot-title">{{ hot.title }}</h4>
                  <div class="hot-meta">
                    <span class="hot-views">{{ hot.views }}次浏览</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 联系我们 -->
          <div class="sidebar-card">
            <h3 class="sidebar-title">联系我们</h3>
            <div class="contact-info">
              <div class="contact-item">
                <el-icon><Phone /></el-icon>
                <span>咨询热线：0571-12345678</span>
              </div>
              <div class="contact-item">
                <el-icon><Message /></el-icon>
                <span>在线客服：周一至周五 9:00-17:00</span>
              </div>
              <div class="contact-item">
                <el-icon><Location /></el-icon>
                <span>地址：杭州市西湖区文三路123号</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <ActionBar>
      <a-button type="primary" @click="handleLike">
        <LikeOutlined />
        点赞 ({{ article?.likes || 0 }})
      </a-button>
      <a-button @click="handleShare">
        <ShareAltOutlined />
        分享
      </a-button>
    </ActionBar>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NewsApi, type NewsInfo } from '@/api/news'
import ActionBar from '@/components/ActionBar.vue'

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  category: string
  author: string
  publishTime: string
  updateTime: string
  views: number
  likes: number
  image: string
  tags?: string[]
}

interface TocItem {
  id: string
  text: string
  level: number
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const article = ref<NewsArticle | null>(null)
const tocList = ref<TocItem[]>([])

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
    updateTime: newsInfo.updatedAt,
    views: newsInfo.readCount,
    likes: 0, // API中没有点赞数，设为0
    image:
      newsInfo.coverImage ||
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: newsInfo.tags || []
  }
}

// 相关文章
const relatedArticles = ref<NewsArticle[]>([])

// 热门文章
const hotArticles = ref<NewsArticle[]>([])

// 获取相关文章
const fetchRelatedArticles = async () => {
  try {
    const response = await NewsApi.getNewsList({ pageSize: 3 })
    relatedArticles.value = response.data.list.slice(0, 2).map(convertNewsData)
  } catch (error) {
    console.error('获取相关文章失败:', error)
  }
}

// 获取热门文章
const fetchHotArticles = async () => {
  try {
    const response = await NewsApi.getHotNews()
    hotArticles.value = response.data.slice(0, 3).map(convertNewsData)
  } catch (error) {
    console.error('获取热门文章失败:', error)
  }
}

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
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
}

// 生成目录
const generateToc = () => {
  const content = document.querySelector('.article-content')
  if (!content) return

  const headings = content.querySelectorAll('h2, h3, h4')
  tocList.value = Array.from(headings).map((heading, index) => {
    const id = heading.id || `heading-${index}`
    heading.id = id
    return {
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }
  })
}

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 跳转到文章
const goToArticle = (id: string) => {
  router.push(`/news/${id}`)
}

// 处理点赞
const handleLike = () => {
  if (article.value) {
    article.value.likes++
    message.success('点赞成功！')
  }
}

// 处理分享
const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value?.title,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    message.success('链接已复制到剪贴板！')
  }
}

// 处理收藏
const handleCollect = () => {
  message.success('收藏成功！')
}

// 加载文章数据
const loadArticle = async () => {
  try {
    loading.value = true
    const articleId = route.params.id as string

    const response = await NewsApi.getNewsDetail(articleId)
    article.value = convertNewsData(response.data)

    // 增加浏览量
    await NewsApi.increaseReadCount(articleId)

    // 生成目录
    nextTick(() => {
      generateToc()
    })
  } catch (error) {
    message.error('获取文章详情失败')
    console.error('获取文章详情失败:', error)
    article.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadArticle()
  fetchRelatedArticles()
  fetchHotArticles()
})
</script>

<style lang="scss" scoped>
.news-detail {
  min-height: calc(100vh - 64px - 200px);
  padding: $spacing-lg 0 100px;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 $spacing-lg;
  }
}

.breadcrumb {
  margin-bottom: $spacing-lg;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: $spacing-xl;
}

.main-content {
  .loading-container {
    padding: $spacing-xl;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
  }

  .article {
    margin-bottom: $spacing-xl;
    padding: $spacing-xl;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-base;

    .article-header {
      margin-bottom: $spacing-xl;

      .category-tag {
        display: inline-block;
        margin-bottom: $spacing-md;
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

      .article-title {
        margin-bottom: $spacing-lg;
        color: $text-color-primary;
        font-weight: bold;
        font-size: 2rem;
        line-height: 1.4;
      }

      .article-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $spacing-md 0;
        border-top: 1px solid $border-color-extra-light;
        border-bottom: 1px solid $border-color-extra-light;

        .meta-left {
          display: flex;
          gap: $spacing-lg;

          .meta-item {
            display: flex;
            gap: $spacing-xs;
            align-items: center;
            color: $text-color-secondary;
            font-size: $font-size-small;
          }
        }
      }
    }

    .article-summary {
      margin-bottom: $spacing-xl;
      padding: $spacing-lg;
      background: $background-color-base;
      border-left: 4px solid $primary-color;
      border-radius: 0 $border-radius-base $border-radius-base 0;

      p {
        margin: 0;
        color: $text-color-regular;
        font-size: $font-size-large;
        line-height: 1.6;
      }
    }

    .article-image {
      margin-bottom: $spacing-xl;
      text-align: center;

      img {
        max-width: 100%;
        height: auto;
        border-radius: $border-radius-base;
        box-shadow: $box-shadow-base;
      }
    }

    .article-content {
      margin-bottom: $spacing-xl;
      color: $text-color-regular;
      font-size: $font-size-base;
      line-height: 1.8;

      :deep(h2) {
        margin: $spacing-xl 0 $spacing-lg;
        padding-bottom: $spacing-sm;
        color: $text-color-primary;
        font-weight: bold;
        font-size: 1.5rem;
        border-bottom: 2px solid $primary-color;
      }

      :deep(h3) {
        margin: $spacing-lg 0 $spacing-md;
        color: $text-color-primary;
        font-weight: bold;
        font-size: 1.25rem;
      }

      :deep(h4) {
        margin: $spacing-md 0 $spacing-sm;
        color: $text-color-primary;
        font-weight: bold;
        font-size: 1.1rem;
      }

      :deep(p) {
        margin-bottom: $spacing-md;
      }

      :deep(ul),
      :deep(ol) {
        margin: $spacing-md 0;
        padding-left: $spacing-xl;

        li {
          margin-bottom: $spacing-xs;
        }
      }

      :deep(blockquote) {
        margin: $spacing-lg 0;
        padding: $spacing-md $spacing-lg;
        background: $background-color-base;
        border-left: 4px solid $info-color;
        border-radius: 0 $border-radius-base $border-radius-base 0;
      }
    }

    .article-tags {
      display: flex;
      gap: $spacing-sm;
      align-items: center;
      margin-bottom: $spacing-xl;
      padding: $spacing-md 0;
      border-top: 1px solid $border-color-extra-light;

      .tags-label {
        color: $text-color-secondary;
        font-weight: 500;
      }

      .tag-item {
        margin-right: $spacing-xs;
      }
    }

    .article-update-time {
      padding: $spacing-lg 0;
      border-top: 1px solid $border-color-extra-light;
      text-align: right;

      .update-time {
        color: $text-color-secondary;
        font-size: $font-size-small;
      }
    }
  }

  .error-state {
    padding: $spacing-xl;
    text-align: center;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
  }

  .related-articles {
    padding: $spacing-xl;
    background: $background-color-lighter;
    border-radius: $border-radius-large;
    box-shadow: $box-shadow-base;

    .related-title {
      margin-bottom: $spacing-lg;
      padding-bottom: $spacing-sm;
      color: $text-color-primary;
      font-weight: bold;
      font-size: $font-size-large;
      border-bottom: 2px solid $primary-color;
    }

    .related-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: $spacing-lg;

      .related-item {
        display: flex;
        overflow: hidden;
        background: $background-color-base;
        border-radius: $border-radius-base;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: $box-shadow-light;
          transform: translateY(-2px);
        }

        .related-image {
          flex-shrink: 0;
          width: 80px;
          height: 60px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .related-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;
          padding: $spacing-sm $spacing-md;

          .related-item-title {
            display: -webkit-box;
            margin-bottom: $spacing-xs;
            overflow: hidden;
            color: $text-color-primary;
            font-size: $font-size-small;
            line-height: 1.4;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .related-meta {
            display: flex;
            gap: $spacing-sm;
            color: $text-color-secondary;
            font-size: $font-size-extra-small;
          }
        }
      }
    }
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

  .toc-list {
    .toc-item {
      display: block;
      margin-bottom: $spacing-xs;
      padding: $spacing-xs $spacing-sm;
      color: $text-color-regular;
      line-height: 1.4;
      text-decoration: none;
      border-radius: $border-radius-base;
      transition: all 0.3s;

      &:hover {
        color: $primary-color;
        background-color: $background-color-base;
      }

      &.toc-level-2 {
        font-weight: 500;
      }

      &.toc-level-3 {
        padding-left: $spacing-lg;
        font-size: $font-size-small;
      }

      &.toc-level-4 {
        padding-left: $spacing-xl;
        color: $text-color-secondary;
        font-size: $font-size-small;
      }
    }
  }

  .hot-articles {
    .hot-item {
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

  .contact-info {
    .contact-item {
      display: flex;
      gap: $spacing-sm;
      align-items: center;
      padding: $spacing-sm 0;
      color: $text-color-regular;
      font-size: $font-size-small;
      line-height: 1.4;

      .anticon {
        flex-shrink: 0;
        color: $primary-color;
      }
    }
  }
}

@media (max-width: $breakpoint-lg) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: $spacing-lg;
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
  .main-content {
    .article {
      padding: $spacing-lg;

      .article-header {
        .article-title {
          font-size: 1.5rem;
        }

        .article-meta {
          flex-direction: column;
          gap: $spacing-md;
          align-items: stretch;

          .meta-left {
            justify-content: space-between;
          }
        }
      }

      .article-actions {
        flex-direction: column;
        gap: $spacing-md;
        align-items: stretch;

        .actions-right {
          text-align: center;
        }
      }
    }

    .related-articles {
      .related-list {
        grid-template-columns: 1fr;
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
