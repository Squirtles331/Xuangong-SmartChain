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
    </template>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
    >
      <template #status="{ row }">
        <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'done' ? 'success' : 'info'" size="small">
          {{ row.status === 'pending' ? '待退货' : row.status === 'done' ? '已退货' : '已取消' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmReturn(row)">确认退货</el-button>
      </template>
    </gi-table>

    <ReturnFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { useTable } from '@/hooks/useTable'
import ReturnFormDialog, { type ReturnFormModel } from './ReturnFormDialog.vue'

interface ReturnRow {
  id: string
  code: string
  po_code: string
  supplier: string
  material: string
  qty: number
  reason: string
  status: string
}

const localData = ref<ReturnRow[]>([
  {
    id: '1',
    code: 'PRT20250115001',
    po_code: 'PO202501100002',
    supplier: 'YY轴承制造厂',
    material: '轴承 6308',
    qty: 20,
    reason: '尺寸超差',
    status: 'pending'
  },
  {
    id: '2',
    code: 'PRT20250110002',
    po_code: 'PO202501050001',
    supplier: 'XX钢材有限公司',
    material: '45#圆钢 φ50',
    qty: 100,
    reason: '材质不合格',
    status: 'done'
  }
])

const sf = ref<FormInstance | null>()
const searchForm = ref({
  code: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ReturnFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '退货单号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待退货', value: 'pending' },
        { label: '已退货', value: 'done' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<ReturnRow>[] = [
  { prop: 'code', label: '退货单号', width: 170 },
  { prop: 'po_code', label: '采购订单', width: 170 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'reason', label: '原因', width: 120 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ReturnRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = [...localData.value]
    const s = searchForm.value
    if (s.code) filtered = filtered.filter((r) => r.code.includes(s.code))
    if (s.status) filtered = filtered.filter((r) => r.status === s.status)
    const total = filtered.length
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total
    }
  }
})

function createDefaultFormModel(): ReturnFormModel {
  return {
    id: '',
    code: '',
    po_code: '',
    supplier: '',
    material: '',
    qty: 1,
    reason: '',
    status: 'pending'
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ReturnRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.material) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    localData.value.unshift({
      id: Date.now().toString(),
      code: 'PRT' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(localData.value.length + 1).padStart(4, '0'),
      ...formModel.value
    } as ReturnRow)
  } else {
    const idx = localData.value.findIndex((r) => r.id === formModel.value.id)
    if (idx > -1) {
      localData.value[idx] = { ...formModel.value }
    }
  }

  dialogVisible.value = false
  await refresh()
}

function confirmReturn(row: ReturnRow) {
  row.status = 'done'
  ElMessage.success('退货完成')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
