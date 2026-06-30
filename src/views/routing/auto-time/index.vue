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

    <TableSetting title="工时自学习记录" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          stripe
          style="height: 100%"
        >
          <template #deviation="{ row }">
            <el-tag :type="getDeviationType(row.deviation)"> {{ row.deviation }}% </el-tag>
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="handleAdopt(row)">采纳建议</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { adoptRoutingAutoTime, getRoutingAutoTimeList, type RoutingAutoTimeQuery, type RoutingAutoTimeRecord } from '@/api/routing'
import { useTable } from '@/hooks/useTable'

const deviationOptions = [
  { label: '全部', value: '' },
  { label: '10%及以下', value: 'low' },
  { label: '10%-20%', value: 'mid' },
  { label: '20%以上', value: 'high' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工序名称 / 产品名称' } as any },
  {
    type: 'select-v2',
    label: '偏差区间',
    field: 'deviation',
    props: {
      options: deviationOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<RoutingAutoTimeRecord>[] = [
  { prop: 'operation', label: '工序名称', minWidth: 120 },
  { prop: 'material_name', label: '产品名称', minWidth: 180 },
  { prop: 'std_hours', label: '标准工时(分钟)', minWidth: 130, align: 'center' },
  { prop: 'actual_avg', label: '平均实绩(分钟)', minWidth: 130, align: 'center' },
  { label: '偏差率', minWidth: 100, align: 'center', slotName: 'deviation' },
  { prop: 'samples', label: '样本数', minWidth: 90, align: 'center' },
  { prop: 'suggestion', label: '建议说明', minWidth: 220 },
  { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  deviation: string
}>({
  keyword: '',
  deviation: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const { tableData, pagination, loading, search, refresh } = useTable<RoutingAutoTimeRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: RoutingAutoTimeQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      deviation: queryParams.deviation || undefined
    }
    const response = await getRoutingAutoTimeList(params)
    return response.data
  }
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    deviation: ''
  })
  search()
}

function getDeviationType(value: number) {
  if (value <= 10) return 'success'
  if (value <= 20) return 'warning'
  return 'danger'
}

async function handleAdopt(row: RoutingAutoTimeRecord) {
  await adoptRoutingAutoTime(row.id)
  ElMessage.success(`已采纳 ${row.operation} 的工时建议`)
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
