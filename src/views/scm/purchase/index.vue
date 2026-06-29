<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="purchase-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool><gi-button type="add" @click="$router.push('/scm/purchase/create')">新建采购订单</gi-button></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe style="height: 100%">
      <template #status="{ row }">
        <el-tag v-if="row.status === 'sent'" type="warning" size="small">已发送</el-tag>
        <el-tag v-else-if="row.status === 'partial'" type="primary" size="small">部分收货</el-tag>
        <el-tag v-else-if="row.status === 'received'" type="success" size="small">已收货</el-tag>
        <el-tag v-else-if="row.status === 'closed'" type="info" size="small">已关闭</el-tag>
        <el-tag v-else size="small">{{ row.status }}</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="receive(row)">收货</el-button>
        <el-button v-if="row.status === 'sent'" type="danger" link size="small" @click="closePO(row)">关闭</el-button>
      </template>
    </gi-table>
    <!-- 收货弹窗 -->
    <el-dialog v-model="rv" title="采购收货" width="500px">
      <el-descriptions :column="1" border
        ><el-descriptions-item label="采购订单">{{ rc?.code }}</el-descriptions-item
        ><el-descriptions-item label="供应商">{{ rc?.supplier }}</el-descriptions-item
        ><el-descriptions-item label="物料">{{ rc?.material }}</el-descriptions-item
        ><el-descriptions-item label="订购数量">{{ rc?.qty }}</el-descriptions-item></el-descriptions
      >
      <el-form label-width="100px" style="margin-top: 16px"
        ><el-form-item label="实收数量"><el-input-number v-model="rf.qty" :min="1" :max="rc?.remain || 1" /></el-form-item
        ><el-form-item label="批号"><el-input v-model="rf.lot" placeholder="批次管理物料必填" /></el-form-item
      ></el-form>
      <template #footer
        ><el-button @click="rv = false">取消</el-button><el-button type="primary" @click="confirmReceive">确认收货</el-button></template
      >
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { purchaseOrders as mockPOs } from '@/mock'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

interface PO {
  id: string
  code: string
  supplier: string
  material: string
  qty: number
  received: number
  remain: number
  delivery: string
  status: string
}
const pos = ref<PO[]>(mockPOs as any)
const s = reactive({ code: '', supplier: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '订单编号', field: 'code' } as any,
  { type: 'input', label: '供应商', field: 'supplier' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '已发送', value: 'sent' },
        { label: '部分收货', value: 'partial' },
        { label: '已收货', value: 'received' }
      ]
    }
  } as any
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
const cols: TableColumnItem<PO>[] = [
  { prop: 'code', label: '订单编号', width: 160 },
  { prop: 'supplier', label: '供应商', minWidth: 150 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'qty', label: '订购数量', minWidth: 100, align: 'center' },
  { prop: 'received', label: '已收货', minWidth: 80, align: 'center' },
  { prop: 'remain', label: '未收货', minWidth: 80, align: 'center' },
  { prop: 'delivery', label: '交期', width: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  pos.value.filter(
    (o) => (!s.code || o.code.includes(s.code)) && (!s.supplier || o.supplier.includes(s.supplier)) && (!s.status || o.status === s.status)
  )
)
const pd = computed(() => {
  return fd.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize)
})

watch(
  fd,
  (val) => {
    p.total = val.length
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
const rv = ref(false)
const rc = ref<PO | null>(null)
const rf = reactive({ qty: 1, lot: '' })
function receive(row: PO) {
  rc.value = row
  rf.qty = row.remain
  rf.lot = ''
  rv.value = true
}
function confirmReceive() {
  if (rc.value) {
    rc.value.received += rf.qty
    rc.value.remain -= rf.qty
    rc.value.status = rc.value.remain === 0 ? 'received' : 'partial'
  }
  rv.value = false
  ElMessage.success('收货成功')
}
function closePO(row: PO) {
  row.status = 'closed'
  ElMessage.success('订单已关闭')
}
</script>
