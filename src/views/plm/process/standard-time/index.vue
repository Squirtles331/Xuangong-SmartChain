<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="标准工时学习"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    :show-add-button="false"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
  >
    <template #deviation="{ row }">
      <el-tag :type="getDeviationType(row.deviation)" effect="light" round>{{ row.deviation }}%</el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { adoptRoutingAutoTime, getRoutingAutoTimeList, type RoutingAutoTimeQuery, type RoutingAutoTimeRecord } from '@/api/routing'
import { useTable } from '@/hooks/useTable'

const deviationOptions = [
  { label: '全部', value: '' },
  { label: '10%及以下', value: 'low' },
  { label: '10%-20%', value: 'mid' },
  { label: '20%以上', value: 'high' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '工序名称 / 产品名称' } as never },
  {
    type: 'select-v2',
    label: '偏差区间',
    field: 'deviation',
    props: {
      options: deviationOptions
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<RoutingAutoTimeRecord>[] = [
  { prop: 'operation', label: '工序名称', minWidth: 130 },
  { prop: 'material_name', label: '产品名称', minWidth: 180 },
  { prop: 'std_hours', label: '标准工时(分钟)', minWidth: 130, align: 'center' },
  { prop: 'actual_avg', label: '平均实绩(分钟)', minWidth: 130, align: 'center' },
  { label: '偏差率', minWidth: 100, align: 'center', slotName: 'deviation' },
  { prop: 'samples', label: '样本数', minWidth: 90, align: 'center' },
  { prop: 'suggestion', label: '建议说明', minWidth: 240 },
  { label: '操作', minWidth: 120, align: 'center', fixed: 'right', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  deviation: string
}>({
  keyword: '',
  deviation: ''
})

const loadedRecords = ref<RoutingAutoTimeRecord[]>([])

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
    loadedRecords.value = response.data.list
    return response.data
  }
})

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

function getRowActions(row: RoutingAutoTimeRecord): CrudRowActionItem[] {
  return [{ key: 'adopt', label: '采纳建议', tone: row.deviation > 20 ? 'warning' : 'primary' }]
}

async function handleRowAction(action: string, row: RoutingAutoTimeRecord) {
  if (action === 'adopt') {
    await adoptRoutingAutoTime(row.id)
    ElMessage.success(`已采纳 ${row.operation} 的工时建议`)
    await refresh()
  }
}
</script>

<style scoped></style>
