<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="审批流配置"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #businessType="{ row }">
      {{ getBusinessTypeLabel(row.businessType) }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #nodes="{ row }">
      <el-steps :active="getNodes(row).length" align-center style="max-width: 600px">
        <el-step
          v-for="(node, index) in getNodes(row)"
          :key="`${row.id}-${index}`"
          :title="node"
          :description="getNodeDescription(Number(index), getNodes(row).length)"
        />
      </el-steps>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ApprovalFlowFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { ApprovalFlow } from '@/api/system'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { sysApprovalFlowRecords } from '../static-data'
import ApprovalFlowFormDialog, { type ApprovalFlowFormModel } from './ApprovalFlowFormDialog.vue'

const businessTypeOptions = [
  { label: '普通工单', value: 'workOrderNormal' },
  { label: '紧急工单', value: 'workOrderUrgent' },
  { label: 'BOM/工艺', value: 'bomRouting' },
  { label: 'ECN 变更', value: 'ecn' },
  { label: '销售订单', value: 'salesOrder' },
  { label: '采购订单', value: 'purchaseOrder' }
]

const statusOptions = [
  { label: '启用', value: 'active', type: 'success' as const },
  { label: '停用', value: 'disabled', type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '审批流名称', field: 'name', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '关联业务',
    field: 'businessType',
    props: {
      clearable: true,
      options: businessTypeOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: statusOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<ApprovalFlow>[] = [
  { prop: 'name', label: '审批流名称', minWidth: 180 },
  { label: '关联业务', minWidth: 140, slotName: 'businessType' },
  { label: '审批节点', minWidth: 280, slotName: 'nodes' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  name: string
  businessType: string
  status: '' | ApprovalFlow['status']
}>({
  name: '',
  businessType: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ApprovalFlowFormModel>(createDefaultFormModel())

const filteredRecords = computed(() => {
  return sysApprovalFlowRecords.value.filter((item) => {
    const matchName = !queryParams.name || item.name.includes(queryParams.name)
    const matchBusinessType = !queryParams.businessType || item.businessType === queryParams.businessType
    const matchStatus = queryParams.status === '' || item.status === queryParams.status
    return matchName && matchBusinessType && matchStatus
  })
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ApprovalFlow>({
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
    sysApprovalFlowRecords.value = sysApprovalFlowRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function createDefaultFormModel(): ApprovalFlowFormModel {
  return { id: '', name: '', businessType: '', nodes: '' }
}

function getNodes(row: ApprovalFlow) {
  return Array.isArray(row.nodes) ? row.nodes : []
}

function getBusinessTypeLabel(value: string) {
  return businessTypeOptions.find((item) => item.value === value)?.label || value
}

function getNodeDescription(index: number, total: number) {
  if (index === 0) return '发起'
  if (index === total - 1) return '终审'
  return `第 ${index + 1} 级`
}

function getRowActions(row: ApprovalFlow): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'toggle', label: row.status === 'active' ? '停用' : '启用', tone: row.status === 'active' ? 'warning' : 'success' },
    { key: 'delete', label: '删除', tone: 'danger' }
  ]
}

function handleReset() {
  Object.assign(queryParams, {
    name: '',
    businessType: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ApprovalFlow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    name: row.name,
    businessType: row.businessType,
    nodes: row.nodes.join(',')
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ApprovalFlow) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'toggle') {
    toggleStatus(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.businessType || !formModel.value.nodes) {
    ElMessage.warning('请填写审批流名称、关联业务和审批节点')
    return
  }

  const nodes = formModel.value.nodes
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  if (dialogMode.value === 'add') {
    sysApprovalFlowRecords.value.unshift({
      id: `FLOW-${String(sysApprovalFlowRecords.value.length + 1).padStart(3, '0')}`,
      name: formModel.value.name,
      businessType: formModel.value.businessType,
      nodes,
      status: 'active'
    })
  } else {
    sysApprovalFlowRecords.value = sysApprovalFlowRecords.value.map((item) =>
      item.id === formModel.value.id
        ? {
            ...item,
            name: formModel.value.name,
            businessType: formModel.value.businessType,
            nodes
          }
        : item
    )
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '已新增静态审批流数据' : '已更新静态审批流数据')
}

function toggleStatus(row: ApprovalFlow) {
  row.status = row.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(row.status === 'active' ? '审批流已启用' : '审批流已停用')
}
</script>
