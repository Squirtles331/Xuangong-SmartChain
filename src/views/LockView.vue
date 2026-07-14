<template>
  <div class="lock-wrap">
    <div class="card">
      <el-avatar class="avatar" size="large" src="" />
      <div class="name">Admin</div>
      <el-input v-model="pwd" class="pwd" type="password" show-password placeholder="请输入解锁密码" @keyup.enter="unlock">
        <template #prefix>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
      <el-button type="warning" class="action" @click="unlock">解锁</el-button>
      <el-button link type="primary" class="login" @click="toLogin">返回登录</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useLockStore } from '@/stores/lock'
import { useUserStore } from '@/stores/user'

const pwd = ref('')
const router = useRouter()
const lockStore = useLockStore()
const userStore = useUserStore()

const unlock = () => {
  if (lockStore.tryUnlock(pwd.value)) {
    router.push('/')
  } else {
    ElMessage.error('密码错误')
  }
}

const toLogin = () => {
  lockStore.forceUnlock()
  userStore.clearAuth()
}
</script>

<style scoped>
.lock-wrap {
  display: grid;
  place-items: center;
  min-height: 100vh;
  background: var(--el-bg-color);
}
.card {
  width: 360px;
  padding: 24px;
  border-radius: 12px;
  background: var(--el-color-white);
  box-shadow: var(--el-box-shadow-light);
  text-align: center;
}
.avatar {
  margin: 8px auto 4px;
}
.name {
  margin-bottom: 12px;
  font-weight: 600;
}
.pwd {
  margin-bottom: 12px;
}
.action {
  width: 100%;
}
.login {
  margin-top: 8px;
}
</style>
