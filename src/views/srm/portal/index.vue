<template>
  <gi-page-layout>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="供应商订单确认" name="orders">
        <gi-table :columns="orderColumns" :data="portalData.orders" border stripe size="small" :loading="loading">
          <template #status="{ row }">
            <el-tag :type="row.status === 'confirmed' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'" size="small">
              {{ row.status === 'confirmed' ? '已确认' : row.status === 'pending' ? '待确认' : '已驳回' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirmOrder(row.id)">确认</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link size="small" @click="rejectOrder(row.id)">驳回</el-button>
          </template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="发货通知" name="deliveries">
        <gi-table :columns="deliveryColumns" :data="portalData.deliveries" border stripe size="small" :loading="loading">
          <template #confirmed="{ row }">
            <el-tag :type="row.confirmed ? 'success' : 'warning'" size="small">
              {{ row.confirmed ? '已确认' : '待确认' }}
            </el-tag>
          </template>
          <template #actions="{ row }">
            <el-button v-if="!row.confirmed" type="primary" link size="small" @click="confirmDelivery(row.id)">确认发货</el-button>
            <span v-else class="muted-text">无需处理</span>
          </template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="订单状态时间线" name="timeline">
        <el-card header="订单状态跟踪" shadow="never">
          <el-timeline>
            <el-timeline-item
              v-for="item in portalData.timelineItems"
              :key="`${item.timestamp}-${item.content}`"
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
        <gi-table :columns="reconciliationColumns" :data="portalData.recData" border stripe size="small" :loading="loading">
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
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import {
  confirmPortalDelivery,
  confirmPortalOrder,
  getSupplierPortalData,
  rejectPortalOrder,
  type PortalDelivery,
  type PortalOrder,
  type PortalReconciliation,
  type PortalTimelineItem,
  type SupplierPortalData
} from '@/api/scm'

const activeTab = ref('orders')
const loading = ref(false)
const portalData = reactive<SupplierPortalData>({
  orders: [],
  deliveries: [],
  timelineItems: [],
  recData: []
})

const orderColumns: TableColumnItem<PortalOrder>[] = [
  { prop: 'code', label: '订单编号', minWidth: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
  { prop: 'delivery_date', label: '交付日期', minWidth: 120 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 140, fixed: 'right', slotName: 'actions', align: 'center' }
]

const deliveryColumns: TableColumnItem<PortalDelivery>[] = [
  { prop: 'code', label: '发货单号', minWidth: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 90, align: 'center' },
  { prop: 'carrier', label: '物流公司', minWidth: 120 },
  { prop: 'tracking_no', label: '运单号', minWidth: 160 },
  { label: '确认状态', minWidth: 100, slotName: 'confirmed', align: 'center' },
  { label: '操作', minWidth: 100, fixed: 'right', slotName: 'actions', align: 'center' }
]

const reconciliationColumns: TableColumnItem<PortalReconciliation>[] = [
  { prop: 'period', label: '对账周期', minWidth: 120 },
  { prop: 'order_code', label: '订单编号', minWidth: 170 },
  { prop: 'material', label: '物料名称', minWidth: 150 },
  { prop: 'order_qty', label: '订单数量', minWidth: 90, align: 'center' },
  { prop: 'delivered_qty', label: '已发货', minWidth: 90, align: 'center' },
  { prop: 'accepted_qty', label: '已验收', minWidth: 90, align: 'center' },
  { prop: 'amount', label: '金额', minWidth: 100, align: 'right' },
  { label: '状态', minWidth: 90, slotName: 'rec_status', align: 'center' }
]

async function loadPortalData() {
  loading.value = true
  try {
    const response = await getSupplierPortalData()
    const data = response.data as SupplierPortalData
    portalData.orders = data.orders || []
    portalData.deliveries = data.deliveries || []
    portalData.timelineItems = data.timelineItems || ([] as PortalTimelineItem[])
    portalData.recData = data.recData || []
  } finally {
    loading.value = false
  }
}

async function confirmOrder(id: string) {
  await confirmPortalOrder(id)
  ElMessage.success('订单已确认')
  await loadPortalData()
}

async function rejectOrder(id: string) {
  await rejectPortalOrder(id)
  ElMessage.success('订单已驳回')
  await loadPortalData()
}

async function confirmDelivery(id: string) {
  await confirmPortalDelivery(id)
  ElMessage.success('发货确认成功')
  await loadPortalData()
}

onMounted(() => {
  loadPortalData()
})
</script>

<style scoped>
.muted-text {
  color: #909399;
}
</style>
