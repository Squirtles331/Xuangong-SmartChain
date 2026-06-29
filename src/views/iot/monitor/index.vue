<template>
  <gi-page-layout>
    <div class="iot-grid">
      <el-card v-for="d in devices" :key="d.id" shadow="hover" class="iot-card" :class="d.online ? 'online' : 'offline'" @click="showDetail(d)">
        <div class="iot-header">
          <span class="iot-name">{{ d.name }}</span>
          <el-tag :type="d.online ? 'success' : 'danger'" size="small">{{ d.online ? '在线' : '离线' }}</el-tag>
        </div>
        <div class="iot-body">
          <div class="iot-row">
            <span>运行状态</span><el-tag :type="d.running ? 'success' : 'info'" size="small">{{ d.running ? '运行中' : '已停机' }}</el-tag>
          </div>
          <div class="iot-row">
            <span>转速</span><strong>{{ d.rpm }} rpm</strong>
          </div>
          <div class="iot-row">
            <span>温度</span><strong :style="{ color: d.temp > 60 ? '#f56c6c' : '' }">{{ d.temp.toFixed(1) }}°C</strong>
          </div>
          <div class="iot-row">
            <span>电流</span><strong>{{ d.current.toFixed(1) }}A</strong>
          </div>
        </div>
        <div class="iot-footer">
          <span>最后上报: {{ d.last_report }}</span>
        </div>
      </el-card>
    </div>

    <!-- 设备详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="detailDevice?.name" width="500px">
      <el-descriptions v-if="detailDevice" :column="2" border>
        <el-descriptions-item label="设备名称">{{ detailDevice.name }}</el-descriptions-item>
        <el-descriptions-item label="在线状态">
          <el-tag :type="detailDevice.online ? 'success' : 'danger'" size="small">{{ detailDevice.online ? '在线' : '离线' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="运行状态">
          <el-tag :type="detailDevice.running ? 'success' : 'info'" size="small">{{ detailDevice.running ? '运行中' : '已停机' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="转速">{{ detailDevice.rpm }} rpm</el-descriptions-item>
        <el-descriptions-item label="温度">
          <span :style="{ color: detailDevice.temp > 60 ? '#f56c6c' : '' }">{{ detailDevice.temp.toFixed(1) }}°C</span>
        </el-descriptions-item>
        <el-descriptions-item label="电流">{{ detailDevice.current.toFixed(1) }}A</el-descriptions-item>
        <el-descriptions-item label="最后上报" :span="2">{{ detailDevice.last_report }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const devices = ref(iotDevices as any)

const detailVisible = ref(false)
const detailDevice = ref<(typeof devices.value)[0] | null>(null)

function showDetail(d: (typeof devices.value)[0]) {
  detailDevice.value = d
  detailVisible.value = true
}

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    const now = new Date()
    const ts = now.toISOString().slice(0, 19).replace('T', ' ')
    devices.value.forEach((d) => {
      if (!d.online) return
      // 微调数值：在线运行设备随机变化
      if (d.running) {
        d.rpm = Math.round(d.rpm + (Math.random() - 0.5) * 20)
        if (d.rpm < 0) d.rpm = 0
        d.temp = +(d.temp + (Math.random() - 0.5) * 0.8).toFixed(1)
        d.current = +(d.current + (Math.random() - 0.5) * 0.3).toFixed(1)
        if (d.current < 0) d.current = 0
      } else {
        d.temp = +(d.temp + (Math.random() - 0.5) * 0.3).toFixed(1)
        d.current = +(0.3 + Math.random() * 0.4).toFixed(1)
      }
      d.last_report = ts
    })
  }, 3000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
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
