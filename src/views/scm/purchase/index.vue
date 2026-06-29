<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="sf"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="$router.push('/scm/purchase/create')">新建采购订单</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe style="height: 100%">
      <template #progress="{ row }">
        <div class="progress-cell">
          <el-progress
            :percentage="row.qty > 0 ? Math.round((row.received / row.qty) * 100) : 0"
            :stroke-width="6"
            :color="row.qty > 0 && row.received >= row.qty ? '#67c23a' : '#409eff'"
          />
          <span class="progress-text">{{ row.received }}/{{ row.qty }}</span>
        </div>
      </template>
      <template #delivery="{ row }">
        <span :class="{ 'overdue-text': isOverdue(row) }">{{ row.delivery }}</span>
        <el-tag v-if="isOverdue(row)" type="danger" size="small" class="overdue-tag">已逾期</el-tag>
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="PO_STATUS" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="receive(row)">收货</el-button>
        <el-button v-if="row.status === 'sent'" type="danger" link size="small" @click="closePO(row)">关闭</el-button>
      </template>
    </gi-table>

    <PurchaseReceiveDialog v-model:visible="receiveVisible" v-model:form="receiveForm" :current-order="receiveCurrent" @submit="confirmReceive" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getPurchaseOrderList, updatePurchaseOrder, type PurchaseOrder, type PurchaseOrderQuery } from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import PurchaseReceiveDialog, { type PurchaseReceiveFormModel } from './PurchaseReceiveDialog.vue'

const PO_STATUS = [
  { value: 'sent', label: '已发送', type: 'warning' as const },
  { value: 'partial', label: '部分收货', type: 'primary' as const },
  { value: 'received', label: '已收货', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

interface PORow {
  id: string
  code: string
  supplier: string
  material: string
  qty: number
  received: number
  remain: number
  delivery: string
  status: string
}

const sf = ref<FormInstance | null>()
const searchForm = ref({
  code: '',
  supplier: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '订单编号', field: 'code' } as any,
  { type: 'input', label: '供应商', field: 'supplier' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '已发送', value: 'sent' },
        { label: '部分收货', value: 'partial' },
        { label: '已收货', value: 'received' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<PORow>[] = [
  { prop: 'code', label: '订单编号', width: 160 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'qty', label: '订购数量', minWidth: 100, align: 'center' },
  { label: '收货进度', minWidth: 160, slotName: 'progress' },
  { label: '交期', width: 130, slotName: 'delivery' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<PORow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PurchaseOrderQuery = {
      page,
      page_size: size,
      code: searchForm.value.code || undefined,
      supplier: searchForm.value.supplier || undefined,
      status: searchForm.value.status || undefined
    }
    const res = await getPurchaseOrderList(params)
    return {
      list: res.data.items.map(mapPORow),
      total: res.data.total
    }
  }
})

function mapPORow(po: PurchaseOrder): PORow {
  return {
    id: String(po.id),
    code: po.code,
    supplier: po.supplier,
    material: po.material,
    qty: po.qty,
    received: po.received,
    remain: po.remain,
    delivery: po.delivery,
    status: po.status
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', supplier: '', status: '' }
  search()
}

const receiveVisible = ref(false)
const receiveCurrent = ref<PORow | null>(null)
const receiveForm = ref<PurchaseReceiveFormModel>({ qty: 1, lot: '' })

function receive(row: PORow) {
  receiveCurrent.value = row
  receiveForm.value = { qty: row.remain, lot: '' }
  receiveVisible.value = true
}

async function confirmReceive() {
  if (receiveCurrent.value) {
    receiveCurrent.value.received += receiveForm.value.qty
    receiveCurrent.value.remain -= receiveForm.value.qty
    const newStatus = receiveCurrent.value.remain === 0 ? 'received' : 'partial'
    receiveCurrent.value.status = newStatus
    await updatePurchaseOrder(receiveCurrent.value.id, {
      received: receiveCurrent.value.received,
      remain: receiveCurrent.value.remain,
      status: newStatus as any
    })
  }
  receiveVisible.value = false
  ElMessage.success('收货成功')
}

async function closePO(row: PORow) {
  row.status = 'closed'
  await updatePurchaseOrder(row.id, { status: 'closed' as const })
  ElMessage.success('订单已关闭')
}

function isOverdue(row: PORow) {
  if (row.status === 'received' || row.status === 'closed') return false
  return new Date(row.delivery) < new Date()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 130px;
}

.progress-text {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.overdue-text {
  color: #f56c6c;
  font-weight: 600;
}

.overdue-tag {
  margin-left: 4px;
}
</style>
