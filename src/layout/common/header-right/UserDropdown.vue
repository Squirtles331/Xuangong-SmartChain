<template>
  <el-dropdown trigger="click">
    <el-avatar class="avatar" size="small" src=""></el-avatar>
    <template #dropdown>
      <el-dropdown-menu class="user-dropdown">
        <div class="user-top">
          <el-avatar class="user-avatar" size="large" src=""></el-avatar>
          <div class="user-meta">
            <div class="user-row">
              <span class="user-name">{{ user.name }}</span
              ><el-tag class="user-tag" size="small" type="success">{{ user.role }}</el-tag>
            </div>
            <div class="user-email">{{ user.email }}</div>
          </div>
          <span class="status-dot"></span>
        </div>
        <div class="user-middle">
          <el-dropdown-item @click="openDoc"
            ><el-icon><Document /></el-icon><span>文档</span></el-dropdown-item
          >
          <el-dropdown-item @click="openGitee"
            ><el-icon><Link /></el-icon><span>Gitee项目地址</span></el-dropdown-item
          >
          <el-dropdown-item @click="openVben"
            ><el-icon><Link /></el-icon><span>Vben官方地址</span></el-dropdown-item
          >
          <el-dropdown-item @click="openHelp"
            ><el-icon><QuestionFilled /></el-icon><span>问题 & 帮助</span></el-dropdown-item
          >
          <el-dropdown-item @click="lockOpen = true"
            ><el-icon><Lock /></el-icon><span>锁屏</span></el-dropdown-item
          >
          <el-dropdown-item @click="open = true"
            ><el-icon><Setting /></el-icon><span>系统设置</span></el-dropdown-item
          >
        </div>
        <el-dropdown-item class="user-bottom" divided @click="logout"><span>退出登录</span><span class="shortcut">Alt Q</span></el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <SettingsDrawer v-model="open" />
  <el-dialog v-model="lockOpen" width="380px" :close-on-click-modal="false" :close-on-press-escape="true" :show-close="true" :lock-scroll="false">
    <div class="lock-dialog">
      <el-avatar class="lock-avatar" size="large" src="" />
      <div class="lock-name">{{ user.name }}</div>
      <el-form :model="lockForm" ref="lockFormRef">
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
        <el-button type="primary" @click="doLock">锁屏</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Document, Link, QuestionFilled, Setting, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useLockStore } from '@/stores/lock'
import SettingsDrawer from '@/layout/common/header-right/SettingsDrawer.vue'
const user = reactive({ name: 'LinaBell', role: 'admin', email: 'crazyLionLi@163.com' })
const openDoc = () => window.open('https://vben.io/guide/introduction.html', '_blank')
const openGitee = () => window.open('https://gitee.com/vben-admin/vue-vben-admin', '_blank')
const openVben = () => window.open('https://vben.io', '_blank')
const openHelp = () => window.open('https://github.com/anncwb/vue-vben-admin/issues', '_blank')
const logout = () => {}

const open = ref(false)
const lockOpen = ref(false)
const lockForm = reactive({ pwd: '' })
const lockFormRef = ref()
const router = useRouter()
const lockStore = useLockStore()

const doLock = async () => {
  const form = lockFormRef.value as any
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
const onCancel = () => {
  lockForm.pwd = ''
  lockOpen.value = false
}
onMounted(() => window.addEventListener('lock-open', handleGlobalLockOpen))
onUnmounted(() => window.removeEventListener('lock-open', handleGlobalLockOpen))
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
  padding: 8px 16px 12px 16px;
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
.lock-action {
  width: 100%;
}
.lock-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
