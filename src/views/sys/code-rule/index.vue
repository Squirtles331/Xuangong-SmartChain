<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="编码规则"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <CodeRuleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { CodeRule } from '@/api/system'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { sysCodeRuleRecords } from '../static-data'
import CodeRuleFormDialog, { type CodeRuleFormModel } from './CodeRuleFormDialog.vue'

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '关键字', field: 'keyword', props: { clearable: true } as any }]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<CodeRule>[] = [
  { prop: 'code', label: '规则编码', minWidth: 120 },
  { prop: 'name', label: '规则名称', minWidth: 160 },
  { prop: 'prefix', label: '前缀', minWidth: 100 },
  { prop: 'dateFormat', label: '日期格式', minWidth: 120 },
  { prop: 'serialLength', label: '流水号长度', minWidth: 120, align: 'center' },
  { prop: 'example', label: '预览示例', minWidth: 180 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<CodeRuleFormModel>(createDefaultFormModel())
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const filteredRecords = computed(() =>
  sysCodeRuleRecords.value.filter(
    (item) =>
      !queryParams.keyword ||
      item.code.includes(queryParams.keyword) ||
      item.name.includes(queryParams.keyword) ||
      item.prefix.includes(queryParams.keyword)
  )
)

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<CodeRule>({
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
    sysCodeRuleRecords.value = sysCodeRuleRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function createDefaultFormModel(): CodeRuleFormModel {
  return { id: '', code: '', name: '', prefix: '', dateFormat: 'YYYYMMDD', serialLength: 4 }
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

function openEdit(row: CodeRule) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    prefix: row.prefix,
    dateFormat: row.dateFormat,
    serialLength: row.serialLength
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: CodeRule) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.prefix) {
    ElMessage.warning('请填写规则编码、规则名称和前缀')
    return
  }

  const example = `${formModel.value.prefix}20250115${'0'.repeat(formModel.value.serialLength - 1)}1`

  if (dialogMode.value === 'add') {
    sysCodeRuleRecords.value.unshift({
      id: `RULE-${String(sysCodeRuleRecords.value.length + 1).padStart(3, '0')}`,
      code: formModel.value.code,
      name: formModel.value.name,
      prefix: formModel.value.prefix,
      dateFormat: formModel.value.dateFormat,
      serialLength: formModel.value.serialLength,
      example
    })
  } else {
    sysCodeRuleRecords.value = sysCodeRuleRecords.value.map((item) =>
      item.id === formModel.value.id
        ? {
            ...item,
            code: formModel.value.code,
            name: formModel.value.name,
            prefix: formModel.value.prefix,
            dateFormat: formModel.value.dateFormat,
            serialLength: formModel.value.serialLength,
            example
          }
        : item
    )
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '已新增静态编码规则数据' : '已更新静态编码规则数据')
}
</script>
