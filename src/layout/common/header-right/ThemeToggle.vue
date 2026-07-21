<template>
  <el-button class="icon-btn" circle @click="toggleTheme($event)">
    <el-icon v-if="isDark"><Moon /></el-icon>
    <el-icon v-else><Sunny /></el-icon>
  </el-button>
</template>

<script lang="ts" setup>
import { Moon, Sunny } from '@element-plus/icons-vue'
import { onMounted, onUnmounted, ref } from 'vue'
import { applyAppTheme, getActiveAppTheme } from '@/hooks/useAppTheme'

const root = document.documentElement
const isDark = ref<boolean>(getActiveAppTheme() === 'night-shift-dark')

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const supportsVT = 'startViewTransition' in document

const toggleTheme = (e?: MouseEvent) => {
  const next = isDark.value ? 'light' : 'night-shift-dark'
  if (!supportsVT || prefersReduced) {
    isDark.value = applyAppTheme(next) !== 'light'
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
    isDark.value = applyAppTheme(next) !== 'light'
  })
  transition.ready.then(() => {
    const radius = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy))
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`] },
      { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    )
  })
}

let observer: MutationObserver | null = null
onMounted(() => {
  observer = new MutationObserver(() => {
    isDark.value = getActiveAppTheme() === 'night-shift-dark'
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
  width: 36px;
  min-width: 36px;
  height: 36px;
  color: var(--el-text-color-regular);
  background: transparent;
  border: none;
}

.icon-btn:hover,
.icon-btn:focus {
  color: var(--el-color-primary);
  background: rgba(255, 255, 255, 0.9);
}
</style>
