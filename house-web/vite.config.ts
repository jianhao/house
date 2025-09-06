import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [AntDesignVueResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: false // 禁用自动生成 auto-imports.d.ts
    }),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
      dts: false // 禁用自动生成 components.d.ts
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // 使用现代 Sass API
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  // 依赖预构建优化
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'ant-design-vue/es', '@ant-design/icons-vue']
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://house-server-dev:3001',
        changeOrigin: true,
        secure: false
      },
      '/health': {
        target: 'http://house-server-dev:3001',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://house-server-dev:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          antdv: ['ant-design-vue', '@ant-design/icons-vue'],
          utils: ['axios', 'dayjs', 'lodash-es']
        }
      }
    }
  }
})
