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
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
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

const overviewCards = computed(() => {
  const highDeviationCount = loadedRecords.value.filter((item) => item.deviation > 20).length
  const midDeviationCount = loadedRecords.value.filter((item) => item.deviation > 10 && item.deviation <= 20).length
  const sampleCount = loadedRecords.value.reduce((sum, item) => sum + item.samples, 0)

  return [
    { label: '学习记录数', value: loadedRecords.value.length, desc: '当前从 MES 实绩样本沉淀出的工时建议数量' },
    { label: '高偏差建议', value: highDeviationCount, desc: '偏差超过 20%，需要优先复核的工序建议' },
    { label: '中偏差建议', value: midDeviationCount, desc: '偏差介于 10%-20%，适合纳入批量评审' },
    { label: '样本总量', value: sampleCount, desc: '支撑当前标准工时学习结果的实绩样本数' }
  ]
})

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
