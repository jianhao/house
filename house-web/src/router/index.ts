import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/house/:id',
        name: 'HouseDetail',
        component: () => import('@/views/house-detail/index.vue'),
        meta: {
          title: '保障房详情'
        }
      },
      {
        path: '/news',
        name: 'News',
        component: () => import('@/views/news/index.vue'),
        meta: {
          title: '资讯中心'
        }
      },
      {
        path: '/news/:id',
        name: 'NewsDetail',
        component: () => import('@/views/news-detail/index.vue'),
        meta: {
          title: '资讯详情'
        }
      },
      {
        path: '/policy/:id',
        name: 'PolicyDetail',
        component: () => import('@/views/policy-detail/index.vue'),
        meta: {
          title: '政策详情'
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 杭州保障房信息网`
  }
  next()
})

export default router
