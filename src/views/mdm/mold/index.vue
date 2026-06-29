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
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <MoldFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getMoldList } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import MoldFormDialog, { type MoldFormModel } from './MoldFormDialog.vue'

interface MoldRow {
  id: string
  code: string
  name: string
  type: string
  lifeDesign: number
  used: number
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', type: '', status: '' })

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

function getUsagePercent(row: MoldRow): number {
  if (row.lifeDesign <= 0) return 0
  return Math.round((row.used / row.lifeDesign) * 100)
}

function getProgressColor(row: MoldRow): string {
  const pct = getUsagePercent(row)
  if (pct > 80) return '#f56c6c'
  if (pct >= 50) return '#e6a23c'
  return '#67c23a'
}

const cols: TableColumnItem<MoldRow>[] = [
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

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<MoldRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getMoldList()
    let items = (res.data as any[]) || []
    // Client-side filter
    if (searchForm.value.keyword) {
      const kw = searchForm.value.keyword.toLowerCase()
      items = items.filter((m: any) => (m.code || '').toLowerCase().includes(kw) || (m.name || '').toLowerCase().includes(kw))
    }
    if (searchForm.value.type) {
      items = items.filter((m: any) => m.type === searchForm.value.type)
    }
    if (searchForm.value.status) {
      items = items.filter((m: any) => m.status === searchForm.value.status)
    }
    const start = (page - 1) * size
    return {
      list: items.slice(start, start + size).map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        type: item.type,
        lifeDesign: Number(item.life) || item.lifeDesign || 0,
        used: Number(item.used) || 0,
        status: item.status
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
  searchForm.value = { keyword: '', type: '', status: '' }
  search()
}

// Dialog
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<MoldFormModel>(createDefaultFormModel())

function createDefaultFormModel(): MoldFormModel {
  return { id: '', code: '', name: '', type: '', lifeDesign: 0, used: 0, status: 'idle' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: MoldRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.type) {
    ElMessage.warning('请填写编码、名称和类型')
    return
  }
  if (dialogMode.value === 'add') {
    tableData.unshift({ ...formModel.value } as MoldRow)
  } else {
    const idx = tableData.findIndex((m) => m.id === formModel.value.id)
    if (idx > -1) tableData[idx] = { ...formModel.value } as MoldRow
  }
  dialogVisible.value = false
}
</script>
