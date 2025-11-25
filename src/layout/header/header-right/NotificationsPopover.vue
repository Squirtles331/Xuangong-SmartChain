<template>
  <el-popover placement="bottom-end" width="360" trigger="click" v-model:visible="open">
    <template #reference>
      <el-button type="text" circle class="icon-btn">
        <el-icon><Bell /></el-icon>
      </el-button>
    </template>
    <div class="notify-panel">
      <div class="notify-top">
        <span class="notify-title">通知</span>
        <el-icon><Message /></el-icon>
      </div>
      <div class="notify-middle">
        <div class="notify-item" v-for="n in notifications" :key="n.id">
          <div class="notify-left">
            <el-icon><ChatLineRound /></el-icon>
          </div>
          <div class="notify-content">
            <div class="notify-label">消息</div>
            <div class="notify-text">{{ n.text }}</div>
            <div class="notify-time">{{ n.time }}</div>
          </div>
          <span class="notify-dot"></span>
        </div>
        <div v-if="notifications.length === 0" class="notify-empty">暂无消息</div>
      </div>
      <div class="notify-bottom">
        <el-button type="text" @click="clearNotifications">清空</el-button>
        <el-button type="primary" size="small" @click="viewAll">查看所有消息</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Message, ChatLineRound } from '@element-plus/icons-vue'

const router = useRouter()
const open = ref(false)
const notifications = ref([
  { id: 1, text: '公告: 难度很大 后端慎重选择! 演示站部署为dev分支', time: '2025-11-18 21:14:38' },
  { id: 2, text: '公告: 难度很大 后端慎重选择! 演示站部署为dev分支', time: '2025-11-18 21:13:02' },
  { id: 3, text: '公告: 难度很大 后端慎重选择! 演示站部署为dev分支', time: '2025-11-18 21:08:16' }
])

const clearNotifications = () => {
  notifications.value = []
}
const viewAll = () => {
  router.push('/about')
  open.value = false
}
</script>

<style scoped>
.icon-btn {
  padding: 4px;
}
.notify-panel {
  width: 100%;
}
.notify-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--layout-divider);
}
.notify-title {
  font-weight: 600;
  color: var(--el-text-color-primary);
}
.notify-middle {
  max-height: 360px;
  overflow-y: auto;
}
.notify-item {
  display: grid;
  grid-template-columns: 40px 1fr 12px;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--layout-divider);
}
.notify-left {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-color-primary-light-5);
  color: var(--el-color-primary);
  border-radius: 4px;
}
.notify-label {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}
.notify-text {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
.notify-time {
  color: var(--el-text-color-tertiary);
  font-size: 12px;
  margin-top: 6px;
}
.notify-dot {
  width: 8px;
  height: 8px;
  background-color: var(--el-color-primary);
  border-radius: 50%;
  align-self: start;
}
.notify-empty {
  padding: 20px;
  text-align: center;
  color: var(--el-text-color-tertiary);
}
.notify-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
}
</style>
