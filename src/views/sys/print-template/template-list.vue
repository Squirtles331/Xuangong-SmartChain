<template>
  <CrudPage
    v-model:search-model="queryParams"
    :title="tableTitle"
    :page-attrs="{ size: 280, style: 'height: calc(100vh - 120px)' }"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #left>
      <div class="tree-wrapper">
        <div class="tree-header">
          <span class="tree-title">打印模板分类</span>
          <el-button link type="primary" @click="refresh">刷新</el-button>
        </div>

        <el-tree
          :data="categoryTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          highlight-current
          :current-node-key="selectedCategoryId || undefined"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        />
      </div>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd">新增</gi-button>
      <gi-button type="reset" @click="refresh">刷新</gi-button>
      <el-button @click="router.push({ name: 'printTemplate' })">返回分类</el-button>
    </template>

    <template #index="{ $index }">
      {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
    </template>

    <template #systemBuiltin="{ row }">
      <el-tag :type="row.systemBuiltin ? 'primary' : 'info'">
        {{ row.systemBuiltin ? '是' : '否' }}
      </el-tag>
    </template>

    <template #isDefault="{ row }">
      <el-switch :model-value="row.isDefault" @change="(value) => handleDefaultChange(row, value)" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="templateActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <PrintTemplateDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :category-options="categoryOptions"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { PrintTemplate, PrintTemplateCategory } from '@/api/system'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { useRoute, useRouter } from 'vue-router'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import { useTable } from '@/hooks/useTable'
import {
  buildPrintTemplateCategoryTree,
  getPrintTemplateCategoryName,
  sysPrintTemplateCategoryRecords,
  sysPrintTemplateRecords
} from '../static-data'
import PrintTemplateDialog, { type PrintTemplateFormModel } from './PrintTemplateDialog.vue'

const router = useRouter()
const route = useRoute()

const queryParams = reactive<{
  keyword: string
  systemBuiltin: '' | 'true' | 'false'
}>({
  keyword: '',
  systemBuiltin: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '模板名称',
    field: 'keyword',
    props: { placeholder: '请输入模板名称 / 备注', clearable: true } as any
  },
  {
    type: 'select-v2',
    label: '系统内置',
    field: 'systemBuiltin',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '是', value: 'true' },
        { label: '否', value: 'false' }
      ]
    } as any
  }
]

const columns: TableColumnItem<PrintTemplate>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'categoryName', label: '模板分类', minWidth: 140 },
  { prop: 'name', label: '模板名称', minWidth: 180 },
  { prop: 'systemBuiltin', label: '系统内置模板', minWidth: 120, slotName: 'systemBuiltin', align: 'center' },
  { prop: 'isDefault', label: '默认模板', minWidth: 100, slotName: 'isDefault', align: 'center' },
  { prop: 'remark', label: '备注', minWidth: 180 },
  { prop: 'createdBy', label: '创建人', minWidth: 120 },
  { prop: 'createdAt', label: '创建时间', minWidth: 180 },
  { prop: 'updatedBy', label: '修改人', minWidth: 120 },
  { prop: 'updatedAt', label: '修改时间', minWidth: 180 },
  { label: '操作', minWidth: 260, slotName: 'actions', fixed: 'right', align: 'center' }
]

const templateActions = [
  { key: 'edit', label: '编辑', tone: 'primary' as const },
  { key: 'designer', label: '编辑模板', tone: 'secondary' as const },
  { key: 'delete', label: '删除', tone: 'danger' as const }
]

const selectedCategoryId = ref(String(route.params.categoryId || ''))
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PrintTemplateFormModel>(createDefaultFormModel())

const categoryTree = computed(() => buildPrintTemplateCategoryTree())
const selectedCategoryName = computed(() => (selectedCategoryId.value ? getPrintTemplateCategoryName(selectedCategoryId.value) : ''))
const categoryOptions = computed(() => {
  const options: Array<{ label: string; value: string }> = []

  function walk(nodes: PrintTemplateCategory[], prefix = '') {
    nodes.forEach((node) => {
      options.push({
        label: `${prefix}${node.name}`,
        value: node.id
      })

      if (node.children?.length) {
        walk(node.children, `${prefix}${node.name} / `)
      }
    })
  }

  walk(categoryTree.value)
  return options
})

const tableTitle = computed(() => (selectedCategoryName.value ? `${selectedCategoryName.value}模板列表` : '打印模板列表'))

const filteredRecords = computed(() =>
  sysPrintTemplateRecords.value.filter((item) => {
    const matchCategory = !selectedCategoryId.value || item.categoryId === selectedCategoryId.value
    const matchKeyword = !queryParams.keyword || item.name.includes(queryParams.keyword) || item.remark.includes(queryParams.keyword)
    const matchSystemBuiltin = queryParams.systemBuiltin === '' || (queryParams.systemBuiltin === 'true' ? item.systemBuiltin : !item.systemBuiltin)
    return matchCategory && matchKeyword && matchSystemBuiltin
  })
)

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PrintTemplate>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    sysPrintTemplateRecords.value = sysPrintTemplateRecords.value.filter((item) => !ids.includes(item.id))
  }
})

watch(
  () => route.params.categoryId,
  (value) => {
    selectedCategoryId.value = String(value || '')
    search()
  }
)

function createDefaultFormModel(): PrintTemplateFormModel {
  return {
    id: '',
    categoryId: selectedCategoryId.value || '',
    name: '',
    systemBuiltin: false,
    isDefault: false,
    remark: ''
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    systemBuiltin: ''
  })
  search()
}

function handleNodeClick(node: PrintTemplateCategory) {
  selectedCategoryId.value = node.id
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = {
    ...createDefaultFormModel(),
    categoryId: selectedCategoryId.value || ''
  }
  dialogVisible.value = true
}

function openEdit(row: PrintTemplate) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    categoryId: row.categoryId,
    name: row.name,
    systemBuiltin: row.systemBuiltin,
    isDefault: row.isDefault,
    remark: row.remark
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: PrintTemplate) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'designer') {
    router.push({
      name: 'printTemplateDesigner',
      params: { id: row.id }
    })
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function handleDefaultChange(row: PrintTemplate, value: boolean | string | number) {
  if (!value) {
    row.isDefault = true
    return
  }

  sysPrintTemplateRecords.value = sysPrintTemplateRecords.value.map((item) => ({
    ...item,
    isDefault: item.categoryId === row.categoryId ? item.id === row.id : item.isDefault
  }))

  ElMessage.success('默认模板已更新')
  await refresh()
}

async function submitDialog() {
  if (!formModel.value.categoryId || !formModel.value.name) {
    ElMessage.warning('请选择模板分类并填写模板名称')
    return
  }

  const categoryName = getPrintTemplateCategoryName(formModel.value.categoryId)
  const payload = {
    categoryId: formModel.value.categoryId,
    categoryName,
    name: formModel.value.name,
    systemBuiltin: formModel.value.systemBuiltin,
    isDefault: formModel.value.isDefault,
    remark: formModel.value.remark,
    templateData: {
      version: 'static-demo',
      title: formModel.value.name,
      blocks: ['header', 'detail', 'footer']
    },
    createdBy: '当前用户',
    createdAt: '2026-07-13 16:50',
    updatedBy: '当前用户',
    updatedAt: '2026-07-13 16:50'
  } satisfies Omit<PrintTemplate, 'id'>

  if (payload.isDefault) {
    sysPrintTemplateRecords.value = sysPrintTemplateRecords.value.map((item) => ({
      ...item,
      isDefault: item.categoryId === payload.categoryId ? false : item.isDefault
    }))
  }

  if (dialogMode.value === 'add') {
    sysPrintTemplateRecords.value.unshift({
      id: `PT-${String(sysPrintTemplateRecords.value.length + 1).padStart(3, '0')}`,
      ...payload
    })
  } else {
    sysPrintTemplateRecords.value = sysPrintTemplateRecords.value.map((item) =>
      item.id === formModel.value.id
        ? {
            ...item,
            ...payload,
            createdBy: item.createdBy,
            createdAt: item.createdAt
          }
        : item
    )
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '已新增静态打印模板' : '已更新静态打印模板')
}
</script>

<style scoped>
.tree-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.tree-title {
  font-size: 14px;
  font-weight: 600;
}

.tree-wrapper :deep(.el-tree) {
  flex: 1;
  overflow: auto;
}
</style>
