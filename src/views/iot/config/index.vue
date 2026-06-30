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
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="IoT 连接配置" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #index="{ $index }">
            {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
          </template>

          <template #protocol="{ row }">
            <el-tag :type="row.protocol === 'OPC UA' ? 'primary' : row.protocol === 'MQTT' ? 'success' : 'warning'">
              {{ row.protocol }}
            </el-tag>
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'connected' ? 'success' : 'danger'">
              {{ row.status === 'connected' ? '已连接' : '已断开' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <IoTConfigFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createIoTConfig,
  deleteIoTConfig,
  getIoTConfigList,
  updateIoTConfig,
  type IoTConfig,
  type IoTConfigQuery,
  type IoTConnectionStatus
} from '@/api/iot'
import { useTable } from '@/hooks/useTable'
import IoTConfigFormDialog, { type IoTConfigFormModel } from './IoTConfigFormDialog.vue'

const statusOptions: Array<{ label: string; value: '' | IoTConnectionStatus }> = [
  { label: '全部', value: '' },
  { label: '已连接', value: 'connected' },
  { label: '已断开', value: 'disconnected' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword' },
  {
    type: 'select-v2',
    label: '通信协议',
    field: 'protocol',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: 'OPC UA', value: 'OPC UA' },
        { label: 'MQTT', value: 'MQTT' },
        { label: 'Modbus', value: 'Modbus' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '连接状态',
    field: 'status',
    props: {
      options: statusOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<IoTConfig>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'name', label: '设备名称', minWidth: 180 },
  { prop: 'protocol', label: '通信协议', minWidth: 100, align: 'center', slotName: 'protocol' },
  { prop: 'address', label: '连接地址', minWidth: 220 },
  { prop: 'port', label: '端口', minWidth: 80, align: 'center' },
  { prop: 'interval', label: '采集间隔', minWidth: 100, align: 'center' },
  { prop: 'status', label: '连接状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  keyword: string
  protocol: string
  status: '' | IoTConnectionStatus
}>({
  keyword: '',
  protocol: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<IoTConfigFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<IoTConfig>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: IoTConfigQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      protocol: queryParams.protocol || undefined,
      status: queryParams.status || undefined
    }

    const response = await getIoTConfigList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteIoTConfig(id)))
})

function createDefaultFormModel(): IoTConfigFormModel {
  return {
    id: '',
    name: '',
    protocol: 'OPC UA',
    address: '',
    port: 4840,
    interval: '1s',
    status: 'connected'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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

function openEdit(row: IoTConfig) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.name || !formModel.value.address) {
    ElMessage.warning('请填写设备名称和连接地址')
    return
  }

  if (dialogMode.value === 'add') {
    await createIoTConfig(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateIoTConfig(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
