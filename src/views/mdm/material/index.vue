<template>
  <gi-page-layout :size="220" style="height: calc(100vh - 120px)">
    <template #left>
      <el-tree
        :data="categoryTree"
        :props="{ children: 'children', label: 'name' }"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        highlight-current
        @node-click="onCategoryClick"
      />
    </template>

    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
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
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="物料列表" :columns="columns" @refresh="refresh">
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
          <template #index="{ $index }">
            {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
          </template>

          <template #type="{ row }">
            <el-tag size="small">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <MaterialFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createMaterial,
  deleteMaterial,
  getMaterialList,
  getMaterialTree,
  updateMaterial,
  type Material,
  type MaterialCategory,
  type MaterialQuery
} from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import MaterialFormDialog, { type MaterialFormModel } from './MaterialFormDialog.vue'

type MaterialRow = Material

const categoryTree = ref<MaterialCategory[]>([])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码/物料名称' } as any },
  { type: 'input', label: '分类', field: 'category', props: { disabled: true } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<MaterialRow>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '物料编码', minWidth: 180 },
  { prop: 'name', label: '物料名称', minWidth: 160 },
  { prop: 'spec', label: '规格型号', minWidth: 140 },
  { label: '物料类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  category: string
}>({
  keyword: '',
  category: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<MaterialFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<MaterialRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: MaterialQuery = {
      pageNum: page,
      pageSize: size,
      name: queryParams.keyword || undefined,
      category: queryParams.category || undefined
    }

    const response = await getMaterialList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteMaterial(id)))
})

init()

async function init() {
  const response = await getMaterialTree()
  categoryTree.value = response.data as MaterialCategory[]
}

function createDefaultFormModel(): MaterialFormModel {
  return {
    id: '',
    code: '',
    name: '',
    spec: '',
    type: 'purchased',
    unit: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function onCategoryClick(data: MaterialCategory) {
  queryParams.category = data.name
  search()
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    category: ''
  })
  search()
}

function getTypeLabel(type: Material['type']) {
  const typeLabelMap: Record<Material['type'], string> = {
    purchased: '外购',
    manufactured: '自制',
    outsourced: '委外'
  }
  return typeLabelMap[type]
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: MaterialRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    spec: row.spec,
    type: row.type,
    unit: row.unit
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写物料编码和物料名称')
    return
  }

  const { id, ...payload } = formModel.value

  if (dialogMode.value === 'add') {
    await createMaterial(payload)
  } else {
    await updateMaterial(id, payload)
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
