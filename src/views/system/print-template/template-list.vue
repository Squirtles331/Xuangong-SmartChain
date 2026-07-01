<template>
  <gi-page-layout :size="280" style="height: calc(100vh - 120px)">
    <template #left>
      <div class="tree-wrapper">
        <div class="tree-header">
          <span class="tree-title">打印模板分类</span>
          <el-button link type="primary" @click="loadCategoryTree">刷新</el-button>
        </div>

        <el-tree
          ref="treeRef"
          :data="categoryTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        />
      </div>
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
      <el-button style="margin-left: 8px" @click="router.push({ name: 'printTemplate' })">返回分类</el-button>
    </template>

    <TableSetting :title="tableTitle" :columns="columns" @refresh="refresh">
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

          <template #systemBuiltin="{ row }">
            <el-tag :type="row.systemBuiltin ? 'primary' : 'info'">
              {{ row.systemBuiltin ? '是' : '否' }}
            </el-tag>
          </template>

          <template #isDefault="{ row }">
            <el-switch :model-value="row.isDefault" @change="(value) => handleDefaultChange(row, value)" />
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button type="warning" link size="small" @click="openDesigner(row)">编辑打印模板</el-button>
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PrintTemplateDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :category-options="categoryOptions"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { ElTree } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { useRoute, useRouter } from 'vue-router'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createPrintTemplate,
  deletePrintTemplate,
  getPrintTemplateCategoryTree,
  getPrintTemplateList,
  setPrintTemplateDefault,
  updatePrintTemplate,
  type PrintTemplate,
  type PrintTemplateCategory,
  type PrintTemplateQuery
} from '@/api/system'
import { useTable } from '@/hooks/useTable'
import PrintTemplateDialog, { type PrintTemplateFormModel } from './PrintTemplateDialog.vue'

const router = useRouter()
const route = useRoute()
const treeRef = ref<InstanceType<typeof ElTree> | null>(null)

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
    props: { placeholder: '请输入模板名称/备注', clearable: true } as any
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

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

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

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const categoryTree = ref<PrintTemplateCategory[]>([])
const selectedCategoryId = ref((route.params.categoryId as string) || '')
const selectedCategoryName = ref('')
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PrintTemplateFormModel>(createDefaultFormModel())

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

const tableTitle = computed(() => (selectedCategoryName.value ? `${selectedCategoryName.value} 模板列表` : '打印模板列表'))

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PrintTemplate>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PrintTemplateQuery = {
      pageNum: page,
      pageSize: size,
      categoryId: selectedCategoryId.value || undefined,
      keyword: queryParams.keyword || undefined,
      systemBuiltin: queryParams.systemBuiltin === '' ? undefined : queryParams.systemBuiltin === 'true' ? true : false
    }

    const response = await getPrintTemplateList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePrintTemplate(id)))
})

loadCategoryTree()

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

async function loadCategoryTree() {
  const response = await getPrintTemplateCategoryTree()
  categoryTree.value = response.data
  syncSelectedCategory()
}

function syncSelectedCategory() {
  if (!selectedCategoryId.value) return

  let found: PrintTemplateCategory | null = null
  function walk(nodes: PrintTemplateCategory[]) {
    for (const node of nodes) {
      if (node.id === selectedCategoryId.value) {
        found = node
        return
      }
      if (node.children?.length) walk(node.children)
      if (found) return
    }
  }

  walk(categoryTree.value)
  if (found) {
    selectedCategoryName.value = found.name
    treeRef.value?.setCurrentKey(found.id)
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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
  selectedCategoryName.value = node.name
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

function openDesigner(row: PrintTemplate) {
  router.push({
    name: 'printTemplateDesigner',
    params: { id: row.id }
  })
}

async function handleDefaultChange(row: PrintTemplate, value: boolean | string | number) {
  if (!value) {
    await refresh()
    return
  }
  await setPrintTemplateDefault(row.id)
  ElMessage.success('默认模板已更新')
  await refresh()
}

async function submitDialog() {
  if (!formModel.value.categoryId || !formModel.value.name) {
    ElMessage.warning('请选择模板分类并填写模板名称')
    return
  }

  const payload = {
    categoryId: formModel.value.categoryId,
    name: formModel.value.name,
    systemBuiltin: formModel.value.systemBuiltin,
    isDefault: formModel.value.isDefault,
    remark: formModel.value.remark
  }

  if (dialogMode.value === 'add') {
    await createPrintTemplate(payload)
  } else {
    await updatePrintTemplate(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

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
