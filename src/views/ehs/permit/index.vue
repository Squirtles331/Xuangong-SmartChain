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
      <template #type="{ row }">
        <el-tag size="small">{{
          row.type === 'hot' ? '动火' : row.type === 'height' ? '高处' : row.type === 'confined' ? '受限空间' : '临时用电'
        }}</el-tag>
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="PERMIT_STATUS" />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <PermitFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getEhsPermitList } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import PermitFormDialog, { type PermitFormModel } from './PermitFormDialog.vue'

const PERMIT_STATUS = [
  { value: 'pending', label: '待审批', type: 'warning' as const },
  { value: 'approved', label: '已批准', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

interface PermitRow {
  id: string
  code: string
  type: string
  location: string
  applicant: string
  apply_date: string
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', type: '', status: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PermitFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '动火', value: 'hot' },
        { label: '高处', value: 'height' },
        { label: '受限空间', value: 'confined' },
        { label: '临时用电', value: 'electric' }
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
        { label: '待审批', value: 'pending' },
        { label: '已批准', value: 'approved' },
        { label: '已关闭', value: 'closed' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<PermitRow>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'location', label: '作业位置', width: 140 },
  { prop: 'applicant', label: '申请人', width: 80 },
  { prop: 'apply_date', label: '日期', width: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PermitRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getEhsPermitList({
      page,
      page_size: size,
      keyword: searchForm.value.keyword || undefined,
      type: searchForm.value.type || undefined,
      status: searchForm.value.status || undefined
    })
    return { list: res.data.items, total: res.data.total }
  },
  deleteAPI: (ids) =>
    Promise.all(
      ids.map((id) => {
        tableData.value = tableData.value.filter((item) => item.id !== id)
      })
    )
})

function createDefaultFormModel(): PermitFormModel {
  return { id: '', code: '', type: 'hot', location: '', applicant: '', apply_date: '', status: 'pending' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', type: '', status: '' }
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

function openEdit(row: PermitRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.location) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    const code = 'ZYP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(tableData.value.length + 1).padStart(4, '0')
    tableData.value.unshift({ ...formModel.value, id: Date.now().toString(), code } as PermitRow)
  } else {
    const i = tableData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(tableData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: PermitRow) {
  onDelete(row)
}
</script>
