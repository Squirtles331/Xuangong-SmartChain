<template>
  <div v-if="hasContent" class="ownership-notice">
    <div class="ownership-header">
      <div class="ownership-title">页面归属</div>
      <div class="ownership-tags">
        <el-tag v-if="ownerSystem" type="primary" effect="light" round>主责：{{ ownerSystem }}</el-tag>
        <el-tag v-if="coreObject" type="success" effect="light" round>对象：{{ coreObject }}</el-tag>
      </div>
    </div>

    <div v-if="collaboratorSystems.length" class="ownership-row">
      <span class="ownership-label">协同系统</span>
      <span class="ownership-value">{{ collaboratorSystems.join(' / ') }}</span>
    </div>

    <div v-if="boundaryNote" class="ownership-row">
      <span class="ownership-label">边界说明</span>
      <span class="ownership-value">{{ boundaryNote }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

function getNearestMetaValue<T>(key: 'ownerSystem' | 'coreObject' | 'boundaryNote' | 'collaboratorSystems') {
  const records = [...route.matched].reverse()
  for (const record of records) {
    const value = record.meta?.[key] as T | undefined
    if (Array.isArray(value) ? value.length > 0 : value) return value
  }
  return undefined
}

const ownerSystem = computed(() => getNearestMetaValue<string>('ownerSystem') || '')
const coreObject = computed(() => getNearestMetaValue<string>('coreObject') || '')
const boundaryNote = computed(() => getNearestMetaValue<string>('boundaryNote') || '')
const collaboratorSystems = computed(() => getNearestMetaValue<string[]>('collaboratorSystems') || [])
const hasContent = computed(() => Boolean(ownerSystem.value || coreObject.value || boundaryNote.value || collaboratorSystems.value.length))
</script>

<style scoped>
.ownership-notice {
  padding: 14px 16px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fbff 0%, #f3f8ff 100%);
}

.ownership-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.ownership-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.ownership-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.ownership-row {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  line-height: 1.7;
}

.ownership-label {
  flex: 0 0 68px;
  color: #64748b;
  font-size: 13px;
}

.ownership-value {
  color: #334155;
  font-size: 13px;
}

@media (max-width: 768px) {
  .ownership-header,
  .ownership-row {
    flex-direction: column;
  }

  .ownership-tags {
    justify-content: flex-start;
  }
}
</style>
