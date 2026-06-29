<template>
  <gi-page-layout :bordered="true">
    <template #header><SearchSetting :columns="allSearchColumns" storage-key="index-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool
      ><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /><el-button
        style="margin-left: 8px"
        @click="handleExport"
        >导出</el-button
      ></template
    >
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'open' ? 'warning' : row.status === 'paid' ? 'success' : 'info'" size="small">{{
          row.status === 'open' ? '未付' : row.status === 'paid' ? '已付' : '部分付'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增应付' : '编辑应付'" width="600px">
      <SearchSetting :columns="allSearchColumns" storage-key="index-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface AP {
  id: string
  code: string
  supplier: string
  amount: number
  paid: number
  balance: number
  due_date: string
  status: string
}
const data = ref<AP[]>([
  {
    id: '1',
    code: 'AP20250115001',
    supplier: 'XX钢材有限公司',
    amount: 85000,
    paid: 50000,
    balance: 35000,
    due_date: '2025-02-15',
    status: 'partial'
  },
  { id: '2', code: 'AP20250110002', supplier: 'YY轴承制造厂', amount: 120000, paid: 0, balance: 120000, due_date: '2025-03-10', status: 'open' }
])
const s = reactive({ code: '', supplier: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '应付单号', field: 'code' } as any,
  { type: 'input', label: '供应商', field: 'supplier' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '未付', value: 'open' },
        { label: '已付', value: 'paid' },
        { label: '部分付', value: 'partial' }
      ]
    }
  } as any
]
const cols: TableColumnItem<AP>[] = [
  { prop: 'code', label: '应付单号', width: 160 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'amount', label: '金额', minWidth: 100, align: 'right' },
  { prop: 'paid', label: '已付', minWidth: 100, align: 'right' },
  { prop: 'balance', label: '余额', minWidth: 100, align: 'right' },
  { prop: 'due_date', label: '到期日', width: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  data.value.filter(
    (r) => (!s.code || r.code.includes(s.code)) && (!s.supplier || r.supplier.includes(s.supplier)) && (!s.status || r.status === s.status)
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
  s.code = ''
  s.supplier = ''
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
const form = reactive({ code: '', supplier: '', amount: 0, paid: 0, balance: 0, due_date: '', status: 'open' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '应付单号', field: 'code', required: true },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input-number', label: '金额', field: 'amount', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '已付', field: 'paid', props: { min: 0 } as any },
  { type: 'date-picker', label: '到期日', field: 'due_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '未付', value: 'open' },
        { label: '已付', value: 'paid' },
        { label: '部分付', value: 'partial' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', supplier: '', amount: 0, paid: 0, balance: 0, due_date: '', status: 'open' })
  vis.value = true
}
function openEdit(r: AP) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.supplier) {
    ElMessage.warning('请填写必填项')
    return false
  }
  form.balance = form.amount - form.paid
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      code: 'AP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      ...form
    } as AP)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) {
      Object.assign(data.value[i], form)
      data.value[i].balance = data.value[i].amount - data.value[i].paid
    }
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm(\'确定删除？\', \'警告\', { type: \'warning\' }).then(() => {
  data.value = data.value.filter((e) => e.id !== id)
}
</script>
