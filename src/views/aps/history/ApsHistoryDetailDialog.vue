<template>
  <gi-dialog v-model="visible" :title="title" width="760px" :footer="false" :lock-scroll="false">
    <template v-if="record">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="版本号">{{ record.versionCode }}</el-descriptions-item>
        <el-descriptions-item label="计划范围">{{ record.planRange }}</el-descriptions-item>
        <el-descriptions-item label="触发方式">
          <StatusTag :value="record.triggerType" :options="triggerOptions" />
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <StatusTag :value="record.status" :options="statusOptions" />
        </el-descriptions-item>
        <el-descriptions-item label="生成人">{{ record.generatedBy }}</el-descriptions-item>
        <el-descriptions-item label="生成时间">{{ record.generatedAt }}</el-descriptions-item>
        <el-descriptions-item label="约束快照" :span="2">{{ record.constraintSet }}</el-descriptions-item>
        <el-descriptions-item label="版本备注" :span="2">{{ record.note }}</el-descriptions-item>
      </el-descriptions>

      <div class="section">
        <div class="section__title">参数快照</div>
        <div class="section__panel">{{ record.snapshotSummary }}</div>
      </div>

      <div class="section">
        <div class="section__title">调整记录</div>
        <ul class="section__list">
          <li v-for="item in record.adjustments" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div v-if="mode === 'compare'" class="section">
        <div class="section__title">与当前主版本对比</div>
        <div class="compare-grid">
          <div class="compare-card">
            <div class="compare-card__label">参照版本</div>
            <div class="compare-card__value">{{ activeVersion?.versionCode || '当前页未加载主版本' }}</div>
          </div>
          <div class="compare-card">
            <div class="compare-card__label">冲突差异</div>
            <div class="compare-card__value">{{ conflictDeltaText }}</div>
          </div>
          <div class="compare-card">
            <div class="compare-card__label">工单差异</div>
            <div class="compare-card__value">{{ workOrderDeltaText }}</div>
          </div>
        </div>
      </div>
    </template>
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import type { ApsHistoryRecord } from '@/types/aps'

interface Props {
  record: ApsHistoryRecord | null
  mode: 'detail' | 'compare'
  activeVersion: ApsHistoryRecord | null
}

const props = defineProps<Props>()
const visible = defineModel<boolean>('visible', { required: true })

const triggerOptions = [
  { value: 'manual', label: '手动排程', type: 'primary' as const },
  { value: 'nightly', label: '夜间批算', type: 'info' as const },
  { value: 'disturbance', label: '扰动回算', type: 'warning' as const }
]

const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'active', label: '主版本', type: 'success' as const },
  { value: 'archived', label: '归档', type: 'warning' as const }
]

const title = computed(() => (props.mode === 'compare' ? '排程版本对比' : '排程历史详情'))

const conflictDeltaText = computed(() => {
  if (!props.record || !props.activeVersion) return '--'
  const delta = props.record.conflictCount - props.activeVersion.conflictCount
  return `${delta > 0 ? '+' : ''}${delta}`
})

const workOrderDeltaText = computed(() => {
  if (!props.record || !props.activeVersion) return '--'
  const delta = props.record.workOrderCount - props.activeVersion.workOrderCount
  return `${delta > 0 ? '+' : ''}${delta}`
})
</script>

<style scoped>
.section {
  margin-top: 18px;
}

.section__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.section__panel {
  padding: 14px 16px;
  border-radius: 10px;
  background: #f8fafc;
  line-height: 1.8;
  color: var(--el-text-color-regular);
}

.section__list {
  margin: 0;
  padding-left: 18px;
  line-height: 1.9;
  color: var(--el-text-color-regular);
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.compare-card {
  padding: 14px 16px;
  border-radius: 10px;
  background: #f8fafc;
}

.compare-card__label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.compare-card__value {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
