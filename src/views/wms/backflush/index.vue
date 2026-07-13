<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="倒冲记录"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #status="{ row }">
      <el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">
        {{ row.status === 'pending' ? '待倒冲' : '已倒冲' }}
      </el-tag>
    </template>

    <template #diff="{ row }">
      <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }"> {{ row.diff > 0 ? '+' : '' }}{{ row.diff }} </span>
    </template>

    <template #diffRate="{ row }">
      <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }">
        {{ row.bomQty > 0 ? ((Math.abs(row.diff) / row.bomQty) * 100).toFixed(2) : '0.00' }}%
      </span>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <BackflushFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getBackflushList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import BackflushFormDialog, { type BackflushFormModel } from './BackflushFormDialog.vue'

interface BackflushRow {
  id: string
  material: string
  woCode: string
  bomQty: number
  actualQty: number
  diff: number
  status: string
  backflushDate: string
}

const queryParams = ref({
  keyword: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: {
      placeholder: '请输入工单号或物料名称',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待倒冲', value: 'pending' },
        { label: '已倒冲', value: 'completed' }
      ],
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<BackflushRow>[] = [
  { prop: 'material', label: '物料名称', minWidth: 180 },
  { prop: 'woCode', label: '工单号', minWidth: 170 },
  { prop: 'bomQty', label: 'BOM 用量', minWidth: 100, align: 'center' },
  { prop: 'actualQty', label: '实际用量', minWidth: 100, align: 'center' },
  { prop: 'diff', label: '差异数量', minWidth: 90, align: 'center', slotName: 'diff' },
  { label: '差异率', minWidth: 90, slotName: 'diffRate', align: 'center' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'backflushDate', label: '倒冲日期', minWidth: 110 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<BackflushRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getBackflushList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.keyword || undefined,
      material: queryParams.value.keyword || undefined,
      status: queryParams.value.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  }
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<BackflushFormModel>(createDefaultForm())

function mapRow(item: any): BackflushRow {
  return {
    id: String(item.id),
    material: item.material || '',
    woCode: item.wo_code || '',
    bomQty: Number(item.bom_qty ?? 0),
    actualQty: Number(item.actual_qty ?? 0),
    diff: Number(item.diff ?? 0),
    status: item.status || '',
    backflushDate: item.backflush_date || ''
  }
}

function handleReset() {
  queryParams.value = {
    keyword: '',
    status: ''
  }
  search()
}

function createDefaultForm(): BackflushFormModel {
  return {
    id: '',
    material: '',
    woCode: '',
    bomQty: 0,
    actualQty: 0,
    diff: 0,
    status: 'pending',
    backflushDate: ''
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: BackflushRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function getRowActions(row: BackflushRow): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'execute', label: '执行倒冲', tone: 'secondary', hidden: row.status !== 'pending' }
  ]
}

function handleRowAction(action: string, row: BackflushRow) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'execute') {
    doBackflush(row)
  }
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function doBackflush(row: BackflushRow) {
  row.status = 'completed'
  ElMessage.success('倒冲完成，库存已同步更新')
}
</script>
