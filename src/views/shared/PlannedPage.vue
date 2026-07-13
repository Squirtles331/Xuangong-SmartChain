<template>
  <gi-page-layout>
    <template #header>
      <div class="planned-header">
        <div>
          <h2 class="planned-title">{{ title }}</h2>
          <p class="planned-desc">{{ description }}</p>
        </div>
        <el-tag type="warning" effect="dark" round>{{ decode('waiting') }}</el-tag>
      </div>
    </template>

    <div class="planned-content">
      <el-card shadow="never" class="planned-main">
        <el-empty :description="emptyDesc" />
      </el-card>

      <div class="planned-side-stack">
        <el-card shadow="never" class="planned-side">
          <template #header>{{ decode('currentPlan') }}</template>
          <div v-if="plannedItems.length" class="planned-items">
            <div v-for="item in plannedItems" :key="item" class="planned-item">
              {{ item }}
            </div>
          </div>
          <el-empty v-else :description="fallbackPlanDesc" :image-size="72" />
        </el-card>

        <el-card v-if="ownershipEntries.length" shadow="never" class="planned-side">
          <template #header>{{ decode('ownershipInfo') }}</template>
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
}

const TEXT = {
  waiting: '%E7%AD%89%E5%BE%85%E5%BB%BA%E8%AE%BE',
  currentPlan: '%E5%BD%93%E5%89%8D%E8%A7%84%E5%88%92',
  ownershipInfo: '%E9%A1%B5%E9%9D%A2%E5%BD%92%E5%B1%9E',
  pageBuilding: '%E9%A1%B5%E9%9D%A2%E5%BB%BA%E8%AE%BE%E4%B8%AD',
  defaultDesc:
    '%E5%BD%93%E5%89%8D%E5%85%88%E5%AE%8C%E6%88%90%E7%B3%BB%E7%BB%9F%E9%AA%A8%E6%9E%B6%E6%90%AD%E5%BB%BA%EF%BC%8C%E5%90%8E%E7%BB%AD%E5%86%8D%E6%8C%89%E4%B8%9A%E5%8A%A1%E4%BC%98%E5%85%88%E7%BA%A7%E9%80%90%E6%AD%A5%E8%A1%A5%E9%BD%90%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0%E3%80%82',
  emptyDesc:
    '%E8%AF%A5%E9%A1%B5%E9%9D%A2%E5%B7%B2%E7%BA%B3%E5%85%A5%E7%B3%BB%E7%BB%9F%E8%8F%9C%E5%8D%95%E4%B8%8E%E8%B7%AF%E7%94%B1%E9%AA%A8%E6%9E%B6%EF%BC%8C%E5%8A%9F%E8%83%BD%E5%B0%86%E5%9C%A8%E5%90%8E%E7%BB%AD%E7%89%88%E6%9C%AC%E9%80%90%E6%AD%A5%E5%BB%BA%E8%AE%BE%E3%80%82',
  noPlan: '%E6%9A%82%E6%9C%AA%E8%A1%A5%E5%85%85%E8%AF%A6%E7%BB%86%E5%BB%BA%E8%AE%BE%E9%A1%B9',
  ownerSystem: '%E4%B8%BB%E8%B4%A3%E7%B3%BB%E7%BB%9F',
  collaboratorSystems: '%E5%8D%8F%E5%90%8C%E7%B3%BB%E7%BB%9F',
  coreObject: '%E6%A0%B8%E5%BF%83%E5%AF%B9%E8%B1%A1',
  boundaryNote: '%E8%BE%B9%E7%95%8C%E8%AF%B4%E6%98%8E'
} as const

const decode = (key: keyof typeof TEXT) => decodeURIComponent(TEXT[key])

const route = useRoute()
const pageMeta = computed(() => route.meta as PlannedRouteMeta)

const title = computed(() => pageMeta.value.title?.toString() || decode('pageBuilding'))
const description = computed(() => pageMeta.value.placeholderDesc || decode('defaultDesc'))
const emptyDesc = computed(() => decode('emptyDesc'))
const fallbackPlanDesc = computed(() => decode('noPlan'))
const plannedItems = computed(() => pageMeta.value.plannedItems || [])
const ownershipEntries = computed(() => {
  const entries = [
    pageMeta.value.ownerSystem ? { label: decode('ownerSystem'), value: pageMeta.value.ownerSystem } : null,
    pageMeta.value.collaboratorSystems?.length
      ? { label: decode('collaboratorSystems'), value: pageMeta.value.collaboratorSystems.join(' / ') }
      : null,
    pageMeta.value.coreObject ? { label: decode('coreObject'), value: pageMeta.value.coreObject } : null,
    pageMeta.value.boundaryNote ? { label: decode('boundaryNote'), value: pageMeta.value.boundaryNote } : null
  ]

  return entries.filter((item): item is { label: string; value: string } => Boolean(item))
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
  color: #1f2937;
}

.planned-desc {
  margin: 8px 0 0;
  line-height: 1.7;
  color: #6b7280;
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
  background: #f8fafc;
  color: #374151;
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
  background: #f8fafc;
}

.ownership-label {
  margin-bottom: 6px;
  font-size: 12px;
  color: #6b7280;
}

.ownership-value {
  color: #1f2937;
  line-height: 1.7;
}

@media (max-width: 960px) {
  .planned-content {
    grid-template-columns: 1fr;
  }
}
</style>
