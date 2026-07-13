<template>
  <gi-page-layout>
    <template #header>
      <div class="planned-header">
        <div>
          <h2 class="planned-title">{{ title }}</h2>
          <p class="planned-desc">{{ description }}</p>
        </div>
        <el-tag type="warning" effect="dark" round>{{ TEXT.waiting }}</el-tag>
      </div>
    </template>

    <div class="planned-content">
      <el-card shadow="never" class="planned-main">
        <el-empty :description="emptyDesc" />
      </el-card>

      <div class="planned-side-stack">
        <el-card shadow="never" class="planned-side">
          <template #header>{{ TEXT.currentPlan }}</template>
          <div v-if="plannedItems.length" class="planned-items">
            <div v-for="item in plannedItems" :key="item" class="planned-item">
              {{ item }}
            </div>
          </div>
          <el-empty v-else :description="fallbackPlanDesc" :image-size="72" />
        </el-card>

        <el-card v-if="ownershipEntries.length" shadow="never" class="planned-side">
          <template #header>{{ TEXT.ownershipInfo }}</template>
          <div class="ownership-list">
            <div v-for="item in ownershipEntries" :key="item.label" class="ownership-item">
              <div class="ownership-label">{{ item.label }}</div>
              <div class="ownership-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteMeta } from 'vue-router'

type PlannedRouteMeta = RouteMeta & {
  placeholderDesc?: string
  plannedItems?: string[]
  collaboratorSystems?: string[] | string
}

const TEXT = {
  waiting: '等待建设',
  currentPlan: '当前规划',
  ownershipInfo: '页面归属',
  pageBuilding: '页面建设中',
  defaultDesc: '当前先完成系统骨架搭建，后续再按业务优先级逐步补齐功能实现。',
  emptyDesc: '该页面已纳入系统菜单与路由骨架，功能将在后续版本逐步建设。',
  noPlan: '暂未补充详细建设项',
  ownerSystem: '主责系统',
  collaboratorSystems: '协同系统',
  coreObject: '核心对象',
  boundaryNote: '边界说明'
} as const

const route = useRoute()
const pageMeta = computed(() => route.meta as PlannedRouteMeta)

const title = computed(() => pageMeta.value.title?.toString() || TEXT.pageBuilding)
const description = computed(() => pageMeta.value.placeholderDesc || TEXT.defaultDesc)
const emptyDesc = computed(() => TEXT.emptyDesc)
const fallbackPlanDesc = computed(() => TEXT.noPlan)
const plannedItems = computed(() => pageMeta.value.plannedItems || [])
const collaboratorSystemsText = computed(() => {
  const value = pageMeta.value.collaboratorSystems

  if (Array.isArray(value)) {
    return value.join(' / ')
  }

  return typeof value === 'string' ? value : ''
})

const ownershipEntries = computed(() => {
  const entries: Array<{ label: string; value: string } | null> = [
    pageMeta.value.ownerSystem ? { label: TEXT.ownerSystem, value: pageMeta.value.ownerSystem } : null,
    collaboratorSystemsText.value ? { label: TEXT.collaboratorSystems, value: collaboratorSystemsText.value } : null,
    pageMeta.value.coreObject ? { label: TEXT.coreObject, value: pageMeta.value.coreObject } : null,
    pageMeta.value.boundaryNote ? { label: TEXT.boundaryNote, value: pageMeta.value.boundaryNote } : null
  ]

  return entries.filter((item): item is { label: string; value: string } => item !== null)
})
</script>

<style scoped>
.planned-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.planned-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--planned-title);
}

.planned-desc {
  margin: 8px 0 0;
  line-height: 1.7;
  color: var(--planned-desc);
}

.planned-content {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 16px;
}

.planned-side-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.planned-main,
.planned-side {
  min-height: 320px;
  border-color: var(--planned-panel-border);
  background: var(--planned-panel-bg);
}

.planned-main :deep(.el-card__body),
.planned-side :deep(.el-card__body) {
  height: 100%;
}

.planned-main :deep(.el-empty) {
  height: 100%;
}

.planned-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.planned-item {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--planned-item-border);
  background: var(--planned-item-bg);
  color: var(--planned-item-text);
  line-height: 1.6;
}

.ownership-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ownership-item {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid var(--planned-item-border);
  background: var(--planned-item-bg);
}

.ownership-label {
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--planned-label);
}

.ownership-value {
  color: var(--planned-item-text);
  line-height: 1.7;
}

@media (max-width: 960px) {
  .planned-content {
    grid-template-columns: 1fr;
  }
}
</style>
