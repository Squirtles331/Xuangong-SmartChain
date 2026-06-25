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
        ><el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">{{
          row.status === 'pending' ? '待发货' : '已发货'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增发货单' : '编辑发货单'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Del {
  id: string
  code: string
  order_code: string
  customer: string
  material: string
  qty: number
  status: string
  created_at: string
}
const data = ref<Del[]>([
  {
    id: '1',
    code: 'DN20250115001',
    order_code: 'SO202501100002',
    customer: 'YY机械设备',
    material: '齿轮箱 GBX-200',
    qty: 20,
    status: 'pending',
    created_at: '2025-01-15'
  }
])
const s = reactive({ code: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '发货单号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待发货', value: 'pending' },
        { label: '已发货', value: 'completed' }
      ]
    }
  } as any
]
const cols: TableColumnItem<Del>[] = [
  { prop: 'code', label: '发货单号', width: 160 },
  { prop: 'order_code', label: '销售订单', width: 160 },
  { prop: 'customer', label: '客户', minWidth: 140 },
  { prop: 'material', label: '产品', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => (!s.code || r.code.includes(s.code)) && (!s.status || r.status === s.status)))
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
const form = reactive({ code: '', order_code: '', customer: '', material: '', qty: 1, status: 'pending' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '发货单号', field: 'code', required: true },
  { type: 'input', label: '销售订单', field: 'order_code', required: true },
  { type: 'input', label: '客户', field: 'customer' },
  { type: 'input', label: '产品', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', order_code: '', customer: '', material: '', qty: 1, status: 'pending' })
  vis.value = true
}
function openEdit(r: Del) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      code: 'DN' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      created_at: new Date().toISOString().slice(0, 10),
      ...form
    } as Del)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  data.value = data.value.filter((e) => e.id !== id)
}
</script>
