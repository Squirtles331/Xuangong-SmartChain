<template>
  <el-dialog v-model="visible" :title="device?.name || 'Device'" width="500px" :lock-scroll="false">
    <el-descriptions v-if="device" :column="2" border>
      <el-descriptions-item label="Device">{{ device.name }}</el-descriptions-item>
      <el-descriptions-item label="Online">
        <el-tag :type="device.online ? 'success' : 'danger'" size="small">{{ device.online ? 'Yes' : 'No' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Status">
        <el-tag :type="device.running ? 'success' : 'info'" size="small">{{ device.running ? 'Running' : 'Idle' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="RPM">{{ device.rpm }} rpm</el-descriptions-item>
      <el-descriptions-item label="Temp">{{ device.temp.toFixed(1) }} C</el-descriptions-item>
      <el-descriptions-item label="Current">{{ device.current.toFixed(1) }} A</el-descriptions-item>
      <el-descriptions-item label="Last report" :span="2">{{ device.last_report }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface DeviceDetailModel {
  id: string
  name: string
  online: boolean
  running: boolean
  rpm: number
  temp: number
  current: number
  last_report: string
}

interface Props {
  device: DeviceDetailModel | null
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
</script>
