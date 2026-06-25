<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'done' ? 'success' : 'info'" size="small">{{
          row.status === 'pending' ? '待退货' : row.status === 'done' ? '已退货' : '已取消'
        }}</el-tag></template
      >
      <template #actions="{ row }"
        ><el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmReturn(row)">确认退货</el-button></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增' : '编辑'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface PR {
  id: string
  code: string
  po_code: string
  supplier: string
  material: string
  qty: number
  reason: string
  status: string
}
const returns = ref<PR[]>([
  {
    id: '1',
    code: 'PRT20250115001',
    po_code: 'PO202501100002',
    supplier: 'YY轴承制造厂',
    material: '轴承 6308',
    qty: 20,
    reason: '尺寸超差',
    status: 'pending'
  },
  {
    id: '2',
    code: 'PRT20250110002',
    po_code: 'PO202501050001',
    supplier: 'XX钢材有限公司',
    material: '45#圆钢 φ50',
    qty: 100,
    reason: '材质不合格',
    status: 'done'
  }
])
const s = reactive({ code: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '退货单号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待退货', value: 'pending' },
        { label: '已退货', value: 'done' }
      ]
    }
  } as any
]
const cols: TableColumnItem<PR>[] = [
  { prop: 'code', label: '退货单号', width: 170 },
  { prop: 'po_code', label: '采购订单', width: 170 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'reason', label: '原因', width: 120 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => returns.value.filter((r) => (!s.code || r.code.includes(s.code)) && (!s.status || r.status === s.status)))
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
function confirmReturn(r: PR) {
  r.status = 'done'
  ElMessage.success('退货完成')
}
</script>
