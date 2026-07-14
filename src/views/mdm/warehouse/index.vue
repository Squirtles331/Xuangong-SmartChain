<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="仓库主数据"
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

const title = '仓库主数据'
const addText = '新增' + title
const editText = '编辑' + title

const searchColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '关键字',
    'field': 'keyword',
    'props': {
      'placeholder': '仓库编码 / 仓库名称 / 责任人'
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
          'label': '启用',
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
    'label': '仓库编码',
    'minWidth': 130
  },
  {
    'prop': 'name',
    'label': '仓库名称',
    'minWidth': 150
  },
  {
    'prop': 'type',
    'label': '仓库类型',
    'minWidth': 120
  },
  {
    'prop': 'manager',
    'label': '责任人',
    'minWidth': 100
  },
  {
    'prop': 'locationCount',
    'label': '库位数量',
    'minWidth': 100,
    'align': 'center'
  },
  {
    'prop': 'capacity',
    'label': '容量说明',
    'minWidth': 120
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
    'label': '仓库编码',
    'field': 'code',
    'required': true
  },
  {
    'type': 'input',
    'label': '仓库名称',
    'field': 'name',
    'required': true
  },
  {
    'type': 'input',
    'label': '仓库类型',
    'field': 'type',
    'required': true
  },
  {
    'type': 'input',
    'label': '责任人',
    'field': 'manager'
  },
  {
    'type': 'input-number',
    'label': '库位数量',
    'field': 'locationCount',
    'props': {
      'min': 0,
      'precision': 0
    }
  },
  {
    'type': 'input',
    'label': '容量说明',
    'field': 'capacity'
  },
  {
    'type': 'select-v2',
    'label': '状态',
    'field': 'status',
    'props': {
      'options': [
        {
          'label': '启用',
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

const keywordFields = ['code', 'name', 'manager']

const statusOptions: StatusOption[] = [
  {
    'value': 'active',
    'label': '启用',
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
    'id': 'WH-001',
    'code': 'WH-RM',
    'name': '原材料仓',
    'type': '原材料仓',
    'manager': '赵仓储',
    'locationCount': 48,
    'capacity': '1200 托位',
    'status': 'active'
  },
  {
    'id': 'WH-002',
    'code': 'WH-WIP',
    'name': '半成品仓',
    'type': '半成品仓',
    'manager': '赵仓储',
    'locationCount': 32,
    'capacity': '680 托位',
    'status': 'active'
  },
  {
    'id': 'WH-003',
    'code': 'WH-FG',
    'name': '成品仓',
    'type': '成品仓',
    'manager': '李物流',
    'locationCount': 26,
    'capacity': '520 托位',
    'status': 'active'
  },
  {
    'id': 'WH-004',
    'code': 'WH-RET',
    'name': '退货隔离仓',
    'type': '退货仓',
    'manager': '王质量',
    'locationCount': 12,
    'capacity': '180 托位',
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
  return { id: '', code: '', name: '', type: '原材料仓', manager: '', locationCount: 0, capacity: '', status: 'active' }
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
