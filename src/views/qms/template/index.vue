<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @reset="handleReset"
          @search="search"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="检验模板" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <TemplateFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      v-model:items="formItems"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createQCTemplate, deleteQCTemplate, getQCTemplateList, updateQCTemplate, type QCTemplate } from '@/api/qms'
import { useTable } from '@/hooks/useTable'
import TemplateFormDialog, { type TemplateFormModel, type TemplateItem } from './TemplateFormDialog.vue'

const queryParams = reactive({
  keyword: '',
  category: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<TemplateFormModel>(createDefaultFormModel())
const formItems = ref<TemplateItem[]>([])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '模板名称', field: 'keyword' },
  {
    type: 'select-v2',
    label: '类别',
    field: 'category',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '原材料', value: 'raw' },
        { label: '外购件', value: 'purchased' },
        { label: '半成品', value: 'semi-finished' },
        { label: '成品', value: 'finished' }
      ]
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<QCTemplate>[] = [
  { prop: 'name', label: '模板名称', minWidth: 220 },
  { prop: 'category', label: '类别', width: 140 },
  { prop: 'itemCount', label: '项目数', minWidth: 100, align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<QCTemplate>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getQCTemplateList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      category: queryParams.category || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteQCTemplate(id)))
})

function createDefaultItems(count = 1): TemplateItem[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `检验项目${index + 1}`,
    type: 'measure',
    standard: '',
    required: true
  }))
}

function createDefaultFormModel(): TemplateFormModel {
  return {
    id: '',
    name: '',
    category: 'raw',
    items: []
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, { keyword: '', category: '' })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  formItems.value = createDefaultItems()
  dialogVisible.value = true
}

function openEdit(row: QCTemplate) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    name: row.name,
    category: row.category,
    items: row.items || []
  }
  formItems.value = row.items?.length ? row.items.map((item) => ({ ...item })) : createDefaultItems(Math.max(1, row.itemCount))
  dialogVisible.value = true
}

async function submitDialog() {
  const payload = {
    ...formModel.value,
    items: formItems.value
  }

  if (dialogMode.value === 'add') {
    await createQCTemplate(payload)
    ElMessage.success('新增成功')
  } else {
    await updateQCTemplate(formModel.value.id, payload)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>
