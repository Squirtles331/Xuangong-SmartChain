<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="loadHistory" />
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="Alert Rules" name="rules">
        <gi-table :columns="ruleColumns" :data="rules" border stripe>
          <template #metric="{ row }">
            <el-tag size="small">{{ metricLabel[row.metric] || row.metric }}</el-tag>
          </template>
          <template #level="{ row }">
            <el-tag :type="row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : 'info'" size="small">
              {{ row.level }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggle(row)">
              {{ row.status === 'active' ? 'Disable' : 'Enable' }}
            </el-button>
            <gi-button type="delete" @click="removeRule(row.id)" />
          </template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="History" name="history">
        <gi-table :columns="historyColumns" :data="alertHistory" border stripe size="small">
          <template #metric="{ row }">
            <el-tag size="small">{{ metricLabel[row.metric] || row.metric }}</el-tag>
          </template>
          <template #level="{ row }">
            <el-tag :type="row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : 'info'" size="small">
              {{ row.level }}
            </el-tag>
          </template>
          <template #status="{ row }">
            <el-tag :type="row.status === 'triggered' ? 'danger' : 'success'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>

    <gi-dialog v-model="dialogVisible" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? 'Add Rule' : 'Edit Rule'" width="600px">
      <gi-form v-model="form" :columns="formColumns" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getIoTAlertHistory, getIoTAlertRules } from '@/api/wms'

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
  temp: 'Temperature',
  rpm: 'RPM',
  vibration: 'Vibration',
  current: 'Current'
}

const tab = ref('rules')
const rules = ref<Rule[]>([])
const alertHistory = ref<any[]>([])
const dialogVisible = ref(false)
const mode = ref<'add' | 'edit'>('add')
const editingId = ref('')

const form = reactive({
  device: 'CNC Lathe CK6150',
  metric: 'temp',
  operator: '>',
  threshold: 60,
  level: 'warning',
  status: 'active'
})

const historyColumns: TableColumnItem<any>[] = [
  { prop: 'device', label: 'Device', minWidth: 160 },
  { label: 'Metric', minWidth: 90, slotName: 'metric', align: 'center' },
  { prop: 'actual_value', label: 'Actual', minWidth: 80, align: 'center' },
  { prop: 'threshold', label: 'Threshold', minWidth: 80, align: 'center' },
  { label: 'Level', minWidth: 80, slotName: 'level', align: 'center' },
  { label: 'Status', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'triggered_at', label: 'Triggered At', minWidth: 170 },
  { prop: 'recovered_at', label: 'Recovered At', minWidth: 170 }
]

const ruleColumns: TableColumnItem<Rule>[] = [
  { prop: 'device', label: 'Device', minWidth: 180 },
  { label: 'Metric', minWidth: 90, slotName: 'metric', align: 'center' },
  { prop: 'operator', label: 'Operator', minWidth: 80, align: 'center' },
  { prop: 'threshold', label: 'Threshold', minWidth: 90, align: 'center' },
  { label: 'Level', minWidth: 80, slotName: 'level', align: 'center' },
  { label: 'Status', minWidth: 80, slotName: 'status', align: 'center' },
  { label: 'Actions', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const formColumns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: 'Device',
    field: 'device',
    required: true,
    props: {
      options: [
        { label: 'CNC Lathe CK6150', value: 'CNC Lathe CK6150' },
        { label: 'Drill Z3050', value: 'Drill Z3050' },
        { label: 'VMC850', value: 'VMC850' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: 'Metric',
    field: 'metric',
    required: true,
    props: {
      options: [
        { label: 'Temperature', value: 'temp' },
        { label: 'RPM', value: 'rpm' },
        { label: 'Vibration', value: 'vibration' },
        { label: 'Current', value: 'current' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: 'Operator',
    field: 'operator',
    required: true,
    props: {
      options: [
        { label: '>', value: '>' },
        { label: '<', value: '<' },
        { label: '>=', value: '>=' },
        { label: '<=', value: '<=' }
      ]
    } as any
  },
  { type: 'input-number', label: 'Threshold', field: 'threshold', required: true },
  {
    type: 'select-v2',
    label: 'Level',
    field: 'level',
    required: true,
    props: {
      options: [
        { label: 'critical', value: 'critical' },
        { label: 'warning', value: 'warning' },
        { label: 'info', value: 'info' }
      ]
    } as any
  }
]

async function loadRules() {
  const res = await getIoTAlertRules()
  rules.value = (res.data || []).map((item: any) => ({ ...item, id: String(item.id) }))
}

async function loadHistory() {
  const res = await getIoTAlertHistory({ page: 1, page_size: 100 })
  alertHistory.value = (res.data.items || []).map((item: any) => ({
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
  mode.value = 'add'
  editingId.value = ''
  Object.assign(form, { device: 'CNC Lathe CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' })
  dialogVisible.value = true
}

function openEdit(rule: Rule) {
  mode.value = 'edit'
  editingId.value = rule.id
  Object.assign(form, rule)
  dialogVisible.value = true
}

async function submit() {
  if (!form.device) {
    ElMessage.warning('Device is required')
    return false
  }

  if (mode.value === 'add') {
    rules.value.unshift({ id: Date.now().toString(), ...form })
  } else {
    const index = rules.value.findIndex((item) => item.id === editingId.value)
    if (index > -1) Object.assign(rules.value[index], form)
  }

  return true
}

function toggle(rule: Rule) {
  rule.status = rule.status === 'active' ? 'disabled' : 'active'
  ElMessage.success('Rule updated')
}

function removeRule(id: string) {
  ElMessageBox.confirm('Delete this rule?', 'Warning', { type: 'warning' })
    .then(() => {
      rules.value = rules.value.filter((item) => item.id !== id)
      ElMessage.success('Deleted')
    })
    .catch(() => {})
}

onMounted(async () => {
  await Promise.all([loadRules(), loadHistory()])
})
</script>
