<template>
  <gi-page-layout>
    <template #header><h3>IoT 自动报工规则</h3></template>
    <template #tool><gi-button type="add" @click="openAdd" /></template>

    <!-- 报工成功率统计 -->
    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="6" v-for="c in reportStats" :key="c.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">{{ c.label }}</div>
          <div class="stat-value" :style="{ color: c.color }">
            {{ c.value }}<span class="stat-unit">{{ c.unit }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #trigger="{ row }">
        <el-tag size="small">{{
          row.trigger === 'cycle_complete'
            ? '周期完成'
            : row.trigger === 'power_off'
              ? '设备停机'
              : row.trigger === 'count_reached'
                ? '计数到达'
                : '连续运行'
        }}</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button
          :type="row.status === 'active' ? 'warning' : 'success'"
          link
          size="small"
          @click="toggle(row)"
        >{{ row.status === 'active' ? '停用' : '启用' }}</el-button>
      </template>
    </gi-table>

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
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import AutoReportFormDialog, { type AutoReportFormModel } from './AutoReportFormDialog.vue'

interface AutoReportRow {
  id: string
  equipment: string
  trigger: string
  threshold: number
  wo_field: string
  default_qty: number
  status: string
}

const equipmentOptions = [
  { label: '数控车床 CK6150', value: '数控车床 CK6150' },
  { label: '钻床 Z3050', value: '钻床 Z3050' },
  { label: '加工中心 VMC850', value: '加工中心 VMC850' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const formModel = ref<AutoReportFormModel>(createDefaultFormModel())

const mockData = ref<AutoReportRow[]>([
  { id: '1', equipment: '数控车床 CK6150', trigger: 'cycle_complete', threshold: 1, wo_field: 'qualified_qty', default_qty: 1, status: 'active' },
  { id: '2', equipment: '钻床 Z3050', trigger: 'count_reached', threshold: 100, wo_field: 'qualified_qty', default_qty: 100, status: 'active' },
  { id: '3', equipment: '加工中心 VMC850', trigger: 'power_off', threshold: 0, wo_field: 'qualified_qty', default_qty: 1, status: 'disabled' }
])

const { tableData, pagination, loading, refresh } = useTable<AutoReportRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    return { list: mockData.value.slice(start, start + size), total: mockData.value.length }
  }
})

const reportStats = computed(() => {
  const activeRules = mockData.value.filter((r) => r.status === 'active')
  return [
    { label: '启用规则数', value: String(activeRules.length), unit: '条', color: '#409eff' },
    { label: '今日报工次数', value: '156', unit: '次', color: '#67c23a' },
    { label: '报工成功率', value: '98.7', unit: '%', color: '#67c23a' },
    { label: '异常次数', value: '2', unit: '次', color: '#f56c6c' }
  ]
})

const columns: TableColumnItem<AutoReportRow>[] = [
  { prop: 'equipment', label: '设备', minWidth: 180 },
  { label: '触发条件', minWidth: 120, slotName: 'trigger', align: 'center' },
  { prop: 'threshold', label: '阈值', minWidth: 80, align: 'center' },
  { prop: 'wo_field', label: '报工字段', minWidth: 120 },
  { prop: 'default_qty', label: '默认数量', minWidth: 90, align: 'center' },
  { label: '状态', minWidth: 60, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

function createDefaultFormModel(): AutoReportFormModel {
  return { id: '', equipment: '数控车床 CK6150', trigger: 'cycle_complete', threshold: 1, wo_field: 'qualified_qty', default_qty: 1, status: 'active' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: AutoReportRow) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.equipment) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    mockData.value.unshift({ ...formModel.value, id: Date.now().toString() } as AutoReportRow)
  } else {
    const i = mockData.value.findIndex((e) => e.id === editingId.value)
    if (i > -1) Object.assign(mockData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function toggle(row: AutoReportRow) {
  row.status = row.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(row.status === 'active' ? '已启用' : '已停用')
}
</script>

<style scoped>
.stat-card :deep(.el-card__body) {
  padding: 16px;
  text-align: center;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
}
.stat-unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}
</style>
