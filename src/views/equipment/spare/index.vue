<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @reset="handleReset"
          @search="search"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="备件库存" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
          :row-class-name="rowClassName"
        >
          <template #stockStatus="{ row }">
            <el-tag :type="row.qty > row.safety ? 'success' : row.qty > 0 ? 'warning' : 'danger'">
              {{ row.qty > row.safety ? '充足' : row.qty > 0 ? '偏低' : '缺货' }}
            </el-tag>
          </template>

          <template #qty="{ row }">
            <span :style="{ color: row.qty < row.safety ? '#f56c6c' : '', fontWeight: row.qty < row.safety ? 'bold' : '' }">
              {{ row.qty }}
            </span>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button type="primary" link size="small" @click="inbound(row)">入库</el-button>
            <el-button type="warning" link size="small" @click="outbound(row)">出库</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <SpareFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getEquipmentSpareList, saveEquipmentSpare, updateEquipmentSpareQty, type EquipmentSpare, type EquipmentSpareQuery } from '@/api/equipment'
import { useTable } from '@/hooks/useTable'
import SpareFormDialog, { type SpareFormModel } from './SpareFormDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '库存状态',
    field: 'stock_status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '充足', value: 'ok' },
        { label: '偏低', value: 'low' },
        { label: '缺货', value: 'out' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EquipmentSpare>[] = [
  { prop: 'code', label: '备件编码', minWidth: 140 },
  { prop: 'name', label: '备件名称', minWidth: 160 },
  { prop: 'spec', label: '规格', minWidth: 120 },
  { prop: 'applicable_equipment', label: '适用设备', minWidth: 180 },
  { label: '库存数量', minWidth: 100, slotName: 'qty', align: 'center' },
  { prop: 'safety', label: '安全库存', minWidth: 100, align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 90, slotName: 'stockStatus', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  stock_status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SpareFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<EquipmentSpare>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentSpareQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      stock_status: (queryParams.stock_status || undefined) as EquipmentSpareQuery['stock_status']
    }
    const response = await getEquipmentSpareList(params)
    return response.data
  }
})

function createDefaultFormModel(): SpareFormModel {
  return {
    id: '',
    code: '',
    name: '',
    spec: '',
    applicable_equipment: '',
    qty: 0,
    safety: 5,
    unit: '件',
    location: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    stock_status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EquipmentSpare) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  await saveEquipmentSpare({ ...formModel.value })
  dialogVisible.value = false
  await refresh()
}

async function inbound(row: EquipmentSpare) {
  await updateEquipmentSpareQty(row.id, 1)
  ElMessage.success(`入库 1${row.unit}`)
  await refresh()
}

async function outbound(row: EquipmentSpare) {
  if (row.qty <= 0) {
    ElMessage.warning('库存不足')
    return
  }
  await updateEquipmentSpareQty(row.id, -1)
  ElMessage.success(`出库 1${row.unit}`)
  await refresh()
}

function rowClassName({ row }: { row: EquipmentSpare }) {
  return row.qty < row.safety ? 'safety-warning-row' : ''
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

:deep(.safety-warning-row) {
  background-color: #fef0f0 !important;
}
</style>
