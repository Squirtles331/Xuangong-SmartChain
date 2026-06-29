<template>
  <gi-page-layout>
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
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getEquipmentList, createEquipment, updateEquipment, deleteEquipment } from '@/api/mdm'

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

const data = ref<Resource[]>([])

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 0
}) as any

const pagedData = ref<Resource[]>([])

onMounted(() => {
  fetchData()
})

async function fetchData() {
  const params: { page: number; page_size: number; name?: string; status?: string } = {
    page: pagination.value.currentPage,
    page_size: pagination.value.pageSize
  }
  if (searchForm.value.keyword) {
    params.name = searchForm.value.keyword
  }
  if (searchForm.value.status) {
    params.status = searchForm.value.status
  }
  const res = await getEquipmentList(params)
  data.value = (res.data.items as any[]).map((item: any) => ({
    ...item,
    type: item.type || item.model || '',
    workCenter: item.workshop || item.workCenter || ''
  }))
  pagination.value.total = res.data.total
  pagedData.value = data.value
}

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
  fetchData()
}

function handleReset() {
  searchForm.value = { keyword: '', status: '' }
  pagination.value.currentPage = 1
  fetchData()
}

function refresh() {
  pagination.value.currentPage = 1
  fetchData()
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

async function del(id: string) {
  await deleteEquipment(id)
  if ((pagination.value.currentPage - 1) * pagination.value.pageSize >= pagination.value.total - 1) {
    pagination.value.currentPage = Math.max(1, pagination.value.currentPage - 1)
  }
  await fetchData()
}

async function submit() {
  if (!form.value.code || !form.value.name) {
    ElMessage.warning('请填写编码和名称')
    return false
  }
  if (mode.value === 'add') {
    await createEquipment({ ...(form.value as any) })
  } else {
    await updateEquipment(form.value.id, { ...(form.value as any) })
  }
  await fetchData()
  return true
}
</script>
