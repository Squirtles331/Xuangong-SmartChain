<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="需求池"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    :toolbar-actions="toolbarActions"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @selection-change="handleSelectionChange"
    @toolbar-action="handleToolbarAction"
  >
    <template #sourceType="{ row }">
      <StatusTag :value="row.sourceType" :options="sourceTypeOptions" />
    </template>

    <template #priority="{ row }">
      <StatusTag :value="row.priority" :options="priorityOptions" />
    </template>

    <template #releaseReadiness="{ row }">
      <StatusTag :value="row.releaseReadiness" :options="readinessOptions" />
    </template>

    <template #mrpStatus="{ row }">
      <StatusTag :value="row.mrpStatus" :options="mrpStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  getErpDemandPoolList,
  mergeErpDemandPool,
  prepareErpDemandRelease,
  type DemandPriority,
  type DemandReadiness,
  type DemandSourceType,
  type ErpDemandPoolRecord
} from '@/static/services/erp'

const router = useRouter()

const toolbarActions: CrudToolbarActionItem[] = [
  { key: 'merge', label: '合并需求' },
  { key: 'prepare', label: '释放准备' },
  { key: 'export', label: '导出' }
]

const rowActions: CrudRowActionItem[] = [
  { key: 'viewMrp', label: '查看 MRP', tone: 'primary' },
  { key: 'prepare', label: '设为可释放', tone: 'success' }
]

const sourceTypeOptions = [
  { value: 'sales', label: '销售订单', type: 'primary' as const },
  { value: 'forecast', label: '预测需求', type: 'warning' as const },
  { value: 'manual', label: '手工保留', type: 'info' as const }
]

const priorityOptions = [
  { value: 'urgent', label: '紧急', type: 'danger' as const },
  { value: 'high', label: '高', type: 'warning' as const },
  { value: 'normal', label: '中', type: 'primary' as const },
  { value: 'low', label: '低', type: 'info' as const }
]

const readinessOptions = [
  { value: 'ready', label: '可释放', type: 'success' as const },
  { value: 'reviewing', label: '待复核', type: 'warning' as const },
  { value: 'pending', label: '待补齐', type: 'info' as const }
]

const mrpStatusOptions = [
  { value: 'not_run', label: '未运算', type: 'info' as const },
  { value: 'planned', label: '已纳入运算', type: 'primary' as const },
  { value: 'released', label: '已释放承接', type: 'success' as const }
]

const queryParams = reactive<{
  keyword: string
  sourceType: '' | DemandSourceType
  priority: '' | DemandPriority
  releaseReadiness: '' | DemandReadiness
}>({
  keyword: '',
  sourceType: '',
  priority: '',
  releaseReadiness: ''
})

const selectedRows = ref<ErpDemandPoolRecord[]>([])

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '关键字',
    field: 'keyword',
    props: {
      placeholder: '需求编号 / 来源单号 / 产品名称 / 客户名称 / 责任人',
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '来源类型',
    field: 'sourceType',
    props: {
      options: sourceTypeOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: {
      options: priorityOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '释放状态',
    field: 'releaseReadiness',
    props: {
      options: readinessOptions.map((item) => ({ label: item.label, value: item.value })),
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<ErpDemandPoolRecord>[] = [
  { type: 'selection', width: 50 },
  { prop: 'demandCode', label: '需求编号', minWidth: 150 },
  { label: '来源类型', width: 110, slotName: 'sourceType', align: 'center' },
  { prop: 'sourceCode', label: '来源单号', minWidth: 150 },
  { prop: 'customerName', label: '客户 / 承接方', minWidth: 160 },
  { prop: 'productCode', label: '产品编码', minWidth: 140 },
  { prop: 'productName', label: '产品名称', minWidth: 180 },
  { prop: 'qty', label: '需求数量', width: 100, align: 'right' },
  { prop: 'dueDate', label: '需求日期', width: 110, align: 'center' },
  { label: '优先级', width: 100, slotName: 'priority', align: 'center' },
  { label: '释放状态', width: 110, slotName: 'releaseReadiness', align: 'center' },
  { label: 'MRP 状态', width: 120, slotName: 'mrpStatus', align: 'center' },
  { prop: 'apsPlanVersion', label: 'APS 计划版本', minWidth: 150 },
  { prop: 'demandOwner', label: '计划责任人', minWidth: 130 },
  { label: '操作', minWidth: 170, slotName: 'actions', align: 'center', fixed: 'right' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ErpDemandPoolRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getErpDemandPoolList({
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      sourceType: queryParams.sourceType || undefined,
      priority: queryParams.priority || undefined,
      releaseReadiness: queryParams.releaseReadiness || undefined
    })
    return response.data
  }
})

function handleSelectionChange(rows: ErpDemandPoolRecord[]) {
  selectedRows.value = rows
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    sourceType: '',
    priority: '',
    releaseReadiness: ''
  })
  search()
}

async function prepareRows(ids: string[]) {
  if (!ids.length) {
    ElMessage.warning('请先选择需要处理的需求条目')
    return
  }

  await prepareErpDemandRelease(ids)
  ElMessage.success('已完成释放准备，后续可进入 MRP 承接链路')
  await refresh()
}

async function handleToolbarAction(action: string) {
  const ids = selectedRows.value.map((item) => item.id)

  if (action === 'merge') {
    if (!ids.length) {
      ElMessage.warning('请先选择需要合并的需求条目')
      return
    }
    await mergeErpDemandPool(ids)
    ElMessage.success('需求已合并到同一计划池口径')
    await refresh()
    return
  }

  if (action === 'prepare') {
    await prepareRows(ids)
    return
  }

  if (action === 'export') {
    ElMessage.success('需求池静态数据已导出')
  }
}

async function handleRowAction(action: string, row: ErpDemandPoolRecord) {
  if (action === 'viewMrp') {
    router.push({
      path: '/erp/material-plan/mrp-result',
      query: { demandCode: row.demandCode }
    })
    return
  }

  if (action === 'prepare') {
    await prepareRows([row.id])
  }
}
</script>

<style scoped></style>
