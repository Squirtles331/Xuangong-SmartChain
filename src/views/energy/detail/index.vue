<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">Export</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe size="small">
      <template #type="{ row }">
        <el-tag :type="row.type === 'electricity' ? 'warning' : row.type === 'water' ? 'primary' : 'info'" size="small">
          {{ row.type }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" size="small" @click="openEdit(row)" />
        <gi-button type="delete" size="small" @click="remove(row)" />
      </template>
    </gi-table>

    <EnergyDetailFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { getEnergyDetailList } from '@/api/energy'
import { useTable } from '@/hooks/useTable'
import EnergyDetailFormDialog, { type EnergyDetailFormModel } from './EnergyDetailFormDialog.vue'

interface EnergyRow {
  id: string
  date: string
  type: string
  workshop: string
  qty: number
  unit: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EnergyDetailFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [{ type: 'input', label: 'Keyword', field: 'keyword' } as any]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<EnergyRow>[] = [
  { prop: 'date', label: 'Period', minWidth: 110 },
  { label: 'Type', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'workshop', label: 'Workshop', minWidth: 160 },
  { prop: 'qty', label: 'Usage', minWidth: 100, align: 'center' },
  { prop: 'unit', label: 'Unit', minWidth: 80, align: 'center' },
  { label: 'Actions', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const allRows = ref<EnergyRow[]>([])

const { tableData, pagination, loading, search, refresh } = useTable<EnergyRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = allRows.value
    if (searchForm.value.keyword) {
      const kw = searchForm.value.keyword.trim().toLowerCase()
      filtered = filtered.filter((item) => item.workshop.toLowerCase().includes(kw) || item.type.toLowerCase().includes(kw))
    }
    const start = (page - 1) * size
    return { list: filtered.slice(start, start + size), total: filtered.length }
  }
})

function createDefaultFormModel(): EnergyDetailFormModel {
  return { id: '', date: '', type: 'electricity', workshop: '', qty: 0, unit: 'kWh' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

async function loadRows() {
  const res = await getEnergyDetailList()
  allRows.value = (res.data || []).map((item: any) => ({
    id: String(item.id),
    date: item.period,
    type: mapEnergyType(item.type),
    workshop: item.workshop,
    qty: Number(item.usage ?? item.qty ?? 0),
    unit: item.unit
  }))
}

function mapEnergyType(type: string) {
  const text = String(type || '')
  if (text.includes('电')) return 'electricity'
  if (text.includes('气') || text.includes('m')) return 'gas'
  if (text.includes('水')) return 'water'
  return text || 'electricity'
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '' }
  search()
}

function handleExport() {
  ElMessage.success('Export completed')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EnergyRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.date) {
    ElMessage.warning('Period is required')
    return
  }

  if (dialogMode.value === 'add') {
    allRows.value.unshift({ ...formModel.value, id: Date.now().toString() } as EnergyRow)
  } else {
    const index = allRows.value.findIndex((item) => item.id === formModel.value.id)
    if (index > -1) Object.assign(allRows.value[index], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: EnergyRow) {
  allRows.value = allRows.value.filter((item) => item.id !== row.id)
  if ((pagination.currentPage - 1) * pagination.pageSize >= tableData.value.length) {
    pagination.currentPage = Math.max(1, pagination.currentPage - 1)
  }
  refresh()
}

onMounted(() => {
  loadRows()
})
</script>
