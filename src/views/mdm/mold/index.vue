<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="mold-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>
    <gi-table :columns="cols" :data="pagedData" :pagination="pagination" border stripe size="small">
      <template #index="{ $index }">
        {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
      </template>
      <template #lifeProgress="{ row }">
        <el-progress :percentage="getUsagePercent(row)" :color="getProgressColor(row)" :stroke-width="16" />
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'using' ? 'success' : row.status === 'idle' ? 'info' : 'warning'" size="small">
          {{ row.status === 'using' ? '使用中' : row.status === 'idle' ? '空闲' : '维护中' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="del(row.id)" />
      </template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增模具' : '编辑模具'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="110" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'

interface Mold {
  id: string
  code: string
  name: string
  type: string
  lifeDesign: number
  used: number
  status: string
}

const searchForm = ref({ keyword: '', type: '', status: '' })
const searchFormRef = ref<FormInstance | null>()
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      clearable: true,
      options: [
        { label: '铸模', value: '铸模' },
        { label: '锻模', value: '锻模' },
        { label: '冲模', value: '冲模' },
        { label: '注塑模', value: '注塑模' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '使用中', value: 'using' },
        { label: '空闲', value: 'idle' },
        { label: '维护中', value: 'maintain' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const data = ref<Mold[]>([
  { id: '1', code: 'MD0000000001', name: '泵体铸造模具', type: '铸模', lifeDesign: 10000, used: 8500, status: 'using' },
  { id: '2', code: 'MD0000000002', name: '叶轮锻模', type: '锻模', lifeDesign: 5000, used: 1200, status: 'using' },
  { id: '3', code: 'MD0000000003', name: '齿轮冲压模', type: '冲模', lifeDesign: 20000, used: 6000, status: 'idle' },
  { id: '4', code: 'MD0000000004', name: '外壳注塑模', type: '注塑模', lifeDesign: 30000, used: 25000, status: 'using' },
  { id: '5', code: 'MD0000000005', name: '阀体铸造模具', type: '铸模', lifeDesign: 8000, used: 4200, status: 'idle' },
  { id: '6', code: 'MD0000000006', name: '连杆锻模', type: '锻模', lifeDesign: 6000, used: 5000, status: 'maintain' },
  { id: '7', code: 'MD0000000007', name: '端盖冲压模', type: '冲模', lifeDesign: 15000, used: 2000, status: 'idle' }
])

const filteredData = computed(() => {
  return data.value.filter((m) => {
    const matchKeyword = !searchForm.value.keyword || m.code.includes(searchForm.value.keyword) || m.name.includes(searchForm.value.keyword)
    const matchType = !searchForm.value.type || m.type === searchForm.value.type
    const matchStatus = !searchForm.value.status || m.status === searchForm.value.status
    return matchKeyword && matchType && matchStatus
  })
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => filteredData.value.length)
}) as any

const pagedData = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredData.value.slice(start, end)
})

function getUsagePercent(row: Mold): number {
  if (row.lifeDesign <= 0) return 0
  return Math.round((row.used / row.lifeDesign) * 100)
}

function getProgressColor(row: Mold): string {
  const pct = getUsagePercent(row)
  if (pct > 80) return '#f56c6c'
  if (pct >= 50) return '#e6a23c'
  return '#67c23a'
}

const cols: TableColumnItem<Mold>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '编码', minWidth: 140 },
  { prop: 'name', label: '名称', minWidth: 140 },
  { prop: 'type', label: '类型', minWidth: 80 },
  { prop: 'lifeDesign', label: '设计寿命', minWidth: 100, align: 'center' },
  { prop: 'used', label: '已用次数', minWidth: 90, align: 'center' },
  { label: '寿命进度', minWidth: 180, slotName: 'lifeProgress' },
  { prop: 'status', label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const form = ref<Mold>({ id: '', code: '', name: '', type: '', lifeDesign: 0, used: 0, status: 'idle' })

const formCols: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '铸模', value: '铸模' },
        { label: '锻模', value: '锻模' },
        { label: '冲模', value: '冲模' },
        { label: '注塑模', value: '注塑模' }
      ]
    } as any
  },
  { type: 'input-number', label: '设计寿命', field: 'lifeDesign', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '已用次数', field: 'used', props: { min: 0 } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '使用中', value: 'using' },
        { label: '空闲', value: 'idle' },
        { label: '维护中', value: 'maintain' }
      ]
    } as any
  }
]

function handleSearch() {
  pagination.value.currentPage = 1
}

function handleReset() {
  searchForm.value = { keyword: '', type: '', status: '' }
  pagination.value.currentPage = 1
}

function refresh() {
  pagination.value.currentPage = 1
}

function openAdd() {
  mode.value = 'add'
  form.value = { id: String(Date.now()), code: '', name: '', type: '', lifeDesign: 0, used: 0, status: 'idle' }
  vis.value = true
}

function openEdit(row: Mold) {
  mode.value = 'edit'
  form.value = { ...row }
  vis.value = true
}

function del(id: string) {
  data.value = data.value.filter((m) => m.id !== id)
  if ((pagination.value.currentPage - 1) * pagination.value.pageSize >= filteredData.value.length) {
    pagination.value.currentPage = Math.max(1, pagination.value.currentPage - 1)
  }
}

async function submit() {
  if (!form.value.code || !form.value.name || !form.value.type) {
    ElMessage.warning('请填写编码、名称和类型')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ ...form.value })
  } else {
    const idx = data.value.findIndex((m) => m.id === form.value.id)
    if (idx > -1) data.value[idx] = { ...form.value }
  }
  return true
}
</script>
