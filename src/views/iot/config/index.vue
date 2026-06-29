<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="iot-config-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>
    <gi-table :columns="cols" :data="pagedData" :pagination="pagination" border stripe size="small">
      <template #index="{ $index }">
        {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
      </template>
      <template #protocol="{ row }">
        <el-tag :type="row.protocol === 'OPC UA' ? 'primary' : row.protocol === 'MQTT' ? 'success' : 'warning'" size="small">
          {{ row.protocol }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'connected' ? 'success' : 'danger'" size="small">
          {{ row.status === 'connected' ? '已连接' : '已断开' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="editCfg(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="del(row.id)" />
      </template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增连接配置' : '编辑连接配置'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="110" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'

interface IotConfig {
  id: string
  name: string
  protocol: string
  address: string
  port: number
  interval: string
  status: string
}

const searchForm = ref({ keyword: '', protocol: '', status: '' })
const searchFormRef = ref<FormInstance | null>()
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '协议',
    field: 'protocol',
    props: {
      clearable: true,
      options: [
        { label: 'OPC UA', value: 'OPC UA' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'Modbus', value: 'Modbus' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '已连接', value: 'connected' },
        { label: '已断开', value: 'disconnected' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const data = ref<IotConfig[]>([
  { id: '1', name: '数控车床 CK6150', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.10', port: 4840, interval: '1s', status: 'connected' },
  { id: '2', name: '钻床 Z3050', protocol: 'MQTT', address: 'mqtt://192.168.1.11', port: 1883, interval: '5s', status: 'connected' },
  { id: '3', name: '加工中心 VMC850', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.12', port: 4840, interval: '1s', status: 'connected' },
  { id: '4', name: '磨床 M1432', protocol: 'Modbus', address: '192.168.1.13', port: 502, interval: '2s', status: 'connected' },
  { id: '5', name: '铣床 X5032', protocol: 'MQTT', address: 'mqtt://192.168.1.14', port: 1883, interval: '10s', status: 'disconnected' },
  { id: '6', name: '镗床 T611B', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.15', port: 4840, interval: '1s', status: 'connected' },
  { id: '7', name: '热处理炉', protocol: 'Modbus', address: '192.168.1.16', port: 502, interval: '5s', status: 'disconnected' }
])

const filteredData = computed(() => {
  return data.value.filter((c) => {
    const matchKeyword =
      !searchForm.value.keyword ||
      c.name.includes(searchForm.value.keyword) ||
      c.address.includes(searchForm.value.keyword) ||
      c.protocol.includes(searchForm.value.keyword)
    const matchProtocol = !searchForm.value.protocol || c.protocol === searchForm.value.protocol
    const matchStatus = !searchForm.value.status || c.status === searchForm.value.status
    return matchKeyword && matchProtocol && matchStatus
  })
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => filteredData.value.length)
}) as any

const pagedData = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredData.value.slice(start, end)
})

const cols: TableColumnItem<IotConfig>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'name', label: '设备名称', minWidth: 160 },
  { label: '协议', minWidth: 80, slotName: 'protocol', align: 'center' },
  { prop: 'address', label: '连接地址', minWidth: 220 },
  { prop: 'port', label: '端口', minWidth: 70, align: 'center' },
  { prop: 'interval', label: '采集间隔', minWidth: 80, align: 'center' },
  { prop: 'status', label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const form = ref<IotConfig>({
  id: '',
  name: '',
  protocol: 'OPC UA',
  address: '',
  port: 4840,
  interval: '1s',
  status: 'connected'
})

const formCols: FormColumnItem[] = [
  { type: 'input', label: '设备名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '协议',
    field: 'protocol',
    required: true,
    props: {
      options: [
        { label: 'OPC UA', value: 'OPC UA' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'Modbus', value: 'Modbus' }
      ]
    } as any
  },
  { type: 'input', label: '连接地址', field: 'address', required: true },
  { type: 'input-number', label: '端口', field: 'port', required: true, props: { min: 1, max: 65535 } as any },
  { type: 'input', label: '采集间隔', field: 'interval' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '已连接', value: 'connected' },
        { label: '已断开', value: 'disconnected' }
      ]
    } as any
  }
]

function handleSearch() {
  pagination.value.currentPage = 1
}

function handleReset() {
  searchForm.value = { keyword: '', protocol: '', status: '' }
  pagination.value.currentPage = 1
}

function refresh() {
  pagination.value.currentPage = 1
}

function openAdd() {
  mode.value = 'add'
  form.value = { id: String(Date.now()), name: '', protocol: 'OPC UA', address: '', port: 4840, interval: '1s', status: 'connected' }
  vis.value = true
}

function editCfg(row: IotConfig) {
  mode.value = 'edit'
  form.value = { ...row }
  vis.value = true
}

function del(id: string) {
  data.value = data.value.filter((c) => c.id !== id)
  if ((pagination.value.currentPage - 1) * pagination.value.pageSize >= filteredData.value.length) {
    pagination.value.currentPage = Math.max(1, pagination.value.currentPage - 1)
  }
}

async function submit() {
  if (!form.value.name || !form.value.address) {
    ElMessage.warning('请填写设备名称和连接地址')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ ...form.value })
  } else {
    const idx = data.value.findIndex((c) => c.id === form.value.id)
    if (idx > -1) data.value[idx] = { ...form.value }
  }
  return true
}
</script>
