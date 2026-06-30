<template>
  <gi-page-layout :size="260" style="height: calc(100vh - 120px)">
    <template #left>
      <div class="tree-wrapper">
        <div class="tree-header">
          <div class="tree-title">工厂组织架构</div>
        </div>
        <el-tree
          ref="treeRef"
          :data="orgTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          :expand-on-click-node="false"
          highlight-current
          @node-click="onNodeClick"
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <span v-if="node.childNodes?.length" class="tree-toggle" @click.stop="node.expanded = !node.expanded">
                <el-icon>
                  <CaretRight v-if="!node.expanded" />
                  <CaretBottom v-else />
                </el-icon>
              </span>
              <span v-else class="tree-toggle tree-toggle--empty"></span>
              <el-icon v-if="data.type === 'group'" class="tree-icon"><OfficeBuilding /></el-icon>
              <el-icon v-else-if="data.type === 'company'" class="tree-icon"><OfficeBuilding /></el-icon>
              <el-icon v-else-if="data.type === 'plant'" class="tree-icon"><HomeFilled /></el-icon>
              <el-icon v-else-if="data.type === 'workshop'" class="tree-icon"><Grid /></el-icon>
              <el-icon v-else class="tree-icon"><Location /></el-icon>
              <span>{{ data.name }}</span>
            </span>
          </template>
        </el-tree>
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
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="组织列表" :columns="tableColumns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
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

    <OrganizationFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ElTree } from 'element-plus'
import { CaretBottom, CaretRight, Grid, HomeFilled, Location, OfficeBuilding } from '@element-plus/icons-vue'
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
const selectedNodeId = ref('')

const queryParams = reactive<{
  keyword: string
  type: '' | OrgType
}>({
  keyword: '',
  type: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '组织名称/组织编码', clearable: true } as any },
  {
    type: 'select-v2',
    label: '组织类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '集团', value: 'group' },
        { label: '公司', value: 'company' },
        { label: '工厂', value: 'plant' },
        { label: '车间', value: 'workshop' },
        { label: '产线', value: 'line' }
      ]
    } as any
  }
]

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
  const response = await getOrgTree()
  orgTree.value = JSON.parse(JSON.stringify(response.data as OrgNode[]))
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

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: ''
  })
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

function openAdd() {
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
    const response = await getOrgNodeDetail(currentNode.value.id)
    currentNode.value = response.data ? { ...response.data } : null
  }

  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}

async function syncCurrentNode() {
  if (!selectedNodeId.value) return
  const response = await getOrgNodeDetail(selectedNodeId.value)
  currentNode.value = response.data ? { ...response.data } : null
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
  display: inline-flex;
  align-items: center;
  font-size: 13px;
}

.tree-toggle {
  display: inline-flex;
  width: 16px;
  margin-right: 4px;
  color: #606266;
  cursor: pointer;
}

.tree-toggle--empty {
  cursor: default;
}

.tree-icon {
  margin-right: 4px;
}

.content-table {
  min-height: 420px;
}

:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
