<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="采购申请"
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
    <template #tool>
      <el-space wrap>
        <el-button type="primary" @click="openAdd">手工创建</el-button>
        <el-button @click="router.push('/erp/material-plan/mrp-result')">查看 ERP 建议</el-button>
        <el-button @click="refresh">刷新</el-button>
      </el-space>
    </template>

    <template #source="{ row }">
      <StatusTag :value="row.source" :options="sourceOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <PurchaseRequestFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
      <PurchaseRequestConvertDialog
        v-model:visible="convertVisible"
        v-model:form="convertForm"
        :current-request="currentRequest"
        :suppliers="supplierOptions"
        @submit="confirmConvert"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  createPurchaseRequest,
  deletePurchaseRequest,
  getPurchaseRequestList,
  updatePurchaseRequest,
  type PurchaseRequestQuery,
  type PurchaseRequestRecord
} from '@/static/services/srm'
import PurchaseRequestConvertDialog, { type PurchaseRequestConvertFormModel } from './PurchaseRequestConvertDialog.vue'
import PurchaseRequestFormDialog, { type PurchaseRequestFormModel, type PurchaseRequestLine } from './PurchaseRequestFormDialog.vue'

defineOptions({
  name: 'SrmPurchaseRequestPage'
})

const router = useRouter()

const supplierOptions = ['苏州精工轴承有限公司', '常州联传机电制造厂', '无锡标准件供应商', '南通铸造协同工厂']

const sourceOptions = [
  { value: 'erp', label: 'ERP 来源', type: 'primary' as const },
  { value: 'manual', label: '手工发起', type: 'info' as const }
]

const statusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'approved', label: '已审核', type: 'primary' as const },
  { value: 'ordered', label: '已转订单', type: 'success' as const },
  { value: 'rejected', label: '已驳回', type: 'warning' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '申请编号', field: 'code', props: { clearable: true, placeholder: '申请编号 / 来源单号 / 物料摘要' } as never },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { clearable: true, options: statusOptions.map((item) => ({ label: item.label, value: item.value })) } as never
  },
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: { clearable: true, options: sourceOptions.map((item) => ({ label: item.label, value: item.value })) } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PurchaseRequestRecord>[] = [
  { prop: 'code', label: '申请编号', minWidth: 150 },
  { prop: 'dept', label: '申请部门', minWidth: 120 },
  { prop: 'item_summary', label: '申请物料', minWidth: 180 },
  { prop: 'item_count', label: '物料项数', minWidth: 90, align: 'center' },
  { prop: 'source_code', label: '来源单号', minWidth: 160 },
  { label: '来源类型', minWidth: 100, slotName: 'source', align: 'center' },
  { prop: 'need_date', label: '需求日期', minWidth: 120, align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建日期', minWidth: 120, align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  code: string
  status: '' | PurchaseRequestRecord['status']
  source: '' | PurchaseRequestRecord['source']
}>({
  code: '',
  status: '',
  source: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<PurchaseRequestFormModel>(createDefaultFormModel())
const convertVisible = ref(false)
const currentRequest = ref<PurchaseRequestRecord | null>(null)
const convertForm = ref<PurchaseRequestConvertFormModel>({
  supplier: supplierOptions[0],
  delivery: '',
  terms: '月结30天'
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PurchaseRequestRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PurchaseRequestQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      status: queryParams.status || undefined,
      source: queryParams.source || undefined
    }
    const response = await getPurchaseRequestList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePurchaseRequest(id)))
})

function createDefaultFormModel(): PurchaseRequestFormModel {
  return {
    id: '',
    dept: '生产计划部',
    reason: '生产需求',
    need_date: '',
    remark: ''
  }
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    status: '',
    source: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PurchaseRequestRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    dept: row.dept,
    reason: row.reason,
    need_date: row.need_date,
    remark: ''
  }
  dialogVisible.value = true
}

function getRowActions(row: PurchaseRequestRecord): CrudRowActionItem[] {
  return [
    { key: 'submit', label: '提交协同', tone: 'primary', hidden: row.status !== 'draft' },
    { key: 'convert', label: '转采购订单', tone: 'success', hidden: row.status !== 'approved' },
    { key: 'edit', label: '编辑', tone: 'primary', hidden: row.status !== 'draft' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status !== 'draft' }
  ]
}

function handleRowAction(action: string, row: PurchaseRequestRecord) {
  if (action === 'submit') {
    void submitApprove(row)
    return
  }

  if (action === 'convert') {
    openConvert(row)
    return
  }

  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog(lines: PurchaseRequestLine[]) {
  if (!formModel.value.need_date) {
    ElMessage.warning('请填写需求日期')
    return
  }

  if (!lines.length) {
    ElMessage.warning('请至少维护一条申请明细')
    return
  }

  const itemSummary = lines
    .map((item) => item.material.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join('、')

  const payload: Partial<PurchaseRequestRecord> = {
    dept: formModel.value.dept,
    reason: formModel.value.reason,
    need_date: formModel.value.need_date,
    item_summary: itemSummary || '待补充物料',
    item_count: lines.length,
    source: 'manual',
    source_code: 'MANUAL-NEW',
    status: 'draft',
    created_at: new Date().toISOString().slice(0, 10)
  }

  if (dialogMode.value === 'add') {
    await createPurchaseRequest(payload)
    ElMessage.success('采购申请已新增')
  } else {
    await updatePurchaseRequest(formModel.value.id, payload)
    ElMessage.success('采购申请已更新')
  }

  dialogVisible.value = false
  await refresh()
}

async function submitApprove(row: PurchaseRequestRecord) {
  await updatePurchaseRequest(row.id, { status: 'approved' })
  ElMessage.success('采购申请已提交协同')
  await refresh()
}

function openConvert(row: PurchaseRequestRecord) {
  currentRequest.value = row
  convertForm.value = {
    supplier: supplierOptions[0],
    delivery: row.need_date,
    terms: '月结30天'
  }
  convertVisible.value = true
}

async function confirmConvert() {
  if (!currentRequest.value) return

  await updatePurchaseRequest(currentRequest.value.id, { status: 'ordered' })
  convertVisible.value = false
  ElMessage.success('已生成采购协同订单')
  await refresh()
}
</script>

<style scoped></style>
