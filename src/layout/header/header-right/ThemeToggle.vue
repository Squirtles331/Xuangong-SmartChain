<template>
  <el-button type="text" circle class="icon-btn" @click="toggleTheme($event)">
    <el-icon v-if="isDark"><Moon /></el-icon>
    <el-icon v-else><Sunny /></el-icon>
  </el-button>
</template>

<script lang="ts" setup>
import { Moon, Sunny } from '@element-plus/icons-vue'
import { ref, onMounted, onUnmounted } from 'vue'

type AppTheme = 'light' | 'dark-blue' | 'dark-deep' | 'dark-midnight' | 'dark-neutral' | 'corporate-blue'
const root = document.documentElement
const hasDarkClass = () =>
  root.classList.contains('dark-blue') ||
  root.classList.contains('dark-deep') ||
  root.classList.contains('dark-midnight') ||
  root.classList.contains('dark-neutral') ||
  root.classList.contains('corporate-blue')
const isDark = ref<boolean>(hasDarkClass())

const applyTheme = (val: AppTheme) => {
  root.classList.remove('dark-blue', 'dark-deep', 'dark-midnight', 'dark-neutral', 'corporate-blue')
  if (val !== 'light') root.classList.add(val)
  localStorage.setItem('app-theme', val)
  isDark.value = val !== 'light'
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const supportsVT = 'startViewTransition' in document

const toggleTheme = (e?: MouseEvent) => {
  const next = isDark.value ? 'light' : 'dark-deep'
  if (!supportsVT || prefersReduced) {
    applyTheme(next)
    return
  }
  const vw = innerWidth
  const vh = innerHeight
  const clickX = e?.clientX ?? vw / 2
  const clickY = e?.clientY ?? vh / 2
  const useOppositeOrigin = next === 'light'
  const cx = useOppositeOrigin ? vw - clickX : clickX
  const cy = useOppositeOrigin ? vh - clickY : clickY
  const transition = (document as any).startViewTransition(() => {
    applyTheme(next)
  })
  transition.ready.then(() => {
    const radius = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy))
    document.documentElement.animate(
      next === 'light'
        ? {
            clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`]
          }
        : {
            clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`]
          },
      {
        duration: 500,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)'
      }
    )
  })
}

const savedTheme = localStorage.getItem('app-theme') as AppTheme | null
if (savedTheme) applyTheme(savedTheme)

let observer: MutationObserver | null = null
onMounted(() => {
  observer = new MutationObserver(() => {
    isDark.value = hasDarkClass()
  })
  observer.observe(root, { attributes: true, attributeFilter: ['class'] })
})
onUnmounted(() => {
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.icon-btn {
  color: var(--el-text-color-regular);
}
</style>
