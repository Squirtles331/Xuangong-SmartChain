<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="供应商门户" name="portal">
        <gi-table :columns="portalCols" :data="orders" border stripe size="small">
          <template #status="{ row }"
            ><el-tag :type="row.status === 'confirmed' ? 'success' : row.status === 'pending' ? 'warning' : 'info'" size="small">{{
              row.status === 'confirmed' ? '已确认' : row.status === 'pending' ? '待确认' : '已拒绝'
            }}</el-tag></template
          >
          <template #actions="{ row }"
            ><el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="confirm(row)">确认</el-button
            ><el-button v-if="row.status === 'pending'" type="danger" link size="small" @click="reject(row)">拒绝</el-button></template
          >
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="发货通知" name="delivery">
        <gi-table :columns="delCols" :data="deliveries" border stripe size="small">
          <template #actions="{ row }"><el-button type="primary" link size="small" @click="confirmDel(row)">确认发货</el-button></template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
const tab = ref('portal')
const orders = ref([
  { id: '1', code: 'PO202501150001', material: '45#圆钢 φ50', qty: 500, delivery_date: '2025-01-20', status: 'pending' },
  { id: '2', code: 'PO202501100002', material: '轴承 6308', qty: 200, delivery_date: '2025-01-18', status: 'confirmed' }
])
const portalCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '订单号', minWidth: 170 },
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'delivery_date', label: '交期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 140, fixed: 'right', slotName: 'actions', align: 'center' }
]
const deliveries = ref([{ id: '1', code: 'DN20250115001', material: '45#圆钢 φ50', qty: 500, carrier: '顺丰速运', tracking_no: 'SF1234567890' }])
const delCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '发货单号', minWidth: 170 },
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'carrier', label: '物流公司', minWidth: 120 },
  { prop: 'tracking_no', label: '运单号', minWidth: 160 },
  { label: '操作', minWidth: 100, fixed: 'right', slotName: 'actions', align: 'center' }
]
function confirm(r: any) {
  r.status = 'confirmed'
  ElMessage.success('已确认订单')
}
function reject(r: any) {
  r.status = 'rejected'
  ElMessage.success('已拒绝订单')
}
function confirmDel(_r: any) {
  ElMessage.success('发货确认成功')
}
</script>
