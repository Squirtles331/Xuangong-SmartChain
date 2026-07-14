<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="库存调拨单列表"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    add-text="新建库存调拨单"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #headerTop>
      <PageOwnershipNotice />
    </template>

    <template #beforeTable>
      <el-card header="在途库存概览" shadow="never" style="margin-bottom: 16px">
        <el-row :gutter="16">
          <el-col v-for="item in transitItems" :key="item.code" :span="8">
            <el-card shadow="hover" class="transit-card">
              <div class="transit-header">
                <span class="transit-code">{{ item.code }}</span>
                <el-tag type="primary" size="small">在途</el-tag>
              </div>
              <div class="transit-body">
                <div class="transit-info"><span>物料：</span>{{ item.material }}</div>
                <div class="transit-info"><span>数量：</span>{{ item.qty }}</div>
                <div class="transit-info"><span>路线：</span>{{ item.from_wh }} -> {{ item.to_wh }}</div>
                <div class="transit-info"><span>发出时间：</span>{{ item.out_time || '-' }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </template>

    <template #status="{ row }">
      <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'transit' ? 'primary' : 'success'" size="small">
        {{ row.status === 'pending' ? '待调出' : row.status === 'transit' ? '在途' : '已完成' }}
      </el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <TransferFormDialog v-model:visible="dialogVisible" v-model:form="formModel" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { createTransfer, getTransferList, updateTransfer } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import TransferFormDialog, { type TransferFormModel } from './TransferFormDialog.vue'

interface TransferRow {
  id: string
  code: string
  material: string
  qty: number
  from_wh: string
  to_wh: string
  status: string
  out_time?: string
}

const queryParams = reactive({
  code: '',
  fromWarehouse: '',
  toWarehouse: '',
  status: ''
})

const warehouseOptions = ['原材料仓', '标准件仓', '半成品仓', '成品仓', '机加线边仓', '装配线边仓', '发货暂存区'].map((item) => ({
  label: item,
  value: item
}))

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '调拨单号', field: 'code', props: { clearable: true } as any },
  { type: 'select-v2', label: '调出仓库', field: 'fromWarehouse', props: { options: warehouseOptions, clearable: true } as any },
  { type: 'select-v2', label: '调入仓库', field: 'toWarehouse', props: { options: warehouseOptions, clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '待调出', value: 'pending' },
        { label: '在途', value: 'transit' },
        { label: '已完成', value: 'completed' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const { tableData, pagination, loading, search, refresh } = useTable<TransferRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getTransferList({
      pageNum: page,
      pageSize: size,
      code: queryParams.code || undefined,
      fromWarehouse: queryParams.fromWarehouse || undefined,
      toWarehouse: queryParams.toWarehouse || undefined,
      status: queryParams.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  }
})

const transitItems = computed(() => tableData.value.filter((item) => item.status === 'transit'))

const columns: TableColumnItem<TransferRow>[] = [
  { prop: 'code', label: '调拨单号', width: 160 },
  { prop: 'material', label: '物料名称', minWidth: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'from_wh', label: '调出仓库', width: 120 },
  { prop: 'to_wh', label: '调入仓库', width: 120 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, slotName: 'actions', align: 'center' }
]

const dialogVisible = ref(false)
const formModel = ref<TransferFormModel>(createDefaultForm())

function mapRow(item: any): TransferRow {
  return {
    id: String(item.id),
    code: item.code || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    from_wh: item.from_wh || '',
    to_wh: item.to_wh || '',
    status: item.status || '',
    out_time: item.out_time || ''
  }
}

function createDefaultForm(): TransferFormModel {
  return {
    material: '',
    qty: 1,
    from_wh: '原材料仓',
    to_wh: '机加线边仓'
  }
}

function handleReset() {
  Object.assign(queryParams, { code: '', fromWarehouse: '', toWarehouse: '', status: '' })
  search()
}

function openAdd() {
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function getRowActions(row: TransferRow): CrudRowActionItem[] {
  return [
    { key: 'out', label: '调出确认', tone: 'primary', hidden: row.status !== 'pending' },
    { key: 'in', label: '调入确认', tone: 'success', hidden: row.status !== 'transit' }
  ]
}

function handleRowAction(action: string, row: TransferRow) {
  if (action === 'out') {
    void confirmOut(row)
    return
  }

  if (action === 'in') {
    void confirmIn(row)
  }
}

async function submitDialog() {
  await createTransfer({
    material: formModel.value.material,
    qty: formModel.value.qty,
    from_wh: formModel.value.from_wh,
    to_wh: formModel.value.to_wh,
    status: 'pending',
    out_time: ''
  })

  dialogVisible.value = false
  ElMessage.success('调拨单已创建')
  await refresh()
}

async function confirmOut(row: TransferRow) {
  const outTime = new Date().toLocaleString('zh-CN')
  await updateTransfer(row.id, { status: 'transit', out_time: outTime })
  row.status = 'transit'
  row.out_time = outTime
  ElMessage.success('调出确认成功')
}

async function confirmIn(row: TransferRow) {
  await updateTransfer(row.id, { status: 'completed' })
  row.status = 'completed'
  ElMessage.success('调入确认成功，库存已更新')
}
</script>

<style scoped>
.transit-card :deep(.el-card__body) {
  padding: 12px 16px;
}

.transit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.transit-code {
  font-weight: 600;
  font-size: 14px;
}

.transit-body {
  font-size: 12px;
  color: #606266;
}

.transit-info {
  line-height: 22px;
}

.transit-info span {
  color: #909399;
}
</style>
