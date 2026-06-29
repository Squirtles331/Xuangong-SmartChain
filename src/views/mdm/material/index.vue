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
      <SearchSetting :columns="allSearchColumns" storage-key="material-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="searchFormRef" v-model="searchForm" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>
    <gi-table :columns="columns" :data="pagedMaterials" :pagination="pagination" border stripe>
      <template #index="{ $index }">{{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}</template>
      <template #type="{ row }">
        <el-tag size="small">{{ row.type === 'purchased' ? '外购' : row.type === 'manufactured' ? '自制' : '委外' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row.id)" />
      </template>
    </gi-table>
    <gi-dialog
      v-model="dialogVisible"
      :footer="true"
      :on-before-ok="submitDialog"
      :title="dialogMode === 'add' ? '新增物料' : '编辑物料'"
      width="600px"
    >
      <gi-form v-model="formModel" :columns="formColumns" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { getMaterialList, getMaterialTree, createMaterial, updateMaterial, deleteMaterial } from '@/api/mdm'

interface M {
  id: string
  code: string
  name: string
  spec: string
  type: string
  unit: string
}

const catTree = ref<any[]>([])

const materials = ref<M[]>([])

const searchForm = reactive({ keyword: '', category: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码/名称', clearable: true } as any },
  { type: 'input', label: '分类', field: 'category', props: { disabled: true } as any }
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => searchColumns)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const searchFormRef = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<M>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '物料编码', width: 180 },
  { prop: 'name', label: '物料名称', minWidth: 140 },
  { prop: 'spec', label: '规格型号', width: 120 },
  { label: '物料类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 60, align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pagedMaterials = ref<M[]>([])

onMounted(() => {
  fetchTree()
  fetchData()
})

async function fetchTree() {
  const res = await getMaterialTree()
  catTree.value = res.data as any[]
}

async function fetchData() {
  const params: { page: number; page_size: number; code?: string; name?: string } = {
    page: pagination.currentPage,
    page_size: pagination.pageSize
  }
  if (searchForm.keyword) {
    // Try both code and name search
    params.name = searchForm.keyword
  }
  const res = await getMaterialList(params)
  materials.value = res.data.items as M[]
  pagination.total = res.data.total
  pagedMaterials.value = res.data.items as M[]
}

function onCatClick(data: any) {
  searchForm.category = data.name
  pagination.currentPage = 1
}
function handleSearch() {
  pagination.currentPage = 1
  fetchData()
}
function handleReset() {
  searchForm.keyword = ''
  searchForm.category = ''
  pagination.currentPage = 1
  fetchData()
}
function refresh() {
  handleReset()
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const formModel = reactive({ code: '', name: '', spec: '', type: 'purchased', unit: '' })
const formColumns: FormColumnItem[] = [
  { type: 'input', label: '物料编码', field: 'code', required: true },
  { type: 'input', label: '物料名称', field: 'name', required: true },
  { type: 'input', label: '规格型号', field: 'spec' },
  {
    type: 'select-v2',
    label: '物料类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '外购', value: 'purchased' },
        { label: '自制', value: 'manufactured' },
        { label: '委外', value: 'outsourced' }
      ]
    } as any
  },
  { type: 'input', label: '单位', field: 'unit', required: true }
]

function openAdd() {
  dialogMode.value = 'add'
  editingId.value = ''
  Object.assign(formModel, { code: '', name: '', spec: '', type: 'purchased', unit: '' })
  dialogVisible.value = true
}
function openEdit(row: M) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  Object.assign(formModel, row)
  dialogVisible.value = true
}
async function submitDialog() {
  if (!formModel.code || !formModel.name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (dialogMode.value === 'add') {
    await createMaterial({ ...formModel })
  } else {
    await updateMaterial(editingId.value, { ...formModel })
  }
  await fetchData()
  return true
}
async function remove(id: string) {
  await deleteMaterial(id)
  await fetchData()
}
</script>
