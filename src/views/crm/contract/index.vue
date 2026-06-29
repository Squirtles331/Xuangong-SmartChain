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
        ><el-tag
          :type="row.status === 'active' ? 'success' : row.status === 'draft' ? 'warning' : row.status === 'expired' ? 'info' : 'danger'"
          size="small"
          >{{ row.status === 'active' ? '生效中' : row.status === 'draft' ? '草稿' : row.status === 'expired' ? '已过期' : '已终止' }}</el-tag
        ></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增合同' : '编辑合同'" width="650px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface CT {
  id: string
  code: string
  customer: string
  amount: number
  sign_date: string
  start_date: string
  end_date: string
  status: string
}
const data = ref<CT[]>([
  {
    id: '1',
    code: 'CT20250101001',
    customer: 'XX重工集团',
    amount: 2500000,
    sign_date: '2025-01-01',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    status: 'active'
  },
  {
    id: '2',
    code: 'CT20250102002',
    customer: 'YY机械设备',
    amount: 800000,
    sign_date: '2025-01-05',
    start_date: '2025-02-01',
    end_date: '2026-01-31',
    status: 'active'
  },
  {
    id: '3',
    code: 'CT20241201003',
    customer: 'ZZ泵业科技',
    amount: 500000,
    sign_date: '2024-12-01',
    start_date: '2024-12-01',
    end_date: '2025-06-30',
    status: 'active'
  }
])
const s = reactive({ keyword: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '生效中', value: 'active' },
        { label: '草稿', value: 'draft' },
        { label: '已过期', value: 'expired' }
      ]
    }
  } as any
]
const cols: TableColumnItem<CT>[] = [
  { prop: 'code', label: '合同编号', minWidth: 170 },
  { prop: 'customer', label: '客户', minWidth: 160 },
  { prop: 'amount', label: '合同金额', minWidth: 120, align: 'right' },
  { prop: 'sign_date', label: '签订日期', minWidth: 110 },
  { prop: 'start_date', label: '生效日期', minWidth: 110 },
  { prop: 'end_date', label: '到期日期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => (!s.keyword || r.customer.includes(s.keyword)) && (!s.status || r.status === s.status)))
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
const form = reactive({ code: '', customer: '', amount: 0, sign_date: '', start_date: '', end_date: '', status: 'draft' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '合同编号', field: 'code', required: true },
  { type: 'input', label: '客户', field: 'customer', required: true },
  { type: 'input-number', label: '合同金额', field: 'amount', props: { min: 0 } as any },
  { type: 'date-picker', label: '签订日期', field: 'sign_date' },
  { type: 'date-picker', label: '生效日期', field: 'start_date' },
  { type: 'date-picker', label: '到期日期', field: 'end_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '生效中', value: 'active' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', customer: '', amount: 0, sign_date: '', start_date: '', end_date: '', status: 'draft' })
  vis.value = true
}
function openEdit(r: CT) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.customer) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      code: 'CT' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      ...form
    } as CT)
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
