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

    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col v-for="card in reportStats" :key="card.label" :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value" :style="{ color: card.color }">
            {{ card.value }}<span class="stat-unit">{{ card.unit }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <TableSetting title="自动报工规则" :columns="columns" @refresh="refresh">
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
          <template #trigger="{ row }">
            <el-tag size="small">{{ triggerLabelMap[row.trigger] }}</el-tag>
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggle(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <AutoReportFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :equipment-options="equipmentOptions"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import {
  createIoTAutoReportRule,
  getIoTAutoReportList,
  updateIoTAutoReportRule,
  type IoTAutoReportQuery,
  type IoTAutoReportRule,
  type IoTRuleStatus,
  type IoTTriggerType
} from '@/api/iot'
import { useTable } from '@/hooks/useTable'
import AutoReportFormDialog, { type AutoReportFormModel } from './AutoReportFormDialog.vue'

const equipmentOptions = [
  { label: '数控车床 CK6150', value: '数控车床 CK6150' },
  { label: '钻床 Z3050', value: '钻床 Z3050' },
  { label: '加工中心 VMC850', value: '加工中心 VMC850' }
]

const triggerLabelMap: Record<IoTTriggerType, string> = {
  cycle_complete: '周期完成',
  count_reached: '计数到达',
  power_off: '设备停机',
  continuous: '连续运行'
}

const statusOptions: Array<{ label: string; value: '' | IoTRuleStatus }> = [
  { label: '全部', value: '' },
  { label: '启用', value: 'active' },
  { label: '停用', value: 'disabled' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '设备名称', field: 'equipment' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<IoTAutoReportRule>[] = [
  { prop: 'equipment', label: '设备', minWidth: 180 },
  { prop: 'trigger', label: '触发条件', minWidth: 120, align: 'center', slotName: 'trigger' },
  { prop: 'threshold', label: '阈值', minWidth: 90, align: 'center' },
  { prop: 'wo_field', label: '报工字段', minWidth: 120 },
  { prop: 'default_qty', label: '默认数量', minWidth: 100, align: 'center' },
  { prop: 'status', label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 180, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive<{
  equipment: string
  status: '' | IoTRuleStatus
}>({
  equipment: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<AutoReportFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<IoTAutoReportRule>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: IoTAutoReportQuery = {
      pageNum: page,
      pageSize: size,
      equipment: queryParams.equipment || undefined,
      status: queryParams.status || undefined
    }

    const response = await getIoTAutoReportList(params)
    return response.data
  }
})

const reportStats = computed(() => {
  const activeRules = tableData.value.filter((item) => item.status === 'active')
  return [
    { label: '启用规则数', value: String(activeRules.length), unit: '条', color: '#409eff' },
    { label: '今日报工次数', value: '156', unit: '次', color: '#67c23a' },
    { label: '报工成功率', value: '98.7', unit: '%', color: '#67c23a' },
    { label: '异常次数', value: '2', unit: '次', color: '#f56c6c' }
  ]
})

function createDefaultFormModel(): AutoReportFormModel {
  return {
    id: '',
    equipment: '数控车床 CK6150',
    trigger: 'cycle_complete',
    threshold: 1,
    wo_field: 'qualified_qty',
    default_qty: 1,
    status: 'active'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    equipment: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: IoTAutoReportRule) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.equipment) {
    ElMessage.warning('请选择设备')
    return
  }

  if (dialogMode.value === 'add') {
    await createIoTAutoReportRule(formModel.value)
    ElMessage.success('新增成功')
  } else {
    await updateIoTAutoReportRule(formModel.value.id, formModel.value)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}

async function toggle(row: IoTAutoReportRule) {
  const nextStatus: IoTRuleStatus = row.status === 'active' ? 'disabled' : 'active'
  await updateIoTAutoReportRule(row.id, { ...row, status: nextStatus })
  await refresh()
  ElMessage.success(nextStatus === 'active' ? '已启用' : '已停用')
}
</script>

<style scoped>
.stat-card :deep(.el-card__body) {
  padding: 16px;
  text-align: center;
}

.stat-label {
  margin-bottom: 8px;
  font-size: 13px;
  color: #909399;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.stat-unit {
  margin-left: 4px;
  font-size: 14px;
  color: #909399;
}

:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
