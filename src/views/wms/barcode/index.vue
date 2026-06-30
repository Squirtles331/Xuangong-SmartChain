<template>
  <gi-page-layout>
    <template #header>
      <h3>Barcode / RFID</h3>
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="Print" name="print">
        <div style="margin-bottom: 12px">
          <el-button type="primary" @click="printBarcode">Batch Print</el-button>
        </div>
        <gi-table
          :columns="printColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          border
          stripe
          size="small"
          @selection-change="onSelect"
        />
      </el-tab-pane>

      <el-tab-pane label="Generate" name="generate">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-card header="Barcode Params" shadow="never">
              <el-form label-width="90px" size="small">
                <el-form-item label="Material Code"><el-input v-model="genForm.code" /></el-form-item>
                <el-form-item label="Material Name"><el-input v-model="genForm.name" /></el-form-item>
                <el-form-item label="Lot"><el-input v-model="genForm.lot" /></el-form-item>
                <el-form-item label="Qty"><el-input-number v-model="genForm.qty" :min="1" style="width: 100%" /></el-form-item>
                <el-form-item><el-button type="primary" @click="generateBarcode">Generate</el-button></el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card header="Preview" shadow="never">
              <div v-if="!previewBarcode" style="color: #c0c4cc; text-align: center; padding: 60px 0">Generate a barcode to preview.</div>
              <div v-else class="barcode-preview">
                <div class="barcode-img">{{ previewBarcode }}</div>
                <el-descriptions :column="2" border size="small" style="margin-top: 12px">
                  <el-descriptions-item label="Barcode">{{ previewBarcode }}</el-descriptions-item>
                  <el-descriptions-item label="Code">{{ genForm.code }}</el-descriptions-item>
                  <el-descriptions-item label="Name">{{ genForm.name }}</el-descriptions-item>
                  <el-descriptions-item label="Lot">{{ genForm.lot }}</el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="Scan In" name="scanIn">
        <el-card shadow="never">
          <el-form :inline="true">
            <el-form-item label="Barcode">
              <el-input v-model="scanInCode" style="width: 300px" @keyup.enter="handleScanIn" />
              <el-button type="primary" style="margin-left: 8px" @click="handleScanIn">Confirm Inbound</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <gi-table :columns="scanInColumns" :data="scanInRecords" border stripe size="small" style="margin-top: 16px" />
      </el-tab-pane>

      <el-tab-pane label="Scan Out" name="scanOut">
        <el-card shadow="never">
          <el-form :inline="true">
            <el-form-item label="Barcode">
              <el-input v-model="scanOutCode" style="width: 300px" @keyup.enter="handleScanOut" />
              <el-button type="primary" style="margin-left: 8px" @click="handleScanOut">Confirm Outbound</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <gi-table :columns="scanOutColumns" :data="scanOutRecords" border stripe size="small" style="margin-top: 16px" />
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { getMaterialListForBarcode } from '@/api/wms'
import { useTable } from '@/hooks/useTable'

const tab = ref('print')
const selectedRows = ref<any[]>([])
const previewBarcode = ref('')
const scanInCode = ref('')
const scanOutCode = ref('')
const scanInRecords = ref<any[]>([])
const scanOutRecords = ref<any[]>([])

const genForm = reactive({
  code: '',
  name: '',
  lot: '',
  qty: 1
})

const printColumns: TableColumnItem<any>[] = [
  { type: 'selection', minWidth: 50 },
  { prop: 'barcode', label: 'Barcode', minWidth: 180 },
  { prop: 'code', label: 'Material Code', minWidth: 170 },
  { prop: 'name', label: 'Material Name', minWidth: 180 },
  { prop: 'lot', label: 'Lot', minWidth: 120 },
  { prop: 'qty', label: 'Stock', minWidth: 80, align: 'center' }
]

const scanInColumns: TableColumnItem<any>[] = [
  { prop: 'barcode', label: 'Barcode', minWidth: 180 },
  { prop: 'material', label: 'Material', minWidth: 180 },
  { prop: 'time', label: 'Inbound Time', minWidth: 170 }
]

const scanOutColumns: TableColumnItem<any>[] = [
  { prop: 'barcode', label: 'Barcode', minWidth: 180 },
  { prop: 'material', label: 'Material', minWidth: 180 },
  { prop: 'time', label: 'Outbound Time', minWidth: 170 }
]

const { tableData, pagination, loading } = useTable<any>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getMaterialListForBarcode({ pageNum: page, pageSize: size })
    const items = res.data.list.map((item: any, index: number) => ({
      id: String(item.id),
      barcode: `BC${String(index + 1).padStart(5, '0')}${String(item.code).replace(/\W/g, '').slice(-6)}`,
      code: item.code,
      name: item.name,
      lot: `LOT-${String(index + 1).padStart(4, '0')}`,
      qty: item.stock ?? item.qty ?? 0
    }))
    return { list: items, total: items.length }
  }
})

function generateBarcode() {
  if (!genForm.code) {
    ElMessage.warning('Material code is required')
    return
  }

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  previewBarcode.value = `BC${date}${seq}`
  ElMessage.success('Barcode generated')
}

function onSelect(rows: any[]) {
  selectedRows.value = rows
}

function printBarcode() {
  ElMessage.success(`Print job submitted: ${selectedRows.value.length} item(s)`)
}

function resolveMaterial(barcode: string) {
  return tableData.value.find((item) => item.barcode === barcode)?.name || 'Unknown Material'
}

function handleScanIn() {
  if (!scanInCode.value) return
  scanInRecords.value.unshift({ barcode: scanInCode.value, material: resolveMaterial(scanInCode.value), time: new Date().toLocaleString() })
  scanInCode.value = ''
  ElMessage.success('Inbound confirmed')
}

function handleScanOut() {
  if (!scanOutCode.value) return
  scanOutRecords.value.unshift({ barcode: scanOutCode.value, material: resolveMaterial(scanOutCode.value), time: new Date().toLocaleString() })
  scanOutCode.value = ''
  ElMessage.success('Outbound confirmed')
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
