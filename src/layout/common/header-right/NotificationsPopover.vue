<template>
  <el-popover v-model:visible="open" placement="bottom-end" width="360" trigger="click">
    <template #reference>
      <el-button class="icon-btn notify-trigger" circle>
        <span v-if="notifications.length" class="notify-badge"></span>
        <el-icon><Bell /></el-icon>
      </el-button>
    </template>

    <div class="notify-panel">
      <div class="notify-top">
        <span class="notify-title">通知中心</span>
        <span class="notify-count">{{ notifications.length }} 条未处理</span>
      </div>

      <div class="notify-middle">
        <div v-for="n in notifications" :key="n.id" class="notify-item">
          <div class="notify-left">
            <el-icon><ChatLineRound /></el-icon>
          </div>
          <div class="notify-content">
            <div class="notify-label">{{ n.label }}</div>
            <div class="notify-text">{{ n.text }}</div>
            <div class="notify-time">{{ n.time }}</div>
          </div>
          <span class="notify-dot"></span>
        </div>

        <div v-if="notifications.length === 0" class="notify-empty">暂无消息</div>
      </div>

      <div class="notify-bottom">
        <el-button text @click="clearNotifications">清空</el-button>
        <el-button type="primary" size="small" @click="viewAll">查看全部</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Bell, ChatLineRound } from '@element-plus/icons-vue'

const open = ref(false)
const notifications = ref([
  { id: 1, label: '审批提醒', text: '采购申请单 SRM-20260713-018 等待业务负责人审批。', time: '2026-07-13 09:24' },
  { id: 2, label: '库存预警', text: '电子件 A 区连接器库存低于安全线，请及时补料。', time: '2026-07-13 08:42' },
  { id: 3, label: '设备告警', text: '2 号产线贴片机状态异常，EAM 工单已自动创建。', time: '2026-07-13 07:58' }
])

const clearNotifications = () => {
  notifications.value = []
}

const viewAll = () => {
  open.value = false
  ElMessage.info('通知中心静态页将在系统平台阶段统一建设')
}
</script>

<style scoped>
.icon-btn {
  position: relative;
  width: 36px;
  min-width: 36px;
  height: 36px;
  color: var(--el-text-color-regular);
  background: transparent;
  border: none;
}

.icon-btn:hover,
.icon-btn:focus {
  color: var(--el-color-primary);
  background: rgba(255, 255, 255, 0.9);
}

.notify-badge {
  position: absolute;
  top: 6px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ff6b7a;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.92);
}

.notify-panel {
  width: 100%;
}

.notify-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--layout-divider);
}

.notify-title {
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.notify-count {
  font-size: 12px;
  color: var(--el-text-color-tertiary);
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
  border-radius: 10px;
  background-color: rgba(76, 111, 255, 0.12);
  color: var(--el-color-primary);
}

.notify-label {
  margin-bottom: 4px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.notify-text {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.notify-time {
  margin-top: 6px;
  font-size: 12px;
  color: var(--el-text-color-tertiary);
}

.notify-dot {
  width: 8px;
  height: 8px;
  align-self: start;
  border-radius: 50%;
  background-color: var(--el-color-primary);
}

.notify-empty {
  padding: 20px;
  text-align: center;
  color: var(--el-text-color-tertiary);
}

.notify-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
}
</style>
