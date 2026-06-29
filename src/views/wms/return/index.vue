<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="items" border stripe>
      <template #type="{ row }"
        ><el-tag :type="row.type === 'return' ? 'danger' : 'warning'" size="small">{{ row.type === 'return' ? '退料' : '退货' }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">{{
          row.status === 'pending' ? '待处理' : '已完成'
        }}</el-tag></template
      >
      <template #actions="{ row }"
        ><el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmReturn(row)">确认</el-button></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" title="新建退料/退货单" width="500px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Ret {
  id: string
  code: string
  type: string
  source: string
  material: string
  qty: number
  reason: string
  status: string
}
const items = ref<Ret[]>([
  {
    id: '1',
    code: 'RT20250115001',
    type: 'return',
    source: 'WO202501150001',
    material: '螺栓 M16×60',
    qty: 50,
    reason: '多余退料',
    status: 'pending'
  },
  {
    id: '2',
    code: 'RT20250115002',
    type: 'refund',
    source: 'PO202501100002',
    material: '轴承 6308',
    qty: 20,
    reason: '来料不良退货',
    status: 'pending'
  }
])
const cols: TableColumnItem<Ret>[] = [
  { prop: 'code', label: '单号', width: 160 },
  { label: '类型', minWidth: 60, slotName: 'type', align: 'center' },
  { prop: 'source', label: '来源单号', width: 170 },
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'reason', label: '原因', width: 120 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 80, slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const form = reactive({ type: 'return', source: '', material: '', qty: 1, reason: '多余退料' })
const formCols: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '生产退料', value: 'return' },
        { label: '采购退货', value: 'refund' }
      ]
    } as any
  },
  { type: 'input', label: '来源单号', field: 'source', required: true },
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input', label: '原因', field: 'reason' }
]
function openAdd() {
  mode.value = 'add'
  eid.value = ''
  Object.assign(form, { type: 'return', source: '', material: '', qty: 1, reason: '多余退料' })
  vis.value = true
}
async function submit() {
  if (!form.source) {
    ElMessage.warning('请填写必填项')
    return false
  }
  items.value.unshift({
    id: Date.now().toString(),
    code: 'RT' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(items.value.length + 1).padStart(4, '0'),
    ...form,
    status: 'pending'
  } as Ret)
  return true
}
function confirmReturn(r: Ret) {
  r.status = 'completed'
  ElMessage.success(r.type === 'return' ? '退料入库成功' : '退货出库成功')
}
</script>
