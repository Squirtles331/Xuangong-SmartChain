<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
    </template>

    <TableSetting title="退料/退货单列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #type="{ row }">
            <el-tag :type="row.type === 'return' ? 'danger' : 'warning'" size="small">
              {{ row.type === 'return' ? '退料' : '退货' }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ row.status === 'pending' ? '待处理' : '已完成' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmReturn(row)">确认</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ReturnFormDialog v-model:visible="dialogVisible" v-model:form="formModel" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import TableSetting from '@/components/TableSetting.vue'
import type { TableColumnItem } from 'gi-component'
import { getReturnList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import ReturnFormDialog, { type ReturnFormModel } from './ReturnFormDialog.vue'

interface ReturnRow {
  id: string
  code: string
  type: string
  source: string
  material: string
  qty: number
  reason: string
  status: string
}

const columns: TableColumnItem<ReturnRow>[] = [
  { prop: 'code', label: '单号', width: 160 },
  { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'source', label: '来源单号', width: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'reason', label: '原因', width: 140 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 80, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, refresh } = useTable<ReturnRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getReturnList({ pageNum: page, pageSize: size })
    return {
      list: res.data.list.map(mapRow),
      total: res.data.total
    }
  }
})

function mapRow(item: any): ReturnRow {
  return {
    id: String(item.id),
    code: item.code || '',
    type: item.type || '',
    source: item.source || '',
    material: item.material || '',
    qty: Number(item.qty ?? 0),
    reason: item.reason || '',
    status: item.status || ''
  }
}

const dialogVisible = ref(false)
const formModel = ref<ReturnFormModel>(createDefaultForm())

function createDefaultForm(): ReturnFormModel {
  return { type: 'return', source: '', material: '', qty: 1, reason: '多余退料' }
}

function openAdd() {
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function confirmReturn(row: ReturnRow) {
  row.status = 'completed'
  ElMessage.success(row.type === 'return' ? '退料入库成功' : '退货出库成功')
}
</script>
