<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">{{
          row.status === 'pending' ? '待发货' : '已发货'
        }}</el-tag></template
      >
      <template #actions="{ row }"
        ><el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmDeliver(row)">确认发货</el-button></template
      >
    </gi-table>
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
const dels = ref<Del[]>([
  {
    id: '1',
    code: 'DN20250115001',
    order_code: 'SO202501100002',
    customer: 'YY机械设备',
    material: '齿轮箱 GBX-200',
    qty: 20,
    status: 'pending',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'DN20250105002',
    order_code: 'SO202501050003',
    customer: 'ZZ泵业科技',
    material: '传动轴 DS-50',
    qty: 100,
    status: 'completed',
    created_at: '2025-01-05'
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
  { prop: 'qty', label: '数量', width: 80, align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { label: '操作', width: 100, slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => dels.value.filter((r) => (!s.code || r.code.includes(s.code)) && (!s.status || r.status === s.status)))
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
function confirmDeliver(r: Del) {
  r.status = 'completed'
  ElMessage.success('发货成功')
}
</script>
