<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
    </template>

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

    <TableSetting title="调拨单列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #status="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'transit' ? 'primary' : 'success'" size="small">
              {{ row.status === 'pending' ? '待调出' : row.status === 'transit' ? '在途' : '已完成' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmOut(row)">调出确认</el-button>
            <el-button v-if="row.status === 'transit'" type="success" link size="small" @click="confirmIn(row)">调入确认</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <TransferFormDialog v-model:visible="dialogVisible" v-model:form="formModel" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import TableSetting from '@/components/TableSetting.vue'
import type { TableColumnItem } from 'gi-component'
import { getTransferList } from '@/api/wms'
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

const { tableData, pagination, loading, refresh } = useTable<TransferRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getTransferList({ pageNum: page, pageSize: size })
    return {
      list: res.data.list.map(mapRow),
      total: res.data.total
    }
  }
})

function mapRow(item: any): TransferRow {
  return {
    id: String(item.id),
    code: item.code || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    from_wh: item.from_wh || item.from_warehouse || '',
    to_wh: item.to_wh || item.to_warehouse || '',
    status: item.status || '',
    out_time: item.out_time || ''
  }
}

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

function createDefaultForm(): TransferFormModel {
  return { material: '', qty: 1, from_wh: '原材料仓', to_wh: '机加工线边仓' }
}

function openAdd() {
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function confirmOut(row: TransferRow) {
  row.status = 'transit'
  row.out_time = '2025-01-15 08:00'
  ElMessage.success('调出确认成功')
}

function confirmIn(row: TransferRow) {
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
