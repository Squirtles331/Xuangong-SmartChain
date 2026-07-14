<template>
  <el-dropdown trigger="click">
    <el-avatar class="avatar" size="small" src=""></el-avatar>
    <template #dropdown>
      <el-dropdown-menu class="user-dropdown">
        <div class="user-top">
          <el-avatar class="user-avatar" size="large" src=""></el-avatar>
          <div class="user-meta">
            <div class="user-row">
              <span class="user-name">{{ user.name }}</span>
              <el-tag class="user-tag" size="small" type="info">{{ user.role }}</el-tag>
            </div>
            <div class="user-email">{{ user.email }}</div>
          </div>
          <span class="status-dot"></span>
        </div>

        <div class="user-middle">
          <el-dropdown-item @click="lockOpen = true">
            <el-icon><Lock /></el-icon>
            <span>锁定屏幕</span>
          </el-dropdown-item>
          <el-dropdown-item @click="open = true">
            <el-icon><Setting /></el-icon>
            <span>界面设置</span>
          </el-dropdown-item>
        </div>

        <el-dropdown-item class="user-bottom" divided @click="logout">
          <span>退出登录</span>
          <span class="shortcut">Alt + Q</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <SettingsDrawer v-model="open" />

  <el-dialog
    v-model="lockOpen"
    title="锁定屏幕"
    width="380px"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :show-close="true"
    :lock-scroll="false"
  >
    <div class="lock-dialog">
      <el-avatar class="lock-avatar" size="large" src="" />
      <div class="lock-name">{{ user.name }}</div>
      <el-form ref="lockFormRef" :model="lockForm">
        <el-form-item prop="pwd" :rules="[{ required: true, message: '请输入锁屏密码' }]">
          <el-input v-model="lockForm.pwd" type="password" show-password placeholder="请输入锁屏密码">
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="lock-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="doLock">确认锁定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import { Lock, Setting } from '@element-plus/icons-vue'

import SettingsDrawer from '@/layout/common/header-right/SettingsDrawer.vue'
import { useLockStore } from '@/stores/lock'
import { useUserStore } from '@/stores/user'

const user = reactive({
  name: '系统管理员',
  role: '平台管理员',
  email: 'admin@xgzl.local'
})

const open = ref(false)
const lockOpen = ref(false)
const lockForm = reactive({ pwd: '' })
const lockFormRef = ref<FormInstance>()

const router = useRouter()
const lockStore = useLockStore()
const userStore = useUserStore()

const logout = async () => {
  try {
    await ElMessageBox.confirm('退出后将返回登录页，当前未保存的内容可能丢失。是否继续退出？', '退出登录', {
      type: 'warning',
      confirmButtonText: '退出',
      cancelButtonText: '取消'
    })

    await userStore.doLogout()
  } catch {
    // user cancelled
  }
}

const doLock = async () => {
  const form = lockFormRef.value
  await form?.validate?.()

  if (!lockForm.pwd) {
    ElMessage.error('请输入锁屏密码')
    return
  }

  lockStore.lock(lockForm.pwd)
  lockOpen.value = false
  lockForm.pwd = ''
  router.push('/lock')
}

const handleGlobalLockOpen = () => {
  lockOpen.value = true
}

const handleGlobalLogoutOpen = () => {
  void logout()
}

const onCancel = () => {
  lockForm.pwd = ''
  lockOpen.value = false
}

onMounted(() => {
  window.addEventListener('lock-open', handleGlobalLockOpen)
  window.addEventListener('logout-open', handleGlobalLogoutOpen)
})

onUnmounted(() => {
  window.removeEventListener('lock-open', handleGlobalLockOpen)
  window.removeEventListener('logout-open', handleGlobalLogoutOpen)
})
</script>

<style scoped>
.avatar {
  cursor: pointer;
}

.user-dropdown {
  width: 280px;
  padding: 8px 0;
}

.user-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px 12px;
  border-bottom: 1px solid var(--layout-divider);
}

.user-avatar {
  width: 44px;
  height: 44px;
}

.user-meta {
  flex: 1;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.user-name {
  font-size: 14px;
}

.user-tag {
  line-height: 1;
}

.user-email {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-tertiary);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: var(--el-color-success);
  border-radius: 50%;
}

.user-middle {
  padding: 8px 6px;
}

.user-middle :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shortcut {
  color: var(--el-text-color-tertiary);
}

.lock-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.lock-avatar {
  margin-top: 6px;
}

.lock-name {
  font-weight: 600;
}

.lock-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
