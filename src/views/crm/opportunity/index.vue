<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="商机"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #amount="{ row }">
      {{ Number(row?.amount ?? 0).toLocaleString('zh-CN') }}
    </template>

    <template #stage="{ row }">
      <StatusTag :value="row.stage" :options="stageOptions" />
    </template>

    <template #probability="{ row }">
      <el-progress
        :percentage="row.probability"
        :stroke-width="8"
        :color="row.probability >= 70 ? '#67c23a' : row.probability >= 40 ? '#e6a23c' : '#909399'"
      />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <OpportunityFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :customer-options="customerOptions"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  convertOpportunity,
  crmCustomerOptions,
  deleteOpportunity,
  getOpportunityList,
  saveOpportunity,
  type OpportunityQuery,
  type OpportunityRecord
} from '@/static/services/crm'
import OpportunityFormDialog, { type OpportunityFormModel } from './OpportunityFormDialog.vue'

defineOptions({
  name: 'CrmOpportunityPage'
})

const customerOptions = [...crmCustomerOptions]

const stageOptions = [
  { value: 'initial', label: '初步接触', type: 'info' as const },
  { value: 'solution', label: '方案制定', type: 'warning' as const },
  { value: 'quotation', label: '报价中', type: 'primary' as const },
  { value: 'won', label: '已成交', type: 'success' as const },
  { value: 'lost', label: '已丢单', type: 'danger' as const }
]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: { clearable: true, placeholder: '商机编号 / 客户 / 商机主题' } as never
  },
  {
    type: 'select-v2',
    label: '客户',
    field: 'customerCode',
    props: { clearable: true, options: customerOptions } as never
  },
  {
    type: 'select-v2',
    label: '阶段',
    field: 'stage',
    props: {
      clearable: true,
      options: stageOptions.map((item) => ({
        label: item.label,
        value: item.value
      }))
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<OpportunityRecord>[] = [
  { prop: 'code', label: '商机编号', minWidth: 150 },
  { prop: 'customer_name', label: '客户', minWidth: 180 },
  { prop: 'topic', label: '商机主题', minWidth: 220 },
  { label: '预计金额', minWidth: 120, align: 'right', slotName: 'amount' },
  { label: '阶段', minWidth: 110, align: 'center', slotName: 'stage' },
  { label: '赢单率', minWidth: 160, slotName: 'probability' },
  { prop: 'owner', label: '负责人', minWidth: 120 },
  { prop: 'next_step', label: '下一步动作', minWidth: 200 },
  { prop: 'close_date', label: '预计成交日期', minWidth: 130, align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  customerCode: string
  stage: '' | OpportunityRecord['stage']
}>({
  keyword: '',
  customerCode: '',
  stage: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<OpportunityFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<OpportunityRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: OpportunityQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      customerCode: queryParams.customerCode || undefined,
      stage: queryParams.stage || undefined
    }
    const response = await getOpportunityList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteOpportunity(id)))
})

function createDefaultFormModel(): OpportunityFormModel {
  return {
    id: '',
    code: '',
    customer_code: customerOptions[0]?.value || '',
    topic: '',
    amount: 0,
    stage: 'initial',
    probability: 20,
    owner: '',
    close_date: '',
    next_step: ''
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    customerCode: '',
    stage: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: OpportunityRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    customer_code: row.customer_code,
    topic: row.topic,
    amount: row.amount,
    stage: row.stage,
    probability: row.probability,
    owner: row.owner,
    close_date: row.close_date,
    next_step: row.next_step
  }
  dialogVisible.value = true
}

function getRowActions(row: OpportunityRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'advance', label: '推进阶段', tone: 'primary', hidden: row.stage === 'won' || row.stage === 'lost' },
    { key: 'convert', label: '转报价', tone: 'success', hidden: row.stage === 'won' || row.stage === 'lost' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.stage === 'won' }
  ]
}

function handleRowAction(action: string, row: OpportunityRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'advance') {
    void advanceStage(row)
    return
  }

  if (action === 'convert') {
    void handleConvert(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.customer_code || !formModel.value.topic) {
    ElMessage.warning('请填写商机编号、客户和商机主题')
    return
  }

  await saveOpportunity({
    ...formModel.value,
    amount: Number(formModel.value.amount || 0),
    probability: Number(formModel.value.probability || 0)
  })
  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '商机已新增' : '商机已更新')
  await refresh()
}

async function advanceStage(row: OpportunityRecord) {
  const nextStageMap: Record<string, OpportunityRecord['stage']> = {
    initial: 'solution',
    solution: 'quotation',
    quotation: 'won'
  }
  const nextStage = nextStageMap[row.stage]
  if (!nextStage) return

  await saveOpportunity({
    ...row,
    stage: nextStage,
    probability: nextStage === 'won' ? 100 : Math.min(row.probability + 20, 90)
  })
  ElMessage.success('商机阶段已推进')
  await refresh()
}

async function handleConvert(row: OpportunityRecord) {
  await convertOpportunity(row.id)
  ElMessage.success('商机已转入报价协同')
  await refresh()
}
</script>
