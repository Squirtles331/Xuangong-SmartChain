<template>
  <el-drawer v-model="open" direction="rtl" size="420" :lock-scroll="false" :with-header="true" custom-class="settings-drawer">
    <template #header>
      <div class="drawer-header">系统设置</div>
    </template>
    <div class="drawer-body">
      <div class="section">
        <div class="section-title">布局模式</div>
        <div class="card-grid">
          <div class="option-card" :class="{ active: layoutMode === 'vertical' }" @click="setLayout('vertical')">
            <div class="preview"><div class="page"></div></div>
            <div class="label">纵向</div>
          </div>
          <div class="option-card" :class="{ active: layoutMode === 'classic' }" @click="setLayout('classic')">
            <div class="preview"><div class="page"></div></div>
            <div class="label">经典</div>
          </div>
          <div class="option-card" :class="{ active: layoutMode === 'horizontal' }" @click="setLayout('horizontal')">
            <div class="preview"><div class="page"></div></div>
            <div class="label">横向</div>
          </div>
          <div class="option-card" :class="{ active: layoutMode === 'columns' }" @click="setLayout('columns')">
            <div class="preview"><div class="page"></div></div>
            <div class="label">分栏</div>
          </div>
          <div class="option-card" :class="{ active: layoutMode === 'mixed' }" @click="setLayout('mixed')">
            <div class="preview"><div class="page"></div></div>
            <div class="label">混合</div>
          </div>
          <div class="option-card" :class="{ active: layoutMode === 'embedded' }" @click="setLayout('embedded')">
            <div class="preview"><div class="page"></div></div>
            <div class="label">嵌入</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">全局主题</div>
        <div class="card-grid">
          <div class="option-card" :class="{ active: currentTheme === 'light' }" @click="setTheme('light', $event)">
            <div class="preview theme-light"><div class="page"></div></div>
            <div class="label">浅色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-blue' }" @click="setTheme('dark-blue', $event)">
            <div class="preview theme-dark-blue"><div class="page"></div></div>
            <div class="label">深蓝深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-deep' }" @click="setTheme('dark-deep', $event)">
            <div class="preview theme-dark-deep"><div class="page"></div></div>
            <div class="label">暗黑深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-midnight' }" @click="setTheme('dark-midnight', $event)">
            <div class="preview theme-dark-midnight"><div class="page"></div></div>
            <div class="label">午夜深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-neutral' }" @click="setTheme('dark-neutral', $event)">
            <div class="preview theme-dark-neutral"><div class="page"></div></div>
            <div class="label">中性深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'corporate-blue' }" @click="setTheme('corporate-blue', $event)">
            <div class="preview theme-corporate-blue"><div class="page"></div></div>
            <div class="label">企业蓝色</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">主题色</div>
        <div class="color-row">
          <el-color-picker
            v-model="primaryColorDraft"
            :predefine="predefinedColors"
            :show-alpha="false"
            @change="onPrimaryColorChange"
            :style="{ '--picker-color': primaryColorDraft }"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <div class="drawer-footer">
        <el-button @click="resetDefaults">还原默认配置</el-button>
        <el-button type="primary" @click="clearAndLogout">清除缓存并退出登录</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore, type LayoutMode } from '@/stores/layout'
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const open = computed({ get: () => props.modelValue, set: (v: boolean) => emit('update:modelValue', v) })
const layoutStore = useLayoutStore()
const layoutMode = ref<LayoutMode>(layoutStore.mode)
const setLayout = (m: LayoutMode) => {
  layoutStore.setMode(m)
  layoutMode.value = m
}
type AppTheme = 'light' | 'dark-blue' | 'dark-deep' | 'dark-midnight' | 'dark-neutral' | 'corporate-blue'
const currentTheme = ref<AppTheme>('light')
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const supportsVT = 'startViewTransition' in document
const primaryColor = ref<string>('')
const primaryColorDraft = ref<string>('')
const predefinedColors = ['#f15bb5', '#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#475569', '#ec4899', '#22c55e', '#84cc16', '#f59e0b']
const getComputedPrimary = () => getComputedStyle(document.documentElement).getPropertyValue('--el-color-primary').trim() || '#409eff'
const mix = (color: string, mixColor: string, weight: number) => {
  const toRgb = (c: string) => {
    const hex = c.replace('#', '')
    const hexFull =
      hex.length === 3
        ? hex
            .split('')
            .map((x) => x + x)
            .join('')
        : hex
    const bigint = parseInt(hexFull, 16)
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
  }
  const a = toRgb(color)
  const b = toRgb(mixColor)
  const r = Math.round(a.r * (1 - weight) + b.r * weight)
  const g = Math.round(a.g * (1 - weight) + b.g * weight)
  const bl = Math.round(a.b * (1 - weight) + b.b * weight)
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`
}
const applyPrimaryColor = (color: string) => {
  const root = document.documentElement
  root.style.setProperty('--el-color-primary', color)
  root.style.setProperty('--el-color-primary-light-3', mix(color, '#ffffff', 0.3))
  root.style.setProperty('--el-color-primary-light-5', mix(color, '#ffffff', 0.5))
  root.style.setProperty('--el-color-primary-dark-2', mix(color, '#000000', 0.2))
}
const onPrimaryColorChange = (val: string) => {
  if (!val) return
  primaryColor.value = val
  primaryColorDraft.value = val
  applyPrimaryColor(val)
  localStorage.setItem('app-primary-color', val)
}
const setTheme = (val: AppTheme, e?: MouseEvent) => {
  const root = document.documentElement
  const apply = () => {
    root.classList.remove('dark-blue', 'dark-deep', 'dark-midnight', 'dark-neutral', 'corporate-blue')
    if (val !== 'light') root.classList.add(val)
    localStorage.setItem('app-theme', val)
    currentTheme.value = val
    const savedPrimary = localStorage.getItem('app-primary-color')
    if (savedPrimary) applyPrimaryColor(savedPrimary)
  }
  if (!supportsVT || prefersReduced) {
    apply()
    return
  }
  const vw = innerWidth
  const vh = innerHeight
  const cx = e?.clientX ?? vw / 2
  const cy = e?.clientY ?? vh / 2
  const transition = (document as any).startViewTransition(() => {
    apply()
  })
  transition.ready.then(() => {
    const radius = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy))
    root.animate(
      val === 'light'
        ? { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`] }
        : { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${radius}px at ${cx}px ${cy}px)`] },
      { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    )
  })
}
const savedTheme = localStorage.getItem('app-theme') as AppTheme | null
if (savedTheme) setTheme(savedTheme)
const savedPrimary = localStorage.getItem('app-primary-color')
primaryColor.value = savedPrimary || getComputedPrimary()
primaryColorDraft.value = primaryColor.value
applyPrimaryColor(primaryColor.value)

const router = useRouter()
const resetDefaults = () => {
  setTheme('light')
  localStorage.removeItem('app-primary-color')
  const def = getComputedPrimary()
  primaryColor.value = def
  primaryColorDraft.value = def
  applyPrimaryColor(def)
  layoutStore.setMode('classic')
  layoutMode.value = 'classic'
}
const clearAndLogout = () => {
  localStorage.clear()
  sessionStorage.clear()
  router.replace('/login')
  emit('update:modelValue', false)
}
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
.drawer-header {
  padding: 16px 20px;
  font-size: 16px;
  font-weight: 600;
  color: #cfd6e6;
}
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 20px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #cfd6e6;
  margin-bottom: 10px;
}
.color-row {
  display: flex;
  justify-content: flex-end;
}
:deep(.el-color-picker__trigger) {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--picker-color) 35%, transparent);
  border-color: var(--picker-color);
}
:deep(.el-color-picker__icon) {
  color: #fff;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.option-card {
  position: relative;
  border-radius: 12px;
  border: 1px solid rgba(120, 130, 150, 0.35);
  background: linear-gradient(180deg, rgba(46, 52, 64, 0.9), rgba(30, 34, 42, 0.9));
  padding: 12px;
  cursor: pointer;
}
.option-card.active {
  border-color: #5b86ff;
  box-shadow: 0 0 0 2px rgba(91, 134, 255, 0.25);
}
.label {
  margin-top: 8px;
  font-size: 13px;
  color: #cfd6e6;
  text-align: center;
}
.preview {
  height: 70px;
  border-radius: 8px;
  background: rgba(20, 22, 28, 0.8);
  overflow: hidden;
  display: grid;
  place-items: center;
}
.preview .page {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #f9f9fb 0%, #eceff5 100%);
}
.theme-dark .page {
  background: linear-gradient(180deg, #2b2f3a 0%, #1c2029 100%);
}
.theme-dark-blue .page {
  background: linear-gradient(180deg, #2a3b64 0%, #1b2440 100%);
}
.theme-dark-deep .page {
  background: linear-gradient(180deg, #1f232c 0%, #12161e 100%);
}
.theme-dark-midnight .page {
  background: linear-gradient(180deg, #0e1220 0%, #0a0e18 100%);
}
.theme-dark-neutral .page {
  background: linear-gradient(180deg, #2a2a2a 0%, #1b1b1b 100%);
}
.theme-corporate-blue .page {
  background: linear-gradient(180deg, #f0f6ff 0%, #dce8ff 100%);
}
</style>
