<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="报警记录"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
  >
    <template #metric="{ row }">
      <el-tag size="small" effect="light">{{ metricLabelMap[row.metric] }}</el-tag>
    </template>

    <template #level="{ row }">
      <StatusTag :value="row.level" :options="levelOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #trigger_value="{ row }"> {{ row.trigger_value }} </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  getIotAlarmList,
  iotAlarmLevelOptions,
  iotAlarmStatusOptions,
  iotPointMetricOptions,
  updateIotAlarmStatus,
  type IotAlarmLevel,
  type IotAlarmQuery,
  type IotAlarmRecord,
  type IotAlarmStatus
} from '@/static/services/iot'

defineOptions({
  name: 'IotAlarmPage'
})

const levelOptions = [...iotAlarmLevelOptions]
const statusOptions = [...iotAlarmStatusOptions]
const metricLabelMap = Object.fromEntries(iotPointMetricOptions.map((item) => [item.value, item.label])) as Record<IotAlarmRecord['metric'], string>
const levelSelectOptions = [{ label: '全部', value: '' }, ...levelOptions.map((item) => ({ label: item.label, value: item.value }))]
const statusSelectOptions = [{ label: '全部', value: '' }, ...statusOptions.map((item) => ({ label: item.label, value: item.value }))]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '报警关键字',
    field: 'keyword',
    props: { clearable: true, placeholder: '报警编号 / 设备 / 点位 / 来源 / 关联维修' } as never
  },
  {
    type: 'select-v2',
    label: '报警等级',
    field: 'level',
    props: { clearable: true, options: levelSelectOptions } as never
  },
  {
    type: 'select-v2',
    label: '处理状态',
    field: 'status',
    props: { clearable: true, options: statusSelectOptions } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<IotAlarmRecord>[] = [
  { prop: 'code', label: '报警编号', minWidth: 160 },
  { prop: 'equipment_name', label: '设备名称', minWidth: 180 },
  { prop: 'equipment_code', label: '设备编码', minWidth: 140 },
  { prop: 'point_name', label: '点位名称', minWidth: 130 },
  { label: '指标', minWidth: 90, align: 'center', slotName: 'metric' },
  { label: '等级', minWidth: 90, align: 'center', slotName: 'level' },
  { label: '触发值', minWidth: 90, align: 'right', slotName: 'trigger_value' },
  { prop: 'threshold_desc', label: '阈值', minWidth: 120, align: 'center' },
  { label: '处理状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'triggered_at', label: '触发时间', minWidth: 160 },
  { prop: 'recovered_at', label: '恢复时间', minWidth: 160 },
  { prop: 'handler', label: '处理人', minWidth: 100 },
  { prop: 'related_repair', label: '关联维修', minWidth: 130 },
  { label: '操作', minWidth: 200, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  level: '' | IotAlarmLevel
  status: '' | IotAlarmStatus
}>({
  keyword: '',
  level: '',
  status: ''
})

const { tableData, pagination, loading, search, refresh } = useTable<IotAlarmRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: IotAlarmQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      level: queryParams.level || undefined,
      status: queryParams.status || undefined
    }
    const response = await getIotAlarmList(params)
    return response.data
  }
})

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    level: '',
    status: ''
  })
  search()
}

function getRowActions(row: IotAlarmRecord): CrudRowActionItem[] {
  return [
    { key: 'ack', label: '确认', tone: 'primary', hidden: row.status !== 'triggered' },
    { key: 'recover', label: '标记恢复', tone: 'success', hidden: row.status === 'recovered' || row.status === 'closed' },
    { key: 'close', label: '关闭', tone: 'secondary', hidden: row.status !== 'recovered' }
  ]
}

async function handleRowAction(action: string, row: IotAlarmRecord) {
  if (action === 'ack') {
    await updateIotAlarmStatus(row.id, 'acknowledged', '当前用户')
    ElMessage.success('报警已确认')
    await refresh()
    return
  }

  if (action === 'recover') {
    await updateIotAlarmStatus(row.id, 'recovered', '当前用户')
    ElMessage.success('报警已标记恢复')
    await refresh()
    return
  }

  if (action === 'close') {
    await updateIotAlarmStatus(row.id, 'closed', '当前用户')
    ElMessage.success('报警已关闭')
    await refresh()
  }
}
</script>
