<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd">手动创建</gi-button>
      <el-button style="margin-left: 8px" type="primary" @click="$router.push('/mrp/result')">从 MRP 生成</el-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="采购申请" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="PR_STATUS" />
          </template>
          <template #source="{ row }">
            <el-tag :type="row.source === 'mrp' ? 'primary' : 'info'" size="small">
              {{ row.source === 'mrp' ? 'MRP' : '手动' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitApprove(row)">提交审核</el-button>
            <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="convertToPO(row)">转采购订单</el-button>
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button v-if="row.status === 'draft'" type="delete" @click="remove(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PurchaseRequestFormDialog v-model:visible="dialogVisible" v-model:form="formModel" @submit="submitDialog" :mode="dialogMode" />
    <PurchaseRequestConvertDialog
      v-model:visible="poVisible"
      v-model:form="poForm"
      :current-request="currentPR"
      :suppliers="suppliers"
      @submit="confirmPO"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createPurchaseRequest,
  deletePurchaseRequest,
  getPurchaseRequestList,
  type PurchaseRequest,
  type PurchaseRequestQuery,
  updatePurchaseRequest
} from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import PurchaseRequestConvertDialog, { type PurchaseRequestConvertFormModel } from './PurchaseRequestConvertDialog.vue'
import PurchaseRequestFormDialog, { type PurchaseRequestFormModel, type PurchaseRequestLine } from './PurchaseRequestFormDialog.vue'

const PR_STATUS = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'approved', label: '已审核', type: 'primary' as const },
  { value: 'ordered', label: '已转订单', type: 'success' as const },
  { value: 'rejected', label: '已驳回', type: 'warning' as const }
]

interface PRRow extends PurchaseRequest {}

const queryParams = ref({
  code: '',
  status: '',
  source: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PurchaseRequestFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '申请编号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已审核', value: 'approved' },
        { label: '已转订单', value: 'ordered' },
        { label: '已驳回', value: 'rejected' }
      ],
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      options: [
        { label: 'MRP', value: 'mrp' },
        { label: '手动', value: 'manual' }
      ],
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<PRRow>[] = [
  { prop: 'code', label: '申请编号', width: 160 },
  { prop: 'dept', label: '申请部门', width: 100 },
  { prop: 'reason', label: '申请原因', width: 130 },
  { prop: 'need_date', label: '需求日期', width: 110 },
  { label: '来源', minWidth: 70, slotName: 'source', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建时间', width: 110 },
  { label: '操作', minWidth: 250, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PRRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PurchaseRequestQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      status: queryParams.value.status || undefined,
      source: queryParams.value.source || undefined
    }
    const res = await getPurchaseRequestList(params)
    return res.data
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

function handleReset() {
  queryParams.value = { code: '', status: '', source: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PRRow) {
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

async function submitDialog(_lines: PurchaseRequestLine[]) {
  if (!formModel.value.need_date) {
    ElMessage.warning('请填写需求日期')
    return
  }

  const payload = {
    dept: formModel.value.dept,
    reason: formModel.value.reason,
    need_date: formModel.value.need_date,
    status: 'draft' as const,
    source: 'manual' as const,
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

function remove(row: PRRow) {
  onDelete(row)
}

async function submitApprove(row: PRRow) {
  row.status = 'approved'
  await updatePurchaseRequest(row.id, { status: 'approved' })
  ElMessage.success('已提交审核')
}

const poVisible = ref(false)
const currentPR = ref<PRRow | null>(null)
const poForm = ref<PurchaseRequestConvertFormModel>({
  supplier: '苏州钢材有限公司',
  delivery: '',
  terms: '30'
})
const suppliers = ['苏州钢材有限公司', '常州轴承制造厂', '无锡标准件有限公司', '南通铸造供应商']

function convertToPO(row: PRRow) {
  currentPR.value = row
  poVisible.value = true
}

async function confirmPO() {
  if (currentPR.value) {
    currentPR.value.status = 'ordered'
    await updatePurchaseRequest(currentPR.value.id, { status: 'ordered' })
  }
  poVisible.value = false
  ElMessage.success(`已生成采购订单 PO${new Date().toISOString().slice(0, 10).replace(/-/g, '')}001`)
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
