<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="检验模板列表"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
    @toolbar-action="handleToolbarAction"
  >
    <template #category="{ row }">
      <StatusTag :value="row.category" :options="categoryOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <TemplateFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        v-model:items="formItems"
        :mode="dialogMode"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { createQCTemplate, deleteQCTemplate, getQCTemplateList, updateQCTemplate } from '@/static/services/qms'
import { useTable } from '@/hooks/useTable'
import type { QCTemplate } from '@/types/qms'
import TemplateFormDialog, { type TemplateFormModel, type TemplateItem } from './TemplateFormDialog.vue'

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]
const categoryOptions = [
  { value: 'raw', label: '原材料', type: 'warning' as const },
  { value: 'purchased', label: '外购件', type: 'primary' as const },
  { value: 'semi-finished', label: '半成品', type: 'success' as const },
  { value: 'finished', label: '成品', type: 'info' as const }
]

const queryParams = ref({
  keyword: '',
  category: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '模板名称', field: 'keyword', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '类别',
    field: 'category',
    props: {
      options: categoryOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<QCTemplate>[] = [
  { prop: 'name', label: '模板名称', minWidth: 220 },
  { label: '类别', width: 120, slotName: 'category', align: 'center' },
  { prop: 'itemCount', label: '检验项目数', width: 120, align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<QCTemplate>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getQCTemplateList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.value.keyword || undefined,
      category: queryParams.value.category || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteQCTemplate(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<TemplateFormModel>(createDefaultFormModel())
const formItems = ref<TemplateItem[]>([])

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

function handleReset() {
  queryParams.value = {
    keyword: '',
    category: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('检验模板静态数据已导出')
  }
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

function handleRowAction(action: string, row: QCTemplate) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
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
