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
      <el-tag :type="row.status === 'active' ? 'success' : 'info'">
        {{ row.status === 'active' ? '启用' : '停用' }}
      </el-tag>
    </template>

    <template #nodes="{ row }">
      <el-steps :active="row.nodes.length" align-center style="max-width: 600px">
        <el-step v-for="(node, index) in row.nodes" :key="index" :title="node" :description="getNodeDescription(Number(index), row.nodes.length)" />
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { createApprovalFlow, deleteApprovalFlow, getApprovalFlows, updateApprovalFlow, type ApprovalFlow, type ApprovalFlowQuery } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import ApprovalFlowFormDialog, { type ApprovalFlowFormModel } from './ApprovalFlowFormDialog.vue'

const businessTypeOptions = [
  { label: '普通工单', value: 'workOrderNormal' },
  { label: '紧急工单', value: 'workOrderUrgent' },
  { label: 'BOM/工艺', value: 'bomRouting' },
  { label: 'ECN 变更', value: 'ecn' },
  { label: '销售订单', value: 'salesOrder' },
  { label: '采购订单', value: 'purchaseOrder' }
]

const statusOptions: Array<{ label: string; value: ApprovalFlow['status'] }> = [
  { label: '启用', value: 'active' },
  { label: '停用', value: 'disabled' }
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

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ApprovalFlow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: ApprovalFlowQuery = {
      pageNum: page,
      pageSize: size,
      name: queryParams.name || undefined,
      businessType: queryParams.businessType || undefined,
      status: queryParams.status === '' ? undefined : queryParams.status
    }
    const response = await getApprovalFlows(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteApprovalFlow(id)))
})

function createDefaultFormModel(): ApprovalFlowFormModel {
  return { id: '', name: '', businessType: '', nodes: '' }
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
    await createApprovalFlow({
      name: formModel.value.name,
      businessType: formModel.value.businessType,
      nodes,
      status: 'active'
    })
  } else {
    await updateApprovalFlow(formModel.value.id, {
      name: formModel.value.name,
      businessType: formModel.value.businessType,
      nodes
    })
  }

  dialogVisible.value = false
  await refresh()
}

function toggleStatus(row: ApprovalFlow) {
  row.status = row.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(row.status === 'active' ? '审批流已启用' : '审批流已停用')
}
</script>
