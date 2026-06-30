<template>
  <gi-page-layout :size="220" style="height: calc(100vh - 120px)">
    <template #left>
      <el-tree
        :data="catTree"
        :props="{ children: 'children', label: 'name' }"
        node-key="id"
        default-expand-all
        highlight-current
        @node-click="onCatClick"
      />
    </template>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @reset="handleReset" @search="handleSearch" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #index="{ $index }">
        {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
      </template>
      <template #type="{ row }">
        <el-tag size="small">
          {{ row.type === 'purchased' ? '外购' : row.type === 'manufactured' ? '自制' : '委外' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <MaterialFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getMaterialList, getMaterialTree, createMaterial, updateMaterial, deleteMaterial } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import MaterialFormDialog, { type MaterialFormModel } from './MaterialFormDialog.vue'

interface MaterialRow {
  id: string
  code: string
  name: string
  spec: string
  type: string
  unit: string
}

const catTree = ref<any[]>([])

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  category: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码/名称', clearable: true } as any },
  { type: 'input', label: '分类', field: 'category', props: { disabled: true } as any }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<MaterialRow>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '物料编码', width: 180 },
  { prop: 'name', label: '物料名称', minWidth: 140 },
  { prop: 'spec', label: '规格型号', width: 120 },
  { label: '物料类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 60, align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<MaterialRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: { pageNum: number; pageSize: number; code?: string; name?: string } = {
      pageNum: page,
      pageSize: size
    }
    if (searchForm.value.keyword) {
      params.name = searchForm.value.keyword
    }
    const res = await getMaterialList(params)
    return {
      list: res.data.list.map((item) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        spec: item.spec || '',
        type: item.type,
        unit: item.unit
      })),
      total: res.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteMaterial(id)))
})

// Tree
async function fetchTree() {
  const res = await getMaterialTree()
  catTree.value = res.data as any[]
}
fetchTree()

function onCatClick(data: any) {
  searchForm.value.category = data.name
  search()
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value.keyword = ''
  searchForm.value.category = ''
  search()
}

// Dialog
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<MaterialFormModel>(createDefaultFormModel())

function createDefaultFormModel(): MaterialFormModel {
  return { id: '', code: '', name: '', spec: '', type: 'purchased', unit: '' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: MaterialRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写必填项')
    return
  }
  const payload = { ...formModel.value }
  if (dialogMode.value === 'add') {
    await createMaterial(payload as any)
  } else {
    await updateMaterial(formModel.value.id, payload as any)
  }
  dialogVisible.value = false
  await refresh()
}
</script>
