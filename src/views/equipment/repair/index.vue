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
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #priority="{ row }">
        <StatusTag :value="row.priority" :options="WORK_ORDER_PRIORITY" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="REPAIR_STATUS" />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="dispatch(row)">派工</el-button>
        <el-button v-if="row.status === 'running'" type="success" link size="small" @click="complete(row)">完工</el-button>
      </template>
    </gi-table>

    <RepairFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { WORK_ORDER_PRIORITY } from '@/common/status-maps'
import { useTable } from '@/hooks/useTable'
import RepairFormDialog, { type RepairFormModel } from './RepairFormDialog.vue'

interface RepairRow {
  id: string
  code: string
  equipment: string
  fault_desc: string
  priority: string
  status: string
  worker: string
  created_at: string
}

const REPAIR_STATUS = [
  { value: 'pending', label: '待派工', type: 'warning' as const },
  { value: 'running', label: '维修中', type: 'primary' as const },
  { value: 'done', label: '已完成', type: 'success' as const },
  { value: 'verified', label: '已验收', type: 'info' as const }
]

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  status: '',
  priority: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<RepairFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待派工', value: 'pending' },
        { label: '维修中', value: 'running' },
        { label: '已完成', value: 'done' },
        { label: '已验收', value: 'verified' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '紧急', value: 'urgent' },
        { label: '高', value: 'high' },
        { label: '普通', value: 'normal' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const cols: TableColumnItem<RepairRow>[] = [
  { prop: 'code', label: '维修单号', minWidth: 170 },
  { prop: 'equipment', label: '设备', minWidth: 160 },
  { prop: 'fault_desc', label: '故障描述', minWidth: 200 },
  { label: '优先级', minWidth: 70, slotName: 'priority', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'worker', label: '维修人', minWidth: 80 },
  { prop: 'created_at', label: '创建时间', minWidth: 150 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<RepairRow>({
  rowKey: 'id',
  listAPI: async () => {
    return { list: [], total: 0 }
  }
})

function createDefaultFormModel(): RepairFormModel {
  return {
    id: '',
    code: '',
    equipment: '',
    fault_desc: '',
    priority: 'normal',
    status: 'pending',
    worker: '',
    created_at: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', status: '', priority: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: RepairRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    equipment: row.equipment,
    fault_desc: row.fault_desc,
    priority: row.priority,
    status: row.status,
    worker: row.worker,
    created_at: row.created_at
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function dispatch(row: RepairRow) {
  row.status = 'running'
  row.worker = row.worker || '张维修'
  ElMessage.success('已派工')
}

function complete(row: RepairRow) {
  row.status = 'done'
  ElMessage.success('维修完成，待验收')
}
</script>
