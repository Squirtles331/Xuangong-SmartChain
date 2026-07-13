<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="生产追溯记录"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
  >
    <template #actions="{ row }">
      <CrudRowActions :actions="detailActions" @action="viewDetail(row)" />
    </template>

    <template #dialog>
      <TraceDetailDialog v-model:visible="detailVisible" :detail="currentDetail" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import { getTraceRecords, type TraceRecord, type TraceRecordQuery } from '@/api/work-order'
import { useTable } from '@/hooks/useTable'
import TraceDetailDialog, { type TraceDetail } from './TraceDetailDialog.vue'

const detailActions = [{ key: 'detail', label: '详情', tone: 'primary' as const }]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'wo_code', props: { clearable: true } as any },
  { type: 'input', label: '操作人', field: 'worker', props: { clearable: true } as any },
  {
    type: 'date-picker',
    label: '日期范围',
    field: 'date_range',
    props: {
      type: 'daterange',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD'
    } as any
  }
]

const columns: TableColumnItem<TraceRecord>[] = [
  { prop: 'wo_code', label: '工单号', minWidth: 170 },
  { prop: 'op_name', label: '工序', minWidth: 130 },
  { prop: 'worker', label: '操作人', minWidth: 100 },
  { prop: 'qualified', label: '合格数', minWidth: 80, align: 'center' },
  { prop: 'defective', label: '不良数', minWidth: 80, align: 'center' },
  { prop: 'hours', label: '工时(分钟)', minWidth: 100, align: 'center' },
  { prop: 'time', label: '时间', minWidth: 150 },
  { label: '操作', minWidth: 80, slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  wo_code: string
  worker: string
  date_range: string[]
}>({
  wo_code: '',
  worker: '',
  date_range: []
})

const detailVisible = ref(false)
const currentDetail = ref<TraceDetail | null>(null)

const { tableData, pagination, loading, search, refresh } = useTable<TraceRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: TraceRecordQuery = {
      pageNum: page,
      pageSize: size,
      wo_code: queryParams.wo_code || undefined,
      worker: queryParams.worker || undefined,
      startDate: queryParams.date_range[0] || undefined,
      endDate: queryParams.date_range[1] || undefined
    }

    const response = await getTraceRecords(params)
    return response.data
  }
})

function handleReset() {
  Object.assign(queryParams, {
    wo_code: '',
    worker: '',
    date_range: []
  })
  search()
}

function viewDetail(row: TraceRecord) {
  currentDetail.value = row as TraceDetail
  detailVisible.value = true
}
</script>
