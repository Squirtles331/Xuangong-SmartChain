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
      <template #type="{ row }"
        ><el-tag :type="row.type === 'purchase' ? 'primary' : row.type === 'production' ? 'success' : 'info'" size="small">{{
          row.type === 'purchase' ? '采购入库' : row.type === 'production' ? '生产入库' : '其他'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">{{
          row.status === 'pending' ? '待入库' : '已入库'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增入库单' : '编辑入库单'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface In {
  id: string
  code: string
  type: string
  material: string
  qty: number
  warehouse: string
  status: string
  created_at: string
}
const data = ref<In[]>([
  {
    id: '1',
    code: 'RK20250115001',
    type: 'purchase',
    material: '45#圆钢 φ50',
    qty: 500,
    warehouse: '原材料仓',
    status: 'pending',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'RK20250115002',
    type: 'production',
    material: '离心泵 XJP-100',
    qty: 45,
    warehouse: '成品仓',
    status: 'completed',
    created_at: '2025-01-15'
  }
])
const s = reactive({ code: '', type: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '入库单号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '采购入库', value: 'purchase' },
        { label: '生产入库', value: 'production' }
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
        { label: '待入库', value: 'pending' },
        { label: '已入库', value: 'completed' }
      ]
    }
  } as any
]
const cols: TableColumnItem<In>[] = [
  { prop: 'code', label: '入库单号', width: 160 },
  { label: '类型', width: 100, slotName: 'type', align: 'center' },
  { prop: 'material', label: '物料', minWidth: 160 },
  { prop: 'qty', label: '数量', width: 80, align: 'center' },
  { prop: 'warehouse', label: '仓库', width: 100 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { label: '操作', width: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  data.value.filter((r) => (!s.code || r.code.includes(s.code)) && (!s.type || r.type === s.type) && (!s.status || r.status === s.status))
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
  s.type = ''
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
const form = reactive({ code: '', type: 'purchase', material: '', qty: 1, warehouse: '原材料仓', status: 'pending' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '入库单号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '采购入库', value: 'purchase' },
        { label: '生产入库', value: 'production' }
      ]
    } as any
  },
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '仓库',
    field: 'warehouse',
    props: {
      options: [
        { label: '原材料仓', value: '原材料仓' },
        { label: '成品仓', value: '成品仓' },
        { label: '备件仓', value: '备件仓' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', type: 'purchase', material: '', qty: 1, warehouse: '原材料仓', status: 'pending' })
  vis.value = true
}
function openEdit(r: In) {
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
      code: 'RK' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      created_at: new Date().toISOString().slice(0, 10),
      ...form
    } as In)
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
