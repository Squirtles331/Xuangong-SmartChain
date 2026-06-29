<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @reset="handleReset"
          @search="handleSearch"
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

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="EQUIPMENT_STATUS" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
        <el-button type="warning" link size="small" @click="$router.push(`/equipment/check-plan/${row.id}`)">点检</el-button>
        <el-button type="success" link size="small" @click="$router.push(`/equipment/maintain-plan/${row.id}`)">保养</el-button>
        <gi-button type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <EquipmentFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { EQUIPMENT_STATUS } from '@/common/status-maps'
import { useTable } from '@/hooks/useTable'
import EquipmentFormDialog, { type EquipmentFormModel } from './EquipmentFormDialog.vue'

interface EqRow {
  id: string
  code: string
  name: string
  model: string
  workshop: string
  status: string
  purchase_date: string
  commission_date: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  workshop: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EquipmentFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '车间',
    field: 'workshop',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '保养', value: 'maintenance' },
        { label: '维修', value: 'repair' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const cols: TableColumnItem<EqRow>[] = [
  { prop: 'code', label: '设备编码', width: 150 },
  { prop: 'name', label: '设备名称', width: 120 },
  { prop: 'model', label: '型号', width: 100 },
  { prop: 'workshop', label: '所属车间', width: 140 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'purchase_date', label: '购置日期', width: 110 },
  { prop: 'commission_date', label: '投产日期', width: 110 },
  { label: '操作', minWidth: 280, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EqRow>({
  rowKey: 'id',
  listAPI: async () => {
    return { list: [], total: 0 }
  },
  deleteAPI: (ids) => Promise.all(ids.map(() => Promise.resolve()))
})

const totalCount = computed(() => tableData.value.length)
const runningCount = computed(() => tableData.value.filter((e) => e.status === 'running').length)
const idleCount = computed(() => tableData.value.filter((e) => e.status === 'idle').length)
const repairCount = computed(() => tableData.value.filter((e) => e.status === 'repair' || e.status === 'maintenance').length)

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

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', workshop: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EqRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    model: row.model,
    workshop: row.workshop,
    status: row.status,
    purchase_date: row.purchase_date,
    commission_date: row.commission_date
  }
  dialogVisible.value = true
}

async function submitDialog() {
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
  color: #303133;
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
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
</style>
