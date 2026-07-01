<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @reset="handleReset"
          @search="search"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="打印模板" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #category="{ row }">
            {{ categoryLabel(row.category) }}
          </template>
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="STATUS_OPTIONS" />
          </template>
          <template #actions="{ row }">
            <gi-button type="primary" link @click="openPreview(row)">预览</gi-button>
            <gi-button style="margin-left: 8px" type="edit" @click="openDesigner(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { deletePrintTemplate, getPrintTemplateList, type PrintTemplate, type TemplateCategory } from '@/api/print'
import { useTable } from '@/hooks/useTable'

const router = useRouter()

const CATEGORY_OPTIONS = [
  { label: '全部', value: '' },
  { label: '业务单据', value: 'document' },
  { label: '标签/条码', value: 'label' },
  { label: '报告', value: 'report' },
  { label: '证书/凭证', value: 'certificate' }
]

function categoryLabel(value: string): string {
  return CATEGORY_OPTIONS.find((o) => o.value === value)?.label ?? value
}

const STATUS_OPTIONS = [
  { value: 'published', label: '已发布', type: 'success' as const },
  { value: 'draft', label: '草稿', type: 'info' as const }
]

const queryParams = reactive({
  keyword: '',
  category: '' as TemplateCategory | ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '模板名称', field: 'keyword' },
  { type: 'select-v2', label: '分类', field: 'category', props: { options: CATEGORY_OPTIONS } as any }
]
const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<PrintTemplate>[] = [
  { prop: 'name', label: '模板名称', minWidth: 180 },
  { prop: 'templateKey', label: '业务键', minWidth: 180 },
  { prop: 'module', label: '模块', width: 100 },
  { prop: 'category', label: '分类', width: 120, slotName: 'category' },
  { prop: 'version', label: '版本', width: 80, align: 'center' },
  { prop: 'status', label: '状态', width: 100, slotName: 'status', align: 'center' },
  { prop: 'updatedAt', label: '更新时间', minWidth: 160 },
  { label: '操作', minWidth: 220, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PrintTemplate>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getPrintTemplateList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      category: queryParams.category || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePrintTemplate(id)))
})

const previewVisible = ref(false)
const previewTemplate = ref<PrintTemplate | null>(null)

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, { keyword: '', category: '' })
  search()
}

function openAdd() {
  ElMessage.info('新建模板向导将在设计器阶段接入，当前可预览已有模板')
}

function openDesigner(row: PrintTemplate) {
  router.push({ name: 'printTemplateDesigner', params: { id: row.id } })
}

function openPreview(row: PrintTemplate) {
  router.push({ name: 'printTemplatePreview', params: { id: row.id } })
}
</script>
