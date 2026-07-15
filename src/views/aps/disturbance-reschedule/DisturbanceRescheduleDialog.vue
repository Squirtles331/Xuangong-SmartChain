<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'release' ? '下发重排建议' : '重排建议详情'"
    width="760px"
    :footer="mode === 'release'"
    :lock-scroll="false"
    :on-before-ok="mode === 'release' ? handleSubmit : undefined"
  >
    <template v-if="record">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="建议单号">{{ record.code }}</el-descriptions-item>
        <el-descriptions-item label="扰动等级">
          <StatusTag :value="record.level" :options="levelOptions" />
        </el-descriptions-item>
        <el-descriptions-item label="扰动类型">{{ record.disturbanceType }}</el-descriptions-item>
        <el-descriptions-item label="当前状态">
          <StatusTag :value="record.status" :options="statusOptions" />
        </el-descriptions-item>
        <el-descriptions-item label="影响范围">{{ record.scope }}</el-descriptions-item>
        <el-descriptions-item label="建议窗口">{{ record.targetWindow }}</el-descriptions-item>
        <el-descriptions-item label="影响资源" :span="2">{{ record.affectedCenters }}</el-descriptions-item>
      </el-descriptions>

      <div class="section">
        <div class="section__title">APS 建议动作</div>
        <div class="section__panel">{{ record.suggestion }}</div>
      </div>

      <div class="section">
        <div class="section__title">MES 承接动作</div>
        <div class="section__panel">{{ record.mesAction }}</div>
      </div>

      <div class="section">
        <div class="section__title">风险提示</div>
        <div class="section__panel section__panel--warning">{{ record.riskNote }}</div>
      </div>
    </template>
  </gi-dialog>
</template>

<script lang="ts" setup>
import StatusTag from '@/components/StatusTag.vue'
import type { ApsRescheduleRecord } from '@/types/aps'

defineProps<{
  record: ApsRescheduleRecord | null
  mode: 'detail' | 'release'
}>()

const visible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const levelOptions = [
  { value: 'L1', label: 'L1 微调', type: 'success' as const },
  { value: 'L2', label: 'L2 局部重排', type: 'warning' as const },
  { value: 'L3', label: 'L3 全局重排', type: 'danger' as const }
]

const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'reviewing', label: '评审中', type: 'warning' as const },
  { value: 'released', label: '已下发', type: 'success' as const }
]

async function handleSubmit() {
  emit('submit')
  return false
}
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
  color: var(--el-text-color-regular);
  line-height: 1.8;
}

.section__panel--warning {
  background: #fff7ed;
}
</style>
