<template>
  <el-button type="text" circle class="icon-btn" @click="open = true">
    <el-icon><Setting /></el-icon>
  </el-button>
  <el-drawer v-model="open" direction="rtl" size="420" :lock-scroll="false" :with-header="false" custom-class="settings-drawer">
    <div class="drawer-body">
      <div class="section">
        <div class="section-title">全局主题</div>
        <div class="card-grid">
          <div class="option-card" :class="{ active: currentTheme === 'light' }" @click="setTheme('light')">
            <div class="preview theme-light">
              <div class="page"></div>
            </div>
            <div class="label">浅色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-blue' }" @click="setTheme('dark-blue')">
            <div class="preview theme-dark-blue">
              <div class="page"></div>
            </div>
            <div class="label">深蓝深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-deep' }" @click="setTheme('dark-deep')">
            <div class="preview theme-dark-deep">
              <div class="page"></div>
            </div>
            <div class="label">暗黑深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-midnight' }" @click="setTheme('dark-midnight')">
            <div class="preview theme-dark-midnight">
              <div class="page"></div>
            </div>
            <div class="label">午夜深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'dark-neutral' }" @click="setTheme('dark-neutral')">
            <div class="preview theme-dark-neutral">
              <div class="page"></div>
            </div>
            <div class="label">中性深色</div>
          </div>
          <div class="option-card" :class="{ active: currentTheme === 'corporate-blue' }" @click="setTheme('corporate-blue')">
            <div class="preview theme-corporate-blue">
              <div class="page"></div>
            </div>
            <div class="label">企业蓝色</div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { Setting } from '@element-plus/icons-vue'
import { ref } from 'vue'

const open = ref(false)

type AppTheme = 'light' | 'dark-blue' | 'dark-deep' | 'dark-midnight' | 'dark-neutral' | 'corporate-blue'
const currentTheme = ref<AppTheme>('light')
const setTheme = (val: AppTheme) => {
  const root = document.documentElement
  root.classList.remove('dark-blue', 'dark-deep', 'dark-midnight', 'dark-neutral', 'corporate-blue')
  if (val !== 'light') root.classList.add(val)
  localStorage.setItem('app-theme', val)
  currentTheme.value = val
}

const savedTheme = localStorage.getItem('app-theme') as AppTheme | null
if (savedTheme) setTheme(savedTheme)
</script>

<style scoped>
.icon-btn {
  color: var(--el-text-color-regular);
}
.settings-drawer {
  background: transparent;
}
.settings-drawer .el-drawer__body {
  padding: 20px;
  background: rgba(22, 24, 29, 0.9);
  backdrop-filter: blur(10px);
}
.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #cfd6e6;
  margin-bottom: 10px;
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
