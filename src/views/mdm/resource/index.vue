<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="resource-search" @update:visible-fields="onSearchFieldsChange">
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
      <template #status="{ row }">
        <el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : 'danger'" size="small">
          {{ row.status === 'running' ? '运行' : row.status === 'idle' ? '空闲' : '维修' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="del(row.id)" />
      </template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增资源' : '编辑资源'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { equipments as mockEqs } from '@/mock'

interface Resource {
  id: string
  code: string
  name: string
  type: string
  model: string
  status: string
  workCenter: string
}

const searchForm = ref({ keyword: '', status: '' })
const searchFormRef = ref<FormInstance | null>()
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '维修', value: 'repair' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const data = ref<Resource[]>([
  { id: '1', code: 'EQ0000000001', name: '数控车床', type: '数控设备', model: 'CK6150', status: 'running', workCenter: '数控车组' },
  { id: '2', code: 'EQ0000000002', name: '数控车床', type: '数控设备', model: 'CK6150', status: 'idle', workCenter: '数控车组' },
  { id: '3', code: 'EQ0000000003', name: '钻床', type: '钻削设备', model: 'Z3050', status: 'running', workCenter: '钻床组' },
  { id: '4', code: 'EQ0000000004', name: '磨床', type: '磨削设备', model: 'M1432', status: 'repair', workCenter: '磨床组' },
  { id: '5', code: 'EQ0000000005', name: '加工中心', type: '数控设备', model: 'VMC850', status: 'running', workCenter: '数控车组' },
  { id: '6', code: 'EQ0000000006', name: '铣床', type: '铣削设备', model: 'X5032', status: 'idle', workCenter: '铣床组' },
  { id: '7', code: 'EQ0000000007', name: '镗床', type: '镗削设备', model: 'T611B', status: 'running', workCenter: '镗床组' }
])

const filteredData = computed(() => {
  return data.value.filter((r) => {
    const matchKeyword =
      !searchForm.value.keyword ||
      r.code.includes(searchForm.value.keyword) ||
      r.name.includes(searchForm.value.keyword) ||
      r.type.includes(searchForm.value.keyword)
    const matchStatus = !searchForm.value.status || r.status === searchForm.value.status
    return matchKeyword && matchStatus
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

const cols: TableColumnItem<Resource>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '编码', minWidth: 140 },
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'type', label: '类型', minWidth: 100 },
  { prop: 'model', label: '型号', minWidth: 100 },
  { prop: 'status', label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'workCenter', label: '所属工作中心', minWidth: 140 },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const form = ref<Resource>({ id: '', code: '', name: '', type: '', model: '', status: 'idle', workCenter: '' })

const formCols: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '类型', field: 'type' },
  { type: 'input', label: '型号', field: 'model' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '维修', value: 'repair' }
      ]
    } as any
  },
  { type: 'input', label: '所属工作中心', field: 'workCenter' }
]

function handleSearch() {
  pagination.value.currentPage = 1
}

function handleReset() {
  searchForm.value = { keyword: '', status: '' }
  pagination.value.currentPage = 1
}

function refresh() {
  pagination.value.currentPage = 1
}

function openAdd() {
  mode.value = 'add'
  form.value = { id: String(Date.now()), code: '', name: '', type: '', model: '', status: 'idle', workCenter: '' }
  vis.value = true
}

function openEdit(row: Resource) {
  mode.value = 'edit'
  form.value = { ...row }
  vis.value = true
}

function del(id: string) {
  data.value = data.value.filter((r) => r.id !== id)
  if ((pagination.value.currentPage - 1) * pagination.value.pageSize >= filteredData.value.length) {
    pagination.value.currentPage = Math.max(1, pagination.value.currentPage - 1)
  }
}

async function submit() {
  if (!form.value.code || !form.value.name) {
    ElMessage.warning('请填写编码和名称')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ ...form.value })
  } else {
    const idx = data.value.findIndex((r) => r.id === form.value.id)
    if (idx > -1) data.value[idx] = { ...form.value }
  }
  return true
}
</script>
