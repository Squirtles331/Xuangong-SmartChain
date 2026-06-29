<template>
  <gi-page-layout :bordered="true">
    <template #tool><el-button type="primary" @click="printBarcode">批量打印</el-button></template>
    <gi-table :columns="cols" :data="materials" border stripe size="small" @selection-change="onSelect" />
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
const materials = ref([
  { id: '1', code: '01.01.001-00001', name: '45#圆钢 φ50', barcode: 'BC20250115001', lot: 'L20250101', qty: 350 },
  { id: '2', code: '02.04.001-00001', name: '轴承 6308', barcode: 'BC20250115002', lot: 'L20241215', qty: 80 },
  { id: '3', code: '04.01.001-00001', name: '离心泵 XJP-100', barcode: 'BC20250115003', lot: 'WO202501150001', qty: 45 }
])
const cols: TableColumnItem<any>[] = [
  { type: 'selection', minWidth: 50 },
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { prop: 'code', label: '物料编码', minWidth: 170 },
  { prop: 'name', label: '物料名称', minWidth: 160 },
  { prop: 'lot', label: '批号', minWidth: 160 },
  { prop: 'qty', label: '库存', minWidth: 80, align: 'center' }
]
function onSelect(_rows: any) {}
function printBarcode() {
  ElMessage.success('条码打印任务已发送')
}
</script>
