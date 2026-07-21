<template>
  <el-dropdown trigger="click">
    <div class="user-trigger">
      <el-avatar class="avatar" size="small">{{ user.name.slice(0, 1) }}</el-avatar>
      <div class="user-trigger__meta">
        <span class="user-trigger__name">{{ user.name }}</span>
        <span class="user-trigger__role">{{ user.role }}</span>
      </div>
      <el-icon class="user-trigger__arrow"><ArrowDown /></el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu class="user-dropdown">
        <div class="user-top">
          <el-avatar class="user-avatar" size="large">{{ user.name.slice(0, 1) }}</el-avatar>
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
          <el-dropdown-item @click="openLockDialog">
            <el-icon><Lock /></el-icon>
            <span>锁定屏幕</span>
          </el-dropdown-item>
          <el-dropdown-item @click="openSettingsDrawer">
            <el-icon><Setting /></el-icon>
            <span>界面设置</span>
          </el-dropdown-item>
        </div>

        <div class="repo-section">
          <div class="repo-title">仓库地址</div>
          <el-dropdown-item v-for="repo in repoLinks" :key="repo.name" @click="openRepo(repo.url)">
            <el-icon><Link /></el-icon>
            <div class="repo-item">
              <span class="repo-name">{{ repo.name }}</span>
              <span class="repo-desc">{{ repo.desc }}</span>
            </div>
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
    append-to-body
    align-center
    destroy-on-close
    :lock-scroll="false"
    class="lock-screen-dialog"
    @closed="resetLockForm"
  >
    <div class="lock-dialog">
      <el-avatar class="lock-avatar" size="large">{{ user.name.slice(0, 1) }}</el-avatar>
      <div class="lock-name">{{ user.name }}</div>
      <div class="lock-tip">请输入锁屏密码后进入锁屏页，解锁后会回到工作台。</div>
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
import { ArrowDown, Link, Lock, Setting } from '@element-plus/icons-vue'

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

const repoLinks = [
  {
    name: 'Gitee 仓库',
    desc: '国内代码仓库',
    url: 'https://gitee.com/songtonngxue/xuanlian'
  },
  {
    name: 'GitHub 仓库',
    desc: '国际代码仓库',
    url: 'https://github.com/Squirtles331/Xuangong-SmartChain'
  },
  {
    name: '极狐 GitLab 仓库',
    desc: '国内协作仓库',
    url: 'https://jihulab.com/Squirtles331/xuanlian'
  }
] as const

const router = useRouter()
const lockStore = useLockStore()
const userStore = useUserStore()

const openSettingsDrawer = () => {
  open.value = true
}

const openLockDialog = () => {
  lockOpen.value = true
}

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

const openRepo = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

const resetLockForm = () => {
  lockForm.pwd = ''
  lockFormRef.value?.clearValidate?.()
}

const handleGlobalLockOpen = () => {
  openLockDialog()
}

const handleGlobalLogoutOpen = () => {
  void logout()
}

const onCancel = () => {
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
.user-trigger {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 6px 6px;
  border-radius: 16px;
  cursor: pointer;
  background: color-mix(in srgb, var(--layout-header-bg) 72%, #ffffff 28%);
  border: 1px solid color-mix(in srgb, var(--layout-header-border) 86%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.user-trigger:hover {
  border-color: color-mix(in srgb, var(--el-color-primary) 22%, var(--layout-header-border) 78%);
  box-shadow: 0 14px 24px -24px rgba(32, 49, 93, 0.28);
  transform: translateY(-1px);
}

.avatar,
.user-avatar,
.lock-avatar {
  color: var(--el-color-primary);
  font-weight: 700;
  background: var(--gradient-soft);
  border: 1px solid rgba(76, 111, 255, 0.12);
}

.user-trigger__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-trigger__name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--el-text-color-primary);
}

.user-trigger__role {
  margin-top: 2px;
  font-size: 11px;
  line-height: 1.2;
  color: var(--el-text-color-secondary);
}

.user-trigger__arrow {
  color: var(--el-text-color-tertiary);
}

.user-dropdown {
  width: 280px;
  padding: 8px 0;
  border-radius: 14px;
}

.user-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px 14px;
  border-bottom: 1px solid var(--layout-divider);
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
  border-radius: 999px;
}

.user-email {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-tertiary);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--el-color-success);
}

.user-middle {
  padding: 8px 6px;
}

.user-middle :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 6px;
  border-radius: 10px;
}

.repo-section {
  padding: 4px 6px 8px;
  border-top: 1px solid var(--layout-divider);
}

.repo-title {
  padding: 8px 10px 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.repo-section :deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 6px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 10px;
}

.repo-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.2;
}

.repo-name {
  font-size: 13px;
  color: var(--el-text-color-primary);
}

.repo-desc {
  font-size: 12px;
  color: var(--el-text-color-tertiary);
}

.user-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 6px;
  border-radius: 10px;
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

.lock-tip {
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.lock-name {
  font-size: 18px;
  font-weight: 600;
}

.lock-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.lock-screen-dialog) {
  overflow: hidden;
  border-radius: 22px;
}

:deep(.lock-screen-dialog .el-dialog__header) {
  margin-right: 0;
  padding: 24px 24px 0;
}

:deep(.lock-screen-dialog .el-dialog__body) {
  padding: 18px 24px 8px;
}

:deep(.lock-screen-dialog .el-dialog__footer) {
  padding: 0 24px 24px;
}

@media (max-width: 768px) {
  .user-trigger {
    padding: 4px;
    border-radius: 12px;
  }

  .user-trigger__meta,
  .user-trigger__arrow {
    display: none;
  }
}
</style>
