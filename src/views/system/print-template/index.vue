<template>
  <gi-page-layout>
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

    <TableSetting title="打印模板分类" :columns="columns" @refresh="refresh">
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

          <template #name="{ row }">
            <el-button link type="primary" @click="openTemplates(row)">
              {{ row.name }}
            </el-button>
          </template>

          <template #parentName="{ row }">
            {{ row.parentName || '-' }}
          </template>

          <template #updatedBy="{ row }">
            {{ row.updatedBy || '-' }}
          </template>

          <template #updatedAt="{ row }">
            {{ row.updatedAt || '-' }}
          </template>

          <template #actions="{ row }">
            <el-button link type="primary" size="small" @click="openTemplates(row)">模板设置</el-button>
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PrintTemplateCategoryDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :parent-options="parentOptions"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createPrintTemplateCategory,
  deletePrintTemplateCategory,
  getPrintTemplateCategoryList,
  getPrintTemplateCategoryTree,
  updatePrintTemplateCategory,
  type PrintTemplateCategory,
  type PrintTemplateCategoryQuery
} from '@/api/system'
import { useTable } from '@/hooks/useTable'
import PrintTemplateCategoryDialog, { type PrintTemplateCategoryFormModel } from './PrintTemplateCategoryDialog.vue'

const router = useRouter()

const queryParams = reactive({
  keyword: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '分类名称',
    field: 'keyword',
    props: { placeholder: '请输入分类名称/编码', clearable: true } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<PrintTemplateCategory>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'name', label: '分类名称', minWidth: 160, slotName: 'name' },
  { prop: 'code', label: '分类编码', minWidth: 180 },
  { prop: 'parentName', label: '上级分类', minWidth: 140, slotName: 'parentName' },
  { prop: 'level', label: '层级', minWidth: 80, align: 'center' },
  { prop: 'createdBy', label: '创建人', minWidth: 120 },
  { prop: 'createdAt', label: '创建时间', minWidth: 180 },
  { prop: 'updatedBy', label: '修改人', minWidth: 120, slotName: 'updatedBy' },
  { prop: 'updatedAt', label: '修改时间', minWidth: 180, slotName: 'updatedAt' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PrintTemplateCategoryFormModel>(createDefaultFormModel())
const categoryTree = ref<PrintTemplateCategory[]>([])

const parentOptions = computed(() => {
  const options: Array<{ label: string; value: string | null }> = [{ label: '无上级分类', value: null }]

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

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PrintTemplateCategory>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: PrintTemplateCategoryQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined
    }

    const response = await getPrintTemplateCategoryList(params)
    return response.data
  },
  deleteAPI: async (ids) => {
    await Promise.all(ids.map((id) => deletePrintTemplateCategory(id)))
    await loadCategoryTree()
  }
})

loadCategoryTree()

function createDefaultFormModel(): PrintTemplateCategoryFormModel {
  return {
    id: '',
    parentId: null,
    name: '',
    code: ''
  }
}

async function loadCategoryTree() {
  const response = await getPrintTemplateCategoryTree()
  categoryTree.value = response.data
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  queryParams.keyword = ''
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PrintTemplateCategory) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    code: row.code
  }
  dialogVisible.value = true
}

function openTemplates(row: PrintTemplateCategory) {
  router.push({
    name: 'printTemplateSettings',
    params: { categoryId: row.id }
  })
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.code) {
    ElMessage.warning('请填写分类名称和分类编码')
    return
  }

  const payload = {
    parentId: formModel.value.parentId,
    name: formModel.value.name,
    code: formModel.value.code
  }

  if (dialogMode.value === 'add') {
    await createPrintTemplateCategory(payload)
  } else {
    await updatePrintTemplateCategory(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await Promise.all([loadCategoryTree(), refresh()])
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
