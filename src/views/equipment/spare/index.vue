<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @reset="handleReset"
          @search="handleSearch"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe :row-class-name="rowClassName">
      <template #stock_status="{ row }">
        <el-tag :type="row.qty > row.safety ? 'success' : row.qty > 0 ? 'warning' : 'danger'" size="small">
          {{ row.qty > row.safety ? '充足' : row.qty > 0 ? '偏低' : '缺货' }}
        </el-tag>
      </template>
      <template #qty="{ row }">
        <span :style="{ color: row.qty < row.safety ? '#f56c6c' : '', fontWeight: row.qty < row.safety ? 'bold' : '' }">{{ row.qty }}</span>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button type="primary" link size="small" @click="inbound(row)">入库</el-button>
        <el-button type="warning" link size="small" @click="outbound(row)">出库</el-button>
      </template>
    </gi-table>

    <SpareFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { useTable } from '@/hooks/useTable'
import SpareFormDialog, { type SpareFormModel } from './SpareFormDialog.vue'

interface SpareRow {
  id: string
  code: string
  name: string
  spec: string
  applicable_equipment: string
  qty: number
  safety: number
  unit: string
  location: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  stock_status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SpareFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '库存状态',
    field: 'stock_status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '充足', value: 'ok' },
        { label: '偏低', value: 'low' },
        { label: '缺货', value: 'out' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const cols: TableColumnItem<SpareRow>[] = [
  { prop: 'code', label: '备件编码', minWidth: 120 },
  { prop: 'name', label: '备件名称', minWidth: 140 },
  { prop: 'spec', label: '规格', minWidth: 100 },
  { prop: 'applicable_equipment', label: '适用设备', minWidth: 160 },
  { label: '库存数量', minWidth: 80, slotName: 'qty', align: 'center' },
  { prop: 'safety', label: '安全库存', minWidth: 80, align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 50, align: 'center' },
  { label: '状态', minWidth: 70, slotName: 'stock_status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<SpareRow>({
  rowKey: 'id',
  listAPI: async () => {
    return { list: [], total: 0 }
  }
})

function createDefaultFormModel(): SpareFormModel {
  return {
    id: '',
    code: '',
    name: '',
    spec: '',
    applicable_equipment: '',
    qty: 0,
    safety: 5,
    unit: '个',
    location: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', stock_status: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SpareRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    spec: row.spec,
    applicable_equipment: row.applicable_equipment,
    qty: row.qty,
    safety: row.safety,
    unit: row.unit,
    location: row.location
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function inbound(row: SpareRow) {
  row.qty += 1
  ElMessage.success(`入库1${row.unit}，当前库存${row.qty}`)
}

function outbound(row: SpareRow) {
  if (row.qty <= 0) {
    ElMessage.warning('库存不足')
    return
  }
  row.qty -= 1
  ElMessage.success(`出库1${row.unit}，当前库存${row.qty}`)
}

function rowClassName({ row }: { row: SpareRow }) {
  return row.qty < row.safety ? 'safety-warning-row' : ''
}
</script>

<style scoped>
:deep(.safety-warning-row) {
  background-color: #fef0f0 !important;
}
</style>
