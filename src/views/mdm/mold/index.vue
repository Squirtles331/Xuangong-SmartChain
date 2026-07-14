<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="模具"
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

const title = '模具'
const addText = '新增' + title
const editText = '编辑' + title

const searchColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '关键字',
    'field': 'keyword',
    'props': {
      'placeholder': '模具编码 / 模具名称 / 模具类型'
    }
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<MasterDataRow>[] = [
  {
    'prop': 'code',
    'label': '模具编码',
    'minWidth': 140
  },
  {
    'prop': 'name',
    'label': '模具名称',
    'minWidth': 160
  },
  {
    'prop': 'type',
    'label': '模具类型',
    'minWidth': 100,
    'align': 'center'
  },
  {
    'prop': 'lifeDesign',
    'label': '设计寿命',
    'minWidth': 100,
    'align': 'center'
  },
  {
    'prop': 'used',
    'label': '已用次数',
    'minWidth': 100,
    'align': 'center'
  },
  {
    'prop': 'usageRate',
    'label': '寿命使用率',
    'minWidth': 120,
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
    'label': '模具编码',
    'field': 'code',
    'required': true
  },
  {
    'type': 'input',
    'label': '模具名称',
    'field': 'name',
    'required': true
  },
  {
    'type': 'input',
    'label': '模具类型',
    'field': 'type'
  },
  {
    'type': 'input-number',
    'label': '设计寿命',
    'field': 'lifeDesign',
    'props': {
      'min': 0,
      'precision': 0
    }
  },
  {
    'type': 'input-number',
    'label': '已用次数',
    'field': 'used',
    'props': {
      'min': 0,
      'precision': 0
    }
  },
  {
    'type': 'input',
    'label': '寿命使用率',
    'field': 'usageRate'
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

const keywordFields = ['code', 'name', 'type']

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
    'id': 'MOD-001',
    'code': 'MD0001',
    'name': '泵体铸造模具',
    'type': '铸模',
    'lifeDesign': 10000,
    'used': 6200,
    'usageRate': '62%',
    'status': 'active'
  },
  {
    'id': 'MOD-002',
    'code': 'MD0002',
    'name': '叶轮锻模',
    'type': '锻模',
    'lifeDesign': 5000,
    'used': 2400,
    'usageRate': '48%',
    'status': 'active'
  },
  {
    'id': 'MOD-003',
    'code': 'MD0003',
    'name': '试制注塑模',
    'type': '注塑模',
    'lifeDesign': 2000,
    'used': 1800,
    'usageRate': '90%',
    'status': 'disabled'
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
  return { id: '', code: '', name: '', type: '铸模', lifeDesign: 0, used: 0, usageRate: '0%', status: 'active' }
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
