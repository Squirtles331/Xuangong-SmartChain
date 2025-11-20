import 'element-plus/dist/index.css'
import 'vxe-table/lib/style.css'
import 'virtual:svg-icons-register'
// 引入样式
import 'gi-component/dist/gi.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VXETable from 'vxe-table'
import GiComponent, { Dialog } from 'gi-component'
import App from './App.vue'
import router from './router'

const app = createApp(App)
Dialog._context = app._context // 继承主应用的上下文
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VXETable)
app.use(GiComponent)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
