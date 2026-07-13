<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="批次策略"
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
    <template #headerTop>
      <PageOwnershipNotice />
    </template>

    <template #beforeTable>
      <div class="page-overview">
        <div v-for="card in overviewCards" :key="card.label" class="overview-card">
          <div class="overview-label">{{ card.label }}</div>
          <div class="overview-value">{{ card.value }}</div>
          <div class="overview-desc">{{ card.desc }}</div>
        </div>
      </div>
    </template>

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
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
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

const title = '批次策略'
const addText = '新增' + title
const editText = '编辑' + title

const searchColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '关键字',
    'field': 'keyword',
    'props': {
      'placeholder': '策略编码 / 策略名称 / 适用范围'
    }
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<MasterDataRow>[] = [
  {
    'prop': 'code',
    'label': '策略编码',
    'minWidth': 120
  },
  {
    'prop': 'name',
    'label': '策略名称',
    'minWidth': 150
  },
  {
    'prop': 'scene',
    'label': '适用场景',
    'minWidth': 140
  },
  {
    'prop': 'rule',
    'label': '批次规则',
    'minWidth': 180
  },
  {
    'prop': 'traceDepth',
    'label': '追溯深度',
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
    'minWidth': 150,
    'fixed': 'right',
    'slotName': 'actions',
    'align': 'center'
  }
]

const formColumns: FormColumnItem[] = [
  {
    'type': 'input',
    'label': '策略编码',
    'field': 'code',
    'required': true
  },
  {
    'type': 'input',
    'label': '策略名称',
    'field': 'name',
    'required': true
  },
  {
    'type': 'input',
    'label': '适用场景',
    'field': 'scene'
  },
  {
    'type': 'input',
    'label': '批次规则',
    'field': 'rule'
  },
  {
    'type': 'input',
    'label': '追溯深度',
    'field': 'traceDepth'
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

const keywordFields = ['code', 'name', 'scene']

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
    'id': 'BAT-001',
    'code': 'LOT-RCV',
    'name': '来料批次',
    'scene': '采购收货',
    'rule': '按收货单 + 供应商批次生成',
    'traceDepth': '批次级',
    'status': 'active'
  },
  {
    'id': 'BAT-002',
    'code': 'LOT-WO',
    'name': '工单批次',
    'scene': '制造报工',
    'rule': '按工单号 + 班次生成',
    'traceDepth': '工单级',
    'status': 'active'
  },
  {
    'id': 'BAT-003',
    'code': 'LOT-MIX',
    'name': '混批策略',
    'scene': '半成品流转',
    'rule': '限制相同版本混批',
    'traceDepth': '容器级',
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

const overviewCards = computed(() => {
  const activeCount = records.value.filter((item) => item.status === 'active').length
  const disabledCount = records.value.filter((item) => item.status && item.status !== 'active').length

  return [
    { label: '批次策略总量', value: records.value.length, desc: '当前已纳入静态主数据基线的对象数量' },
    { label: '启用数量', value: activeCount, desc: '当前可被下游业务模块直接引用的有效主数据' },
    { label: '非启用数量', value: disabledCount, desc: '用于停用、草稿、冻结等治理状态的对象数量' },
    { label: '治理定位', value: 'MDM', desc: '先稳定静态字段与页面口径，再进入 mock 和接口阶段' }
  ]
})

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
  return { id: '', code: '', name: '', scene: '', rule: '', traceDepth: '批次级', status: 'active' }
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

<style scoped>
.page-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.overview-card {
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  background: linear-gradient(180deg, #fcfdff 0%, #f7faff 100%);
}

.overview-label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.overview-value {
  margin-top: 10px;
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: 600;
}

.overview-desc {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.6;
}

@media (max-width: 1200px) {
  .page-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-overview {
    grid-template-columns: 1fr;
  }
}
</style>
