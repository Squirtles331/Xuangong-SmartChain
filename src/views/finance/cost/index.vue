<template>
  <gi-page-layout>
    <gi-table :columns="cols" :data="costDetails" border stripe size="small" />
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'

const costDetails = ref(mockCostDetails as any)

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
