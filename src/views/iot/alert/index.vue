<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="rules" border stripe>
      <template #metric="{ row }"
        ><el-tag size="small">{{
          row.metric === 'temp' ? '温度' : row.metric === 'rpm' ? '转速' : row.metric === 'vibration' ? '振动' : '电流'
        }}</el-tag></template
      >
      <template #level="{ row }"
        ><el-tag :type="row.level === 'critical' ? 'danger' : row.level === 'warning' ? 'warning' : 'info'" size="small">{{
          row.level === 'critical' ? '严重' : row.level === 'warning' ? '警告' : '提示'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag></template
      >
      <template #actions="{ row }"
        ><gi-button type="edit" @click="openEdit(row)" /><el-button
          :type="row.status === 'active' ? 'warning' : 'success'"
          link
          size="small"
          @click="toggle(row)"
          >{{ row.status === 'active' ? '停用' : '启用' }}</el-button
        ><gi-button type="delete" @click="del(row.id)"
      /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增告警规则' : '编辑告警规则'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Rule {
  id: string
  device: string
  metric: string
  operator: string
  threshold: number
  level: string
  status: string
}
const rules = ref<Rule[]>([
  { id: '1', device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' },
  { id: '2', device: '数控车床 CK6150', metric: 'vibration', operator: '>', threshold: 4.0, level: 'critical', status: 'active' },
  { id: '3', device: '加工中心 VMC850', metric: 'temp', operator: '>', threshold: 65, level: 'warning', status: 'active' },
  { id: '4', device: '钻床 Z3050', metric: 'current', operator: '>', threshold: 20, level: 'warning', status: 'disabled' }
])
const cols: TableColumnItem<Rule>[] = [
  { prop: 'device', label: '设备', minWidth: 180 },
  { label: '指标', minWidth: 70, slotName: 'metric', align: 'center' },
  { prop: 'operator', label: '条件', minWidth: 50, align: 'center' },
  { prop: 'threshold', label: '阈值', minWidth: 80, align: 'center' },
  { label: '级别', minWidth: 70, slotName: 'level', align: 'center' },
  { label: '状态', minWidth: 60, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' })
const formCols: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '设备',
    field: 'device',
    required: true,
    props: {
      options: [
        { label: '数控车床 CK6150', value: '数控车床 CK6150' },
        { label: '钻床 Z3050', value: '钻床 Z3050' },
        { label: '加工中心 VMC850', value: '加工中心 VMC850' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '指标',
    field: 'metric',
    required: true,
    props: {
      options: [
        { label: '温度', value: 'temp' },
        { label: '转速', value: 'rpm' },
        { label: '振动', value: 'vibration' },
        { label: '电流', value: 'current' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '条件',
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
  { type: 'input-number', label: '阈值', field: 'threshold', required: true },
  {
    type: 'select-v2',
    label: '级别',
    field: 'level',
    required: true,
    props: {
      options: [
        { label: '严重', value: 'critical' },
        { label: '警告', value: 'warning' },
        { label: '提示', value: 'info' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { device: '数控车床 CK6150', metric: 'temp', operator: '>', threshold: 60, level: 'warning', status: 'active' })
  vis.value = true
}
function openEdit(r: Rule) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.device) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    rules.value.unshift({ id: Date.now().toString(), ...form } as Rule)
  } else {
    const i = rules.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(rules.value[i], form)
  }
  return true
}
function toggle(r: Rule) {
  r.status = r.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(r.status === 'active' ? '已启用' : '已停用')
}
function del(id: string) {
  ElMessageBox.confirm(\'确定删除？\', \'警告\', { type: \'warning\' }).then(() => {
  rules.value = rules.value.filter((e) => e.id !== id)
}
function refresh() {}
</script>
