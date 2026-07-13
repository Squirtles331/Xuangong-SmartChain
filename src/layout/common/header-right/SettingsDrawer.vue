<template>
  <el-drawer v-model="open" direction="rtl" size="420" :lock-scroll="false" :with-header="true" custom-class="settings-drawer">
    <template #header>
      <div class="drawer-header">界面设置</div>
    </template>

    <div class="drawer-body">
      <div class="section">
        <div class="section-title">布局模式</div>
        <div class="card-grid">
          <div class="option-card" :class="{ active: layoutMode === 'classic' }" @click="setLayout('classic')">
            <div class="preview layout-classic"><div class="page"></div></div>
            <div class="label">经典布局</div>
          </div>
          <div class="option-card" :class="{ active: layoutMode === 'embedded' }" @click="setLayout('embedded')">
            <div class="preview layout-embedded"><div class="page"></div></div>
            <div class="label">嵌入布局</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">全局主题</div>
        <div class="card-grid">
          <div class="option-card" :class="{ active: currentTheme === 'light' }" @click="setTheme('light', $event)">
            <div class="preview theme-light"><div class="page"></div></div>
            <div class="label">工业蓝灰</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'night-shift-dark' }" @click="setTheme('night-shift-dark', $event)">
            <div class="preview theme-night-shift-dark"><div class="page"></div></div>
            <div class="label">夜班深蓝</div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="resetDefaults">恢复默认设置</el-button>
        <el-button type="primary" @click="clearAndLogout">清除缓存并退出</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { type LayoutMode, useLayoutStore } from '@/stores/layout'
import { applyAppTheme, getActiveAppTheme, getStoredAppTheme, type AppTheme } from '@/hooks/useAppTheme'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const open = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v)
})

const layoutStore = useLayoutStore()
const layoutMode = ref<LayoutMode>(layoutStore.mode)
const currentTheme = ref<AppTheme>(getStoredAppTheme())

const root = document.documentElement
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const supportsVT = 'startViewTransition' in document

const applyTheme = (val: AppTheme) => {
  currentTheme.value = applyAppTheme(val)
}

const setLayout = (mode: LayoutMode) => {
  layoutStore.setMode(mode)
  layoutMode.value = mode
}

const setTheme = (val: AppTheme, event?: MouseEvent) => {
  if (!supportsVT || prefersReduced) {
    applyTheme(val)
    return
  }

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const centerX = event?.clientX ?? viewportWidth / 2
  const centerY = event?.clientY ?? viewportHeight / 2
  const radius = Math.hypot(Math.max(centerX, viewportWidth - centerX), Math.max(centerY, viewportHeight - centerY))

  const transition = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }).startViewTransition?.(() =>
    applyTheme(val)
  )

  transition?.ready.then(() => {
    root.animate(
      {
        clipPath: [`circle(0px at ${centerX}px ${centerY}px)`, `circle(${radius}px at ${centerX}px ${centerY}px)`]
      },
      { duration: 450, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    )
  })
}

const router = useRouter()

const resetDefaults = () => {
  setTheme('light')
  setLayout('classic')
}

const clearAndLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  router.replace('/login')
  emit('update:modelValue', false)
}

watch(
  () => props.modelValue,
  (openState) => {
    if (!openState) return
    layoutMode.value = layoutStore.mode
    currentTheme.value = getStoredAppTheme()
  }
)

watch(
  () => layoutStore.mode,
  (mode) => {
    layoutMode.value = mode
  }
)

let themeObserver: MutationObserver | null = null

onMounted(() => {
  themeObserver = new MutationObserver(() => {
    currentTheme.value = getActiveAppTheme()
  })
  themeObserver.observe(root, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => {
  themeObserver?.disconnect()
  themeObserver = null
})
</script>

<style scoped>
:deep(.settings-drawer) {
  background: transparent;
}

.el-drawer__body {
  flex: 1;
  overflow: auto;
  padding: var(--el-drawer-padding-primary);
  scrollbar-width: none;
}

.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section {
  padding: 16px;
  border-radius: 18px;
  border: 1px solid var(--layout-divider);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--el-bg-color) 96%, transparent) 0%, var(--el-fill-color-lighter) 100%);
  box-shadow: var(--el-box-shadow-lighter);
}

.drawer-header {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
}

.section-title {
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.option-card {
  position: relative;
  padding: 12px;
  border: 1px solid var(--layout-divider);
  border-radius: 12px;
  background: var(--el-bg-color);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.option-card:hover {
  transform: translateY(-1px);
}

.option-card.active {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px rgba(32, 104, 182, 0.12);
}

.label {
  margin-top: 8px;
  font-size: 13px;
  text-align: center;
  color: var(--el-text-color-primary);
}

.preview {
  height: 70px;
  overflow: hidden;
  border-radius: 8px;
  background: #edf2f7;
  display: grid;
  place-items: center;
}

.preview .page {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(118, 134, 158, 0.18);
  background: linear-gradient(180deg, #f9fbfd 0%, #edf3f6 100%);
}

.layout-classic .page {
  background: linear-gradient(90deg, #18324d 0 28%, transparent 28% 100%), linear-gradient(180deg, #ffffff 0 22%, #eef3f7 22% 100%);
}

.layout-embedded .page {
  background: linear-gradient(90deg, #18324d 0 24%, transparent 24% 100%), linear-gradient(180deg, #eef4f8 0 16%, #ffffff 16% 100%);
}

.theme-night-shift-dark .page {
  border-color: rgba(149, 170, 196, 0.16);
  background: linear-gradient(180deg, #172231 0%, #111a27 100%);
}
</style>
