<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" :required-fields="['keyword']" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAddType" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="表格工具栏" :columns="typeColumns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEditType(row)" />
            <gi-button type="delete" @click="deleteType(row)" />
            <el-button type="primary" link size="small" @click="openItems(row)">字典项</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

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
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createDictItem,
  createDictType,
  deleteDictItem,
  deleteDictType,
  getDictItems,
  getDictTypeList,
  updateDictItem,
  updateDictType,
  type DictItem,
  type DictType,
  type DictTypeQuery
} from '@/api/system'
import { useTable } from '@/hooks/useTable'
import DictItemsDialog from './DictItemsDialog.vue'
import DictTypeDialog, { type DictTypeFormModel } from './DictTypeDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '字典编码/字典名称' } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const typeColumns: TableColumnItem<DictType>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '字典编码', minWidth: 180 },
  { prop: 'name', label: '字典名称', minWidth: 140 },
  { prop: 'description', label: '描述', minWidth: 200 },
  { label: '状态', minWidth: 100, slotName: 'status' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
}>({
  keyword: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const typeDialogVisible = ref(false)
const typeDialogMode = ref<'add' | 'edit'>('add')
const typeFormModel = ref<DictTypeFormModel>(createDefaultTypeForm())

const { tableData, pagination, loading, search, refresh } = useTable<DictType>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: DictTypeQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined
    }

    const response = await getDictTypeList(params)
    return response.data
  }
})

function createDefaultTypeForm(): DictTypeFormModel {
  return { id: '', code: '', name: '', description: '' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: ''
  })
  search()
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
    ElMessage.warning('请填写字典编码和字典名称')
    return
  }

  if (typeDialogMode.value === 'add') {
    await createDictType({
      code: typeFormModel.value.code,
      name: typeFormModel.value.name,
      description: typeFormModel.value.description,
      status: 'active'
    })
  } else {
    await updateDictType(typeFormModel.value.id, {
      code: typeFormModel.value.code,
      name: typeFormModel.value.name,
      description: typeFormModel.value.description
    })
  }

  typeDialogVisible.value = false
  await refresh()
}

async function deleteType(row: DictType) {
  await ElMessageBox.confirm('删除字典类型将同时删除其下所有字典项，确认删除？', '警告', { type: 'warning' })
  await deleteDictType(row.id)
  ElMessage.success('删除成功')
  await refresh()
}

const itemDialogVisible = ref(false)
const currentType = ref<DictType | null>(null)
const currentItems = ref<DictItem[]>([])

async function openItems(row: DictType) {
  currentType.value = row
  const response = await getDictItems(row.code)
  currentItems.value = response.data
  itemDialogVisible.value = true
}

async function createItemFromDialog(form: { id: string; code: string; name: string; sortOrder: number; cssClass: string }) {
  if (!form.code || !form.name || !currentType.value) {
    ElMessage.warning('请填写字典项编码和字典项名称')
    return
  }

  await createDictItem({
    dictTypeId: currentType.value.id,
    dictTypeCode: currentType.value.code,
    code: form.code,
    name: form.name,
    sortOrder: form.sortOrder,
    cssClass: form.cssClass || undefined,
    status: 'active'
  })

  ElMessage.success('新增成功')
  await reloadCurrentItems()
}

async function updateItemFromDialog(form: { id: string; code: string; name: string; sortOrder: number; cssClass: string }) {
  if (!form.code || !form.name) {
    ElMessage.warning('请填写字典项编码和字典项名称')
    return
  }

  await updateDictItem(form.id, {
    code: form.code,
    name: form.name,
    sortOrder: form.sortOrder,
    cssClass: form.cssClass || undefined
  })

  ElMessage.success('编辑成功')
  await reloadCurrentItems()
}

async function deleteItem(id: string) {
  await ElMessageBox.confirm('确定删除该字典项？', '提示', { type: 'warning' })
  await deleteDictItem(id)
  currentItems.value = currentItems.value.filter((item) => item.id !== id)
  ElMessage.success('删除成功')
}

async function reloadCurrentItems() {
  if (!currentType.value) return
  const response = await getDictItems(currentType.value.code)
  currentItems.value = response.data
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
