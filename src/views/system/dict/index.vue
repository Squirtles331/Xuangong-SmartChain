<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" :required-fields="['keyword']" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAddType" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="typeColumns" :data="tableData" :pagination="pagination" :loading="loading" border style="height: 100%">
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEditType(row)" />
        <gi-button type="delete" @click="deleteType(row)" />
        <el-button type="primary" link size="small" @click="openItems(row)">字典项</el-button>
      </template>
    </gi-table>

    <DictTypeDialog v-model:visible="typeDialogVisible" v-model:form="typeFormModel" :mode="typeDialogMode" @submit="submitTypeDialog" />

    <DictItemsDialog
      v-model:visible="itemDialogVisible"
      v-model:items="currentItems"
      :dict-type-name="currentType?.name || ''"
      @close="closeItemDialog"
      @create-item="createItemFromDialog"
      @update-item="updateItemFromDialog"
      @delete-item="deleteItem"
    />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import type { DictItem, DictType } from '@/api/system'
import { createDictItem, createDictType, deleteDictItem, getDictItems, getDictTypeList, updateDictItem } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import DictItemsDialog from './DictItemsDialog.vue'
import DictTypeDialog, { type DictTypeFormModel } from './DictTypeDialog.vue'

const searchForm = ref({ keyword: '' })
const searchFormRef = ref<FormInstance | null>()

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '字典编码/名称', clearable: true } as any }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const typeColumns: TableColumnItem<DictType>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '字典编码', minWidth: 180 },
  { prop: 'name', label: '字典名称', minWidth: 140 },
  { prop: 'description', label: '描述', minWidth: 200 },
  { label: '状态', minWidth: 100, slotName: 'status' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<DictType>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getDictTypeList({ page, page_size: size })
    return {
      list: response.data.items as DictType[],
      total: response.data.total
    }
  },
  deleteAPI: () => Promise.resolve()
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value.keyword = ''
  search()
}

const typeDialogVisible = ref(false)
const typeDialogMode = ref<'add' | 'edit'>('add')
const typeFormModel = ref<DictTypeFormModel>(createDefaultTypeForm())

function createDefaultTypeForm(): DictTypeFormModel {
  return { id: '', code: '', name: '', description: '' }
}

function openAddType() {
  typeDialogMode.value = 'add'
  typeFormModel.value = createDefaultTypeForm()
  typeDialogVisible.value = true
}

function openEditType(row: DictType) {
  typeDialogMode.value = 'edit'
  typeFormModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description
  }
  typeDialogVisible.value = true
}

async function submitTypeDialog() {
  if (!typeFormModel.value.code || !typeFormModel.value.name) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (typeDialogMode.value === 'add') {
    await createDictType({
      code: typeFormModel.value.code,
      name: typeFormModel.value.name,
      description: typeFormModel.value.description,
      status: 'active'
    })
    ElMessage.success('新增成功')
  } else {
    ElMessage.success('编辑成功')
  }

  typeDialogVisible.value = false
  await refresh()
}

function deleteType(row: DictType) {
  ElMessageBox.confirm('删除字典类型将同时删除其下所有字典项，确认删除？', '警告', { type: 'warning' })
    .then(async () => {
      await refresh()
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const itemDialogVisible = ref(false)
const currentType = ref<DictType | null>(null)
const currentItems = ref<DictItem[]>([])

async function openItems(row: DictType) {
  currentType.value = row
  const res = await getDictItems(row.code)
  currentItems.value = (res.data || []) as DictItem[]
  itemDialogVisible.value = true
}

async function createItemFromDialog(form: { id: string; code: string; name: string; sort_order: number; css_class: string }) {
  if (!form.code || !form.name) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (!currentType.value) return

  await createDictItem({
    dict_type_id: currentType.value.id,
    code: form.code,
    name: form.name,
    sort_order: form.sort_order,
    css_class: form.css_class || undefined,
    status: 'active'
  })
  ElMessage.success('新增成功')
  await reloadCurrentItems()
}

async function updateItemFromDialog(form: { id: string; code: string; name: string; sort_order: number; css_class: string }) {
  if (!form.code || !form.name) {
    ElMessage.warning('请填写必填项')
    return
  }

  await updateDictItem(form.id, {
    code: form.code,
    name: form.name,
    sort_order: form.sort_order,
    css_class: form.css_class || undefined
  })
  ElMessage.success('编辑成功')
  await reloadCurrentItems()
}

function deleteItem(id: string) {
  ElMessageBox.confirm('确定删除该字典项？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteDictItem(id)
      currentItems.value = currentItems.value.filter((item) => item.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

async function reloadCurrentItems() {
  if (!currentType.value) return
  const res = await getDictItems(currentType.value.code)
  currentItems.value = (res.data || []) as DictItem[]
}

function closeItemDialog() {
  currentType.value = null
  currentItems.value = []
}
</script>

<style scoped lang="scss">
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
