<template>
  <gi-page-layout :bordered="true">
    <el-card shadow="never"
      ><el-form :inline="true"
        ><el-form-item label="扫描条码"
          ><el-input v-model="scanCode" placeholder="扫描或输入条码" style="width: 300px" @keyup.enter="handleScanIn" /><el-button
            type="primary"
            style="margin-left: 8px"
            @click="handleScanIn"
            >确认入库</el-button
          ></el-form-item
        ></el-form
      ></el-card
    >
    <gi-table :columns="cols" :data="records" border stripe size="small" style="margin-top: 16px" />
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
const scanCode = ref('')
const records = ref<any[]>([])
const cols: TableColumnItem<any>[] = [
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'time', label: '入库时间', minWidth: 170 }
]
function handleScanIn() {
  if (scanCode.value) {
    records.value.unshift({ barcode: scanCode.value, material: '45#圆钢 φ50', time: new Date().toLocaleString() })
    scanCode.value = ''
    ElMessage.success('入库成功')
  }
}
</script>
