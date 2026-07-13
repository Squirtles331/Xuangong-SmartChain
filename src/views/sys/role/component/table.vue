<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'

const tabValue = ref('1')
const options = [
  { label: '用户权限', name: '1' },
  { label: '用户角色', name: '2' }
]

// 权限树数据
const permissionTree = ref([
  {
    id: 'sys',
    label: '系统管理',
    children: [
      { id: 'sys-user', label: '用户管理' },
      { id: 'sys-role', label: '角色管理' },
      { id: 'sys-menu', label: '菜单管理' },
      { id: 'sys-perm', label: '权限管理' }
    ]
  },
  {
    id: 'bom',
    label: 'BOM管理',
    children: [
      { id: 'bom-list', label: 'BOM列表' },
      { id: 'bom-edit', label: 'BOM编辑' },
      { id: 'bom-compare', label: '版本比较' },
      { id: 'bom-explode', label: 'BOM展开' }
    ]
  },
  {
    id: 'order',
    label: '工单管理',
    children: [
      { id: 'order-list', label: '工单列表' },
      { id: 'order-create', label: '创建工单' },
      { id: 'order-approve', label: '工单审批' }
    ]
  },
  {
    id: 'settings',
    label: '系统设置',
    children: [
      { id: 'settings-audit', label: '操作日志' },
      { id: 'settings-notify', label: '通知管理' }
    ]
  }
])

const checkedKeys = ref(['sys-user', 'bom-list', 'bom-edit'])

// 用户角色
const userColumns: TableColumnItem[] = [
  {
    prop: 'roleName',
    label: '角色名称',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    prop: 'roleDesc',
    label: '角色描述',
    align: 'center',
    showOverflowTooltip: true
  }
]
const userData = [
  { roleName: 'admin', roleDesc: '管理员' },
  { roleName: 'user', roleDesc: '普通用户' }
]
</script>

<template>
  <gi-tabs v-model="tabValue" :options="options"> </gi-tabs>
  <!--  用户权限 - 树形勾选 -->
  <div v-if="tabValue === '1'" style="padding: 16px">
    <div style="margin-bottom: 12px">
      <el-button type="primary" size="small" @click="ElMessage.success('权限已保存')">保存权限</el-button>
      <el-button size="small" @click="checkedKeys = []">清空</el-button>
      <el-button size="small" @click="checkedKeys = permissionTree.flatMap((n) => [n.id, ...(n.children || []).map((c) => c.id)])">全选</el-button>
    </div>
    <el-tree
      :data="permissionTree"
      show-checkbox
      node-key="id"
      :default-checked-keys="checkedKeys"
      default-expand-all
      @check="(_, state) => (checkedKeys = state.checkedKeys as string[])"
    />
  </div>
  <!--  用户角色 -->
  <gi-table v-else :columns="userColumns" :data="userData" style="height: 100%"></gi-table>
</template>

<style scoped></style>
