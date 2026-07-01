import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VXETable from 'vxe-table'
import GiComponent, { Dialog } from 'gi-component'
import App from './App.vue'
import router from './router'
// 打印设计器 Web Component（vue-print-designer）
import 'vue-print-designer'
import 'vue-print-designer/style.css'
// 引入样式
import 'element-plus/dist/index.css'

import 'vxe-table/lib/style.css'
import 'virtual:svg-icons-register'
import '@/styles/reset.css'
import '@/styles/element.css'
import 'gi-component/dist/gi.css'
// if you just want to import css
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/theme/light.scss'
import '@/styles/theme/dark.scss'
import '@/styles/theme/dark-blue.scss'
import '@/styles/theme/dark-deep.scss'
import '@/styles/theme/dark-midnight.scss'
import '@/styles/theme/dark-neutral.scss'
import '@/styles/theme/corporate-blue.scss'
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

window.addEventListener('keydown', (e) => {
  const isAltL = e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.toLowerCase() === 'l'
  if (isAltL) {
    e.preventDefault()
    window.dispatchEvent(new Event('lock-open'))
  }
})
