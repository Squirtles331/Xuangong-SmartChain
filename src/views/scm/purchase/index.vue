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
      <gi-button type="add" @click="openAdd">新增采购订单</gi-button>
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="采购订单列表" :columns="columns" @refresh="refresh">
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
          <template #progress="{ row }">
            <div class="progress-cell">
              <el-progress
                :percentage="row.qty > 0 ? Math.round((row.received / row.qty) * 100) : 0"
                :stroke-width="6"
                :color="row.received >= row.qty ? '#67c23a' : '#409eff'"
              />
              <span class="progress-text">{{ row.received }}/{{ row.qty }}</span>
            </div>
          </template>

          <template #delivery="{ row }">
            <span :class="{ overdue: isOverdue(row) }">{{ row.delivery }}</span>
            <el-tag v-if="isOverdue(row)" type="danger" size="small" class="delivery-tag">已逾期</el-tag>
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="purchaseOrderStatusOptions" />
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button type="primary" link size="small" @click="onPrint(row)">打印</el-button>
            <el-button v-if="row.status !== 'received' && row.status !== 'closed'" type="primary" link size="small" @click="openReceive(row)">
              收货
            </el-button>
            <el-button v-if="row.status === 'sent' || row.status === 'partial'" type="warning" link size="small" @click="closeOrder(row)">
              关闭
            </el-button>
            <el-button v-if="row.status === 'closed'" type="danger" link size="small" @click="onDelete(row)">删除</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PurchaseFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <PurchaseReceiveDialog v-model:visible="receiveVisible" v-model:form="receiveForm" :current-order="currentOrder" @submit="confirmReceive" />
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
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderList,
  updatePurchaseOrder,
  type PurchaseOrder,
  type PurchaseOrderQuery
} from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import { usePrint } from '@/print/usePrint'
import PurchaseFormDialog, { type PurchaseFormModel } from './PurchaseFormDialog.vue'
import PurchaseReceiveDialog, { type PurchaseReceiveFormModel } from './PurchaseReceiveDialog.vue'

type PurchaseOrderRow = PurchaseOrder

const { print } = usePrint()

/** 采购订单 → 打印模板数据结构 */
function toPrintData(row: PurchaseOrderRow) {
  const price = 12.5 // 示例单价，真实场景取自明细
  return {
    supplierName: row.supplier,
    orderNo: row.code,
    orderDate: row.delivery,
    items: [
      {
        materialName: row.material,
        qty: row.qty,
        price,
        amount: row.qty * price
      }
    ]
  }
}

async function onPrint(row: PurchaseOrderRow) {
  try {
    await print({ templateKey: 'scm.purchase.order', data: toPrintData(row), output: 'browser' })
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '打印失败')
  }
}

const purchaseOrderStatusOptions = [
  { value: 'sent', label: '已下发', type: 'warning' as const },
  { value: 'partial', label: '部分收货', type: 'primary' as const },
  { value: 'received', label: '已收货', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '订单编号', field: 'code', props: { clearable: true } as any },
  { type: 'input', label: '供应商', field: 'supplier', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: purchaseOrderStatusOptions.map((item) => ({ label: item.label, value: item.value }))
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PurchaseOrderRow>[] = [
  { prop: 'code', label: '订单编号', minWidth: 160 },
  { prop: 'supplier', label: '供应商', minWidth: 160 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '采购数量', minWidth: 100, align: 'center' },
  { label: '收货进度', minWidth: 180, slotName: 'progress' },
  { label: '交期', minWidth: 140, slotName: 'delivery' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  code: '',
  supplier: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PurchaseFormModel>(createDefaultFormModel())
const currentOrder = ref<PurchaseOrderRow | null>(null)
const receiveVisible = ref(false)
const receiveForm = ref<PurchaseReceiveFormModel>({ qty: 1, lot: '' })

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PurchaseOrderRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PurchaseOrderQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      supplier: queryParams.supplier || undefined,
      status: queryParams.status || undefined
    }
    const response = await getPurchaseOrderList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePurchaseOrder(id)))
})

function createDefaultFormModel(): PurchaseFormModel {
  return {
    id: '',
    code: '',
    supplier: '',
    material: '',
    qty: 1,
    received: 0,
    delivery: '',
    status: 'sent'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    code: '',
    supplier: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PurchaseOrderRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    supplier: row.supplier,
    material: row.material,
    qty: row.qty,
    received: row.received,
    delivery: row.delivery,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.supplier || !formModel.value.material) {
    ElMessage.warning('请填写订单编号、供应商和物料名称')
    return
  }

  const received = Number(formModel.value.received || 0)
  const qty = Number(formModel.value.qty || 0)
  const remain = Math.max(qty - received, 0)
  const status = formModel.value.status === 'closed' ? 'closed' : remain === 0 ? 'received' : received > 0 ? 'partial' : 'sent'

  const payload: Partial<PurchaseOrder> = {
    code: formModel.value.code,
    supplier: formModel.value.supplier,
    material: formModel.value.material,
    qty,
    received,
    remain,
    delivery: formModel.value.delivery,
    status
  }

  if (dialogMode.value === 'add') {
    await createPurchaseOrder(payload)
  } else {
    await updatePurchaseOrder(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}

function openReceive(row: PurchaseOrderRow) {
  currentOrder.value = row
  receiveForm.value = {
    qty: row.remain || 1,
    lot: ''
  }
  receiveVisible.value = true
}

async function confirmReceive() {
  if (!currentOrder.value) return
  if (receiveForm.value.qty <= 0 || receiveForm.value.qty > currentOrder.value.remain) {
    ElMessage.warning('收货数量不合法')
    return
  }

  const received = currentOrder.value.received + receiveForm.value.qty
  const remain = currentOrder.value.qty - received
  const status = remain === 0 ? 'received' : 'partial'

  await updatePurchaseOrder(currentOrder.value.id, {
    received,
    remain,
    status
  })

  receiveVisible.value = false
  ElMessage.success('收货完成')
  await refresh()
}

async function closeOrder(row: PurchaseOrderRow) {
  await updatePurchaseOrder(row.id, { status: 'closed' })
  ElMessage.success('采购订单已关闭')
  await refresh()
}

function isOverdue(row: PurchaseOrderRow) {
  if (row.status === 'received' || row.status === 'closed') return false
  return new Date(row.delivery).getTime() < Date.now()
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
}

.progress-text {
  color: #909399;
  font-size: 12px;
  white-space: nowrap;
}

.overdue {
  color: #f56c6c;
  font-weight: 600;
}

.delivery-tag {
  margin-left: 6px;
}
</style>
