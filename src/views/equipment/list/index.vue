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

    <div class="stats-row">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-value">{{ totalCount }}</div>
        <div class="stat-label">设备总数</div>
      </el-card>
      <el-card shadow="hover" class="stat-card stat-running">
        <div class="stat-value">{{ runningCount }}</div>
        <div class="stat-label">运行中</div>
      </el-card>
      <el-card shadow="hover" class="stat-card stat-idle">
        <div class="stat-value">{{ idleCount }}</div>
        <div class="stat-label">空闲</div>
      </el-card>
      <el-card shadow="hover" class="stat-card stat-repair">
        <div class="stat-value">{{ repairCount }}</div>
        <div class="stat-label">维修/保养</div>
      </el-card>
    </div>

    <TableSetting title="设备台账" :columns="columns" @refresh="refresh">
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
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="equipmentStatusOptions" />
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="openCheckPlan(row)">点检</el-button>
            <el-button type="success" link size="small" @click="openMaintainPlan(row)">保养</el-button>
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <EquipmentFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { EQUIPMENT_STATUS as equipmentStatusOptions } from '@/common/status-maps'
import { createEquipment, deleteEquipment, getEquipmentList, updateEquipment, type Equipment, type EquipmentQuery } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import EquipmentFormDialog, { type EquipmentFormModel } from './EquipmentFormDialog.vue'

const router = useRouter()

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '车间',
    field: 'workshop',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' },
        { label: '装配车间', value: '装配车间' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '运行中', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '保养中', value: 'maintenance' },
        { label: '维修中', value: 'repair' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Equipment>[] = [
  { prop: 'code', label: '设备编码', minWidth: 150 },
  { prop: 'name', label: '设备名称', minWidth: 140 },
  { prop: 'model', label: '型号', minWidth: 120 },
  { prop: 'workshop', label: '所属车间', minWidth: 160 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'purchase_date', label: '购置日期', minWidth: 120 },
  { prop: 'commission_date', label: '投产日期', minWidth: 120 },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  workshop: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EquipmentFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Equipment>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentQuery = {
      pageNum: page,
      pageSize: size,
      name: queryParams.keyword || undefined,
      workshop: queryParams.workshop || undefined,
      status: queryParams.status || undefined
    }
    const response = await getEquipmentList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEquipment(id)))
})

const totalCount = computed(() => tableData.value.length)
const runningCount = computed(() => tableData.value.filter((item) => item.status === 'running').length)
const idleCount = computed(() => tableData.value.filter((item) => item.status === 'idle').length)
const repairCount = computed(() => tableData.value.filter((item) => item.status === 'repair' || item.status === 'maintenance').length)

function createDefaultFormModel(): EquipmentFormModel {
  return {
    id: '',
    code: '',
    name: '',
    model: '',
    workshop: '机加工一车间',
    status: 'running',
    purchase_date: '',
    commission_date: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    workshop: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: Equipment) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    model: row.model,
    workshop: row.workshop,
    status: row.status,
    purchase_date: row.purchase_date || '',
    commission_date: row.commission_date || ''
  }
  dialogVisible.value = true
}

function openCheckPlan(_row: Equipment) {
  router.push('/collaboration/equipment-iot/equipment/check')
}

function openMaintainPlan(_row: Equipment) {
  router.push('/collaboration/equipment-iot/equipment/maintain')
}

async function submitDialog() {
  const payload: Partial<Equipment> = {
    id: formModel.value.id,
    code: formModel.value.code,
    name: formModel.value.name,
    model: formModel.value.model,
    workshop: formModel.value.workshop,
    status: formModel.value.status as Equipment['status'],
    purchase_date: formModel.value.purchase_date,
    commission_date: formModel.value.commission_date
  }

  if (dialogMode.value === 'add') {
    await createEquipment(payload)
  } else {
    await updateEquipment(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat-card {
  flex: 1;
  text-align: center;
  cursor: default;
}

.stat-card :deep(.el-card__body) {
  padding: 16px 12px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  color: #303133;
}

.stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
}

.stat-running .stat-value {
  color: #67c23a;
}

.stat-idle .stat-value {
  color: #909399;
}

.stat-repair .stat-value {
  color: #e6a23c;
}

:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
