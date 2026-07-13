<template>
  <gi-page-layout>
    <template #header>
      <div class="page-header-stack">
        <PageOwnershipNotice />
        <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
          <gi-form
            v-model="queryParams"
            :columns="visibleSearchColumns"
            :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
            search
            @reset="handleReset"
            @search="search"
          />
        </SearchSetting>
      </div>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="检验任务" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #verdict="{ row }">
            <StatusTag :value="row.verdict || ''" :options="inspectionVerdictOptions" />
          </template>
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="inspectionStatusOptions" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="inspect(row)">检验</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <InspectionFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <InspectionExecuteDialog
      v-model:visible="executeVisible"
      v-model:items="items"
      v-model:result="inspectResult"
      :task="currentTask"
      @submit="submitInspect"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createInspectionTask, deleteInspectionTask, getInspectionTaskList, updateInspectionTask, type InspectionTask } from '@/api/qms'
import { useTable } from '@/hooks/useTable'
import InspectionFormDialog, { type InspectionFormModel } from './InspectionFormDialog.vue'
import InspectionExecuteDialog, { type InspectionExecuteItem, type InspectionExecuteTask } from './InspectionExecuteDialog.vue'

const inspectionVerdictOptions = [
  { value: '合格', label: '合格', type: 'success' as const },
  { value: '让步', label: '让步', type: 'warning' as const },
  { value: '返工', label: '返工', type: 'danger' as const },
  { value: '退货', label: '退货', type: 'danger' as const },
  { value: '报废', label: '报废', type: 'info' as const }
]

const inspectionStatusOptions = [
  { value: 'pending', label: '待检', type: 'warning' as const },
  { value: 'done', label: '已完成', type: 'success' as const }
]

const queryParams = reactive({
  keyword: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<InspectionFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword' },
  {
    type: 'select-v2',
    label: '检验类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '来料检验', value: '来料检验' },
        { label: '过程检验', value: '过程检验' },
        { label: '最终检验', value: '最终检验' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待检', value: 'pending' },
        { label: '已完成', value: 'done' }
      ]
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<InspectionTask>[] = [
  { prop: 'code', label: '任务编号', width: 170 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'lot', label: '批号', width: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '判定', minWidth: 80, slotName: 'verdict', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<InspectionTask>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getInspectionTaskList({
      pageNum: page,
      pageSize: size,
      code: queryParams.keyword || undefined,
      type: queryParams.type || undefined,
      material: queryParams.keyword || undefined,
      status: queryParams.status || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteInspectionTask(id)))
})

function createDefaultFormModel(): InspectionFormModel {
  return {
    id: '',
    code: '',
    type: '来料检验',
    material: '',
    lot: '',
    qty: 1,
    status: 'pending',
    verdict: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, { keyword: '', type: '', status: '' })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: InspectionTask) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createInspectionTask(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateInspectionTask(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}

const executeVisible = ref(false)
const currentTask = ref<InspectionExecuteTask | null>(null)
const inspectResult = ref('qualified')
const items = ref<InspectionExecuteItem[]>([])

function inspect(row: InspectionTask) {
  currentTask.value = { code: row.code, material: row.material }
  executeVisible.value = true
  inspectResult.value = 'qualified'
  items.value = [
    { name: '尺寸', standard: '100.00', value: '' },
    { name: '硬度', standard: '45', value: '' },
    { name: '表面粗糙度', standard: '3.2', value: '' }
  ]
}

async function submitInspect() {
  if (!currentTask.value) return

  const verdictMap: Record<string, string> = {
    qualified: '合格',
    concession: '让步',
    sorting: '返工',
    return: '退货',
    scrap: '报废'
  }

  const target = tableData.value.find((row) => row.code === currentTask.value?.code)
  if (!target) return

  await updateInspectionTask(target.id, {
    status: 'done',
    verdict: verdictMap[inspectResult.value] || ''
  })

  target.status = 'done'
  target.verdict = verdictMap[inspectResult.value] || ''
  executeVisible.value = false
  ElMessage.success(`检验完成：${verdictMap[inspectResult.value] || ''}`)
}
</script>

<style scoped>
.page-header-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
