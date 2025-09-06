<template>
  <div class="layout">
    <!-- 顶部导航 -->
    <AppHeader />

    <!-- 主要内容区域 -->
    <main class="layout-main">
      <router-view />
    </main>

    <!-- 底部 -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-main {
  flex: 1;
  min-height: calc(100vh - 64px);
}
</style>
