<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><h3>净变更 MRP</h3>
      <p style="color: #909399; margin: 4px 0">仅重算自上次MRP以来发生变化的部分，大幅缩短运算时间</p></template
    >
    <template #tool><el-button type="primary" @click="runNetMRP">运行净变更MRP</el-button></template>
    <el-card header="变更事件列表" shadow="never" style="margin-bottom: 16px">
      <gi-table :columns="eventCols" :data="events" border stripe size="small" />
    </el-card>
    <el-card header="受影响物料" shadow="never">
      <gi-table :columns="resultCols" :data="affected" border stripe size="small">
        <template #action="{ row }"
          ><el-tag :type="row.action === 'increase' ? 'success' : row.action === 'decrease' ? 'danger' : 'warning'" size="small">{{
            row.action === 'increase' ? '增加' : row.action === 'decrease' ? '减少' : '不变'
          }}</el-tag></template
        >
      </gi-table>
    </el-card>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
const events = ref([
  { id: '1', type: '销售订单变更', detail: 'SO202501150001 数量 50→60', time: '2025-01-15 14:00' },
  { id: '2', type: '库存变化', detail: '轴承 6308 入库200件', time: '2025-01-15 10:00' },
  { id: '3', type: 'BOM变更', detail: 'MBOM V1.2 生效', time: '2025-01-15 08:00' }
])
const eventCols: TableColumnItem<any>[] = [
  { prop: 'type', label: '变更类型', minWidth: 140 },
  { prop: 'detail', label: '变更详情', minWidth: 280 },
  { prop: 'time', label: '时间', minWidth: 160 }
]
const affected = ref([
  { id: '1', material: '离心泵 XJP-100', old_qty: 70, new_qty: 80, diff: 10, action: 'increase' },
  { id: '2', material: '泵体铸件', old_qty: 100, new_qty: 110, diff: 10, action: 'increase' },
  { id: '3', material: '螺栓 M16×60', old_qty: 800, new_qty: 880, diff: 80, action: 'increase' }
])
const resultCols: TableColumnItem<any>[] = [
  { prop: 'material', label: '物料', minWidth: 160 },
  { prop: 'old_qty', label: '原需求', minWidth: 80, align: 'center' },
  { prop: 'new_qty', label: '新需求', minWidth: 80, align: 'center' },
  { prop: 'diff', label: '变化量', minWidth: 80, align: 'center' },
  { label: '动作', minWidth: 70, slotName: 'action', align: 'center' }
]
function runNetMRP() {
  ElMessage.success('净变更MRP运算完成')
}
</script>
