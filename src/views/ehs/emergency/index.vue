<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #level="{ row }">
        <el-tag :type="row.level === 'I' ? 'danger' : row.level === 'II' ? 'warning' : 'info'" size="small">{{ row.level }}级响应</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button type="primary" link size="small" @click="drill(row)">演练</el-button>
      </template>
    </gi-table>

    <EmergencyFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getEhsEmergencyList } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import EmergencyFormDialog, { type EmergencyFormModel } from './EmergencyFormDialog.vue'

interface EmergencyRow {
  id: string
  name: string
  type: string
  level: string
  responsible: string
  last_drill: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ name: '', type: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EmergencyFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '预案名称', field: 'name' } as any,
  {
    type: 'select-v2',
    label: '事故类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '火灾', value: '火灾' },
        { label: '危化品', value: '危化品' },
        { label: '机械', value: '机械' },
        { label: '电力', value: '电力' },
        { label: '其他', value: '其他' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<EmergencyRow>[] = [
  { prop: 'name', label: '预案名称', minWidth: 200 },
  { prop: 'type', label: '事故类型', minWidth: 100 },
  { label: '响应等级', minWidth: 90, slotName: 'level', align: 'center' },
  { prop: 'responsible', label: '负责人', minWidth: 140 },
  { prop: 'last_drill', label: '最近演练', minWidth: 120 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<EmergencyRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getEhsEmergencyList({
      page,
      page_size: size,
      name: searchForm.value.name || undefined,
      type: searchForm.value.type || undefined
    })
    return { list: res.data.items, total: res.data.total }
  }
})

function createDefaultFormModel(): EmergencyFormModel {
  return { id: '', name: '', type: '火灾', level: 'II', responsible: '', last_drill: '' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { name: '', type: '' }
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

function openEdit(row: EmergencyRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.name) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    tableData.value.unshift({ ...formModel.value, id: Date.now().toString() } as EmergencyRow)
  } else {
    const i = tableData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(tableData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function drill(row: EmergencyRow) {
  row.last_drill = new Date().toISOString().slice(0, 10)
  ElMessage.success(`演练完成: ${row.name}`)
}
</script>
