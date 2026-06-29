<template>
  <gi-page-layout :bordered="true">
    <template #header><h3>条码/RFID 仓储管理</h3></template>
    <el-tabs v-model="tab">
      <el-tab-pane label="条码打印" name="print">
        <template #tool><el-button type="primary" @click="printBarcode">批量打印</el-button></template>
        <gi-table :columns="printCols" :data="materials" border stripe size="small" @selection-change="onSelect" />
      </el-tab-pane>
      <el-tab-pane label="条码生成" name="generate">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-card header="条码参数" shadow="never">
              <el-form label-width="80px" size="small">
                <el-form-item label="物料编码"><el-input v-model="genForm.code" placeholder="如: 01.01.001" /></el-form-item>
                <el-form-item label="物料名称"><el-input v-model="genForm.name" placeholder="如: 45#圆钢" /></el-form-item>
                <el-form-item label="批号"><el-input v-model="genForm.lot" placeholder="如: L20250101" /></el-form-item>
                <el-form-item label="数量"><el-input-number v-model="genForm.qty" :min="1" style="width: 100%" /></el-form-item>
                <el-form-item><el-button type="primary" @click="generateBarcode">生成条码</el-button></el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card header="条码预览" shadow="never">
              <div v-if="!previewBarcode" style="color: #c0c4cc; text-align: center; padding: 60px 0">请输入参数并点击"生成条码"预览</div>
              <div v-else class="barcode-preview">
                <div class="barcode-img">{{ previewBarcode }}</div>
                <el-descriptions :column="2" border size="small" style="margin-top: 12px">
                  <el-descriptions-item label="条码号">{{ previewBarcode }}</el-descriptions-item>
                  <el-descriptions-item label="物料编码">{{ genForm.code }}</el-descriptions-item>
                  <el-descriptions-item label="物料名称">{{ genForm.name }}</el-descriptions-item>
                  <el-descriptions-item label="批号">{{ genForm.lot }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="扫码入库" name="scanIn">
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
        <gi-table :columns="scanInCols" :data="scanRecords" border stripe size="small" style="margin-top: 16px" />
      </el-tab-pane>
      <el-tab-pane label="扫码出库" name="scanOut">
        <el-card shadow="never"
          ><el-form :inline="true"
            ><el-form-item label="扫描条码"
              ><el-input v-model="scanOutCode" placeholder="扫描或输入条码" style="width: 300px" @keyup.enter="handleScanOut" /><el-button
                type="primary"
                style="margin-left: 8px"
                @click="handleScanOut"
                >确认出库</el-button
              ></el-form-item
            ></el-form
          ></el-card
        >
        <gi-table :columns="scanOutCols" :data="scanOutRecords" border stripe size="small" style="margin-top: 16px" />
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'

// 条码生成
const genForm = reactive({ code: '', name: '', lot: '', qty: 1 })
const previewBarcode = ref('')

function generateBarcode() {
  if (!genForm.code) {
    ElMessage.warning('请输入物料编码')
    return
  }
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  previewBarcode.value = `BC${date}${seq}`
  ElMessage.success('条码已生成')
}
const tab = ref('print')
const materials = ref([
  { id: '1', code: '01.01.001-00001', name: '45#圆钢 φ50', barcode: 'BC20250115001', lot: 'L20250101', qty: 350 },
  { id: '2', code: '02.04.001-00001', name: '轴承 6308', barcode: 'BC20250115002', lot: 'L20241215', qty: 80 },
  { id: '3', code: '04.01.001-00001', name: '离心泵 XJP-100', barcode: 'BC20250115003', lot: 'WO202501150001', qty: 45 }
])
const printCols: TableColumnItem<any>[] = [
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
const scanCode = ref('')
const scanRecords = ref<any[]>([])
const scanInCols: TableColumnItem<any>[] = [
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'time', label: '入库时间', minWidth: 170 }
]
function handleScanIn() {
  if (scanCode.value) {
    scanRecords.value.unshift({ barcode: scanCode.value, material: '45#圆钢 φ50', time: new Date().toLocaleString() })
    scanCode.value = ''
    ElMessage.success('入库成功')
  }
}
const scanOutCode = ref('')
const scanOutRecords = ref<any[]>([])
const scanOutCols: TableColumnItem<any>[] = [
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'time', label: '出库时间', minWidth: 170 }
]
function handleScanOut() {
  if (scanOutCode.value) {
    scanOutRecords.value.unshift({ barcode: scanOutCode.value, material: '轴承 6308', time: new Date().toLocaleString() })
    scanOutCode.value = ''
    ElMessage.success('出库成功')
  }
}
</script>
<style scoped>
.barcode-preview {
  text-align: center;
}
.barcode-img {
  font-family: 'Courier New', monospace;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #303133;
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  border: 2px dashed #dcdfe6;
}
</style>
