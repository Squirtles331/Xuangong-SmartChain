<template>
  <div class="menu-view">
    <div class="page-header">
      <h2>菜单管理</h2>
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        新增菜单
      </el-button>
    </div>

    <div class="page-content">
      <el-card>
        <el-table :data="menus" style="width: 100%" row-key="id" default-expand-all>
          <el-table-column prop="name" label="菜单名称" />
          <el-table-column prop="path" label="路径" />
          <el-table-column prop="icon" label="图标" />
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'enabled' ? 'success' : 'danger'">
                {{ row.status === 'enabled' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button type="text" size="small" @click="editMenu(row)">编辑</el-button>
              <el-button type="text" size="small" style="color: #f56c6c" @click="deleteMenu(row)">删除</el-button>
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

interface Menu {
  id: number
  name: string
  path: string
  icon: string
  sort: number
  status: 'enabled' | 'disabled'
  children?: Menu[]
}

const menus = ref<Menu[]>([
  {
    id: 1,
    name: '系统管理',
    path: '/system',
    icon: 'House',
    sort: 1,
    status: 'enabled',
    children: [
      { id: 11, name: '用户管理', path: '/user', icon: 'User', sort: 1, status: 'enabled' },
      { id: 12, name: '角色管理', path: '/role', icon: 'Avatar', sort: 2, status: 'enabled' },
      { id: 13, name: '菜单管理', path: '/menu', icon: 'Menu', sort: 3, status: 'enabled' }
    ]
  },
  {
    id: 2,
    name: '数据分析',
    path: '/analysis',
    icon: 'DataAnalysis',
    sort: 2,
    status: 'enabled',
    children: [
      {
        id: 21,
        name: '数据面板',
        path: '/dashboard',
        icon: 'TrendCharts',
        sort: 1,
        status: 'enabled'
      },
      { id: 22, name: '报表管理', path: '/report', icon: 'Document', sort: 2, status: 'enabled' }
    ]
  }
])

function editMenu(menu: Menu) {
  console.log('编辑菜单', menu)
}

function deleteMenu(menu: Menu) {
  console.log('删除菜单', menu)
}
</script>

<style scoped>
.menu-view {
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
