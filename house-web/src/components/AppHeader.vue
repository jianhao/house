<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <HomeOutlined class="logo-icon" />
        <span class="logo-text">杭州保障房信息网</span>
      </div>
      <nav class="nav-menu">
        <a-menu :selected-keys="[activeMenu]" mode="horizontal" @select="handleMenuSelect">
          <a-menu-item key="/home">首页</a-menu-item>
          <a-menu-item key="/news">资讯中心</a-menu-item>
        </a-menu>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { HomeOutlined } from '@ant-design/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 当前激活的菜单项
const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/news')) {
    return '/news'
  }
  return '/home'
})

// 菜单选择处理
const handleMenuSelect = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<style lang="scss" scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    height: 64px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .logo {
    display: flex;
    gap: 8px;
    align-items: center;
    color: #1890ff;
    font-weight: 600;
    font-size: 20px;
    text-decoration: none;

    .logo-icon {
      font-size: 24px;
    }

    .logo-text {
      color: #333;
    }
  }

  .nav-menu {
    :deep(.ant-menu) {
      background: transparent;
      border-bottom: none;
    }

    :deep(.ant-menu-item) {
      font-weight: 500;

      &:hover {
        color: #1890ff;
      }

      &.ant-menu-item-selected {
        color: #1890ff;
        border-bottom-color: #1890ff;
      }
    }
  }
}
</style>
