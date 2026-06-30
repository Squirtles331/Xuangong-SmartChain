<template>
  <el-dialog v-model="visible" title="报工详情" width="600px" :lock-scroll="false">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="工单">{{ detail?.wo_code }}</el-descriptions-item>
      <el-descriptions-item label="工序">{{ detail?.op_name }}</el-descriptions-item>
      <el-descriptions-item label="操作人">{{ detail?.worker }}</el-descriptions-item>
      <el-descriptions-item label="报工时间">{{ detail?.time }}</el-descriptions-item>
      <el-descriptions-item label="合格数量">{{ detail?.qualified }}</el-descriptions-item>
      <el-descriptions-item label="不良数量">{{ detail?.defective }}</el-descriptions-item>
      <el-descriptions-item label="不良原因">{{ detail?.reasons || '-' }}</el-descriptions-item>
      <el-descriptions-item label="工时(分钟)">{{ detail?.hours }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface TraceDetail {
  id: string
  wo_code: string
  op_name: string
  worker: string
  qualified: number
  defective: number
  reasons: string
  hours: number
  time: string
}

interface Props {
  detail: TraceDetail | null
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
</script>
