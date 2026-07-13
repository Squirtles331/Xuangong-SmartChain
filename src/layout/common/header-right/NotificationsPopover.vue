<template>
  <el-popover v-model:visible="open" placement="bottom-end" width="360" trigger="click">
    <template #reference>
      <el-button text circle class="icon-btn">
        <el-icon><Bell /></el-icon>
      </el-button>
    </template>

    <div class="notify-panel">
      <div class="notify-top">
        <span class="notify-title">通知中心</span>
        <el-icon><Message /></el-icon>
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
import { Bell, ChatLineRound, Message } from '@element-plus/icons-vue'

const open = ref(false)
const notifications = ref([
  { id: 1, label: '审批提醒', text: '采购申请单 SRM-20260713-018 待业务负责人审批。', time: '2026-07-13 09:24' },
  { id: 2, label: '库存预警', text: '电子仓 A 区连接器库存低于安全线，请及时补料。', time: '2026-07-13 08:42' },
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
