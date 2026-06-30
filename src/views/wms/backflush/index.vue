<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form v-model="queryParams" :columns="visibleSearchColumns" search @search="search" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="倒冲记录" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #status="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
              {{ row.status === 'pending' ? '待倒冲' : '已倒冲' }}
            </el-tag>
          </template>
          <template #diff="{ row }">
            <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }">
              {{ row.diff > 0 ? '+' : '' }}{{ row.diff }}
            </span>
          </template>
          <template #diffRate="{ row }">
            <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }">
              {{ row.bom_qty > 0 ? ((Math.abs(row.diff) / row.bom_qty) * 100).toFixed(2) : '0.00' }}%
            </span>
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button style="margin-left: 8px" type="primary" link size="small" @click="doBackflush(row)">倒冲</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <BackflushFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getBackflushList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import BackflushFormDialog, { type BackflushFormModel } from './BackflushFormDialog.vue'

interface BackflushRow {
  id: string
  material: string
  wo_code: string
  bom_qty: number
  actual_qty: number
  diff: number
  status: string
  backflush_date: string
}

const queryParams = ref({ keyword: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '请输入工单号/物料名称', clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待倒冲', value: 'pending' },
        { label: '已倒冲', value: 'completed' }
      ],
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<BackflushRow>[] = [
  { prop: 'material', label: '物料名称', minWidth: 180 },
  { prop: 'wo_code', label: '工单号', minWidth: 170 },
  { prop: 'bom_qty', label: 'BOM用量', minWidth: 90, align: 'center' },
  { prop: 'actual_qty', label: '实际用量', minWidth: 90, align: 'center' },
  { prop: 'diff', label: '差异', minWidth: 80, align: 'center', slotName: 'diff' },
  { label: '差异率', minWidth: 90, slotName: 'diffRate', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'backflush_date', label: '倒冲日期', minWidth: 110 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<BackflushRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getBackflushList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.keyword || undefined,
      material: queryParams.value.keyword || undefined,
      status: queryParams.value.status || undefined
    })
    return {
      list: res.data.list.map(mapRow),
      total: res.data.total
    }
  }
})

function mapRow(item: any): BackflushRow {
  return {
    id: String(item.id),
    material: item.material || '',
    wo_code: item.wo_code || '',
    bom_qty: Number(item.bom_qty ?? 0),
    actual_qty: Number(item.actual_qty ?? 0),
    diff: Number(item.diff ?? 0),
    status: item.status || '',
    backflush_date: item.backflush_date || ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  queryParams.value = { keyword: '', status: '' }
  search()
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<BackflushFormModel>(createDefaultForm())

function createDefaultForm(): BackflushFormModel {
  return { id: '', material: '', wo_code: '', bom_qty: 0, actual_qty: 0, diff: 0, status: 'pending', backflush_date: '' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: BackflushRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function doBackflush(row: BackflushRow) {
  row.status = 'completed'
  ElMessage.success('倒冲完成，库存已更新')
}
</script>
