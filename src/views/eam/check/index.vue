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

    <TableSetting title="点检计划" :columns="columns" @refresh="refresh">
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
            <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'done' ? 'success' : 'danger'">
              {{ row.status === 'pending' ? '待执行' : row.status === 'done' ? '已完成' : '已逾期' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="execute(row)">执行</el-button>
            <gi-button type="edit" @click="openEdit(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <CheckFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <CheckExecuteDialog v-model:visible="execVisible" v-model:items="execItems" v-model:form="execForm" @submit="confirmExec" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { executeEquipmentCheck, getEquipmentCheckList, saveEquipmentCheck, type EquipmentCheck, type EquipmentCheckQuery } from '@/api/equipment'
import { useTable } from '@/hooks/useTable'
import CheckFormDialog, { type CheckFormModel } from './CheckFormDialog.vue'
import CheckExecuteDialog, { type CheckExecuteFormModel, type CheckExecuteItem } from './CheckExecuteDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '设备名称', field: 'keyword' },
  {
    type: 'select-v2',
    label: '点检类型',
    field: 'check_type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '日点检', value: '日点检' },
        { label: '周点检', value: '周点检' },
        { label: '月点检', value: '月点检' }
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
        { label: '待执行', value: 'pending' },
        { label: '已完成', value: 'done' },
        { label: '已逾期', value: 'overdue' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EquipmentCheck>[] = [
  { prop: 'code', label: '计划编号', minWidth: 160 },
  { prop: 'equipment', label: '设备', minWidth: 160 },
  { prop: 'check_type', label: '点检类型', minWidth: 100 },
  { prop: 'plan_date', label: '计划日期', minWidth: 120 },
  { prop: 'executor', label: '执行人', minWidth: 100 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  check_type: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<CheckFormModel>(createDefaultFormModel())

const execVisible = ref(false)
const execPlanId = ref('')
const execForm = ref<CheckExecuteFormModel>({ remark: '' })
const execItems = ref<CheckExecuteItem[]>([
  { name: '设备外观', result: 'normal' },
  { name: '运行声音', result: 'normal' },
  { name: '润滑油位', result: 'normal' },
  { name: '安全防护', result: 'normal' },
  { name: '仪表读数', result: 'normal' }
])

const { tableData, pagination, loading, search, refresh } = useTable<EquipmentCheck>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentCheckQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      check_type: (queryParams.check_type || undefined) as EquipmentCheck['check_type'] | undefined,
      status: (queryParams.status || undefined) as EquipmentCheck['status'] | undefined
    }
    const response = await getEquipmentCheckList(params)
    return response.data
  }
})

function createDefaultFormModel(): CheckFormModel {
  return {
    id: '',
    code: '',
    equipment: '',
    check_type: '日点检',
    plan_date: '',
    executor: '',
    status: 'pending'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    check_type: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EquipmentCheck) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  await saveEquipmentCheck({
    ...formModel.value,
    check_type: formModel.value.check_type as EquipmentCheck['check_type'],
    status: formModel.value.status as EquipmentCheck['status']
  })
  dialogVisible.value = false
  await refresh()
}

function execute(row: EquipmentCheck) {
  execPlanId.value = row.id
  execForm.value = { remark: '' }
  execItems.value = execItems.value.map((item) => ({ ...item, result: 'normal' }))
  execVisible.value = true
}

async function confirmExec() {
  await executeEquipmentCheck(execPlanId.value, { remark: execForm.value.remark })
  execVisible.value = false
  ElMessage.success('点检完成')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
