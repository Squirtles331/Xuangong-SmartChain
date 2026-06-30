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
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #level="{ row }">
        <StatusTag :value="row.level" :options="EHS_RISK_LEVEL" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="EHS_STATUS" />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <EhsIndexFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getEhsHazardList } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import EhsIndexFormDialog, { type EhsHazardFormModel } from './EhsIndexFormDialog.vue'

const EHS_RISK_LEVEL = [
  { value: 'major', label: '重大', type: 'danger' as const },
  { value: 'moderate', label: '一般', type: 'warning' as const },
  { value: 'minor', label: '低风险', type: 'info' as const }
]

const EHS_STATUS = [
  { value: 'open', label: '待整改', type: 'danger' as const },
  { value: 'processing', label: '整改中', type: 'warning' as const },
  { value: 'closed', label: '已关闭', type: 'success' as const }
]

interface HazardRow {
  id: string
  code: string
  location: string
  desc: string
  level: string
  status: string
  finder: string
  found_at: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', level: '', status: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EhsHazardFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '风险等级',
    field: 'level',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '重大', value: 'major' },
        { label: '一般', value: 'moderate' },
        { label: '低风险', value: 'minor' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待整改', value: 'open' },
        { label: '整改中', value: 'processing' },
        { label: '已关闭', value: 'closed' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<HazardRow>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { prop: 'location', label: '位置', width: 140 },
  { prop: 'desc', label: '描述', minWidth: 180 },
  { label: '风险等级', minWidth: 80, slotName: 'level', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'finder', label: '发现人', width: 80 },
  { prop: 'found_at', label: '发现时间', width: 110 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<HazardRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getEhsHazardList({
      pageNum: page,
      pageSize: size,
      keyword: searchForm.value.keyword || undefined,
      level: searchForm.value.level || undefined,
      status: searchForm.value.status || undefined
    })
    return { list: res.data.list, total: res.data.total }
  },
  deleteAPI: (ids) =>
    Promise.all(
      ids.map((id) => {
        // mock delete: filter out
        tableData.value = tableData.value.filter((item) => item.id !== id)
      })
    )
})

function createDefaultFormModel(): EhsHazardFormModel {
  return { id: '', code: '', location: '', desc: '', level: 'moderate', status: 'open', finder: '', found_at: '' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', level: '', status: '' }
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

function openEdit(row: HazardRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.location || !formModel.value.desc) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    const code = 'YH' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(tableData.value.length + 1).padStart(4, '0')
    tableData.value.unshift({ ...formModel.value, id: Date.now().toString(), code } as HazardRow)
  } else {
    const i = tableData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(tableData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: HazardRow) {
  onDelete(row)
}
</script>
