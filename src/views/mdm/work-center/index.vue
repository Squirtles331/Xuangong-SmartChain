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
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe size="small">
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
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <WorkCenterFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getWorkCenterList } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import WorkCenterFormDialog, { type WorkCenterFormModel } from './WorkCenterFormDialog.vue'

interface WorkCenterRow {
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

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', workshop: '' })

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

const cols: TableColumnItem<WorkCenterRow>[] = [
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

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<WorkCenterRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getWorkCenterList()
    let items = (res.data as any[]) || []
    if (searchForm.value.keyword) {
      const kw = searchForm.value.keyword.toLowerCase()
      items = items.filter(
        (w: any) =>
          (w.code || '').toLowerCase().includes(kw) || (w.name || '').toLowerCase().includes(kw) || (w.workshop || '').toLowerCase().includes(kw)
      )
    }
    if (searchForm.value.workshop) {
      items = items.filter((w: any) => w.workshop === searchForm.value.workshop)
    }
    const start = (page - 1) * size
    return {
      list: items.slice(start, start + size).map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        workshop: item.workshop || '',
        shift: item.shift || '白班',
        people: Number(item.people) || 0,
        efficiency: Number(item.efficiency) || 0,
        costPerHour: Number(item.cost) || Number(item.costPerHour) || 0,
        status: item.status || 'running'
      })),
      total: items.length
    }
  },
  deleteAPI: undefined
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', workshop: '' }
  search()
}

// Dialog
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<WorkCenterFormModel>(createDefaultFormModel())

function createDefaultFormModel(): WorkCenterFormModel {
  return { id: '', code: '', name: '', workshop: '', shift: '白班', people: 0, efficiency: 0, costPerHour: 0, status: 'running' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: WorkCenterRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.workshop) {
    ElMessage.warning('请填写编码、名称和车间')
    return
  }
  if (dialogMode.value === 'add') {
    tableData.value.unshift({ ...formModel.value } as WorkCenterRow)
  } else {
    const idx = tableData.value.findIndex((w) => w.id === formModel.value.id)
    if (idx > -1) tableData.value[idx] = { ...formModel.value } as WorkCenterRow
  }
  dialogVisible.value = false
}
</script>
