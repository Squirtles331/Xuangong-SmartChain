<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" :required-fields="['keyword']" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border style="height: 100%">
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <ParamFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getSystemParams, updateSystemParam, batchUpdateSystemParams, type SystemParam } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import ParamFormDialog, { type ParamFormModel } from './ParamFormDialog.vue'

interface ParamRow {
  id: string
  code: string
  name: string
  value: string
  description: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '编码/名称', clearable: true } as any }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<ParamRow>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '参数编码', minWidth: 200 },
  { prop: 'name', label: '参数名称', minWidth: 180 },
  { prop: 'value', label: '参数值', minWidth: 120, align: 'center' },
  { prop: 'description', label: '说明', minWidth: 250 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ParamRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params = {
      page,
      page_size: size,
      keyword: searchForm.value.keyword || undefined
    }
    const response = await getSystemParams(params)
    return {
      list: (response.data.items as SystemParam[]).map(mapParamRow),
      total: response.data.total
    }
  }
})

function mapParamRow(p: SystemParam): ParamRow {
  return {
    id: p.id,
    code: p.code,
    name: p.name,
    value: p.value,
    description: p.description
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value.keyword = ''
  search()
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ParamFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ParamFormModel {
  return { id: '', code: '', name: '', value: '', description: '' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ParamRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    value: row.value,
    description: row.description
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写必填项')
    return
  }
  if (dialogMode.value === 'add') {
    await batchUpdateSystemParams([{ id: '', value: formModel.value.value }])
    ElMessage.success('新增成功')
  } else {
    await updateSystemParam(formModel.value.id, formModel.value.value)
    ElMessage.success('保存成功')
  }
  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
