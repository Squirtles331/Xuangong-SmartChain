<template>
  <div class="user-view">
    <div class="page-header">
      <h2>用户管理</h2>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <div class="page-content">
      <el-card>
        <el-table :data="users" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="role" label="角色" />
          <el-table-column prop="status" label="状态">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
                {{ row.status === 'active' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="editUser(row)">编辑</el-button>
              <el-button type="text" size="small" style="color: #f56c6c" @click="deleteUser(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

interface User {
  id: number
  username: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const users = ref<User[]>([
  { id: 1, username: 'admin', email: 'admin@example.com', role: '管理员', status: 'active' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: '普通用户', status: 'active' },
  { id: 3, username: 'user2', email: 'user2@example.com', role: '普通用户', status: 'inactive' }
])

function editUser(user: User) {
  console.log('编辑用户', user)
}

function deleteUser(user: User) {
  console.log('删除用户', user)
}
</script>

<style scoped>
.user-view {
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.page-content {
  background-color: #fff;
}
</style>
