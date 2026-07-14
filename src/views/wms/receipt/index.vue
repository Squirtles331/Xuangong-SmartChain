<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="收货入库单列表"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
    @toolbar-action="handleToolbarAction"
  >
    <template #headerTop>
      <PageOwnershipNotice />
    </template>

    <template #beforeTable>
      <el-card header="MES / WMS / QMS 入库桥接" shadow="never" class="bridge-panel">
        <div class="bridge-caption">{{ bridgeData.note }}</div>

        <el-row :gutter="16" class="bridge-metrics">
          <el-col v-for="item in bridgeData.metrics" :key="item.label" :xs="24" :sm="8">
            <el-card shadow="hover" class="bridge-metric-card">
              <div class="bridge-metric-label">{{ item.label }}</div>
              <div class="bridge-metric-value" :style="{ color: item.color }">{{ item.value }}</div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :xs="24" :lg="14">
            <div class="bridge-section">
              <div class="bridge-section__title">完工入库确认关系</div>
              <div v-for="item in bridgeData.flow" :key="item.title" class="bridge-flow-item">
                <div class="bridge-flow-item__header">
                  <span class="bridge-flow-item__title">{{ item.title }}</span>
                  <el-tag size="small" effect="light" :type="getOwnerTagType(item.ownerSystem)">{{ item.ownerSystem }}</el-tag>
                </div>
                <div class="bridge-flow-item__desc">{{ item.description }}</div>
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :lg="10">
            <div class="bridge-section">
              <div class="bridge-section__title">最近完工确认摘要</div>
              <div v-for="item in bridgeData.records" :key="item.completionCode" class="bridge-record">
                <div class="bridge-record__header">
                  <span class="bridge-record__code">{{ item.completionCode }}</span>
                  <span class="bridge-record__wo">{{ item.woCode }}</span>
                </div>
                <div class="bridge-record__material">{{ item.material }}</div>
                <div class="bridge-record__extra">关联入库单：{{ item.receiptCode || '待生成' }}</div>
                <div class="bridge-record__tags">
                  <el-tag size="small" :type="getReceiptBridgeStatusType(item.receiptStatus)">{{ item.receiptStatus }}</el-tag>
                  <el-tag size="small" :type="getQualityStatusType(item.qualityStatus)">{{ item.qualityStatus }}</el-tag>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </template>

    <template #type="{ row }">
      <StatusTag :value="row.type" :options="receiptTypeOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="receiptStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ReceiptFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { createReceipt, deleteReceipt, getReceiptList, getWmsBridgeSummary, updateReceipt } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import ReceiptFormDialog, { type ReceiptFormModel } from './ReceiptFormDialog.vue'

interface ReceiptRow {
  id: string
  code: string
  type: string
  material: string
  qty: number
  warehouse: string
  status: string
  createdAt: string
}

interface BridgeMetric {
  label: string
  value: string
  color: string
}

interface BridgeFlowItem {
  title: string
  ownerSystem: string
  description: string
}

interface ReceiptBridgeRecord {
  completionCode: string
  woCode: string
  material: string
  receiptCode: string
  receiptStatus: string
  qualityStatus: string
}

interface ReceiptBridgeData {
  metrics: BridgeMetric[]
  flow: BridgeFlowItem[]
  records: ReceiptBridgeRecord[]
  note: string
}

const receiptTypeOptions = [
  { value: 'purchase', label: '采购入库', type: 'primary' as const },
  { value: 'production', label: '生产入库', type: 'success' as const }
]

const receiptStatusOptions = [
  { value: 'pending', label: '待入库', type: 'warning' as const },
  { value: 'completed', label: '已入库', type: 'success' as const }
]

const warehouseOptions = [
  { label: '原材料仓', value: '原材料仓' },
  { label: '标准件仓', value: '标准件仓' },
  { label: '半成品仓', value: '半成品仓' },
  { label: '成品仓', value: '成品仓' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '入库单号', field: 'code', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '入库类型',
    field: 'type',
    props: {
      options: receiptTypeOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: receiptStatusOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<ReceiptRow>[] = [
  { prop: 'code', label: '入库单号', width: 160 },
  { label: '入库类型', minWidth: 110, slotName: 'type', align: 'center' },
  { prop: 'material', label: '物料名称', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'warehouse', label: '仓库', width: 110 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const queryParams = ref({
  code: '',
  type: '',
  status: ''
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ReceiptRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getReceiptList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.code || undefined,
      type: queryParams.value.type || undefined,
      status: queryParams.value.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteReceipt(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReceiptFormModel>(createDefaultForm())
const bridgeData = ref<ReceiptBridgeData>(createDefaultBridgeData())

function mapRow(item: any): ReceiptRow {
  return {
    id: String(item.id),
    code: item.code || '',
    type: item.type || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    warehouse: item.warehouse || '',
    status: item.status || '',
    createdAt: item.created_at || ''
  }
}

function createDefaultBridgeData(): ReceiptBridgeData {
  return {
    metrics: [],
    flow: [],
    records: [],
    note: ''
  }
}

function handleReset() {
  queryParams.value = {
    code: '',
    type: '',
    status: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('导出成功')
  }
}

function getOwnerTagType(ownerSystem: string) {
  if (ownerSystem === 'WMS') return 'primary'
  if (ownerSystem === 'QMS') return 'success'
  return 'warning'
}

function getReceiptBridgeStatusType(status: string) {
  if (status === '待生成入库单') return 'warning'
  if (status === '待入库') return 'primary'
  return 'success'
}

function getQualityStatusType(status: string) {
  if (status === '待完工确认') return 'info'
  if (status === '待质量放行') return 'warning'
  return 'success'
}

function createDefaultForm(): ReceiptFormModel {
  return {
    id: '',
    code: '',
    type: 'purchase',
    material: '',
    qty: 1,
    warehouse: warehouseOptions[0].value,
    status: 'pending'
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: ReceiptRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    type: row.type,
    material: row.material,
    qty: row.qty,
    warehouse: row.warehouse,
    status: row.status
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ReceiptRow) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createReceipt({
      code: formModel.value.code,
      type: formModel.value.type,
      material: formModel.value.material,
      qty: formModel.value.qty,
      warehouse: formModel.value.warehouse,
      status: formModel.value.status
    })
    ElMessage.success('入库单创建成功')
  } else {
    await updateReceipt(formModel.value.id, {
      code: formModel.value.code,
      type: formModel.value.type,
      material: formModel.value.material,
      qty: formModel.value.qty,
      warehouse: formModel.value.warehouse,
      status: formModel.value.status
    })
    ElMessage.success('入库单更新成功')
  }

  dialogVisible.value = false
  await refresh()
}

async function loadBridgeSummary() {
  const response = await getWmsBridgeSummary()
  bridgeData.value = response.data.receipt || createDefaultBridgeData()
}

onMounted(() => {
  void loadBridgeSummary()
})
</script>

<style scoped>
.bridge-panel {
  margin-bottom: 16px;
}

.bridge-caption {
  margin-bottom: 16px;
  color: #475569;
  line-height: 1.7;
}

.bridge-metrics {
  margin-bottom: 16px;
}

.bridge-metric-card :deep(.el-card__body) {
  padding: 14px 16px;
}

.bridge-metric-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.bridge-metric-value {
  font-size: 26px;
  font-weight: 700;
}

.bridge-section {
  height: 100%;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fbfdff;
}

.bridge-section__title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.bridge-flow-item + .bridge-flow-item,
.bridge-record + .bridge-record {
  margin-top: 12px;
}

.bridge-flow-item,
.bridge-record {
  padding: 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.bridge-flow-item__header,
.bridge-record__header,
.bridge-record__tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bridge-flow-item__header {
  justify-content: space-between;
}

.bridge-flow-item__title,
.bridge-record__code {
  font-weight: 600;
  color: #1f2937;
}

.bridge-flow-item__desc,
.bridge-record__material,
.bridge-record__wo,
.bridge-record__extra {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .bridge-section {
    margin-bottom: 12px;
  }
}
</style>
