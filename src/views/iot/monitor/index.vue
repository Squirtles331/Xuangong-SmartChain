<template>
  <gi-page-layout>
    <div class="iot-grid">
      <el-card
        v-for="item in devices"
        :key="item.id"
        shadow="hover"
        class="iot-card"
        :class="item.online ? 'online' : 'offline'"
        @click="showDetail(item)"
      >
        <div class="iot-header">
          <span class="iot-name">{{ item.name }}</span>
          <el-tag :type="item.online ? 'success' : 'danger'" size="small">
            {{ item.online ? '在线' : '离线' }}
          </el-tag>
        </div>

        <div class="iot-body">
          <div class="iot-row">
            <span>运行状态</span>
            <el-tag :type="item.running ? 'success' : 'info'" size="small">
              {{ item.running ? '运行中' : '空闲' }}
            </el-tag>
          </div>
          <div class="iot-row">
            <span>转速</span>
            <strong>{{ item.rpm }} rpm</strong>
          </div>
          <div class="iot-row">
            <span>温度</span>
            <strong :style="{ color: item.temp > 60 ? '#f56c6c' : '' }">{{ item.temp.toFixed(1) }} °C</strong>
          </div>
          <div class="iot-row">
            <span>电流</span>
            <strong>{{ item.current.toFixed(1) }} A</strong>
          </div>
        </div>

        <div class="iot-footer">最近上报 {{ item.last_report }}</div>
      </el-card>
    </div>

    <DeviceDetailDialog v-model:visible="detailVisible" :device="detailDevice" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { getIoTDeviceList } from '@/api/iot'
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
  const response = await getIoTDeviceList({ pageNum: 1, pageSize: 100 })
  const now = '2026-06-30 12:00:00'
  devices.value = response.data.list.map((item) => ({
    id: item.id,
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
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
    devices.value.forEach((item) => {
      if (!item.online) return

      if (item.running) {
        item.rpm = Math.max(0, Math.round(item.rpm + (Math.random() - 0.5) * 20))
        item.temp = +(item.temp + (Math.random() - 0.5) * 0.8).toFixed(1)
        item.current = Math.max(0, +(item.current + (Math.random() - 0.5) * 0.3).toFixed(1))
      } else {
        item.temp = +(item.temp + (Math.random() - 0.5) * 0.3).toFixed(1)
        item.current = +(0.3 + Math.random() * 0.4).toFixed(1)
      }

      item.last_report = now
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
  font-size: 15px;
  font-weight: 600;
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
  margin-top: 8px;
  font-size: 11px;
  color: #c0c4cc;
}
</style>
