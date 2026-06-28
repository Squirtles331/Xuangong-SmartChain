<template>
  <gi-page-layout :bordered="true">
    <template #tool><el-button type="primary" @click="runMRP">运行多工厂MRP</el-button></template>
    <gi-table :columns="cols" :data="results" border stripe>
      <template #type="{ row }"
        ><el-tag :type="row.type === 'transfer' ? 'warning' : row.type === 'purchase' ? 'primary' : 'success'" size="small">{{
          row.type === 'transfer' ? '调拨' : row.type === 'purchase' ? '采购' : '生产'
        }}</el-tag></template
      >
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
const results = ref([
  { id: '1', material: '泵体铸件', from_plant: '一工厂', to_plant: '二工厂', qty: 200, type: 'transfer', suggestion: '从一工厂调拨200件到二工厂' },
  { id: '2', material: '轴承 6308', from_plant: '二工厂', to_plant: '一工厂', qty: 50, type: 'transfer', suggestion: '从二工厂调拨50件到一工厂' },
  { id: '3', material: '45#圆钢 φ50', from_plant: '-', to_plant: '一工厂', qty: 300, type: 'purchase', suggestion: '一工厂采购300kg' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'from_plant', label: '来源工厂', minWidth: 100 },
  { prop: 'to_plant', label: '目标工厂', minWidth: 100 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '类型', minWidth: 70, slotName: 'type', align: 'center' },
  { prop: 'suggestion', label: '建议', minWidth: 250 }
]
function runMRP() {
  ElMessage.success('多工厂MRP运算完成')
}
</script>
