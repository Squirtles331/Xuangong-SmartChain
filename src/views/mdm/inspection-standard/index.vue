<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="检验标准"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :add-text="addText"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #status="{ row }">
      <StatusTag v-if="statusOptions.length" :value="row.status" :options="statusOptions" />
      <span v-else>{{ row.status ?? '-' }}</span>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <CrudFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :title="dialogMode === 'add' ? addText : editText"
        :columns="formColumns"
        width="680px"
        :label-width="110"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'

type MasterDataRow = Record<string, any>

type StatusOption = {
  value: string
  label: string
  type: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const title = '检验标准'
const addText = '新增' + title
const editText = '编辑' + title

const searchColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '关键字',
    'field': 'keyword',
    'props': {
      'placeholder': '标准编码 / 标准名称 / 适用对象'
    }
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<MasterDataRow>[] = [
  {
    'prop': 'code',
    'label': '标准编码',
    'minWidth': 130
  },
  {
    'prop': 'name',
    'label': '标准名称',
    'minWidth': 160
  },
  {
    'prop': 'target',
    'label': '适用对象',
    'minWidth': 150
  },
  {
    'prop': 'inspectionType',
    'label': '检验类型',
    'minWidth': 120
  },
  {
    'prop': 'version',
    'label': '版本',
    'minWidth': 90,
    'align': 'center'
  },
  {
    'prop': 'status',
    'label': '状态',
    'minWidth': 90,
    'slotName': 'status',
    'align': 'center'
  },
  {
    'label': '操作',
    'minWidth': 150,
    'fixed': 'right',
    'slotName': 'actions',
    'align': 'center'
  }
]

const formColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '标准编码',
    'field': 'code',
    'required': true
  },
  {
    'type': 'input',
    'label': '标准名称',
    'field': 'name',
    'required': true
  },
  {
    'type': 'input',
    'label': '适用对象',
    'field': 'target'
  },
  {
    'type': 'input',
    'label': '检验类型',
    'field': 'inspectionType'
  },
  {
    'type': 'input',
    'label': '版本',
    'field': 'version'
  },
  {
    'type': 'select-v2',
    'label': '状态',
    'field': 'status',
    'props': {
      'options': [
        {
          'label': '草稿',
          'value': 'draft'
        },
        {
          'label': '已生效',
          'value': 'active'
        },
        {
          'label': '已停用',
          'value': 'disabled'
        }
      ]
    }
  }
]

const keywordFields = ['code', 'name', 'target']

const statusOptions: StatusOption[] = [
  {
    'value': 'draft',
    'label': '草稿',
    'type': 'info'
  },
  {
    'value': 'active',
    'label': '已生效',
    'type': 'success'
  },
  {
    'value': 'disabled',
    'label': '已停用',
    'type': 'warning'
  }
]

const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const records = ref<MasterDataRow[]>([
  {
    'id': 'QST-001',
    'code': 'QST-RCV-01',
    'name': '来料尺寸检验标准',
    'target': '外购机加件',
    'inspectionType': '来料检验',
    'version': 'V1.0',
    'status': 'active'
  },
  {
    'id': 'QST-002',
    'code': 'QST-IPQC-01',
    'name': '装配过程检验标准',
    'target': '总成装配工序',
    'inspectionType': '过程检验',
    'version': 'V1.2',
    'status': 'active'
  },
  {
    'id': 'QST-003',
    'code': 'QST-FQC-01',
    'name': '整机完工检验标准',
    'target': '供液控制总成',
    'inspectionType': '完工检验',
    'version': 'V0.9',
    'status': 'draft'
  }
])

const queryParams = reactive<Record<string, any>>({
  'keyword': ''
})
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<MasterDataRow>(createDefaultFormModel())

const filteredRecords = computed(() =>
  records.value.filter((row) =>
    Object.entries(queryParams).every(([field, value]) => {
      if (value === '' || value === undefined || value === null) return true

      if (field === 'keyword') {
        const keyword = String(value).trim().toLowerCase()
        if (!keyword) return true
        const searchKeys = keywordFields.length ? keywordFields : Object.keys(row)
        return searchKeys.some((key) =>
          String(row[key] ?? '')
            .toLowerCase()
            .includes(keyword)
        )
      }

      const rowValue = row[field]
      if (Array.isArray(rowValue)) {
        return rowValue.map((item) => String(item)).includes(String(value))
      }

      return String(rowValue ?? '') === String(value)
    })
  )
)

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<MasterDataRow>({
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
    records.value = records.value.filter((item) => !ids.includes(String(item.id)))
  }
})

function createDefaultFormModel() {
  return { id: '', code: '', name: '', target: '', inspectionType: '', version: 'V1.0', status: 'draft' }
}

function handleReset() {
  Object.assign(queryParams, {
    'keyword': ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: MasterDataRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: MasterDataRow) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  const rowId = String(formModel.value.id || '')

  if (dialogMode.value === 'add') {
    records.value.unshift({
      ...formModel.value,
      id: rowId || 'MDM-' + Date.now()
    })
    ElMessage.success('已新增静态数据')
  } else {
    records.value = records.value.map((item) =>
      String(item.id) === rowId
        ? {
            ...formModel.value
          }
        : item
    )
    ElMessage.success('已更新静态数据')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped></style>
