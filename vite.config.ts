import { resolve } from 'path'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import { exclude, include } from './vite-support/optimize'
import { getPluginsList } from './vite-support/plugins'
import { wrapperEnv } from './vite-support/getEnv'
import pkg from './package.json'
import { getNowDate } from './src/common/utils/core/date'

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: getNowDate()
}

export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd())
  const viteEnv = wrapperEnv(env)

  return {
    base: viteEnv.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    plugins: getPluginsList(command, viteEnv),
    optimizeDeps: {
      include,
      exclude
    },
    server: {
      host: '0.0.0.0',
      port: viteEnv.VITE_PORT,
      open: viteEnv.VITE_OPEN,
      cors: true,
      proxy: {
        '/api': {
          target: 'http://192.168.1.100:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*']
      }
    },
    css: {
      preprocessorOptions: {
        scss: {}
      }
    },
    build: {
      minify: 'esbuild',
      outDir: env.VITE_OUT_DIR || 'dist',
      sourcemap: viteEnv.VITE_SOURCEMAP,
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: resolve(__dirname, '.', 'index.html')
        },
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/element-plus')) return 'element-plus'
            if (id.includes('node_modules/echarts')) return 'echarts'
            if (id.includes('node_modules/vue/') || id.includes('node_modules/vue-router/') || id.includes('node_modules/pinia/')) {
              return 'vue-chunks'
            }
          },
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      },
      cssCodeSplit: !env.VITE_USE_CSS_SPLIT
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true',
      log: {}
    }
  }
})
