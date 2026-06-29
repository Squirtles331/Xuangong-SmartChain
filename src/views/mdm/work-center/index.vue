<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="work-center-search" @update:visible-fields="onSearchFieldsChange">
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
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增工作中心' : '编辑工作中心'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="110" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'

interface WorkCenter {
  id: string
  code: string
  name: string
  workshop: string
  shift: string
  people: number
  efficiency: number
  costPerHour: number
  status: string
}

const searchForm = ref({ keyword: '', workshop: '' })
const searchFormRef = ref<FormInstance | null>()
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '车间',
    field: 'workshop',
    props: {
      clearable: true,
      options: [
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' },
        { label: '装配车间', value: '装配车间' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const data = ref<WorkCenter[]>([
  {
    id: '1',
    code: 'WC00000001',
    name: '数控车组',
    workshop: '机加工一车间',
    shift: '两班倒',
    people: 12,
    efficiency: 92,
    costPerHour: 150,
    status: 'running'
  },
  {
    id: '2',
    code: 'WC00000002',
    name: '钻床组',
    workshop: '机加工一车间',
    shift: '白班',
    people: 8,
    efficiency: 85,
    costPerHour: 80,
    status: 'running'
  },
  {
    id: '3',
    code: 'WC00000003',
    name: '磨床组',
    workshop: '机加工一车间',
    shift: '两班倒',
    people: 10,
    efficiency: 78,
    costPerHour: 120,
    status: 'idle'
  },
  {
    id: '4',
    code: 'WC00000004',
    name: '装配组',
    workshop: '装配车间',
    shift: '白班',
    people: 15,
    efficiency: 88,
    costPerHour: 100,
    status: 'running'
  },
  {
    id: '5',
    code: 'WC00000005',
    name: '铣床组',
    workshop: '机加工二车间',
    shift: '两班倒',
    people: 9,
    efficiency: 90,
    costPerHour: 130,
    status: 'running'
  },
  {
    id: '6',
    code: 'WC00000006',
    name: '镗床组',
    workshop: '机加工二车间',
    shift: '白班',
    people: 6,
    efficiency: 82,
    costPerHour: 140,
    status: 'idle'
  },
  {
    id: '7',
    code: 'WC00000007',
    name: '热处理组',
    workshop: '机加工一车间',
    shift: '三班倒',
    people: 7,
    efficiency: 95,
    costPerHour: 160,
    status: 'repair'
  }
])

const filteredData = computed(() => {
  return data.value.filter((w) => {
    const matchKeyword =
      !searchForm.value.keyword ||
      w.code.includes(searchForm.value.keyword) ||
      w.name.includes(searchForm.value.keyword) ||
      w.workshop.includes(searchForm.value.keyword)
    const matchWorkshop = !searchForm.value.workshop || w.workshop === searchForm.value.workshop
    return matchKeyword && matchWorkshop
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

const cols: TableColumnItem<WorkCenter>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '编码', minWidth: 130 },
  { prop: 'name', label: '名称', minWidth: 110 },
  { prop: 'workshop', label: '车间', minWidth: 140 },
  { prop: 'shift', label: '班次', minWidth: 80 },
  { prop: 'people', label: '人数', minWidth: 60, align: 'center' },
  { prop: 'efficiency', label: '效率(%)', minWidth: 80, align: 'center' },
  { prop: 'costPerHour', label: '工时费率(元/h)', minWidth: 120, align: 'center' },
  { prop: 'status', label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const form = ref<WorkCenter>({
  id: '',
  code: '',
  name: '',
  workshop: '',
  shift: '白班',
  people: 0,
  efficiency: 0,
  costPerHour: 0,
  status: 'running'
})

const formCols: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '车间', field: 'workshop', required: true },
  {
    type: 'select-v2',
    label: '班次',
    field: 'shift',
    required: true,
    props: {
      options: [
        { label: '白班', value: '白班' },
        { label: '两班倒', value: '两班倒' },
        { label: '三班倒', value: '三班倒' }
      ]
    } as any
  },
  { type: 'input-number', label: '人数', field: 'people', props: { min: 0 } as any },
  { type: 'input-number', label: '效率(%)', field: 'efficiency', props: { min: 0, max: 100 } as any },
  { type: 'input-number', label: '工时费率(元/h)', field: 'costPerHour', props: { min: 0 } as any },
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
  }
]

function handleSearch() {
  pagination.value.currentPage = 1
}

function handleReset() {
  searchForm.value = { keyword: '', workshop: '' }
  pagination.value.currentPage = 1
}

function refresh() {
  pagination.value.currentPage = 1
}

function openAdd() {
  mode.value = 'add'
  form.value = {
    id: String(Date.now()),
    code: '',
    name: '',
    workshop: '',
    shift: '白班',
    people: 0,
    efficiency: 0,
    costPerHour: 0,
    status: 'running'
  }
  vis.value = true
}

function openEdit(row: WorkCenter) {
  mode.value = 'edit'
  form.value = { ...row }
  vis.value = true
}

function del(id: string) {
  data.value = data.value.filter((w) => w.id !== id)
  if ((pagination.value.currentPage - 1) * pagination.value.pageSize >= filteredData.value.length) {
    pagination.value.currentPage = Math.max(1, pagination.value.currentPage - 1)
  }
}

async function submit() {
  if (!form.value.code || !form.value.name || !form.value.workshop) {
    ElMessage.warning('请填写编码、名称和车间')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ ...form.value })
  } else {
    const idx = data.value.findIndex((w) => w.id === form.value.id)
    if (idx > -1) data.value[idx] = { ...form.value }
  }
  return true
}
</script>
