<template>
  <gi-page-layout :size="320" style="height: calc(100vh - 120px)">
    <template #left>
      <div class="tree-wrapper">
        <div class="tree-header">
          <span class="tree-title">菜单树</span>
          <el-button link type="primary" @click="loadTree">刷新</el-button>
        </div>

        <el-tree
          :data="menuTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          :expand-on-click-node="false"
          highlight-current
          @node-click="handleTreeNodeClick"
        >
          <template #default="{ data }">
            <span class="tree-node">
              <el-icon v-if="data.type === 'directory'"><Folder /></el-icon>
              <el-icon v-else-if="data.type === 'menu'"><Document /></el-icon>
              <el-icon v-else><Operation /></el-icon>
              <span>{{ data.name }}</span>
            </span>
          </template>
        </el-tree>

        <div class="tree-toolbar">
          <el-button type="primary" size="small" @click="openAdd(null)">新增根节点</el-button>
          <el-button size="small" @click="clearTreeFilter">查看全部</el-button>
        </div>
      </div>
    </template>

    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd(currentTreeNode)" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="菜单列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #type="{ row }">
            <el-tag :type="typeTagMap[row.type]">{{ typeLabelMap[row.type] }}</el-tag>
          </template>

          <template #visible="{ row }">
            <el-tag :type="row.visible ? 'success' : 'info'">{{ row.visible ? '显示' : '隐藏' }}</el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <MenuFormDialog v-model:visible="dialogVisible" v-model:form="dialogFormModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Folder, Operation } from '@element-plus/icons-vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createMenu, deleteMenu, getMenuList, getMenuTree, updateMenu, type MenuQuery, type SysMenu } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import MenuFormDialog, { type MenuFormModel } from './MenuFormDialog.vue'

const typeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
]

const typeLabelMap: Record<SysMenu['type'], string> = {
  directory: '目录',
  menu: '菜单',
  button: '按钮'
}

const typeTagMap: Record<SysMenu['type'], 'info' | 'primary' | 'warning'> = {
  directory: 'info',
  menu: 'primary',
  button: 'warning'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '菜单名称/路由/权限编码' } as any },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: { options: typeOptions, clearable: true } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SysMenu>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'name', label: '菜单名称', minWidth: 160 },
  { prop: 'parentName', label: '上级节点', minWidth: 140 },
  { prop: 'type', label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'path', label: '路由路径', minWidth: 180 },
  { prop: 'permissionCode', label: '权限编码', minWidth: 200 },
  { prop: 'sortOrder', label: '排序', minWidth: 80, align: 'center' },
  { prop: 'visible', label: '显示状态', minWidth: 100, slotName: 'visible', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  type: '' | SysMenu['type']
}>({
  keyword: '',
  type: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const menuTree = ref<SysMenu[]>([])
const currentTreeNode = ref<SysMenu | null>(null)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const dialogFormModel = ref<MenuFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SysMenu>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: MenuQuery = {
      pageNum: page,
      pageSize: size,
      keyword: currentTreeNode.value?.id ? currentTreeNode.value.name : queryParams.keyword || undefined,
      type: queryParams.type || undefined
    }

    const response = await getMenuList(params)
    const list = currentTreeNode.value?.id
      ? response.data.list.filter((item) => item.parentId === currentTreeNode.value?.id || item.id === currentTreeNode.value?.id)
      : response.data.list

    return {
      list,
      total: currentTreeNode.value?.id ? list.length : response.data.total
    }
  },
  deleteAPI: async (ids) => {
    await Promise.all(ids.map((id) => deleteMenu(id)))
    await loadTree()
  }
})

loadTree()

function createDefaultFormModel(): MenuFormModel {
  return {
    id: '',
    parentId: null,
    name: '',
    type: 'menu',
    path: '',
    component: '',
    permissionCode: '',
    icon: '',
    sortOrder: 1,
    visible: true
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: ''
  })
  currentTreeNode.value = null
  search()
}

async function loadTree() {
  const response = await getMenuTree()
  menuTree.value = response.data
}

function handleTreeNodeClick(node: SysMenu) {
  currentTreeNode.value = node
  search()
}

function clearTreeFilter() {
  currentTreeNode.value = null
  search()
}

function openAdd(parent: SysMenu | null) {
  dialogMode.value = 'add'
  dialogFormModel.value = {
    ...createDefaultFormModel(),
    parentId: parent?.id || null,
    type: parent?.type === 'button' ? 'button' : 'menu'
  }
  dialogVisible.value = true
}

function openEdit(row: SysMenu) {
  dialogMode.value = 'edit'
  dialogFormModel.value = {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    type: row.type,
    path: row.path || '',
    component: row.component || '',
    permissionCode: row.permissionCode,
    icon: row.icon || '',
    sortOrder: row.sortOrder,
    visible: row.visible
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!dialogFormModel.value.name || !dialogFormModel.value.permissionCode) {
    ElMessage.warning('请填写菜单名称和权限编码')
    return
  }

  const payload = {
    parentId: dialogFormModel.value.parentId,
    name: dialogFormModel.value.name,
    type: dialogFormModel.value.type,
    path: dialogFormModel.value.path || undefined,
    component: dialogFormModel.value.component || undefined,
    permissionCode: dialogFormModel.value.permissionCode,
    icon: dialogFormModel.value.icon || undefined,
    sortOrder: dialogFormModel.value.sortOrder,
    visible: dialogFormModel.value.visible
  }

  if (dialogMode.value === 'add') {
    await createMenu(payload)
  } else {
    await updateMenu(dialogFormModel.value.id, payload)
  }

  dialogVisible.value = false
  await loadTree()
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

.tree-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tree-title {
  font-size: 14px;
  font-weight: 600;
}

.tree-wrapper :deep(.el-tree) {
  flex: 1;
  overflow: auto;
}

.tree-toolbar {
  display: flex;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #ebeef5;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
