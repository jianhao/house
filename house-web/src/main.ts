import * as AntdIcons from '@ant-design/icons-vue'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import './styles/index.scss'

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(AntdIcons)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(Antd)

app.mount('#app')
