<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /> <gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="plans" border stripe>
      <template #type="{ row }"
        ><el-tag :type="row.type === 'daily' ? 'info' : row.type === 'weekly' ? 'warning' : 'primary'" size="small">{{
          row.type === 'daily' ? '日常' : row.type === 'weekly' ? '周保养' : '大修'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'done' ? 'success' : 'danger'" size="small">{{
          row.status === 'pending' ? '待执行' : row.status === 'done' ? '已完成' : '已逾期'
        }}</el-tag></template
      >
      <template #actions="{ row }"
        ><el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="execute(row)">执行</el-button
        ><gi-button type="edit" @click="openEdit(row)"
      /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增保养计划' : '编辑保养计划'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
    <el-dialog v-model="execVis" title="执行保养" width="500px">
      <el-table :data="items" border size="small"
        ><el-table-column prop="name" label="保养项目" /><el-table-column label="结果" width="200"
          ><template #default="{ row }"
            ><el-radio-group v-model="row.result" size="small"
              ><el-radio value="done">已完成</el-radio><el-radio value="issue">有问题</el-radio></el-radio-group
            ></template
          ></el-table-column
        ></el-table
      >
      <el-form label-width="80px" style="margin-top: 12px"
        ><el-form-item label="备注"><el-input v-model="execForm.remark" type="textarea" :rows="2" /></el-form-item
      ></el-form>
      <template #footer><el-button @click="execVis = false">取消</el-button><el-button type="primary" @click="confirmExec">提交</el-button></template>
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Plan {
  id: string
  code: string
  equipment: string
  type: string
  plan_date: string
  executor: string
  status: string
}
const plans = ref<Plan[]>([
  { id: '1', code: 'BY20250115001', equipment: '数控车床 CK6150', type: 'daily', plan_date: '2025-01-15', executor: '李四', status: 'pending' },
  { id: '2', code: 'BY20250120001', equipment: '钻床 Z3050', type: 'weekly', plan_date: '2025-01-20', executor: '王五', status: 'pending' },
  { id: '3', code: 'BY20250110001', equipment: '磨床 M1432', type: 'daily', plan_date: '2025-01-10', executor: '赵六', status: 'done' },
  { id: '4', code: 'BY20250101001', equipment: '加工中心 VMC850', type: 'overhaul', plan_date: '2025-01-01', executor: '孙八', status: 'done' }
])
const cols: TableColumnItem<Plan>[] = [
  { prop: 'code', label: '计划编号', width: 160 },
  { prop: 'equipment', label: '设备', minWidth: 160 },
  { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'plan_date', label: '计划日期', width: 110 },
  { prop: 'executor', label: '执行人', width: 100 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ code: '', equipment: '', type: 'daily', plan_date: '', executor: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '计划编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '设备',
    field: 'equipment',
    required: true,
    props: {
      options: [
        { label: '数控车床 CK6150', value: '数控车床 CK6150' },
        { label: '钻床 Z3050', value: '钻床 Z3050' },
        { label: '磨床 M1432', value: '磨床 M1432' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '保养类型',
    field: 'type',
    props: {
      options: [
        { label: '日常保养', value: 'daily' },
        { label: '周保养', value: 'weekly' },
        { label: '大修', value: 'overhaul' }
      ]
    } as any
  },
  { type: 'date-picker', label: '计划日期', field: 'plan_date' },
  { type: 'input', label: '执行人', field: 'executor' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', equipment: '', type: 'daily', plan_date: '', executor: '' })
  vis.value = true
}
function openEdit(r: Plan) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.code) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    plans.value.unshift({ id: Date.now().toString(), ...form, status: 'pending' } as Plan)
  } else {
    const i = plans.value.findIndex((p) => p.id === eid.value)
    if (i > -1) Object.assign(plans.value[i], form)
  }
  return true
}
function handleExport() {
  ElMessage.success('导出成功')
}
function del(id: string) {
  ElMessageBox.confirm(\'确定删除？\', \'警告\', { type: \'warning\' }).then(() => {
  data.value = data.value.filter((e: any) => e.id !== id)
}
function refresh() {}
const execVis = ref(false)
const execForm = reactive({ remark: '' })
const items = ref([
  { name: '清洁设备表面', result: 'done' },
  { name: '检查润滑油', result: 'done' },
  { name: '紧固螺栓', result: 'done' },
  { name: '更换滤芯', result: 'done' },
  { name: '电气检查', result: 'done' }
])
function execute(r: Plan) {
  execVis.value = true
}
function confirmExec() {
  const p = plans.value.find((p) => p.status === 'pending')
  if (p) p.status = 'done'
  execVis.value = false
  ElMessage.success('保养完成')
}
</script>
