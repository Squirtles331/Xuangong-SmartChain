<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe size="small">
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
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <IoTConfigFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getIoTConfigList } from '@/api/iot'
import { useTable } from '@/hooks/useTable'
import IoTConfigFormDialog, { type IoTConfigFormModel } from './IoTConfigFormDialog.vue'

interface IoTConfigRow {
  id: string
  name: string
  protocol: string
  address: string
  port: number
  interval: string
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', protocol: '', status: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<IoTConfigFormModel>(createDefaultFormModel())

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

const columns: TableColumnItem<IoTConfigRow>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'name', label: '设备名称', minWidth: 160 },
  { label: '协议', minWidth: 80, slotName: 'protocol', align: 'center' },
  { prop: 'address', label: '连接地址', minWidth: 220 },
  { prop: 'port', label: '端口', minWidth: 70, align: 'center' },
  { prop: 'interval', label: '采集间隔', minWidth: 80, align: 'center' },
  { prop: 'status', label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<IoTConfigRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getIoTConfigList({
      pageNum: page,
      pageSize: size,
      keyword: searchForm.value.keyword || undefined,
      protocol: searchForm.value.protocol || undefined,
      status: searchForm.value.status || undefined
    })
    return { list: res.data.list, total: res.data.total }
  }
})

function createDefaultFormModel(): IoTConfigFormModel {
  return { id: '', name: '', protocol: 'OPC UA', address: '', port: 4840, interval: '1s', status: 'connected' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', protocol: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: IoTConfigRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

function remove(row: IoTConfigRow) {
  tableData.value = tableData.value.filter((c) => c.id !== row.id)
  if ((pagination.currentPage - 1) * pagination.pageSize >= tableData.value.length) {
    pagination.currentPage = Math.max(1, pagination.currentPage - 1)
  }
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.address) {
    ElMessage.warning('请填写设备名称和连接地址')
    return
  }

  if (dialogMode.value === 'add') {
    tableData.value.unshift({ ...formModel.value, id: String(Date.now()) } as IoTConfigRow)
  } else {
    const idx = tableData.value.findIndex((c) => c.id === formModel.value.id)
    if (idx > -1) tableData.value[idx] = { ...formModel.value } as IoTConfigRow
  }

  dialogVisible.value = false
  await refresh()
}
</script>
