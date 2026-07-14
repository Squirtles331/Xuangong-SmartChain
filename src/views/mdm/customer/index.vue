<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="客户主数据"
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

const title = '客户主数据'
const addText = '新增' + title
const editText = '编辑' + title

const searchColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '关键字',
    'field': 'keyword',
    'props': {
      'placeholder': '客户编码 / 客户名称 / 联系人'
    }
  },
  {
    'type': 'select-v2',
    'label': '状态',
    'field': 'status',
    'props': {
      'options': [
        {
          'label': '全部',
          'value': ''
        },
        {
          'label': '正常',
          'value': 'active'
        },
        {
          'label': '停用',
          'value': 'disabled'
        }
      ]
    }
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<MasterDataRow>[] = [
  {
    'prop': 'code',
    'label': '客户编码',
    'minWidth': 140
  },
  {
    'prop': 'name',
    'label': '客户名称',
    'minWidth': 180
  },
  {
    'prop': 'contact_person',
    'label': '联系人',
    'minWidth': 120
  },
  {
    'prop': 'contact_phone',
    'label': '联系电话',
    'minWidth': 140
  },
  {
    'prop': 'payment_terms',
    'label': '付款条件',
    'minWidth': 120
  },
  {
    'prop': 'credit_limit_label',
    'label': '信用额度(元)',
    'minWidth': 140,
    'align': 'right'
  },
  {
    'prop': 'status',
    'label': '状态',
    'minWidth': 100,
    'align': 'center',
    'slotName': 'status'
  },
  {
    'label': '操作',
    'minWidth': 160,
    'fixed': 'right',
    'align': 'center',
    'slotName': 'actions'
  }
]

const formColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '客户编码',
    'field': 'code',
    'required': true
  },
  {
    'type': 'input',
    'label': '客户名称',
    'field': 'name',
    'required': true
  },
  {
    'type': 'input',
    'label': '联系人',
    'field': 'contact_person'
  },
  {
    'type': 'input',
    'label': '联系电话',
    'field': 'contact_phone'
  },
  {
    'type': 'input',
    'label': '付款条件',
    'field': 'payment_terms'
  },
  {
    'type': 'input',
    'label': '信用额度',
    'field': 'credit_limit_label'
  },
  {
    'type': 'select-v2',
    'label': '状态',
    'field': 'status',
    'props': {
      'options': [
        {
          'label': '正常',
          'value': 'active'
        },
        {
          'label': '停用',
          'value': 'disabled'
        }
      ]
    }
  }
]

const keywordFields = ['code', 'name', 'contact_person']

const statusOptions: StatusOption[] = [
  {
    'value': 'active',
    'label': '正常',
    'type': 'success'
  },
  {
    'value': 'disabled',
    'label': '停用',
    'type': 'warning'
  }
]

const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const records = ref<MasterDataRow[]>([
  {
    'id': 'CUS-001',
    'code': 'CUS-001',
    'name': '华东自动化装备',
    'contact_person': '张宁',
    'contact_phone': '13800001234',
    'payment_terms': '月结30天',
    'credit_limit': 800000,
    'credit_limit_label': '800,000',
    'status': 'active'
  },
  {
    'id': 'CUS-002',
    'code': 'CUS-002',
    'name': '凌云精工',
    'contact_person': '刘杰',
    'contact_phone': '13800004567',
    'payment_terms': '预付30%',
    'credit_limit': 500000,
    'credit_limit_label': '500,000',
    'status': 'active'
  },
  {
    'id': 'CUS-003',
    'code': 'CUS-003',
    'name': '智造实验线',
    'contact_person': '王可',
    'contact_phone': '13800007890',
    'payment_terms': '货到45天',
    'credit_limit': 200000,
    'credit_limit_label': '200,000',
    'status': 'disabled'
  }
])

const queryParams = reactive<Record<string, any>>({
  'keyword': '',
  'status': ''
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
  return () => ({
    id: '',
    code: '',
    name: '',
    contact_person: '',
    contact_phone: '',
    payment_terms: '月结30天',
    credit_limit: 0,
    credit_limit_label: '0',
    status: 'active'
  })
}

function handleReset() {
  Object.assign(queryParams, {
    'keyword': '',
    'status': ''
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
