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

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #pass_rate="{ row }">
        <el-progress
          :percentage="row.pass_rate"
          :stroke-width="8"
          :color="row.pass_rate >= 95 ? '#67c23a' : row.pass_rate >= 80 ? '#e6a23c' : '#f56c6c'"
        />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <SupplierQualityFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getSupplierQualityList } from '@/api/qms'
import { useTable } from '@/hooks/useTable'
import SupplierQualityFormDialog, { type SupplierQualityFormModel } from './SupplierQualityFormDialog.vue'

interface SupplierQualityRow {
  id: string
  supplier: string
  total_batches: number
  pass_batches: number
  pass_rate: number
  repeat_issues: number
  last_inspection: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  supplier: '',
  date_range: [] as string[]
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SupplierQualityFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '供应商', field: 'supplier' } as any,
  { type: 'date-picker', label: '时间范围', field: 'date_range', props: { type: 'daterange' } as any }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const cols: TableColumnItem<SupplierQualityRow>[] = [
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'total_batches', label: '总批次数', minWidth: 100, align: 'center' },
  { prop: 'pass_batches', label: '合格批次', minWidth: 100, align: 'center' },
  { label: '合格率', minWidth: 180, slotName: 'pass_rate' },
  { prop: 'repeat_issues', label: '重复问题', minWidth: 90, align: 'center' },
  { prop: 'last_inspection', label: '最近检验', width: 110 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

function mapRow(raw: any): SupplierQualityRow {
  return {
    id: String(raw.id),
    supplier: raw.supplier || '',
    total_batches: Number(raw.total_batches) || 0,
    pass_batches: Number(raw.pass_batches) || 0,
    pass_rate: Number(raw.pass_rate) || 0,
    repeat_issues: Number(raw.repeat_issues) || 0,
    last_inspection: raw.last_inspection || ''
  }
}

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SupplierQualityRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getSupplierQualityList({ page, page_size: size })
    const items = (res.data.items || res.data || []).map(mapRow)
    return { list: items, total: res.data.total || items.length }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => Promise.resolve()))
})

function createDefaultFormModel(): SupplierQualityFormModel {
  return {
    id: '',
    supplier: '',
    total_batches: 0,
    pass_batches: 0,
    pass_rate: 0,
    repeat_issues: 0,
    last_inspection: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { supplier: '', date_range: [] }
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

function openEdit(row: SupplierQualityRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    supplier: row.supplier,
    total_batches: row.total_batches,
    pass_batches: row.pass_batches,
    pass_rate: row.pass_rate,
    repeat_issues: row.repeat_issues,
    last_inspection: row.last_inspection
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}
</script>
