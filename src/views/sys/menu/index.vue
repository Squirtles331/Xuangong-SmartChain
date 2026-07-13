<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="菜单列表"
    :page-attrs="{ size: 320, style: 'height: calc(100vh - 120px)' }"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd(currentTreeNode)"
  >
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

    <template #type="{ row }">
      <StatusTag :value="row.type" :options="typeTagOptions" />
    </template>

    <template #visible="{ row }">
      <StatusTag :value="row.visible" :options="visibleTagOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="menuActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <MenuFormDialog v-model:visible="dialogVisible" v-model:form="dialogFormModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Folder, Operation } from '@element-plus/icons-vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import type { SysMenu } from '@/api/system'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import { useTable } from '@/hooks/useTable'
import { buildMenuRows, buildMenuTree, sysMenuRecords } from '../static-data'
import MenuFormDialog, { type MenuFormModel } from './MenuFormDialog.vue'

const typeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
]

const typeTagOptions = [
  { label: '目录', value: 'directory', type: 'info' as const },
  { label: '菜单', value: 'menu', type: 'primary' as const },
  { label: '按钮', value: 'button', type: 'warning' as const }
]

const visibleTagOptions = [
  { label: '显示', value: true, type: 'success' as const },
  { label: '隐藏', value: false, type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '菜单名称 / 路由 / 权限编码', clearable: true } as any },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: { options: typeOptions, clearable: true } as any
  }
]

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

const menuActions = [
  { key: 'edit', label: '编辑', tone: 'primary' as const },
  { key: 'delete', label: '删除', tone: 'danger' as const }
]

const queryParams = reactive<{
  keyword: string
  type: '' | SysMenu['type']
}>({
  keyword: '',
  type: ''
})

const menuTree = ref<SysMenu[]>([])
const currentTreeNode = ref<SysMenu | null>(null)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const dialogFormModel = ref<MenuFormModel>(createDefaultFormModel())

const menuRows = computed(() => buildMenuRows())
const filteredRecords = computed(() => {
  const keyword = queryParams.keyword.trim().toLowerCase()

  return menuRows.value.filter((item) => {
    const matchKeyword =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      (item.path || '').toLowerCase().includes(keyword) ||
      item.permissionCode.toLowerCase().includes(keyword)

    const matchType = !queryParams.type || item.type === queryParams.type
    const matchTree = !currentTreeNode.value?.id || item.parentId === currentTreeNode.value.id || item.id === currentTreeNode.value.id

    return matchKeyword && matchType && matchTree
  })
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SysMenu>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    const deleteSet = new Set(ids)
    let hasNext = true

    while (hasNext) {
      hasNext = false
      sysMenuRecords.value.forEach((item) => {
        if (item.parentId && deleteSet.has(item.parentId) && !deleteSet.has(item.id)) {
          deleteSet.add(item.id)
          hasNext = true
        }
      })
    }

    sysMenuRecords.value = sysMenuRecords.value.filter((item) => !deleteSet.has(item.id))
    loadTree()
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

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: ''
  })
  currentTreeNode.value = null
  search()
}

function loadTree() {
  menuTree.value = buildMenuTree()
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
    type: parent ? (parent.type === 'button' ? 'button' : 'menu') : 'directory'
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

function handleRowAction(action: string, row: SysMenu) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
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
    sysMenuRecords.value.push({
      id: `MENU-${String(sysMenuRecords.value.length + 1).padStart(3, '0')}`,
      ...payload
    })
  } else {
    sysMenuRecords.value = sysMenuRecords.value.map((item) => (item.id === dialogFormModel.value.id ? { ...item, ...payload } : item))
  }

  dialogVisible.value = false
  loadTree()
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '已新增静态菜单数据' : '已更新静态菜单数据')
}
</script>

<style scoped>
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
