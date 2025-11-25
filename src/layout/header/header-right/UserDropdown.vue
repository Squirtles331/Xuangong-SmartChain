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
              <el-tag class="user-tag" size="small" type="success">{{ user.role }}</el-tag>
            </div>
            <div class="user-email">{{ user.email }}</div>
          </div>
          <span class="status-dot"></span>
        </div>
        <div class="user-middle">
          <el-dropdown-item @click="openDoc">
            <el-icon><Document /></el-icon>
            <span>文档</span>
          </el-dropdown-item>
          <el-dropdown-item @click="openGitee">
            <el-icon><Link /></el-icon>
            <span>Gitee项目地址</span>
          </el-dropdown-item>
          <el-dropdown-item @click="openVben">
            <el-icon><Link /></el-icon>
            <span>Vben官方地址</span>
          </el-dropdown-item>
          <el-dropdown-item @click="openHelp">
            <el-icon><QuestionFilled /></el-icon>
            <span>问题 & 帮助</span>
          </el-dropdown-item>
        </div>
        <el-dropdown-item class="user-bottom" divided @click="logout">
          <span>退出登录</span>
          <span class="shortcut">Alt Q</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Document, Link, QuestionFilled } from '@element-plus/icons-vue'

const user = reactive({ name: 'LinaBell', role: 'admin', email: 'crazyLionLi@163.com' })

const openDoc = () => window.open('https://vben.io/guide/introduction.html', '_blank')
const openGitee = () => window.open('https://gitee.com/vben-admin/vue-vben-admin', '_blank')
const openVben = () => window.open('https://vben.io', '_blank')
const openHelp = () => window.open('https://github.com/anncwb/vue-vben-admin/issues', '_blank')
const logout = () => {}
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
</style>
