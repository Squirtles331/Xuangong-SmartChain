<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="字典类型管理"
    :search-columns="searchColumns"
    :columns="typeColumns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAddType"
  >
    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="typeActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
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
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { DictItem, DictType } from '@/api/system'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import { useTable } from '@/hooks/useTable'
import { sysDictItemRecords, sysDictTypeRecords } from '../static-data'
import DictItemsDialog from './DictItemsDialog.vue'
import DictTypeDialog, { type DictTypeFormModel } from './DictTypeDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '字典编码 / 字典名称', clearable: true } as any }
]

const typeColumns: TableColumnItem<DictType>[] = [
  { prop: 'code', label: '字典编码', minWidth: 180 },
  { prop: 'name', label: '字典名称', minWidth: 150 },
  { prop: 'description', label: '说明', minWidth: 220 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const typeActions = [
  { key: 'edit', label: '编辑', tone: 'primary' as const },
  { key: 'items', label: '字典项', tone: 'secondary' as const },
  { key: 'delete', label: '删除', tone: 'danger' as const }
]

const queryParams = reactive<{ keyword: string }>({
  keyword: ''
})

const statusOptions = [
  { label: '启用', value: 'active', type: 'success' as const },
  { label: '停用', value: 'disabled', type: 'info' as const }
]

const typeDialogVisible = ref(false)
const typeDialogMode = ref<'add' | 'edit'>('add')
const typeFormModel = ref<DictTypeFormModel>(createDefaultTypeForm())

const filteredTypes = computed(() => {
  const keyword = queryParams.keyword.trim().toLowerCase()

  if (!keyword) {
    return sysDictTypeRecords.value
  }

  return sysDictTypeRecords.value.filter((item) => item.code.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword))
})

const { tableData, pagination, loading, search, refresh } = useTable<DictType>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredTypes.value.slice(start, end),
      total: filteredTypes.value.length
    }
  }
})

function createDefaultTypeForm(): DictTypeFormModel {
  return { id: '', code: '', name: '', description: '' }
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

function handleRowAction(action: string, row: DictType) {
  if (action === 'edit') {
    openEditType(row)
    return
  }

  if (action === 'items') {
    openItems(row)
    return
  }

  if (action === 'delete') {
    deleteType(row)
  }
}

async function submitTypeDialog() {
  if (!typeFormModel.value.code || !typeFormModel.value.name) {
    ElMessage.warning('请填写字典编码和字典名称')
    return
  }

  if (typeDialogMode.value === 'add') {
    sysDictTypeRecords.value.unshift({
      id: `DICT-TYPE-${String(sysDictTypeRecords.value.length + 1).padStart(3, '0')}`,
      code: typeFormModel.value.code,
      name: typeFormModel.value.name,
      description: typeFormModel.value.description,
      status: 'active'
    })
    sysDictItemRecords.value[typeFormModel.value.code] = []
  } else {
    const previousCode = sysDictTypeRecords.value.find((item) => item.id === typeFormModel.value.id)?.code
    sysDictTypeRecords.value = sysDictTypeRecords.value.map((item) =>
      item.id === typeFormModel.value.id
        ? {
            ...item,
            code: typeFormModel.value.code,
            name: typeFormModel.value.name,
            description: typeFormModel.value.description
          }
        : item
    )

    if (previousCode && previousCode !== typeFormModel.value.code) {
      const previousItems = sysDictItemRecords.value[previousCode] || []
      delete sysDictItemRecords.value[previousCode]
      sysDictItemRecords.value[typeFormModel.value.code] = previousItems.map((item) => ({
        ...item,
        dictTypeCode: typeFormModel.value.code
      }))
    }
  }

  typeDialogVisible.value = false
  await refresh()
  ElMessage.success(typeDialogMode.value === 'add' ? '已新增静态字典类型' : '已更新静态字典类型')
}

async function deleteType(row: DictType) {
  await ElMessageBox.confirm('删除字典类型将同时删除其下所有字典项，确认删除？', '警告', { type: 'warning' })
  sysDictTypeRecords.value = sysDictTypeRecords.value.filter((item) => item.id !== row.id)
  delete sysDictItemRecords.value[row.code]
  ElMessage.success('删除成功')
  await refresh()
}

const itemDialogVisible = ref(false)
const currentType = ref<DictType | null>(null)
const currentItems = ref<DictItem[]>([])

async function openItems(row: DictType) {
  currentType.value = row
  currentItems.value = [...(sysDictItemRecords.value[row.code] || [])]
  itemDialogVisible.value = true
}

async function createItemFromDialog(form: { id: string; code: string; name: string; sortOrder: number; cssClass: string }) {
  if (!form.code || !form.name || !currentType.value) {
    ElMessage.warning('请填写字典项编码和字典项名称')
    return
  }

  const dictTypeCode = currentType.value.code
  const dictTypeId = currentType.value.id
  const items = sysDictItemRecords.value[dictTypeCode] || []

  sysDictItemRecords.value[dictTypeCode] = [
    ...items,
    {
      id: `DICT-ITEM-${String(items.length + 1).padStart(3, '0')}`,
      dictTypeId,
      dictTypeCode,
      code: form.code,
      name: form.name,
      sortOrder: form.sortOrder,
      cssClass: form.cssClass || undefined,
      status: 'active'
    }
  ]

  ElMessage.success('新增成功')
  await reloadCurrentItems()
}

async function updateItemFromDialog(form: { id: string; code: string; name: string; sortOrder: number; cssClass: string }) {
  if (!form.code || !form.name || !currentType.value) {
    ElMessage.warning('请填写字典项编码和字典项名称')
    return
  }

  const dictTypeCode = currentType.value.code
  sysDictItemRecords.value[dictTypeCode] = (sysDictItemRecords.value[dictTypeCode] || []).map((item) =>
    item.id === form.id
      ? {
          ...item,
          code: form.code,
          name: form.name,
          sortOrder: form.sortOrder,
          cssClass: form.cssClass || undefined
        }
      : item
  )

  ElMessage.success('编辑成功')
  await reloadCurrentItems()
}

async function deleteItem(id: string) {
  if (!currentType.value) return

  await ElMessageBox.confirm('确定删除该字典项？', '提示', { type: 'warning' })
  sysDictItemRecords.value[currentType.value.code] = (sysDictItemRecords.value[currentType.value.code] || []).filter((item) => item.id !== id)
  currentItems.value = currentItems.value.filter((item) => item.id !== id)
  ElMessage.success('删除成功')
}

async function reloadCurrentItems() {
  if (!currentType.value) return
  currentItems.value = [...(sysDictItemRecords.value[currentType.value.code] || [])]
}

function closeItemDialog() {
  currentType.value = null
  currentItems.value = []
}
</script>
