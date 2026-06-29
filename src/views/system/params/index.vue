<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="params-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="searchFormRef" v-model="searchForm" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="pagedData" :pagination="pagination" border style="height: 100%">
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="del(row.id)" />
      </template>
    </gi-table>

    <gi-dialog v-model="dialogVisible" :footer="true" :on-before-ok="submitDialog" :title="dialogMode === 'add' ? '新增参数' : '编辑参数'">
      <gi-form v-model="form" :columns="formColumns" :label-width="120" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

interface Param {
  id: string
  code: string
  name: string
  value: string
  description: string
}

import { systemParams as mockParams } from '@/mock'

const params = ref<Param[]>(mockParams as any)

const searchForm = reactive({ keyword: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '编码/名称', clearable: true } as any }
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => searchColumns)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const searchFormRef = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<Param>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '参数编码', minWidth: 200 },
  { prop: 'name', label: '参数名称', minWidth: 180 },
  { prop: 'value', label: '参数值', minWidth: 120, align: 'center' },
  { prop: 'description', label: '说明', minWidth: 250 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const filteredData = computed(() => {
  const kw = searchForm.keyword?.toLowerCase() || ''
  return kw ? params.value.filter((p) => p.code.toLowerCase().includes(kw) || p.name.toLowerCase().includes(kw)) : params.value
})
const pagedData = computed(() => {
  const s = (pagination.currentPage - 1) * pagination.pageSize
  return filteredData.value.slice(s, s + pagination.pageSize)
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const form = reactive({ code: '', name: '', value: '', description: '' })
const formColumns: FormColumnItem[] = [
  { type: 'input', label: '参数编码', field: 'code', required: true },
  { type: 'input', label: '参数名称', field: 'name', required: true },
  { type: 'input', label: '参数值', field: 'value', required: true },
  { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 2 } as any }
]

function handleSearch() {
  pagination.currentPage = 1
}
function handleReset() {
  searchForm.keyword = ''
  pagination.currentPage = 1
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      params.value = params.value.filter((e: any) => e.id !== id)
      if ((pagination.currentPage - 1) * pagination.pageSize >= filteredData.value.length) {
        pagination.currentPage = Math.max(1, pagination.currentPage - 1)
      }
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
function refresh() {
  handleReset()
}

function openAdd() {
  dialogMode.value = 'add'
  form.code = ''
  form.name = ''
  form.value = ''
  form.description = ''
  dialogVisible.value = true
}
function openEdit(row: Param) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  form.code = row.code
  form.name = row.name
  form.value = row.value
  form.description = row.description
  dialogVisible.value = true
}

async function submitDialog() {
  if (!form.code || !form.name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (dialogMode.value === 'add') {
    params.value.unshift({ id: Date.now().toString(), ...form })
    ElMessage.success('新增成功')
  } else {
    const p = params.value.find((p) => p.id === editingId.value)
    if (p) Object.assign(p, form)
    ElMessage.success('保存成功')
  }
  return true
}

// 自动更新分页total
watch(
  filteredData,
  (val) => {
    pagination.total = val.length
  },
  { immediate: true }
)
</script>
