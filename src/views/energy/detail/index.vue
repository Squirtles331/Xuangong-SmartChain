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

    <TableSetting title="能耗明细" :columns="columns" @refresh="refresh">
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
          <template #type="{ row }">
            <el-tag :type="energyTypeTagMap[row.type]">
              {{ row.type }}
            </el-tag>
          </template>

          <template #usage="{ row }">
            {{ row.usage.toLocaleString('zh-CN') }}
          </template>

          <template #cost="{ row }">
            {{ row.cost.toLocaleString('zh-CN') }}
          </template>

          <template #rate="{ row }">
            {{ row.rate }}
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <EnergyDetailFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { deleteEnergyDetail, getEnergyDetailList, saveEnergyDetail, type EnergyDetail, type EnergyDetailQuery } from '@/api/energy'
import { useTable } from '@/hooks/useTable'
import EnergyDetailFormDialog, { type EnergyDetailFormModel } from './EnergyDetailFormDialog.vue'

const energyTypeTagMap: Record<EnergyDetail['type'], 'warning' | 'primary' | 'success'> = {
  电: 'warning',
  水: 'primary',
  气: 'success'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '能源类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '电', value: 'electricity' },
        { label: '水', value: 'water' },
        { label: '气', value: 'gas' }
      ]
    } as any
  },
  { type: 'input', label: '期间', field: 'period', props: { placeholder: '例如 2026-01' } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EnergyDetail>[] = [
  { prop: 'period', label: '期间', minWidth: 110 },
  { label: '能源类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'workshop', label: '车间', minWidth: 160 },
  { label: '用量', minWidth: 120, slotName: 'usage', align: 'right' },
  { prop: 'unit', label: '单位', minWidth: 90, align: 'center' },
  { label: '单价', minWidth: 100, slotName: 'rate', align: 'right' },
  { label: '成本', minWidth: 120, slotName: 'cost', align: 'right' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  type: '',
  period: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EnergyDetailFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EnergyDetail>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EnergyDetailQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: (queryParams.type || undefined) as EnergyDetailQuery['type'],
      period: queryParams.period || undefined
    }
    const response = await getEnergyDetailList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEnergyDetail(id)))
})

function createDefaultFormModel(): EnergyDetailFormModel {
  return {
    id: '',
    period: '',
    type: 'electricity',
    workshop: '',
    usage: 0,
    unit: 'kWh',
    rate: 0.9,
    cost: 0
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: '',
    period: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EnergyDetail) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    period: row.period,
    type: row.type === '电' ? 'electricity' : row.type === '水' ? 'water' : 'gas',
    workshop: row.workshop,
    usage: row.usage,
    unit: row.unit,
    rate: row.rate,
    cost: row.cost
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.period || !formModel.value.workshop) {
    ElMessage.warning('请填写期间和车间')
    return
  }

  const typeMap = {
    electricity: '电',
    water: '水',
    gas: '气'
  } as const

  await saveEnergyDetail({
    id: formModel.value.id,
    period: formModel.value.period,
    workshop: formModel.value.workshop,
    type: typeMap[formModel.value.type],
    usage: formModel.value.usage,
    unit: formModel.value.unit,
    rate: formModel.value.rate,
    cost: formModel.value.cost
  })

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
