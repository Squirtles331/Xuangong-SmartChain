<template>
  <div class="role-view">
    <div class="page-header">
      <h2>角色管理</h2>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新增角色
      </el-button>
    </div>

    <div class="page-content">
      <el-card>
        <el-table :data="roles" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="角色名称" />
          <el-table-column prop="description" label="角色描述" />
          <el-table-column prop="permissions" label="权限">
            <template #default="{ row }">
              <el-tag v-for="perm in row.permissions.slice(0, 2)" :key="perm" size="small" style="margin-right: 4px">
                {{ perm }}
              </el-tag>
              <el-tag v-if="row.permissions.length > 2" size="small"> +{{ row.permissions.length - 2 }} </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="editRole(row)">编辑</el-button>
              <el-button type="text" size="small" style="color: #f56c6c" @click="deleteRole(row)">删除</el-button>
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

interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
}

const roles = ref<Role[]>([
  {
    id: 1,
    name: '管理员',
    description: '拥有系统所有权限',
    permissions: ['用户管理', '角色管理', '菜单管理', '系统配置']
  },
  {
    id: 2,
    name: '普通用户',
    description: '拥有基本操作权限',
    permissions: ['查看数据', '导出报表']
  }
])

function editRole(role: Role) {
  console.log('编辑角色', role)
}

function deleteRole(role: Role) {
  console.log('删除角色', role)
}
</script>

<style scoped>
.role-view {
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
