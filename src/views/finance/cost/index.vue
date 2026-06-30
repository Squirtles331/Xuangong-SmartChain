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

    <template #tool>
      <gi-button type="reset" @click="refresh" />
    </template>

    <TableSetting title="成本明细列表" :columns="columns" @refresh="refresh">
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
          <template #material_cost="{ row }">
            {{ formatAmount(row.material_cost) }}
          </template>

          <template #labor_cost="{ row }">
            {{ formatAmount(row.labor_cost) }}
          </template>

          <template #overhead="{ row }">
            {{ formatAmount(row.overhead) }}
          </template>

          <template #total="{ row }">
            {{ formatAmount(row.total) }}
          </template>
        </gi-table>
      </template>
    </TableSetting>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getFinanceCostList, type FinanceCostDetail, type FinanceCostQuery } from '@/api/finance'
import { useTable } from '@/hooks/useTable'

const periodOptions = [
  { label: '2026-06', value: '2026-06' },
  { label: '2026-05', value: '2026-05' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '产品名称', field: 'product' },
  {
    type: 'select-v2',
    label: '核算期间',
    field: 'period',
    props: {
      options: periodOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<FinanceCostDetail>[] = [
  { prop: 'product', label: '产品名称', minWidth: 180 },
  { prop: 'material_cost', label: '材料成本', minWidth: 120, align: 'right', slotName: 'material_cost' },
  { prop: 'labor_cost', label: '人工成本', minWidth: 120, align: 'right', slotName: 'labor_cost' },
  { prop: 'overhead', label: '制造费用', minWidth: 120, align: 'right', slotName: 'overhead' },
  { prop: 'total', label: '总成本', minWidth: 120, align: 'right', slotName: 'total' },
  { prop: 'period', label: '核算期间', minWidth: 100, align: 'center' }
]

const queryParams = reactive({
  product: '',
  period: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const { tableData, pagination, loading, search, refresh } = useTable<FinanceCostDetail>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: FinanceCostQuery = {
      pageNum: page,
      pageSize: size,
      product: queryParams.product || undefined,
      period: queryParams.period || undefined
    }

    const response = await getFinanceCostList(params)
    return response.data
  }
})

function formatAmount(value: number) {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    product: '',
    period: ''
  })
  search()
}
</script>
