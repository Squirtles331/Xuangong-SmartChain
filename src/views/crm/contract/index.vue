<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="sf"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
      style="height: 100%"
      :row-class-name="rowClassName"
    >
      <template #status="{ row }">
        <el-tag
          :type="row.status === 'active' ? 'success' : row.status === 'draft' ? 'warning' : row.status === 'expired' ? 'info' : 'danger'"
          size="small"
        >
          {{ row.status === 'active' ? '生效中' : row.status === 'draft' ? '草稿' : row.status === 'expired' ? '已过期' : '已终止' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <ContractFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { useTable } from '@/hooks/useTable'
import ContractFormDialog, { type ContractFormModel } from './ContractFormDialog.vue'

interface ContractRow {
  id: string
  code: string
  customer: string
  amount: number
  sign_date: string
  start_date: string
  end_date: string
  status: string
}

// Local data store (no dedicated contract API)
const localData = ref<ContractRow[]>([
  {
    id: '1',
    code: 'CT20250101001',
    customer: 'XX重工集团',
    amount: 2500000,
    sign_date: '2025-01-01',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    status: 'active'
  },
  {
    id: '2',
    code: 'CT20250102002',
    customer: 'YY机械设备',
    amount: 800000,
    sign_date: '2025-01-05',
    start_date: '2025-02-01',
    end_date: '2026-01-31',
    status: 'active'
  },
  {
    id: '3',
    code: 'CT20241201003',
    customer: 'ZZ泵业科技',
    amount: 500000,
    sign_date: '2024-12-01',
    start_date: '2024-12-01',
    end_date: '2025-06-30',
    status: 'active'
  }
])

const sf = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ContractFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '生效中', value: 'active' },
        { label: '草稿', value: 'draft' },
        { label: '已过期', value: 'expired' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<ContractRow>[] = [
  { prop: 'code', label: '合同编号', minWidth: 170 },
  { prop: 'customer', label: '客户', minWidth: 160 },
  { prop: 'amount', label: '合同金额', minWidth: 120, align: 'right' },
  { prop: 'sign_date', label: '签订日期', minWidth: 110 },
  { prop: 'start_date', label: '生效日期', minWidth: 110 },
  { prop: 'end_date', label: '到期日期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ContractRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = [...localData.value]
    const s = searchForm.value
    if (s.keyword) {
      filtered = filtered.filter((r) => r.customer.includes(s.keyword) || r.code.includes(s.keyword))
    }
    if (s.status) {
      filtered = filtered.filter((r) => r.status === s.status)
    }
    const total = filtered.length
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total
    }
  },
  deleteAPI: (ids) => {
    localData.value = localData.value.filter((r) => !ids.includes(r.id))
    return Promise.resolve()
  }
})

function createDefaultFormModel(): ContractFormModel {
  return {
    id: '',
    code: '',
    customer: '',
    amount: 0,
    sign_date: '',
    start_date: '',
    end_date: '',
    status: 'draft'
  }
}

function rowClassName({ row }: { row: ContractRow }) {
  if (row.status === 'active') {
    const today = new Date().toISOString().slice(0, 10)
    if (row.end_date < today) {
      return 'row-expired'
    }
  }
  return ''
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', status: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ContractRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.customer) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    const newItem: ContractRow = {
      id: Date.now().toString(),
      code: 'CT' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(localData.value.length + 1).padStart(4, '0'),
      ...formModel.value
    }
    localData.value.unshift(newItem)
  } else {
    const idx = localData.value.findIndex((r) => r.id === formModel.value.id)
    if (idx > -1) {
      localData.value[idx] = { ...formModel.value }
    }
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: ContractRow) {
  onDelete(row)
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

:deep(.row-expired) {
  background-color: #fef0f0 !important;
}

:deep(.row-expired td) {
  background-color: #fef0f0 !important;
}
</style>
