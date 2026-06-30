<template>
  <gi-page-layout>
    <el-tabs v-model="tab">
      <el-tab-pane label="供应商门户" name="portal">
        <gi-table :columns="portalCols" :data="orders" border stripe size="small">
          <template #status="{ row }">
            <el-tag :type="row.status === 'confirmed' ? 'success' : row.status === 'pending' ? 'warning' : 'info'" size="small">
              {{ row.status === 'confirmed' ? '已确认' : row.status === 'pending' ? '待确认' : '已拒绝' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirm(row.id)">确认</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link size="small" @click="reject(row.id)">拒绝</el-button>
          </template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="发货通知" name="delivery">
        <gi-table :columns="deliveryCols" :data="deliveries" border stripe size="small">
          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="confirmDel(row.id)">确认发货</el-button>
          </template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="订单状态时间线" name="timeline">
        <el-card header="订单 PO202501150001 状态跟踪" shadow="never">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in timelineItems"
              :key="index"
              :timestamp="item.timestamp"
              :color="item.color"
              :type="item.type"
              :hollow="item.hollow"
            >
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="对账明细" name="reconciliation">
        <gi-table :columns="reconciliationCols" :data="recData" border stripe size="small">
          <template #rec_status="{ row }">
            <el-tag :type="row.rec_status === 'confirmed' ? 'success' : 'warning'" size="small">
              {{ row.rec_status === 'confirmed' ? '已对账' : '待对账' }}
            </el-tag>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { confirmPortalDelivery, confirmPortalOrder, getSupplierPortalData, rejectPortalOrder } from '@/api/scm'

const tab = ref('portal')
const orders = ref<any[]>([])
const deliveries = ref<any[]>([])
const timelineItems = ref<any[]>([])
const recData = ref<any[]>([])

const portalCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '订单号', minWidth: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'delivery_date', label: '交期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 140, fixed: 'right', slotName: 'actions', align: 'center' }
]

const deliveryCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '发货单号', minWidth: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'carrier', label: '物流公司', minWidth: 120 },
  { prop: 'tracking_no', label: '运单号', minWidth: 160 },
  { label: '操作', minWidth: 100, fixed: 'right', slotName: 'actions', align: 'center' }
]

const reconciliationCols: TableColumnItem<any>[] = [
  { prop: 'period', label: '对账周期', minWidth: 160 },
  { prop: 'order_code', label: '订单号', minWidth: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'order_qty', label: '订单数量', minWidth: 80, align: 'center' },
  { prop: 'delivered_qty', label: '已发货', minWidth: 80, align: 'center' },
  { prop: 'accepted_qty', label: '已验收', minWidth: 80, align: 'center' },
  { prop: 'amount', label: '金额(元)', minWidth: 100, align: 'right' },
  { label: '状态', minWidth: 80, slotName: 'rec_status', align: 'center' }
]

async function loadPortalData() {
  const res = await getSupplierPortalData()
  orders.value = res.data.orders || []
  deliveries.value = res.data.deliveries || []
  timelineItems.value = res.data.timelineItems || []
  recData.value = res.data.recData || []
}

async function confirm(id: string) {
  await confirmPortalOrder(id)
  ElMessage.success('已确认订单')
  await loadPortalData()
}

async function reject(id: string) {
  await rejectPortalOrder(id)
  ElMessage.success('已拒绝订单')
  await loadPortalData()
}

async function confirmDel(id: string) {
  await confirmPortalDelivery(id)
  ElMessage.success('发货确认成功')
}

onMounted(() => {
  loadPortalData()
})
</script>
