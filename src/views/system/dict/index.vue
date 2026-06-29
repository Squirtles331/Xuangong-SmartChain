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

    <!-- 字典类型弹窗 -->
    <DictTypeDialog v-model:visible="typeDialogVisible" v-model:form="typeFormModel" :mode="typeDialogMode" @submit="submitTypeDialog" />

    <!-- 字典项管理弹窗 -->
    <gi-dialog v-model="itemDialogVisible" :footer="false" :title="`字典项管理 — ${currentType?.name || ''}`" width="800px" @close="closeItemDialog">
      <div class="dict-items-header">
        <gi-button type="add" size="small" @click="openAddItem">新增字典项</gi-button>
      </div>
      <gi-table :columns="itemColumns" :data="currentItems" border size="small" style="margin-top: 12px">
        <template #status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
        </template>
        <template #itemActions="{ row }">
          <gi-button type="edit" size="small" @click="openEditItem(row)" />
          <gi-button type="delete" size="small" @click="deleteItem(row.id)" />
        </template>
      </gi-table>

      <!-- 字典项弹窗 -->
      <DictItemDialog v-model:visible="itemFormVisible" v-model:form="itemFormModel" :mode="itemDialogMode" @submit="submitItemDialog" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import type { DictType, DictItem } from '@/api/system'
import { getDictTypeList, getDictItems, createDictType, createDictItem, updateDictItem, deleteDictItem } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import DictTypeDialog, { type DictTypeFormModel } from './DictTypeDialog.vue'
import DictItemDialog, { type DictItemFormModel } from './DictItemDialog.vue'

// ==================== useTable ====================
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

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<DictType>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params = {
      page,
      page_size: size
    }
    const response = await getDictTypeList(params)
    return {
      list: response.data.items as DictType[],
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.resolve()
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value.keyword = ''
  search()
}

// ==================== 字典类型 CRUD ====================
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
    // Update locally via refresh
    ElMessage.success('编辑成功')
  }
  typeDialogVisible.value = false
  await refresh()
}

function deleteType(row: DictType) {
  ElMessageBox.confirm('删除字典类型将同时删除其下所有字典项，确定删除？', '警告', { type: 'warning' })
    .then(async () => {
      // Local delete + refresh
      await refresh()
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

// ==================== 字典项管理 ====================
const itemDialogVisible = ref(false)
const currentType = ref<DictType | null>(null)
const currentItems = ref<DictItem[]>([])
const itemFormVisible = ref(false)
const itemDialogMode = ref<'add' | 'edit'>('add')
const itemFormModel = ref<DictItemFormModel>(createDefaultItemForm())

function createDefaultItemForm(): DictItemFormModel {
  return { id: '', code: '', name: '', sort_order: 1, css_class: '' }
}

async function openItems(row: DictType) {
  currentType.value = row
  const res = await getDictItems(row.code)
  currentItems.value = (res.data || []) as DictItem[]
  itemDialogVisible.value = true
}

function openAddItem() {
  itemDialogMode.value = 'add'
  itemFormModel.value = createDefaultItemForm()
  itemFormVisible.value = true
}

function openEditItem(row: DictItem) {
  itemDialogMode.value = 'edit'
  itemFormModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    sort_order: row.sort_order,
    css_class: row.css_class || ''
  }
  itemFormVisible.value = true
}

async function submitItemDialog() {
  if (!itemFormModel.value.code || !itemFormModel.value.name) {
    ElMessage.warning('请填写必填项')
    return
  }
  if (itemDialogMode.value === 'add') {
    await createDictItem({
      dict_type_id: currentType.value!.id,
      code: itemFormModel.value.code,
      name: itemFormModel.value.name,
      sort_order: itemFormModel.value.sort_order,
      css_class: itemFormModel.value.css_class || undefined,
      status: 'active'
    })
    ElMessage.success('新增成功')
  } else {
    await updateDictItem(itemFormModel.value.id, {
      code: itemFormModel.value.code,
      name: itemFormModel.value.name,
      sort_order: itemFormModel.value.sort_order,
      css_class: itemFormModel.value.css_class || undefined
    })
    ElMessage.success('编辑成功')
  }
  itemFormVisible.value = false
  // Reload items
  if (currentType.value) {
    const res = await getDictItems(currentType.value.code)
    currentItems.value = (res.data || []) as DictItem[]
  }
}

function deleteItem(id: string) {
  ElMessageBox.confirm('确定删除该字典项？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteDictItem(id)
      currentItems.value = currentItems.value.filter((i) => i.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function closeItemDialog() {
  currentType.value = null
  currentItems.value = []
}

const itemColumns: TableColumnItem<DictItem>[] = [
  { type: 'index', label: '#', width: 50 },
  { prop: 'code', label: '编码', width: 140 },
  { prop: 'name', label: '名称', width: 140 },
  { prop: 'sort_order', label: '排序', minWidth: 80, align: 'center' },
  { prop: 'css_class', label: '样式', width: 100 },
  { label: '状态', minWidth: 80, slotName: 'status' },
  { label: '操作', minWidth: 160, slotName: 'itemActions', align: 'center' }
]
</script>

<style scoped lang="scss">
.dict-items-header {
  display: flex;
  justify-content: flex-end;
}
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
