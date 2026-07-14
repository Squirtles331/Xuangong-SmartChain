<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="生产领料单列表"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
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
      <el-card header="MES / WMS 领料桥接" shadow="never" class="bridge-panel">
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
              <div class="bridge-section__title">领料申请 / 执行关系</div>
              <div v-for="item in bridgeData.flow" :key="item.title" class="bridge-flow-item">
                <div class="bridge-flow-item__header">
                  <span class="bridge-flow-item__title">{{ item.title }}</span>
                  <el-tag size="small" effect="light" type="primary">{{ item.ownerSystem }}</el-tag>
                </div>
                <div class="bridge-flow-item__desc">{{ item.description }}</div>
              </div>
            </div>
          </el-col>

          <el-col :xs="24" :lg="10">
            <div class="bridge-section">
              <div class="bridge-section__title">倒冲记录只读摘要</div>
              <div class="bridge-mini-metrics">
                <div v-for="item in bridgeData.backflushSummary" :key="item.label" class="bridge-mini-metric">
                  <span>{{ item.label }}</span>
                  <strong :style="{ color: item.color }">{{ item.value }}</strong>
                </div>
              </div>

              <div v-for="item in bridgeData.records" :key="item.requestCode" class="bridge-record">
                <div class="bridge-record__header">
                  <span class="bridge-record__code">{{ item.requestCode }}</span>
                  <span class="bridge-record__wo">{{ item.woCode }}</span>
                </div>
                <div class="bridge-record__material">{{ item.material }}</div>
                <div class="bridge-record__tags">
                  <el-tag size="small" type="info">{{ item.requestStatus }}</el-tag>
                  <el-tag size="small" :type="getPickingStatusType(item.pickingStatus)">{{ item.pickingStatus }}</el-tag>
                  <el-tag size="small" :type="getBackflushStatusType(item.backflushStatus)">{{ item.backflushStatus }}</el-tag>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </template>

    <template #status="{ row }">
      <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'picked' ? 'primary' : 'success'" size="small">
        {{ row.status === 'pending' ? '待拣料' : row.status === 'picked' ? '已拣料' : '已出库' }}
      </el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <PickingFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { createPicking, deletePicking, getPickingList, getWmsBridgeSummary, updatePicking } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import PickingFormDialog, { type PickingFormModel } from './PickingFormDialog.vue'

interface PickingRow {
  id: string
  woCode: string
  material: string
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

interface BridgeRecord {
  requestCode: string
  woCode: string
  material: string
  requestStatus: string
  pickingStatus: string
  backflushStatus: string
}

interface PickingBridgeData {
  metrics: BridgeMetric[]
  flow: BridgeFlowItem[]
  records: BridgeRecord[]
  backflushSummary: BridgeMetric[]
  note: string
}

const warehouseOptions = [
  { label: '原材料仓', value: '原材料仓' },
  { label: '标准件仓', value: '标准件仓' },
  { label: '半成品仓', value: '半成品仓' },
  { label: '成品仓', value: '成品仓' }
]

const queryParams = ref({
  woCode: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'woCode', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待拣料', value: 'pending' },
        { label: '已拣料', value: 'picked' },
        { label: '已出库', value: 'completed' }
      ],
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<PickingRow>[] = [
  { prop: 'woCode', label: '工单号', width: 170 },
  { prop: 'material', label: '产品名称', minWidth: 160 },
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

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PickingRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getPickingList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.woCode || undefined,
      status: queryParams.value.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePicking(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PickingFormModel>(createDefaultForm())
const bridgeData = ref<PickingBridgeData>(createDefaultBridgeData())

function mapRow(item: any): PickingRow {
  return {
    id: String(item.id),
    woCode: item.wo_code || '',
    material: item.material || '',
    warehouse: item.warehouse || '',
    status: item.status || '',
    createdAt: item.created_at || ''
  }
}

function createDefaultBridgeData(): PickingBridgeData {
  return {
    metrics: [],
    flow: [],
    records: [],
    backflushSummary: [],
    note: ''
  }
}

function handleReset() {
  queryParams.value = {
    woCode: '',
    status: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('导出成功')
  }
}

function getPickingStatusType(status: string) {
  if (status === '待拣料') return 'warning'
  if (status === '已拣料') return 'primary'
  return 'success'
}

function getBackflushStatusType(status: string) {
  return status === '待倒冲' ? 'warning' : 'success'
}

function createDefaultForm(): PickingFormModel {
  return {
    id: '',
    woCode: '',
    material: '',
    warehouse: warehouseOptions[0].value,
    status: 'pending'
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: PickingRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    woCode: row.woCode,
    material: row.material,
    warehouse: row.warehouse,
    status: row.status
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: PickingRow) {
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
    await createPicking({
      woCode: formModel.value.woCode,
      material: formModel.value.material,
      warehouse: formModel.value.warehouse,
      status: formModel.value.status
    })
    ElMessage.success('领料单创建成功')
  } else {
    await updatePicking(formModel.value.id, {
      wo_code: formModel.value.woCode,
      material: formModel.value.material,
      warehouse: formModel.value.warehouse,
      status: formModel.value.status
    })
    ElMessage.success('领料单更新成功')
  }

  dialogVisible.value = false
  await refresh()
}

async function loadBridgeSummary() {
  const response = await getWmsBridgeSummary()
  bridgeData.value = response.data.picking || createDefaultBridgeData()
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

.bridge-flow-item {
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
.bridge-record__wo {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

.bridge-mini-metrics {
  margin-bottom: 12px;
}

.bridge-mini-metric {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed #e5e7eb;
  color: #475569;
  font-size: 13px;
}

.bridge-mini-metric:last-child {
  border-bottom: none;
}

.bridge-record {
  padding: 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .bridge-section {
    margin-bottom: 12px;
  }
}
</style>
