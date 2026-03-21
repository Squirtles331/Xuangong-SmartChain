<script lang="ts" setup>
import type { TableColumnItem } from 'gi-component'

const tabValue = ref('1')
const options = [
  { label: '用户权限', name: '1' },
  { label: '用户角色', name: '2' }
]
// 用户分配权限
const roleColumns: TableColumnItem[] = [
  {
    prop: 'menuName',
    label: '菜单名称',
    align: 'center'
  },
  {
    prop: 'menuDesc',
    label: '菜单功能',
    align: 'center'
  }
]

// 把原始数据包一下，补 checkedList
interface RoleRow {
  menuName: string
  menuDesc: string[] // 所有可选项
  checkedList: string[] // 真正 v-model 的已选项
}
const roleData = ref<RoleRow[]>([
  {
    menuName: '系统管理',
    menuDesc: ['用户管理', '角色管理', '菜单管理', '权限管理'],
    checkedList: ['用户管理'] // 默认勾哪个就写哪个
  },
  {
    menuName: '系统设置',
    menuDesc: ['系统日志', '操作日志'],
    checkedList: []
  }
])
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
  <!--  用户权限-->
  <gi-table v-if="tabValue === '1'" :columns="roleColumns" :data="roleData" style="height: 100%">
    <template #menuDesc="{ row }">
      <el-checkbox-group v-model="row.checkedList">
        <el-checkbox v-for="opt in row.menuDesc" :key="opt" :label="opt">
          {{ opt }}
        </el-checkbox>
      </el-checkbox-group>
    </template>
  </gi-table>
  <!--  用户角色-->
  <gi-table v-else :columns="userColumns" :data="userData" style="height: 100%"></gi-table>
</template>

<style scoped></style>
