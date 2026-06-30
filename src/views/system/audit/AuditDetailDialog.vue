<template>
  <el-dialog v-model="visible" title="操作日志详情" width="600px" :lock-scroll="false">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="操作人">{{ detailLog?.userName }}</el-descriptions-item>
      <el-descriptions-item label="操作时间">{{ detailLog?.createdAt }}</el-descriptions-item>
      <el-descriptions-item label="模块">{{ detailLog?.module }}</el-descriptions-item>
      <el-descriptions-item label="操作类型">
        <StatusTag v-if="detailLog" :value="detailLog.action" :options="actionOptions" />
      </el-descriptions-item>
      <el-descriptions-item label="操作对象">{{ detailLog?.target }}</el-descriptions-item>
      <el-descriptions-item label="IP 地址">{{ detailLog?.ip }}</el-descriptions-item>
      <el-descriptions-item label="请求参数" :span="2">
        <pre class="json-preview">{{ detailLog?.requestParams || '-' }}</pre>
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import StatusTag from '@/components/StatusTag.vue'
import type { AuditLog } from '@/api/system'

interface Props {
  detailLog: AuditLog | null
  actionOptions: Array<{ value: string; label: string; type: 'success' | 'warning' | 'danger' | 'primary' | 'info' }>
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
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
