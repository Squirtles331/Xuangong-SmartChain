<template>
  <el-dialog v-model="visible" title="报工详情" width="600px" :lock-scroll="false">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="工单">{{ detail?.wo_code }}</el-descriptions-item>
      <el-descriptions-item label="工序">{{ detail?.operation_name }}</el-descriptions-item>
      <el-descriptions-item label="操作人">{{ detail?.worker }}</el-descriptions-item>
      <el-descriptions-item label="报工时间">{{ detail?.time }}</el-descriptions-item>
      <el-descriptions-item label="合格数量">{{ detail?.qualified_qty }}</el-descriptions-item>
      <el-descriptions-item label="不良数量">{{ detail?.defective_qty }}</el-descriptions-item>
      <el-descriptions-item label="不良原因">{{ detail?.defect_reasons || '-' }}</el-descriptions-item>
      <el-descriptions-item label="工时(分钟)">{{ detail?.actual_hours }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface TraceDetail {
  id: string
  wo_code: string
  operation_name: string
  worker: string
  qualified_qty: number
  defective_qty: number
  defect_reasons: string
  actual_hours: number
  time: string
}

interface Props {
  detail: TraceDetail | null
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
</script>
