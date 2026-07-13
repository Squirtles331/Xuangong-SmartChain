<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="dialogState"
    title="操作日志详情"
    :columns="[]"
    width="640px"
    :show-footer="false"
    @cancel="emit('close')"
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item label="操作人">{{ detailLog?.userName || '-' }}</el-descriptions-item>
      <el-descriptions-item label="操作时间">{{ detailLog?.createdAt || '-' }}</el-descriptions-item>
      <el-descriptions-item label="所属模块">{{ detailLog?.module || '-' }}</el-descriptions-item>
      <el-descriptions-item label="操作类型">
        <StatusTag v-if="detailLog" :value="detailLog.action" :options="auditActions" />
      </el-descriptions-item>
      <el-descriptions-item label="操作对象">{{ detailLog?.target || '-' }}</el-descriptions-item>
      <el-descriptions-item label="IP 地址">{{ detailLog?.ip || '-' }}</el-descriptions-item>
      <el-descriptions-item label="请求参数" :span="2">
        <pre class="json-preview">{{ detailLog?.requestParams || '-' }}</pre>
      </el-descriptions-item>
    </el-descriptions>
  </CrudFormDialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { AuditLog } from '@/api/system'

const auditActions = [
  { value: 'CREATE', label: '新增', type: 'success' as const },
  { value: 'UPDATE', label: '修改', type: 'warning' as const },
  { value: 'DELETE', label: '删除', type: 'danger' as const },
  { value: 'APPROVE', label: '审批', type: 'primary' as const },
  { value: 'LOGIN', label: '登录', type: 'info' as const }
]

const visible = defineModel<boolean>('visible', { required: true })
const detailLog = defineModel<AuditLog | null>('detailLog', { required: true })

const dialogState = computed(() => ({}))

const emit = defineEmits<{
  close: []
}>()
</script>

<style scoped>
.json-preview {
  margin: 0;
  max-height: 220px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 12px;
}
</style>
