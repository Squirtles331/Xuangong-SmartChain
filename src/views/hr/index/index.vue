<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool
      ><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /><el-button
        style="margin-left: 8px"
        @click="handleExport"
        >导出</el-button
      ></template
    >
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '在职' : '离职' }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增员工' : '编辑员工'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Emp {
  id: string
  code: string
  name: string
  department: string
  position: string
  phone: string
  hire_date: string
  status: string
}
const data = ref<Emp[]>([
  {
    id: '1',
    code: 'E00000001',
    name: '李四',
    department: '机加工一车间',
    position: '数控操作工',
    phone: '13800000001',
    hire_date: '2022-03-01',
    status: 'active'
  },
  {
    id: '2',
    code: 'E00000002',
    name: '王五',
    department: '机加工一车间',
    position: '钻床操作工',
    phone: '13800000002',
    hire_date: '2023-06-15',
    status: 'active'
  },
  {
    id: '3',
    code: 'E00000003',
    name: '赵六',
    department: '装配车间',
    position: '装配钳工',
    phone: '13800000003',
    hire_date: '2021-09-01',
    status: 'active'
  },
  {
    id: '4',
    code: 'E00000004',
    name: '孙八',
    department: '机加工二车间',
    position: '加工中心操作工',
    phone: '13800000004',
    hire_date: '2024-01-10',
    status: 'active'
  }
])
const s = reactive({ keyword: '', department: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '部门',
    field: 'department',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' },
        { label: '装配车间', value: '装配车间' }
      ]
    }
  } as any
]
const cols: TableColumnItem<Emp>[] = [
  { prop: 'code', label: '工号', width: 120 },
  { prop: 'name', label: '姓名', width: 80 },
  { prop: 'department', label: '部门', width: 140 },
  { prop: 'position', label: '岗位', width: 140 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'hire_date', label: '入职日期', width: 110 },
  { label: '状态', minWidth: 60, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  data.value.filter(
    (e) => (!s.keyword || e.name.includes(s.keyword) || e.code.includes(s.keyword)) && (!s.department || e.department === s.department)
  )
)
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
  s.keyword = ''
  s.department = ''
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
const form = reactive({ code: '', name: '', department: '机加工一车间', position: '', phone: '', hire_date: '', status: 'active' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '工号', field: 'code', required: true },
  { type: 'input', label: '姓名', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '部门',
    field: 'department',
    required: true,
    props: {
      options: [
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' },
        { label: '装配车间', value: '装配车间' }
      ]
    } as any
  },
  { type: 'input', label: '岗位', field: 'position', required: true },
  { type: 'input', label: '电话', field: 'phone' },
  { type: 'date-picker', label: '入职日期', field: 'hire_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  eid.value = ''
  Object.assign(form, { code: '', name: '', department: '机加工一车间', position: '', phone: '', hire_date: '', status: 'active' })
  vis.value = true
}
function openEdit(r: Emp) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.name || !form.position) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), code: 'E' + String(data.value.length + 1).padStart(8, '0'), ...form } as Emp)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  data.value = data.value.filter((e) => e.id !== id)
  ElMessage.success('删除成功')
}
</script>
