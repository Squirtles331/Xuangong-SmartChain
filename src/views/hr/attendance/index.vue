<template>
  <gi-page-layout>
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="attendance-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool
      ><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /><el-button
        style="margin-left: 8px"
        @click="handleExport"
        >导出</el-button
      ></template
    >
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #result="{ row }">
        <StatusTag :value="row.result" :options="ATTENDANCE_RESULT" />
      </template>
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增考勤' : '编辑考勤'" width="500px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

const ATTENDANCE_RESULT = [
  { value: 'normal', label: '正常', type: 'success' as const },
  { value: 'late', label: '迟到', type: 'warning' as const },
  { value: 'absent', label: '旷工', type: 'danger' as const }
]
interface Att {
  id: string
  employee: string
  date: string
  clock_in: string
  clock_out: string
  result: string
}
const data = ref<Att[]>([
  { id: '1', employee: '李四', date: '2025-01-15', clock_in: '07:50', clock_out: '17:05', result: 'normal' },
  { id: '2', employee: '王五', date: '2025-01-15', clock_in: '08:15', clock_out: '17:00', result: 'late' },
  { id: '3', employee: '赵六', date: '2025-01-15', clock_in: '07:55', clock_out: '17:10', result: 'normal' }
])
const s = reactive({ employee: '', date: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '员工', field: 'employee' } as any,
  { type: 'date-picker', label: '日期', field: 'date' } as any
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
const cols: TableColumnItem<Att>[] = [
  { prop: 'employee', label: '员工', width: 80 },
  { prop: 'date', label: '日期', width: 110 },
  { prop: 'clock_in', label: '上班打卡', width: 100 },
  { prop: 'clock_out', label: '下班打卡', width: 100 },
  { label: '结果', minWidth: 60, slotName: 'result', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((e) => (!s.employee || e.employee.includes(s.employee)) && (!s.date || e.date === s.date)))
const pd = computed(() => fd.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize))
watch(
  fd,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
function hs() {
  p.currentPage = 1
}
function hr() {
  s.employee = ''
  s.date = ''
  p.currentPage = 1
}
function refresh() {
  hr()
}
function handleExport() {
  ElMessage.success('导出成功')
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ employee: '', date: '', clock_in: '08:00', clock_out: '17:00', result: 'normal' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '员工', field: 'employee', required: true },
  { type: 'date-picker', label: '日期', field: 'date', required: true },
  { type: 'input', label: '上班打卡', field: 'clock_in' },
  { type: 'input', label: '下班打卡', field: 'clock_out' },
  {
    type: 'select-v2',
    label: '结果',
    field: 'result',
    props: {
      options: [
        { label: '正常', value: 'normal' },
        { label: '迟到', value: 'late' },
        { label: '旷工', value: 'absent' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { employee: '', date: '', clock_in: '08:00', clock_out: '17:00', result: 'normal' })
  vis.value = true
}
function openEdit(r: Att) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.employee) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), ...form } as Att)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      data.value = data.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
