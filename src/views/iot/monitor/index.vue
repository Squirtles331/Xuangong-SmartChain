<template>
  <gi-page-layout>
    <div class="iot-grid">
      <el-card
        v-for="device in devices"
        :key="device.id"
        shadow="hover"
        class="iot-card"
        :class="device.online ? 'online' : 'offline'"
        @click="showDetail(device)"
      >
        <div class="iot-header">
          <span class="iot-name">{{ device.name }}</span>
          <el-tag :type="device.online ? 'success' : 'danger'" size="small">
            {{ device.online ? 'Online' : 'Offline' }}
          </el-tag>
        </div>
        <div class="iot-body">
          <div class="iot-row">
            <span>Status</span>
            <el-tag :type="device.running ? 'success' : 'info'" size="small">
              {{ device.running ? 'Running' : 'Idle' }}
            </el-tag>
          </div>
          <div class="iot-row">
            <span>RPM</span>
            <strong>{{ device.rpm }} rpm</strong>
          </div>
          <div class="iot-row">
            <span>Temp</span>
            <strong :style="{ color: device.temp > 60 ? '#f56c6c' : '' }">{{ device.temp.toFixed(1) }} C</strong>
          </div>
          <div class="iot-row">
            <span>Current</span>
            <strong>{{ device.current.toFixed(1) }} A</strong>
          </div>
        </div>
        <div class="iot-footer">Last report {{ device.last_report }}</div>
      </el-card>
    </div>

    <DeviceDetailDialog v-model:visible="detailVisible" :device="detailDevice" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { getIoTDeviceList } from '@/api/wms'
import DeviceDetailDialog, { type DeviceDetailModel } from './DeviceDetailDialog.vue'

type DeviceItem = DeviceDetailModel

const devices = ref<DeviceItem[]>([])
const detailVisible = ref(false)
const detailDevice = ref<DeviceItem | null>(null)

let timer: ReturnType<typeof setInterval> | null = null

function showDetail(device: DeviceItem) {
  detailDevice.value = device
  detailVisible.value = true
}

async function loadDevices() {
  const res = await getIoTDeviceList({ pageNum: 1, pageSize: 100 })
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  devices.value = res.data.list.map((item: any) => ({
    id: String(item.id),
    name: item.name,
    online: item.status !== 'maintenance',
    running: item.status === 'running',
    rpm: Number(item.rpm || 0),
    temp: Number(item.temp || 0),
    current: Number(item.power || 0),
    last_report: now
  }))
}

function startTimer() {
  timer = setInterval(() => {
    const ts = new Date().toISOString().slice(0, 19).replace('T', ' ')
    devices.value.forEach((device) => {
      if (!device.online) return

      if (device.running) {
        device.rpm = Math.max(0, Math.round(device.rpm + (Math.random() - 0.5) * 20))
        device.temp = +(device.temp + (Math.random() - 0.5) * 0.8).toFixed(1)
        device.current = Math.max(0, +(device.current + (Math.random() - 0.5) * 0.3).toFixed(1))
      } else {
        device.temp = +(device.temp + (Math.random() - 0.5) * 0.3).toFixed(1)
        device.current = +(0.3 + Math.random() * 0.4).toFixed(1)
      }

      device.last_report = ts
    })
  }, 3000)
}

onMounted(async () => {
  await loadDevices()
  startTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.iot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.iot-card {
  border-left: 4px solid #67c23a;
  cursor: pointer;
  transition: transform 0.2s;
}

.iot-card:hover {
  transform: translateY(-2px);
}

.iot-card.offline {
  border-left-color: #f56c6c;
}

.iot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.iot-name {
  font-weight: 600;
  font-size: 15px;
}

.iot-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
  border-bottom: 1px solid #ebeef5;
}

.iot-row span {
  color: #909399;
}

.iot-footer {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 8px;
}
</style>
