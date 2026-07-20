<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="设备连接管理"
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
    <template #protocol="{ row }">
      <el-tag size="small" effect="light">{{ row.protocol }}</el-tag>
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="statusOptions" />
    </template>

    <template #collect_interval="{ row }"> {{ row.collect_interval }} 秒 </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <IoTConfigFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import {
  deleteIotConnection,
  getIotConnectionList,
  iotConnectionStatusOptions,
  iotProtocolOptions,
  saveIotConnection,
  type IotConnectionQuery,
  type IotConnectionRecord
} from '@/static/services/iot'
import IoTConfigFormDialog, { type IoTConfigFormModel } from './IoTConfigFormDialog.vue'

defineOptions({
  name: 'IotConnectionPage'
})

const statusOptions = [...iotConnectionStatusOptions]
const protocolOptions = [{ label: '全部', value: '' }, ...iotProtocolOptions]
const statusSelectOptions = [{ label: '全部', value: '' }, ...statusOptions.map((item) => ({ label: item.label, value: item.value }))]

const searchColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '连接关键字',
    field: 'keyword',
    props: { clearable: true, placeholder: '连接编码 / 设备 / 网关 / 端点 / 责任人' } as never
  },
  {
    type: 'select-v2',
    label: '通信协议',
    field: 'protocol',
    props: { clearable: true, options: protocolOptions } as never
  },
  {
    type: 'select-v2',
    label: '连接状态',
    field: 'status',
    props: { clearable: true, options: statusSelectOptions } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<IotConnectionRecord>[] = [
  { prop: 'code', label: '连接编码', minWidth: 140 },
  { prop: 'equipment_name', label: '设备名称', minWidth: 180 },
  { prop: 'equipment_code', label: '设备编码', minWidth: 140 },
  { prop: 'workshop', label: '所属车间', minWidth: 130 },
  { prop: 'line', label: '产线/单元', minWidth: 140 },
  { label: '协议', minWidth: 100, align: 'center', slotName: 'protocol' },
  { prop: 'gateway', label: '边缘网关', minWidth: 150 },
  { prop: 'endpoint', label: '连接端点', minWidth: 230 },
  { label: '采集周期', minWidth: 100, align: 'center', slotName: 'collect_interval' },
  { label: '连接状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'last_heartbeat', label: '最近心跳', minWidth: 160 },
  { prop: 'owner', label: '责任人', minWidth: 100 },
  { label: '操作', minWidth: 180, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  protocol: '' | IotConnectionRecord['protocol']
  status: '' | IotConnectionRecord['status']
}>({
  keyword: '',
  protocol: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<IoTConfigFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<IotConnectionRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: IotConnectionQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      protocol: queryParams.protocol || undefined,
      status: queryParams.status || undefined
    }
    const response = await getIotConnectionList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteIotConnection(id)))
})

function createDefaultFormModel(): IoTConfigFormModel {
  return {
    id: '',
    code: '',
    equipment_code: '',
    equipment_name: '',
    workshop: '机加一车间',
    line: '',
    protocol: 'OPC UA',
    gateway: '',
    endpoint: '',
    collect_interval: 1,
    status: 'connected',
    last_heartbeat: '2026-07-16 10:30:00',
    owner: ''
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    protocol: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: IotConnectionRecord) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function getRowActions(row: IotConnectionRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'delete', label: '删除', tone: 'danger', hidden: row.status === 'connected' }
  ]
}

function handleRowAction(action: string, row: IotConnectionRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.equipment_code || !formModel.value.equipment_name || !formModel.value.endpoint) {
    ElMessage.warning('请填写连接编码、设备信息和连接端点')
    return
  }

  await saveIotConnection({
    ...formModel.value,
    collect_interval: Number(formModel.value.collect_interval || 1)
  })
  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '设备连接已新增' : '设备连接已更新')
  await refresh()
}
</script>
