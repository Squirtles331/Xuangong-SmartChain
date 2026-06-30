<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="loadHistory" />
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="预警规则" name="rules">
        <gi-table :columns="ruleColumns" :data="rules" border stripe>
          <template #metric="{ row }">
            <el-tag size="small">{{ metricLabel[row.metric] || row.metric }}</el-tag>
          </template>
          <template #level="{ row }">
            <el-tag :type="row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : 'info'" size="small">
              {{ levelLabel[row.level] || row.level }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggle(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <gi-button type="delete" @click="removeRule(row.id)" />
          </template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="告警历史" name="history">
        <gi-table :columns="historyColumns" :data="alertHistory" border stripe size="small">
          <template #metric="{ row }">
            <el-tag size="small">{{ metricLabel[row.metric] || row.metric }}</el-tag>
          </template>
          <template #level="{ row }">
            <el-tag :type="row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : 'info'" size="small">
              {{ levelLabel[row.level] || row.level }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === 'triggered' ? 'danger' : 'success'" size="small">
              {{ row.status === 'triggered' ? '已触发' : '已恢复' }}
            </el-tag>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>

    <AlertFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      :device-options="deviceOptions"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { createIoTAlertRule, deleteIoTAlertRule, getIoTAlertHistory, getIoTAlertRules, updateIoTAlertRule } from '@/api/wms'
import AlertFormDialog, { type AlertRuleFormModel } from './AlertFormDialog.vue'

interface Rule {
  id: string
  device: string
  metric: string
  operator: string
  threshold: number
  level: string
  status: string
}

const metricLabel: Record<string, string> = {
  temp: '温度',
  rpm: 'RPM',
  vibration: '振动',
  current: '电流'
}

const levelLabel: Record<string, string> = {
  critical: '严重',
  warning: '预警',
  info: '提示'
}

const deviceOptions = [
  { label: '数控车床 CK6150', value: '数控车床 CK6150' },
  { label: '钻床 Z3050', value: '钻床 Z3050' },
  { label: '加工中心 VMC850', value: '加工中心 VMC850' }
]

const tab = ref('rules')
const rules = ref<Rule[]>([])
const alertHistory = ref<any[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')

const formModel = ref<AlertRuleFormModel>({
  id: '',
  device: '数控车床 CK6150',
  metric: 'temp',
  operator: '>',
  threshold: 60,
  level: 'warning',
  status: 'active'
})

const historyColumns: TableColumnItem<any>[] = [
  { prop: 'device', label: '设备', minWidth: 160 },
  { label: '监测项', minWidth: 90, slotName: 'metric', align: 'center' },
  { prop: 'actual_value', label: '实际值', minWidth: 80, align: 'center' },
  { prop: 'threshold', label: '阈值', minWidth: 80, align: 'center' },
  { label: '等级', minWidth: 80, slotName: 'level', align: 'center' },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'triggered_at', label: '触发时间', minWidth: 170 },
  { prop: 'recovered_at', label: '恢复时间', minWidth: 170 }
]

const ruleColumns: TableColumnItem<Rule>[] = [
  { prop: 'device', label: '设备', minWidth: 180 },
  { label: '监测项', minWidth: 90, slotName: 'metric', align: 'center' },
  { prop: 'operator', label: '运算符', minWidth: 80, align: 'center' },
  { prop: 'threshold', label: '阈值', minWidth: 90, align: 'center' },
  { label: '等级', minWidth: 80, slotName: 'level', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

async function loadRules() {
  const res = await getIoTAlertRules()
  rules.value = (res.data || []).map((item: any) => ({ ...item, id: String(item.id) }))
}

async function loadHistory() {
  const res = await getIoTAlertHistory({ pageNum: 1, pageSize: 100 })
  alertHistory.value = res.data.list.map((item: any) => ({
    id: String(item.id),
    device: item.device,
    metric: String(item.metric || 'current'),
    actual_value: item.actual_value ?? item.value,
    threshold: item.threshold,
    level: item.level === 'danger' ? 'critical' : item.level,
    status: item.recover_time ? 'recovered' : 'triggered',
    triggered_at: item.triggered_at ?? item.trigger_time,
    recovered_at: item.recovered_at ?? item.recover_time
  }))
}

function openAdd() {
  dialogMode.value = 'add'
  editingId.value = ''
  formModel.value = { id: '', device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' }
  dialogVisible.value = true
}

function openEdit(rule: Rule) {
  dialogMode.value = 'edit'
  editingId.value = rule.id
  formModel.value = { ...rule }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.device) {
    ElMessage.warning('请选择设备')
    return
  }

  if (dialogMode.value === 'add') {
    await createIoTAlertRule({ ...formModel.value })
  } else {
    await updateIoTAlertRule(editingId.value, { ...formModel.value })
  }

  dialogVisible.value = false
  await loadRules()
}

async function toggle(rule: Rule) {
  const nextStatus = rule.status === 'active' ? 'disabled' : 'active'
  await updateIoTAlertRule(rule.id, { ...rule, status: nextStatus })
  await loadRules()
  ElMessage.success(nextStatus === 'active' ? '规则已启用' : '规则已停用')
}

function removeRule(id: string) {
  ElMessageBox.confirm('确认删除这条预警规则吗？', '提示', { type: 'warning' })
    .then(async () => {
      await deleteIoTAlertRule(id)
      await loadRules()
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

onMounted(async () => {
  await Promise.all([loadRules(), loadHistory()])
})
</script>
