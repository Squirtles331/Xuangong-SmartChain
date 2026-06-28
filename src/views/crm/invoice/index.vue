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
          :type="row.status === 'issued' ? 'success' : row.status === 'draft' ? 'warning' : row.status === 'voided' ? 'danger' : 'info'"
          size="small"
          >{{ row.status === 'issued' ? '已开具' : row.status === 'draft' ? '草稿' : row.status === 'voided' ? '已作废' : '已红冲' }}</el-tag
        ></template
      >
      <template #actions="{ row }"
        ><gi-button type="edit" @click="openEdit(row)" /><el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="issue(row)"
          >开具</el-button
        ></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增发票' : '编辑发票'" width="650px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Inv {
  id: string
  code: string
  customer: string
  order_code: string
  amount: number
  tax_rate: number
  tax_amount: number
  total: number
  issue_date: string
  status: string
}
const data = ref<Inv[]>([
  {
    id: '1',
    code: 'INV20250115001',
    customer: 'XX重工集团',
    order_code: 'SO202501150001',
    amount: 230000,
    tax_rate: 13,
    tax_amount: 29900,
    total: 259900,
    issue_date: '2025-01-15',
    status: 'issued'
  },
  {
    id: '2',
    code: 'INV20250110002',
    customer: 'YY机械设备',
    order_code: 'SO202501100002',
    amount: 180000,
    tax_rate: 13,
    tax_amount: 23400,
    total: 203400,
    issue_date: '2025-01-10',
    status: 'issued'
  },
  {
    id: '3',
    code: 'INV20250116003',
    customer: 'AA精密制造',
    order_code: '',
    amount: 80000,
    tax_rate: 13,
    tax_amount: 10400,
    total: 90400,
    issue_date: '',
    status: 'draft'
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
        { label: '已开具', value: 'issued' },
        { label: '草稿', value: 'draft' },
        { label: '已作废', value: 'voided' },
        { label: '已红冲', value: 'red' }
      ]
    }
  } as any
]
const cols: TableColumnItem<Inv>[] = [
  { prop: 'code', label: '发票号码', minWidth: 170 },
  { prop: 'customer', label: '客户', minWidth: 150 },
  { prop: 'order_code', label: '销售订单', minWidth: 170 },
  { prop: 'amount', label: '不含税金额', minWidth: 120, align: 'right' },
  { prop: 'tax_rate', label: '税率(%)', minWidth: 80, align: 'center' },
  { prop: 'tax_amount', label: '税额', minWidth: 100, align: 'right' },
  { prop: 'total', label: '价税合计', minWidth: 120, align: 'right' },
  { prop: 'issue_date', label: '开票日期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
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
const form = reactive({ code: '', customer: '', order_code: '', amount: 0, tax_rate: 13, tax_amount: 0, total: 0, issue_date: '', status: 'draft' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '发票号码', field: 'code', required: true },
  { type: 'input', label: '客户', field: 'customer', required: true },
  { type: 'input', label: '销售订单', field: 'order_code' },
  { type: 'input-number', label: '不含税金额', field: 'amount', required: true, props: { min: 0, precision: 2 } as any },
  { type: 'input-number', label: '税率(%)', field: 'tax_rate', required: true, props: { min: 0, max: 100 } as any },
  { type: 'input-number', label: '税额', field: 'tax_amount', props: { disabled: true } as any },
  { type: 'input-number', label: '价税合计', field: 'total', props: { disabled: true } as any },
  { type: 'date-picker', label: '开票日期', field: 'issue_date' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', customer: '', order_code: '', amount: 0, tax_rate: 13, tax_amount: 0, total: 0, issue_date: '', status: 'draft' })
  vis.value = true
}
function openEdit(r: Inv) {
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
  form.tax_amount = Math.round(((form.amount * form.tax_rate) / 100) * 100) / 100
  form.total = form.amount + form.tax_amount
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      code: 'INV' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      ...form
    } as Inv)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function issue(r: Inv) {
  r.status = 'issued'
  r.issue_date = new Date().toISOString().slice(0, 10)
  ElMessage.success('发票已开具')
}
</script>
