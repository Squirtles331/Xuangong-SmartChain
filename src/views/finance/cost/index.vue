<template>
  <gi-page-layout :bordered="true">
    <gi-table :columns="cols" :data="costDetails" border stripe size="small" />
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'

const costDetails = ref([
  { id: '1', category: '材料费用', item: '钢材采购', quantity: 12000, unit: 'kg', unit_price: 8.5, amount: 102000, month: '2025-06' },
  { id: '2', category: '材料费用', item: '铝合金采购', quantity: 5000, unit: 'kg', unit_price: 22.0, amount: 110000, month: '2025-06' },
  { id: '3', category: '材料费用', item: '标准件采购', quantity: 8000, unit: '套', unit_price: 15.0, amount: 120000, month: '2025-06' },
  { id: '4', category: '材料费用', item: '辅料采购', quantity: 2000, unit: '批', unit_price: 24.0, amount: 48000, month: '2025-06' },
  { id: '5', category: '人工费用', item: '直接生产人工', quantity: 20, unit: '人', unit_price: 4500, amount: 90000, month: '2025-06' },
  { id: '6', category: '人工费用', item: '质检人工', quantity: 5, unit: '人', unit_price: 5000, amount: 25000, month: '2025-06' },
  { id: '7', category: '人工费用', item: '车间管理人工', quantity: 3, unit: '人', unit_price: 6000, amount: 18000, month: '2025-06' },
  { id: '8', category: '人工费用', item: '仓储人工', quantity: 4, unit: '人', unit_price: 4250, amount: 17000, month: '2025-06' },
  { id: '9', category: '制造费用', item: '设备折旧', quantity: 1, unit: '月', unit_price: 35000, amount: 35000, month: '2025-06' },
  { id: '10', category: '制造费用', item: '水电费用', quantity: 1, unit: '月', unit_price: 18000, amount: 18000, month: '2025-06' },
  { id: '11', category: '制造费用', item: '维修保养', quantity: 1, unit: '月', unit_price: 12000, amount: 12000, month: '2025-06' },
  { id: '12', category: '制造费用', item: '劳保用品', quantity: 1, unit: '月', unit_price: 8000, amount: 8000, month: '2025-06' },
  { id: '13', category: '制造费用', item: '工具消耗', quantity: 1, unit: '月', unit_price: 10000, amount: 10000, month: '2025-06' },
  { id: '14', category: '制造费用', item: '环保处理', quantity: 1, unit: '月', unit_price: 7000, amount: 7000, month: '2025-06' }
])

const cols: TableColumnItem<any>[] = [
  { prop: 'category', label: '费用类别', minWidth: 110 },
  { prop: 'item', label: '费用项目', minWidth: 140 },
  { prop: 'quantity', label: '数量', minWidth: 80, align: 'right' },
  { prop: 'unit', label: '单位', minWidth: 60, align: 'center' },
  { prop: 'unit_price', label: '单价(元)', minWidth: 100, align: 'right' },
  { prop: 'amount', label: '金额(元)', minWidth: 120, align: 'right' },
  { prop: 'month', label: '月份', minWidth: 100, align: 'center' }
]
</script>
