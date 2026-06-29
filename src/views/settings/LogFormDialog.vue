<template>
  <el-dialog v-model="visible" title="操作日志详情" width="600px" @close="handleClose">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="操作人">{{ detailLog?.user_name }}</el-descriptions-item>
      <el-descriptions-item label="操作时间">{{ detailLog?.created_at }}</el-descriptions-item>
      <el-descriptions-item label="模块">{{ detailLog?.module }}</el-descriptions-item>
      <el-descriptions-item label="操作类型">
        <StatusTag v-if="detailLog" :value="detailLog.action" :options="AUDIT_ACTION" />
      </el-descriptions-item>
      <el-descriptions-item label="操作对象">{{ detailLog?.target }}</el-descriptions-item>
      <el-descriptions-item label="IP地址">{{ detailLog?.ip }}</el-descriptions-item>
      <el-descriptions-item label="请求参数" :span="2">
        <pre class="json-preview">{{ detailLog?.request_params || '-' }}</pre>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script lang="ts" setup>
import StatusTag from '@/components/StatusTag.vue'
import type { AuditLog } from '@/api/system'

const AUDIT_ACTION = [
  { value: 'CREATE', label: '新增', type: 'success' as const },
  { value: 'UPDATE', label: '修改', type: 'warning' as const },
  { value: 'DELETE', label: '删除', type: 'danger' as const },
  { value: 'APPROVE', label: '审批', type: 'primary' as const }
]

export interface LogDetailModel {
  log: AuditLog | null
}

const visible = defineModel<boolean>('visible', { required: true })
const detailLog = defineModel<AuditLog | null>('detailLog', { required: true })

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}
</script>

<style scoped>
.json-preview {
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
</style>
