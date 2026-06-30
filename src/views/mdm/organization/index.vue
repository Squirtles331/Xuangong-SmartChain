<template>
  <gi-page-layout :size="260" style="height: calc(100vh - 120px)">
    <template #left>
      <div class="tree-wrapper">
        <div class="tree-header">
          <div class="tree-title">工厂组织架构</div>
          <el-button text type="primary" @click="toggleTreeExpanded">
            {{ treeExpanded ? '收起组织树' : '展开组织树' }}
          </el-button>
        </div>
        <el-tree
          v-show="treeExpanded"
          ref="treeRef"
          :data="orgTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @node-click="onNodeClick"
        >
          <template #default="{ data }">
            <span class="tree-node">
              <el-icon v-if="data.type === 'group'" style="margin-right: 4px"><OfficeBuilding /></el-icon>
              <el-icon v-else-if="data.type === 'company'" style="margin-right: 4px"><OfficeBuilding /></el-icon>
              <el-icon v-else-if="data.type === 'plant'" style="margin-right: 4px"><HomeFilled /></el-icon>
              <el-icon v-else-if="data.type === 'workshop'" style="margin-right: 4px"><Grid /></el-icon>
              <el-icon v-else style="margin-right: 4px"><Location /></el-icon>
              <span>{{ data.name }}</span>
            </span>
          </template>
        </el-tree>
      </div>
    </template>

    <template #header>
      <div class="org-page-header">
        <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
          <gi-form
            v-model="queryParams"
            :columns="visibleSearchColumns"
            :grid-item-props="searchGridItemProps"
            search
            @search="handleSearch"
            @reset="handleReset"
          />
        </SearchSetting>
      </div>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <div class="content-wrapper">
      <TableSetting title="表格工具栏" :columns="tableColumns" @refresh="refresh">
        <template #default="{ settingColumns, tableProps }">
          <gi-table
            :columns="settingColumns"
            :data="tableData"
            :pagination="pagination"
            :loading="loading"
            v-bind="tableProps"
            @row-click="handleRowClick"
            border
            stripe
            class="content-table"
          >
            <template #index="{ $index }">
              {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
            </template>
            <template #type="{ row }">
              <el-tag size="small" :type="getTypeTagType(row.type)">
                {{ getTypeLabel(row.type) }}
              </el-tag>
            </template>
            <template #actions="{ row }">
              <gi-button type="edit" @click="openEditByRow(row)" />
              <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
            </template>
          </gi-table>
        </template>
      </TableSetting>
    </div>

    <OrganizationFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'
import { OfficeBuilding, HomeFilled, Grid, Location } from '@element-plus/icons-vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createOrgNode, deleteOrgNode, getOrgNodeDetail, getOrgTree, getOrgTreeList, updateOrgNode, type OrgListItem, type OrgNode } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import OrganizationFormDialog, { type OrgType, type OrganizationFormModel } from './OrganizationFormDialog.vue'

const orgTree = ref<OrgNode[]>([])
const currentNode = ref<OrgNode | null>(null)
const treeRef = ref<InstanceType<typeof ElTree> | null>(null)
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<OrganizationFormModel>(createDefaultFormModel())
const treeExpanded = ref(true)
const queryParams = reactive<{
  keyword: string
  type: '' | OrgType
}>({
  keyword: '',
  type: ''
})
const selectedNodeId = ref('')

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '组织名称/组织编码', clearable: true } as any },
  {
    type: 'select-v2',
    label: '组织类型',
    field: 'type',
    props: {
      clearable: true,
      options: [
        { label: '集团', value: 'group' },
        { label: '公司', value: 'company' },
        { label: '工厂', value: 'plant' },
        { label: '车间', value: 'workshop' },
        { label: '产线', value: 'line' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const tableColumns: TableColumnItem<OrgListItem>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'name', label: '组织名称', minWidth: 180 },
  { prop: 'code', label: '组织编码', minWidth: 160 },
  { label: '组织类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'parentName', label: '上级组织', minWidth: 180 },
  { prop: 'childCount', label: '下级节点数', minWidth: 100, align: 'center' },
  { label: '操作', minWidth: 180, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<OrgListItem>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getOrgTreeList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: queryParams.type || undefined,
      nodeId: selectedNodeId.value || undefined
    })

    return response.data
  },
  deleteAPI: deleteOrgNodes,
  onSuccess: syncCurrentNode
})

init()

async function init() {
  await fetchTree()
}

async function fetchTree() {
  const res = await getOrgTree()
  orgTree.value = JSON.parse(JSON.stringify(res.data as OrgNode[]))
}

function createDefaultFormModel(): OrganizationFormModel {
  return {
    id: '',
    parentId: '',
    name: '',
    code: '',
    type: 'group'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function toggleTreeExpanded() {
  treeExpanded.value = !treeExpanded.value
}

function handleSearch() {
  currentNode.value = null
  selectedNodeId.value = ''
  treeRef.value?.setCurrentKey(undefined)
  search()
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: ''
  })
  currentNode.value = null
  selectedNodeId.value = ''
  treeRef.value?.setCurrentKey(undefined)
  search()
}

async function onNodeClick(data: OrgNode) {
  currentNode.value = { ...data }
  selectedNodeId.value = data.id
  search()
}

function buildDefaultCode(type: OrgType) {
  return `${type.toUpperCase()}-${Date.now().toString().slice(-6)}`
}

function getTypeLabel(type: OrgType) {
  const typeLabelMap: Record<OrgType, string> = {
    group: '集团',
    company: '公司',
    plant: '工厂',
    workshop: '车间',
    line: '产线'
  }
  return typeLabelMap[type]
}

function getTypeTagType(type: OrgType) {
  if (type === 'group') return 'danger'
  if (type === 'company') return 'primary'
  if (type === 'plant') return 'success'
  return 'warning'
}

function addNode() {
  const parent = currentNode.value
  const typeMap: Record<OrgType, OrgType> = {
    group: 'company',
    company: 'plant',
    plant: 'workshop',
    workshop: 'line',
    line: 'line'
  }

  const newType: OrgType = parent ? typeMap[parent.type] : 'group'

  dialogMode.value = 'add'
  formModel.value = {
    id: '',
    parentId: parent?.id || '',
    name: '',
    code: buildDefaultCode(newType),
    type: newType
  }
  dialogVisible.value = true
}

function openAdd() {
  addNode()
}

function openEditByRow(row: OrgListItem) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    parentId: '',
    name: row.name,
    code: row.code === '-' ? '' : row.code,
    type: row.type
  }
  dialogVisible.value = true
}

async function handleRowClick(row: OrgListItem) {
  const res = await getOrgNodeDetail(row.id)
  const detail = res.data ? { ...res.data } : null
  if (!detail) return
  currentNode.value = detail
  selectedNodeId.value = detail.id
  treeRef.value?.setCurrentKey(detail.id)
  search()
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.code) {
    ElMessage.warning('请填写名称和编码')
    return
  }

  if (dialogMode.value === 'add') {
    await createOrgNode({
      parentId: formModel.value.parentId || undefined,
      name: formModel.value.name,
      code: formModel.value.code,
      type: formModel.value.type
    })
  } else {
    await updateOrgNode(formModel.value.id, {
      name: formModel.value.name,
      code: formModel.value.code,
      type: formModel.value.type
    })
  }

  dialogVisible.value = false
  await Promise.all([fetchTree(), refresh()])

  if (currentNode.value?.id) {
    const res = await getOrgNodeDetail(currentNode.value.id)
    currentNode.value = res.data ? { ...res.data } : null
  }

  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}

async function syncCurrentNode() {
  if (!selectedNodeId.value) return
  const res = await getOrgNodeDetail(selectedNodeId.value)
  currentNode.value = res.data ? { ...res.data } : null
}

async function deleteOrgNodes(ids: string[]) {
  await Promise.all(ids.map((id) => deleteOrgNode(id)))

  if (ids.includes(selectedNodeId.value)) {
    selectedNodeId.value = ''
    currentNode.value = null
    treeRef.value?.setCurrentKey(undefined)
  }

  await fetchTree()
}
</script>

<style scoped>
.org-page-header {
  width: 100%;
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
  gap: 8px;
  padding-bottom: 8px;
}

.tree-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2d3d;
}

.tree-wrapper :deep(.el-tree) {
  flex: 1;
  overflow: auto;
}

.tree-node {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.content-wrapper {
  padding: 0 16px 16px;
}

.content-table {
  min-height: 420px;
}
</style>
