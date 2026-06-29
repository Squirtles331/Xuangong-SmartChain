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
      <template #level="{ row }"
        ><el-tag :type="row.level === 'major' ? 'danger' : row.level === 'moderate' ? 'warning' : 'info'" size="small">{{
          row.level === 'major' ? '重大' : row.level === 'moderate' ? '一般' : '低风险'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'open' ? 'danger' : row.status === 'processing' ? 'warning' : 'success'" size="small">{{
          row.status === 'open' ? '待整改' : row.status === 'processing' ? '整改中' : '已关闭'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增隐患' : '编辑隐患'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Hz {
  id: string
  code: string
  location: string
  desc: string
  level: string
  status: string
  finder: string
  found_at: string
}
const data = ref<Hz[]>([
  {
    id: '1',
    code: 'YH20250115001',
    location: '机加工一车间',
    desc: '冷却液泄漏',
    level: 'moderate',
    status: 'open',
    finder: '李四',
    found_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'YH20250110002',
    location: '装配车间',
    desc: '安全护栏损坏',
    level: 'major',
    status: 'processing',
    finder: '王五',
    found_at: '2025-01-10'
  },
  {
    id: '3',
    code: 'YH20250105003',
    location: '热处理车间',
    desc: '通风不畅',
    level: 'minor',
    status: 'closed',
    finder: '赵六',
    found_at: '2025-01-05'
  }
])
const s = reactive({ keyword: '', level: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '风险等级',
    field: 'level',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '重大', value: 'major' },
        { label: '一般', value: 'moderate' },
        { label: '低风险', value: 'minor' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待整改', value: 'open' },
        { label: '整改中', value: 'processing' },
        { label: '已关闭', value: 'closed' }
      ]
    }
  } as any
]
const cols: TableColumnItem<Hz>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { prop: 'location', label: '位置', width: 140 },
  { prop: 'desc', label: '描述', minWidth: 180 },
  { label: '风险等级', minWidth: 80, slotName: 'level', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'finder', label: '发现人', width: 80 },
  { prop: 'found_at', label: '发现时间', width: 110 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  data.value.filter((e) => (!s.keyword || e.desc.includes(s.keyword)) && (!s.level || e.level === s.level) && (!s.status || e.status === s.status))
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
  s.level = ''
  s.status = ''
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
const form = reactive({ code: '', location: '', desc: '', level: 'moderate', status: 'open', finder: '', found_at: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '编号', field: 'code', required: true },
  { type: 'input', label: '位置', field: 'location', required: true },
  { type: 'input', label: '描述', field: 'desc', required: true },
  {
    type: 'select-v2',
    label: '风险等级',
    field: 'level',
    required: true,
    props: {
      options: [
        { label: '重大', value: 'major' },
        { label: '一般', value: 'moderate' },
        { label: '低风险', value: 'minor' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待整改', value: 'open' },
        { label: '整改中', value: 'processing' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  },
  { type: 'input', label: '发现人', field: 'finder' },
  { type: 'date-picker', label: '发现时间', field: 'found_at' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', location: '', desc: '', level: 'moderate', status: 'open', finder: '', found_at: '' })
  vis.value = true
}
function openEdit(r: Hz) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.location || !form.desc) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      code: 'YH' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      ...form
    } as Hz)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm(\'确定删除？\', \'警告\', { type: \'warning\' }).then(() => {
  data.value = data.value.filter((e) => e.id !== id)
}
</script>
