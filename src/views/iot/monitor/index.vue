<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="实时监控"
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
    <template #connection_status="{ row }">
      <StatusTag :value="row.connection_status" :options="connectionStatusOptions" />
    </template>

    <template #run_status="{ row }">
      <StatusTag :value="row.run_status" :options="runStatusOptions" />
    </template>

    <template #temperature="{ row }"> {{ row.temperature }} degC </template>

    <template #current="{ row }"> {{ row.current }} A </template>

    <template #vibration="{ row }"> {{ row.vibration }} mm/s </template>

    <template #alarm_count="{ row }">
      <el-tag :type="row.alarm_count > 0 ? 'danger' : 'success'" size="small" effect="light"> {{ row.alarm_count }} 条 </el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions()" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <DeviceDetailDialog v-model:visible="detailVisible" :snapshot="detailSnapshot" :samples="detailSamples" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  getIotMonitorList,
  getIotPointSamples,
  iotConnectionStatusOptions,
  iotRunStatusOptions,
  type IotConnectionStatus,
  type IotMonitorQuery,
  type IotMonitorSnapshot,
  type IotPointSample,
  type IotRunStatus
} from '@/static/services/iot'
import DeviceDetailDialog from './DeviceDetailDialog.vue'

defineOptions({
  name: 'IotMonitorPage'
})

const connectionStatusOptions = [...iotConnectionStatusOptions]
const runStatusOptions = [...iotRunStatusOptions]
const connectionSelectOptions = [{ label: '全部', value: '' }, ...connectionStatusOptions.map((item) => ({ label: item.label, value: item.value }))]
const runStatusSelectOptions = [{ label: '全部', value: '' }, ...runStatusOptions.map((item) => ({ label: item.label, value: item.value }))]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '设备关键字',
    field: 'keyword',
    props: { clearable: true, placeholder: '设备编码 / 设备名称 / 车间 / 网关' } as never
  },
  {
    type: 'select-v2',
    label: '运行状态',
    field: 'run_status',
    props: { clearable: true, options: runStatusSelectOptions } as never
  },
  {
    type: 'select-v2',
    label: '连接状态',
    field: 'connection_status',
    props: { clearable: true, options: connectionSelectOptions } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<IotMonitorSnapshot>[] = [
  { prop: 'equipment_name', label: '设备名称', minWidth: 180 },
  { prop: 'equipment_code', label: '设备编码', minWidth: 140 },
  { prop: 'workshop', label: '所属车间', minWidth: 130 },
  { prop: 'line', label: '产线/单元', minWidth: 140 },
  { label: '连接状态', minWidth: 100, align: 'center', slotName: 'connection_status' },
  { label: '运行状态', minWidth: 100, align: 'center', slotName: 'run_status' },
  { prop: 'rpm', label: '转速(rpm)', minWidth: 110, align: 'right' },
  { label: '温度', minWidth: 100, align: 'right', slotName: 'temperature' },
  { label: '电流', minWidth: 100, align: 'right', slotName: 'current' },
  { label: '振动', minWidth: 110, align: 'right', slotName: 'vibration' },
  { label: '告警数', minWidth: 90, align: 'center', slotName: 'alarm_count' },
  { prop: 'sample_time', label: '采样时间', minWidth: 160 },
  { label: '操作', minWidth: 120, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  run_status: '' | IotRunStatus
  connection_status: '' | IotConnectionStatus
}>({
  keyword: '',
  run_status: '',
  connection_status: ''
})

const detailVisible = ref(false)
const detailSnapshot = ref<IotMonitorSnapshot | null>(null)
const detailSamples = ref<IotPointSample[]>([])

const { tableData, pagination, loading, search, refresh } = useTable<IotMonitorSnapshot>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: IotMonitorQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      run_status: queryParams.run_status || undefined,
      connection_status: queryParams.connection_status || undefined
    }
    const response = await getIotMonitorList(params)
    return response.data
  }
})

function getRowActions(): CrudRowActionItem[] {
  return [{ key: 'detail', label: '查看详情', tone: 'primary' }]
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    run_status: '',
    connection_status: ''
  })
  search()
}

async function handleRowAction(action: string, row: IotMonitorSnapshot) {
  if (action !== 'detail') return
  detailSnapshot.value = row
  const response = await getIotPointSamples(row.equipment_code)
  detailSamples.value = response.data.list || []
  detailVisible.value = true
}
</script>
