<template>
  <gi-page-layout>
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

    <TableSetting title="表格工具栏" :columns="columns" @refresh="refresh">
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
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>

          <template #nodes="{ row }">
            <el-steps :active="row.nodes.length" align-center style="max-width: 600px">
              <el-step
                v-for="(node, index) in row.nodes"
                :key="index"
                :title="node"
                :description="index === 0 ? '发起' : index === row.nodes.length - 1 ? '终审' : `第 ${index + 1} 级`"
              />
            </el-steps>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggleStatus(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ApprovalFlowFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
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
  { type: 'input', label: '审批流名称', field: 'name' },
  {
    type: 'select-v2',
    label: '关联业务',
    field: 'businessType',
    props: {
      options: businessTypeOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<ApprovalFlow>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'name', label: '审批流名称', minWidth: 160 },
  { prop: 'businessType', label: '关联业务', width: 160 },
  { label: '审批节点', minWidth: 250, slotName: 'nodes' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
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

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
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

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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
  ElMessage.success(row.status === 'active' ? '已启用' : '已停用')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
