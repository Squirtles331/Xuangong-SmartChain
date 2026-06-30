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
      <gi-button type="add" @click="openAdd">手工创建</gi-button>
      <el-button type="primary" style="margin-left: 8px" @click="$router.push('/mrp/result')">从 MRP 结果生成</el-button>
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="采购申请列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          stripe
          style="height: 100%"
        >
          <template #source="{ row }">
            <el-tag :type="row.source === 'mrp' ? 'primary' : 'info'" size="small">
              {{ row.source === 'mrp' ? 'MRP' : '手工' }}
            </el-tag>
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="purchaseRequestStatusOptions" />
          </template>

          <template #actions="{ row }">
            <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitApprove(row)">提交审核</el-button>
            <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="openConvert(row)">转采购订单</el-button>
            <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button v-if="row.status === 'draft'" type="danger" link size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PurchaseRequestFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <PurchaseRequestConvertDialog
      v-model:visible="convertVisible"
      v-model:form="convertForm"
      :current-request="currentRequest"
      :suppliers="supplierOptions"
      @submit="confirmConvert"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createPurchaseRequest,
  deletePurchaseRequest,
  getPurchaseRequestList,
  updatePurchaseRequest,
  type PurchaseRequest,
  type PurchaseRequestQuery
} from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import PurchaseRequestConvertDialog, { type PurchaseRequestConvertFormModel } from './PurchaseRequestConvertDialog.vue'
import PurchaseRequestFormDialog, { type PurchaseRequestFormModel, type PurchaseRequestLine } from './PurchaseRequestFormDialog.vue'

type PurchaseRequestRow = PurchaseRequest

const purchaseRequestStatusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'approved', label: '已审核', type: 'primary' as const },
  { value: 'ordered', label: '已转订单', type: 'success' as const },
  { value: 'rejected', label: '已驳回', type: 'warning' as const }
]

const supplierOptions = ['苏州精工钢材有限公司', '常州轴承制造厂', '无锡标准件有限公司', '南通铸造供应商']

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '申请编号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: purchaseRequestStatusOptions.map((item) => ({ label: item.label, value: item.value }))
    } as any
  },
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      clearable: true,
      options: [
        { label: 'MRP', value: 'mrp' },
        { label: '手工', value: 'manual' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PurchaseRequestRow>[] = [
  { prop: 'code', label: '申请编号', minWidth: 160 },
  { prop: 'dept', label: '申请部门', minWidth: 120 },
  { prop: 'reason', label: '申请原因', minWidth: 150 },
  { prop: 'need_date', label: '需求日期', minWidth: 120 },
  { label: '来源', minWidth: 90, slotName: 'source', align: 'center' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建日期', minWidth: 120 },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  code: '',
  status: '',
  source: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PurchaseRequestFormModel>(createDefaultFormModel())
const convertVisible = ref(false)
const currentRequest = ref<PurchaseRequestRow | null>(null)
const convertForm = ref<PurchaseRequestConvertFormModel>({
  supplier: supplierOptions[0],
  delivery: '',
  terms: '月结30天'
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PurchaseRequestRow>({
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
    dept: '生产部',
    reason: '生产需求',
    need_date: '',
    remark: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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

function openEdit(row: PurchaseRequestRow) {
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

async function submitDialog(lines: PurchaseRequestLine[]) {
  if (!formModel.value.need_date) {
    ElMessage.warning('请填写需求日期')
    return
  }

  if (!lines.length) {
    ElMessage.warning('请至少维护一条申请明细')
    return
  }

  const payload: Partial<PurchaseRequest> = {
    dept: formModel.value.dept,
    reason: formModel.value.reason,
    need_date: formModel.value.need_date,
    status: 'draft',
    source: 'manual',
    created_at: new Date().toISOString().slice(0, 10)
  }

  if (dialogMode.value === 'add') {
    await createPurchaseRequest({
      code: `PR${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Date.now()).slice(-4)}`,
      ...payload
    })
  } else {
    await updatePurchaseRequest(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}

async function submitApprove(row: PurchaseRequestRow) {
  await updatePurchaseRequest(row.id, { status: 'approved' })
  ElMessage.success('采购申请已提交审核')
  await refresh()
}

function openConvert(row: PurchaseRequestRow) {
  currentRequest.value = row
  convertForm.value = {
    supplier: supplierOptions[0],
    delivery: '',
    terms: '月结30天'
  }
  convertVisible.value = true
}

async function confirmConvert() {
  if (!currentRequest.value) return
  await updatePurchaseRequest(currentRequest.value.id, { status: 'ordered' })
  convertVisible.value = false
  ElMessage.success('已生成采购订单')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
