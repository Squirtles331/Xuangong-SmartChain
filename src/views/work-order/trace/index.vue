<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <TableSetting title="生产追溯记录" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <TraceDetailDialog v-model:visible="detailVisible" :detail="currentDetail" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getTraceRecords, type TraceRecord, type TraceRecordQuery } from '@/api/work-order'
import { useTable } from '@/hooks/useTable'
import TraceDetailDialog, { type TraceDetail } from './TraceDetailDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'wo_code' },
  { type: 'input', label: '操作人', field: 'worker' },
  {
    type: 'date-picker',
    label: '日期范围',
    field: 'date_range',
    props: { type: 'daterange', startPlaceholder: '开始日期', endPlaceholder: '结束日期', valueFormat: 'YYYY-MM-DD' } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<TraceRecord>[] = [
  { prop: 'wo_code', label: '工单号', minWidth: 170 },
  { prop: 'op_name', label: '工序', minWidth: 130 },
  { prop: 'worker', label: '操作人', minWidth: 100 },
  { prop: 'qualified', label: '合格数', minWidth: 80, align: 'center' },
  { prop: 'defective', label: '不良数', minWidth: 80, align: 'center' },
  { prop: 'hours', label: '工时(分)', minWidth: 90, align: 'center' },
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

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
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

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

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
