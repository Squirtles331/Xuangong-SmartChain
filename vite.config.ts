import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 1. 自动引入 Vue/Vue-Router/Pinia 等组合式 API
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        // 可选：ElementPlus 组合式 API
        {
          'element-plus': ['ElMessage', 'ElMessageBox', 'ElNotification', 'ElLoading']
        }
      ],
      dts: 'src/types/auto-imports.d.ts', // 类型声明文件
      eslintrc: {
        enabled: true, // 生成 .eslintrc-auto-import.json
        filepath: './.eslintrc-auto-import.json'
      }
    }),
    // 2. 自动引入组件（ElementPlus + 自定义）
    Components({
      // ElementPlus 按需引入
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      // 自定义组件目录
      dirs: ['src/components', 'src/layout'],
      // 类型声明
      dts: 'src/types/components.d.ts',
      // 后缀名
      extensions: ['vue'],
      // 深度
      deep: true
    }),
    // 3. SVG 图标插件
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      // 自定义插入位置
      inject: 'body-last',
      // 自定义dom id
      customDomId: '__svg__icons__dom__'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern' // 关键一行，立即告别 legacy 警告
      }
    }
  }
})
