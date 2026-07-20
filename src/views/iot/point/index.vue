<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="点位配置"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, rowKey: 'id', style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #metric="{ row }">
      <el-tag size="small" effect="light">{{ metricLabelMap[row.metric] }}</el-tag>
    </template>

    <template #limit="{ row }">
      {{ formatLimit(row) }}
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions()" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <PointFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :connection-options="connectionOptions"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  deleteIotPoint,
  getIotConnectionOptions,
  getIotPointList,
  iotPointMetricOptions,
  iotPointStatusOptions,
  saveIotPoint,
  type IotPointQuery,
  type IotPointRecord
} from '@/static/services/iot'
import PointFormDialog, { type PointFormModel } from './PointFormDialog.vue'

defineOptions({
  name: 'IotPointPage'
})

const connectionOptions = computed(() => getIotConnectionOptions())
const statusOptions = [...iotPointStatusOptions]
const metricLabelMap = Object.fromEntries(iotPointMetricOptions.map((item) => [item.value, item.label])) as Record<IotPointRecord['metric'], string>
const metricSelectOptions = [{ label: '全部', value: '' }, ...iotPointMetricOptions]
const statusSelectOptions = [{ label: '全部', value: '' }, ...statusOptions.map((item) => ({ label: item.label, value: item.value }))]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '点位关键字',
    field: 'keyword',
    props: { clearable: true, placeholder: '点位编码 / 点位名称 / 设备 / 地址' } as never
  },
  {
    type: 'select-v2',
    label: '采集指标',
    field: 'metric',
    props: { clearable: true, options: metricSelectOptions } as never
  },
  {
    type: 'select-v2',
    label: '点位状态',
    field: 'status',
    props: { clearable: true, options: statusSelectOptions } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<IotPointRecord>[] = [
  { prop: 'code', label: '点位编码', minWidth: 150 },
  { prop: 'name', label: '点位名称', minWidth: 150 },
  { prop: 'equipment_name', label: '设备名称', minWidth: 180 },
  { prop: 'equipment_code', label: '设备编码', minWidth: 140 },
  { label: '采集指标', minWidth: 100, align: 'center', slotName: 'metric' },
  { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
  { prop: 'address', label: '点位地址', minWidth: 200 },
  { prop: 'collect_interval', label: '周期(秒)', minWidth: 90, align: 'center' },
  { label: '阈值范围', minWidth: 120, align: 'center', slotName: 'limit' },
  { label: '点位状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  metric: '' | IotPointRecord['metric']
  status: '' | IotPointRecord['status']
}>({
  keyword: '',
  metric: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<PointFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<IotPointRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: IotPointQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      metric: queryParams.metric || undefined,
      status: queryParams.status || undefined
    }
    const response = await getIotPointList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteIotPoint(id)))
})

function createDefaultFormModel(): PointFormModel {
  return {
    id: '',
    code: '',
    name: '',
    connection_id: connectionOptions.value[0]?.value || '',
    equipment_code: '',
    equipment_name: '',
    metric: 'temperature',
    unit: 'degC',
    address: '',
    collect_interval: 1,
    lower_limit: null,
    upper_limit: null,
    status: 'active'
  }
}

function formatLimit(row: IotPointRecord) {
  const lower = row.lower_limit ?? '-'
  const upper = row.upper_limit ?? '-'
  return `${lower} / ${upper}`
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    metric: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: IotPointRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function getRowActions(): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'delete', label: '删除', tone: 'danger' }
  ]
}

function handleRowAction(action: string, row: IotPointRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.connection_id || !formModel.value.address) {
    ElMessage.warning('请填写点位编码、点位名称、绑定连接和点位地址')
    return
  }

  await saveIotPoint({
    ...formModel.value,
    collect_interval: Number(formModel.value.collect_interval || 1),
    lower_limit: formModel.value.lower_limit === null ? null : Number(formModel.value.lower_limit),
    upper_limit: formModel.value.upper_limit === null ? null : Number(formModel.value.upper_limit)
  })
  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '采集点位已新增' : '采集点位已更新')
  await refresh()
}
</script>
