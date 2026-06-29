<template>
  <gi-page-layout>
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="purchase-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool><gi-button type="add" @click="$router.push('/scm/purchase/create')">新建采购订单</gi-button></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe style="height: 100%">
      <template #progress="{ row }">
        <div class="progress-cell">
          <el-progress
            :percentage="row.qty > 0 ? Math.round((row.received / row.qty) * 100) : 0"
            :stroke-width="6"
            :color="row.qty > 0 && row.received >= row.qty ? '#67c23a' : '#409eff'"
          />
          <span class="progress-text">{{ row.received }}/{{ row.qty }}</span>
        </div>
      </template>
      <template #delivery="{ row }">
        <span :class="{ 'overdue-text': isOverdue(row) }">{{ row.delivery }}</span>
        <el-tag v-if="isOverdue(row)" type="danger" size="small" class="overdue-tag">已逾期</el-tag>
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="PO_STATUS" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPurchaseOrderList, updatePurchaseOrder } from '@/api/scm'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

const PO_STATUS = [
  { value: 'sent', label: '已发送', type: 'warning' as const },
  { value: 'partial', label: '部分收货', type: 'primary' as const },
  { value: 'received', label: '已收货', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

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
const pos = ref<PO[]>([])
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
  { label: '收货进度', minWidth: 160, slotName: 'progress' },
  { label: '交期', width: 130, slotName: 'delivery' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 120, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pd = ref<PO[]>([])

onMounted(() => {
  fetchData()
})

async function fetchData() {
  const params = {
    page: p.currentPage,
    page_size: p.pageSize,
    code: s.code || undefined,
    supplier: s.supplier || undefined,
    status: s.status || undefined
  }
  const res = await getPurchaseOrderList(params)
  pos.value = res.data.items
  p.total = res.data.total
  pd.value = res.data.items
}

function hs() {
  p.currentPage = 1
  fetchData()
}
function hr() {
  s.code = ''
  s.supplier = ''
  s.status = ''
  p.currentPage = 1
  fetchData()
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
async function confirmReceive() {
  if (rc.value) {
    rc.value.received += rf.qty
    rc.value.remain -= rf.qty
    const newStatus = rc.value.remain === 0 ? 'received' : 'partial'
    rc.value.status = newStatus
    await updatePurchaseOrder(rc.value.id, { received: rc.value.received, remain: rc.value.remain, status: newStatus as any })
  }
  rv.value = false
  ElMessage.success('收货成功')
}
async function closePO(row: PO) {
  row.status = 'closed'
  await updatePurchaseOrder(row.id, { status: 'closed' as const })
  ElMessage.success('订单已关闭')
}

function isOverdue(row: PO) {
  if (row.status === 'received' || row.status === 'closed') return false
  return new Date(row.delivery) < new Date()
}
</script>
<style scoped>
.progress-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 130px;
}
.progress-text {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}
.overdue-text {
  color: #f56c6c;
  font-weight: 600;
}
.overdue-tag {
  margin-left: 4px;
}
</style>
