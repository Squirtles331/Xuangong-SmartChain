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

    <TableSetting title="保养计划" :columns="columns" @refresh="refresh">
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
            <el-tag :type="row.type === 'daily' ? 'info' : row.type === 'weekly' ? 'warning' : 'primary'">
              {{ row.type === 'daily' ? '日常' : row.type === 'weekly' ? '周保养' : '大修' }}
            </el-tag>
          </template>

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

    <MaintainFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <MaintainExecuteDialog v-model:visible="execVisible" v-model:items="execItems" v-model:form="execForm" @submit="confirmExec" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  executeEquipmentMaintain,
  getEquipmentMaintainList,
  saveEquipmentMaintain,
  type EquipmentMaintain,
  type EquipmentMaintainQuery
} from '@/api/equipment'
import { useTable } from '@/hooks/useTable'
import MaintainFormDialog, { type MaintainFormModel } from './MaintainFormDialog.vue'
import MaintainExecuteDialog, { type MaintainExecuteFormModel, type MaintainExecuteItem } from './MaintainExecuteDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '设备名称', field: 'keyword' },
  {
    type: 'select-v2',
    label: '保养类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '日常', value: 'daily' },
        { label: '周保养', value: 'weekly' },
        { label: '大修', value: 'overhaul' }
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

const columns: TableColumnItem<EquipmentMaintain>[] = [
  { prop: 'code', label: '计划编号', minWidth: 160 },
  { prop: 'equipment', label: '设备', minWidth: 160 },
  { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'plan_date', label: '计划日期', minWidth: 120 },
  { prop: 'executor', label: '执行人', minWidth: 100 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  type: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<MaintainFormModel>(createDefaultFormModel())

const execVisible = ref(false)
const execPlanId = ref('')
const execForm = ref<MaintainExecuteFormModel>({ remark: '' })
const execItems = ref<MaintainExecuteItem[]>([
  { name: '清洁设备表面', result: 'done' },
  { name: '检查润滑油', result: 'done' },
  { name: '紧固螺栓', result: 'done' },
  { name: '更换滤芯', result: 'done' },
  { name: '电气检查', result: 'done' }
])

const { tableData, pagination, loading, search, refresh } = useTable<EquipmentMaintain>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EquipmentMaintainQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: (queryParams.type || undefined) as EquipmentMaintain['type'] | undefined,
      status: (queryParams.status || undefined) as EquipmentMaintain['status'] | undefined
    }
    const response = await getEquipmentMaintainList(params)
    return response.data
  }
})

function createDefaultFormModel(): MaintainFormModel {
  return {
    id: '',
    code: '',
    equipment: '',
    type: 'daily',
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
    type: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EquipmentMaintain) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  await saveEquipmentMaintain({
    ...formModel.value,
    type: formModel.value.type as EquipmentMaintain['type'],
    status: formModel.value.status as EquipmentMaintain['status']
  })
  dialogVisible.value = false
  await refresh()
}

function execute(row: EquipmentMaintain) {
  execPlanId.value = row.id
  execForm.value = { remark: '' }
  execItems.value = execItems.value.map((item) => ({ ...item, result: 'done' }))
  execVisible.value = true
}

async function confirmExec() {
  await executeEquipmentMaintain(execPlanId.value, { remark: execForm.value.remark })
  execVisible.value = false
  ElMessage.success('保养完成')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
