<template>
  <el-dialog v-model="visible" :title="device?.name || '设备详情'" width="500px" :lock-scroll="false">
    <el-descriptions v-if="device" :column="2" border>
      <el-descriptions-item label="设备">{{ device.name }}</el-descriptions-item>
      <el-descriptions-item label="在线状态">
        <el-tag :type="device.online ? 'success' : 'danger'" size="small">
          {{ device.online ? '在线' : '离线' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="运行状态">
        <el-tag :type="device.running ? 'success' : 'info'" size="small">
          {{ device.running ? '运行中' : '空闲' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="转速">{{ device.rpm }} rpm</el-descriptions-item>
      <el-descriptions-item label="温度">{{ device.temp.toFixed(1) }} °C</el-descriptions-item>
      <el-descriptions-item label="电流">{{ device.current.toFixed(1) }} A</el-descriptions-item>
      <el-descriptions-item label="最近上报" :span="2">{{ device.last_report }}</el-descriptions-item>
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
