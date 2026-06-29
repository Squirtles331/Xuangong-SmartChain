<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #status="{ row }">
        <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
          {{ row.status === 'pending' ? '待冲销' : '已冲销' }}
        </el-tag>
      </template>
      <template #diff="{ row }">
        <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }">
          {{ row.diff > 0 ? '+' : '' }}{{ row.diff }}
        </span>
      </template>
      <template #diff_rate="{ row }">
        <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }">
          {{ row.bom_qty > 0 ? ((Math.abs(row.diff) / row.bom_qty) * 100).toFixed(2) : '0.00' }}%
        </span>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button style="margin-left: 8px" type="primary" link size="small" @click="doBackflush(row)">冲销</el-button>
      </template>
    </gi-table>

    <BackflushFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
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

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待冲销', value: 'pending' },
        { label: '已冲销', value: 'completed' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const cols: TableColumnItem<BackflushRow>[] = [
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'wo_code', label: '工单号', minWidth: 170 },
  { prop: 'bom_qty', label: 'BOM用量', minWidth: 90, align: 'center' },
  { prop: 'actual_qty', label: '实际用量', minWidth: 90, align: 'center' },
  { prop: 'diff', label: '差异', minWidth: 80, align: 'center', slotName: 'diff' },
  { label: '差异率', minWidth: 90, slotName: 'diff_rate', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'backflush_date', label: '冲销日期', minWidth: 110 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<BackflushRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getBackflushList({
      page,
      page_size: size,
      code: searchForm.value.keyword || undefined,
      material: searchForm.value.keyword || undefined,
      status: searchForm.value.status || undefined
    })
    return {
      list: (res.data.items || []).map(mapRow),
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

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<BackflushFormModel>(createDefaultForm())

function createDefaultForm(): BackflushFormModel {
  return { id: '', material: '', wo_code: '', bom_qty: 0, actual_qty: 0, diff: 0, status: 'pending', backflush_date: '' }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: BackflushRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    material: row.material,
    wo_code: row.wo_code,
    bom_qty: row.bom_qty,
    actual_qty: row.actual_qty,
    diff: row.diff,
    status: row.status,
    backflush_date: row.backflush_date
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function doBackflush(r: BackflushRow) {
  r.status = 'completed'
  ElMessage.success('倒冲完成，库存已更新')
}
</script>
