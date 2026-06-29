<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="energy-detail-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">Export</el-button>
    </template>

    <gi-table :columns="columns" :data="pagedData" :pagination="pagination" border stripe size="small">
      <template #type="{ row }">
        <el-tag :type="row.type === 'electricity' ? 'warning' : row.type === 'water' ? 'primary' : 'info'" size="small">
          {{ row.type }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" size="small" @click="openEdit(row)" />
        <gi-button type="delete" size="small" @click="removeRow(row.id)" />
      </template>
    </gi-table>

    <gi-dialog v-model="dialogVisible" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? 'Add Record' : 'Edit Record'" width="600px">
      <gi-form v-model="form" :columns="formColumns" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { getEnergyDetailList } from '@/api/energy'

interface EnergyRow {
  id: string
  date: string
  type: string
  workshop: string
  qty: number
  unit: string
}

const searchForm = reactive({ keyword: '' })
const searchColumns: FormColumnItem[] = [{ type: 'input', label: 'Keyword', field: 'keyword' } as any]
const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])
const searchFormRef = ref<FormInstance | null>()
const rows = ref<EnergyRow[]>([])

const columns: TableColumnItem<any>[] = [
  { prop: 'date', label: 'Period', minWidth: 110 },
  { label: 'Type', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'workshop', label: 'Workshop', minWidth: 160 },
  { prop: 'qty', label: 'Usage', minWidth: 100, align: 'center' },
  { prop: 'unit', label: 'Unit', minWidth: 80, align: 'center' },
  { label: 'Actions', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const filteredData = computed(() =>
  rows.value.filter((item) => {
    const keyword = searchForm.keyword.trim().toLowerCase()
    if (!keyword) return true
    return item.workshop.toLowerCase().includes(keyword) || item.type.toLowerCase().includes(keyword)
  })
)

const pagination = reactive({ currentPage: 1, pageSize: 5, total: 0 })
const pagedData = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

watch(
  filteredData,
  (value) => {
    pagination.total = value.length
  },
  { immediate: true }
)

const dialogVisible = ref(false)
const mode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const form = reactive<EnergyRow>({
  id: '',
  date: '',
  type: 'electricity',
  workshop: '',
  qty: 0,
  unit: 'kWh'
})

const formColumns: FormColumnItem[] = [
  { type: 'input', label: 'Period', field: 'date', required: true },
  {
    type: 'select-v2',
    label: 'Type',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: 'electricity', value: 'electricity' },
        { label: 'water', value: 'water' },
        { label: 'gas', value: 'gas' }
      ]
    } as any
  },
  { type: 'input', label: 'Workshop', field: 'workshop' },
  { type: 'input-number', label: 'Usage', field: 'qty', required: true, props: { min: 0 } as any },
  { type: 'input', label: 'Unit', field: 'unit' }
]

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

async function loadRows() {
  const res = await getEnergyDetailList()
  rows.value = (res.data || []).map((item: any) => ({
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
  if (text.includes('鐢')) return 'electricity'
  if (text.includes('姘') && text.includes('m')) return 'gas'
  if (text.includes('姘')) return 'water'
  return text || 'electricity'
}

function handleSearch() {
  pagination.currentPage = 1
}

function handleReset() {
  searchForm.keyword = ''
  pagination.currentPage = 1
}

function refresh() {
  handleReset()
}

function handleExport() {
  ElMessage.success('Export completed')
}

function openAdd() {
  mode.value = 'add'
  editingId.value = ''
  Object.assign(form, { id: '', date: '', type: 'electricity', workshop: '', qty: 0, unit: 'kWh' })
  dialogVisible.value = true
}

function openEdit(row: EnergyRow) {
  mode.value = 'edit'
  editingId.value = row.id
  Object.assign(form, row)
  dialogVisible.value = true
}

async function submit() {
  if (!form.date) {
    ElMessage.warning('Period is required')
    return false
  }

  if (mode.value === 'add') {
    rows.value.unshift({ ...form, id: Date.now().toString() })
  } else {
    const index = rows.value.findIndex((item) => item.id === editingId.value)
    if (index > -1) Object.assign(rows.value[index], form)
  }

  return true
}

function removeRow(id: string) {
  rows.value = rows.value.filter((item) => item.id !== id)
  if ((pagination.currentPage - 1) * pagination.pageSize >= filteredData.value.length) {
    pagination.currentPage = Math.max(1, pagination.currentPage - 1)
  }
}

onMounted(() => {
  loadRows()
})
</script>
