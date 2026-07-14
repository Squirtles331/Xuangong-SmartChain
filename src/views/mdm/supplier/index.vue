<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="供应商主数据"
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

const title = '供应商主数据'
const addText = '新增' + title
const editText = '编辑' + title

const searchColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '关键字',
    'field': 'keyword',
    'props': {
      'placeholder': '供应商编码 / 供应商名称 / 联系人'
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
          'label': '冻结',
          'value': 'frozen'
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
    'label': '供应商编码',
    'minWidth': 150
  },
  {
    'prop': 'name',
    'label': '供应商名称',
    'minWidth': 180
  },
  {
    'prop': 'contact',
    'label': '联系人',
    'minWidth': 100
  },
  {
    'prop': 'phone',
    'label': '联系电话',
    'minWidth': 130
  },
  {
    'prop': 'terms',
    'label': '付款条件',
    'minWidth': 120
  },
  {
    'prop': 'qualifiedLabel',
    'label': '资质状态',
    'minWidth': 100,
    'align': 'center'
  },
  {
    'prop': 'score',
    'label': '综合评分',
    'minWidth': 100,
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
    'minWidth': 160,
    'fixed': 'right',
    'slotName': 'actions',
    'align': 'center'
  }
]

const formColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '供应商编码',
    'field': 'code',
    'required': true
  },
  {
    'type': 'input',
    'label': '供应商名称',
    'field': 'name',
    'required': true
  },
  {
    'type': 'input',
    'label': '联系人',
    'field': 'contact'
  },
  {
    'type': 'input',
    'label': '联系电话',
    'field': 'phone'
  },
  {
    'type': 'input',
    'label': '付款条件',
    'field': 'terms'
  },
  {
    'type': 'input',
    'label': '资质状态',
    'field': 'qualifiedLabel'
  },
  {
    'type': 'input-number',
    'label': '综合评分',
    'field': 'score',
    'props': {
      'min': 0,
      'max': 100,
      'precision': 0
    }
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
          'label': '冻结',
          'value': 'frozen'
        }
      ]
    }
  }
]

const keywordFields = ['code', 'name', 'contact']

const statusOptions: StatusOption[] = [
  {
    'value': 'active',
    'label': '正常',
    'type': 'success'
  },
  {
    'value': 'frozen',
    'label': '冻结',
    'type': 'warning'
  }
]

const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const records = ref<MasterDataRow[]>([
  {
    'id': 'SUP-001',
    'code': 'SUP-001',
    'name': '科锐标准件',
    'contact': '孙波',
    'phone': '13900001234',
    'terms': '月结30天',
    'qualifiedLabel': '已合格',
    'score': 96,
    'status': 'active'
  },
  {
    'id': 'SUP-002',
    'code': 'SUP-002',
    'name': '鑫锐热处理',
    'contact': '陈立',
    'phone': '13900004567',
    'terms': '月结45天',
    'qualifiedLabel': '已合格',
    'score': 88,
    'status': 'active'
  },
  {
    'id': 'SUP-003',
    'code': 'SUP-003',
    'name': '华南电气件',
    'contact': '何青',
    'phone': '13900007890',
    'terms': '预付20%',
    'qualifiedLabel': '待复审',
    'score': 75,
    'status': 'frozen'
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
    contact: '',
    phone: '',
    terms: '月结30天',
    qualifiedLabel: '已合格',
    score: 90,
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
