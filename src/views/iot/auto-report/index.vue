<template>
  <gi-page-layout :bordered="true">
    <template #header><h3>IoT 自动报工规则</h3></template>
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="rules" border stripe>
      <template #trigger="{ row }"
        ><el-tag size="small">{{
          row.trigger === 'cycle_complete'
            ? '周期完成'
            : row.trigger === 'power_off'
              ? '设备停机'
              : row.trigger === 'count_reached'
                ? '计数到达'
                : '连续运行'
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
        ></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增规则' : '编辑规则'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface AR {
  id: string
  equipment: string
  trigger: string
  threshold: number
  wo_field: string
  default_qty: number
  status: string
}
const rules = ref<AR[]>([
  { id: '1', equipment: '数控车床 CK6150', trigger: 'cycle_complete', threshold: 1, wo_field: 'qualified_qty', default_qty: 1, status: 'active' },
  { id: '2', equipment: '钻床 Z3050', trigger: 'count_reached', threshold: 100, wo_field: 'qualified_qty', default_qty: 100, status: 'active' },
  { id: '3', equipment: '加工中心 VMC850', trigger: 'power_off', threshold: 0, wo_field: 'qualified_qty', default_qty: 1, status: 'disabled' }
])
const cols: TableColumnItem<AR>[] = [
  { prop: 'equipment', label: '设备', minWidth: 180 },
  { label: '触发条件', minWidth: 120, slotName: 'trigger', align: 'center' },
  { prop: 'threshold', label: '阈值', minWidth: 80, align: 'center' },
  { prop: 'wo_field', label: '报工字段', minWidth: 120 },
  { prop: 'default_qty', label: '默认数量', minWidth: 90, align: 'center' },
  { label: '状态', minWidth: 60, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({
  equipment: '数控车床 CK6150',
  trigger: 'cycle_complete',
  threshold: 1,
  wo_field: 'qualified_qty',
  default_qty: 1,
  status: 'active'
})
const formCols: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '设备',
    field: 'equipment',
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
    label: '触发条件',
    field: 'trigger',
    required: true,
    props: {
      options: [
        { label: '周期完成', value: 'cycle_complete' },
        { label: '计数到达', value: 'count_reached' },
        { label: '设备停机', value: 'power_off' },
        { label: '连续运行', value: 'continuous' }
      ]
    } as any
  },
  { type: 'input-number', label: '阈值', field: 'threshold', props: { min: 0 } as any },
  {
    type: 'select-v2',
    label: '报工字段',
    field: 'wo_field',
    props: {
      options: [
        { label: '合格数', value: 'qualified_qty' },
        { label: '不良数', value: 'defective_qty' },
        { label: '总数量', value: 'total_qty' }
      ]
    } as any
  },
  { type: 'input-number', label: '默认数量', field: 'default_qty', props: { min: 1 } as any }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, {
    equipment: '数控车床 CK6150',
    trigger: 'cycle_complete',
    threshold: 1,
    wo_field: 'qualified_qty',
    default_qty: 1,
    status: 'active'
  })
  vis.value = true
}
function openEdit(r: AR) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.equipment) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    rules.value.unshift({ id: Date.now().toString(), ...form } as AR)
  } else {
    const i = rules.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(rules.value[i], form)
  }
  return true
}
function toggle(r: AR) {
  r.status = r.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(r.status === 'active' ? '已启用' : '已停用')
}
</script>
