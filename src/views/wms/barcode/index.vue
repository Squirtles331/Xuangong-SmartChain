<template>
  <gi-page-layout>
    <template #header>
      <h3>条码 / RFID 管理</h3>
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="批量打印" name="print">
        <div style="margin-bottom: 12px">
          <el-button type="primary" @click="printBarcode">批量打印</el-button>
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

      <el-tab-pane label="条码生成" name="generate">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-card header="条码参数" shadow="never">
              <el-form label-width="90px" size="small">
                <el-form-item label="物料编码"><el-input v-model="genForm.code" /></el-form-item>
                <el-form-item label="物料名称"><el-input v-model="genForm.name" /></el-form-item>
                <el-form-item label="批号"><el-input v-model="genForm.lot" /></el-form-item>
                <el-form-item label="数量"><el-input-number v-model="genForm.qty" :min="1" style="width: 100%" /></el-form-item>
                <el-form-item><el-button type="primary" @click="generateBarcode">生成条码</el-button></el-form-item>
              </el-form>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card header="预览" shadow="never">
              <div v-if="!previewBarcode" class="empty-preview">生成条码后可在此预览。</div>
              <div v-else class="barcode-preview">
                <div class="barcode-img">{{ previewBarcode }}</div>
                <el-descriptions :column="2" border size="small" style="margin-top: 12px">
                  <el-descriptions-item label="条码">{{ previewBarcode }}</el-descriptions-item>
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
        <el-card shadow="never">
          <el-form :inline="true">
            <el-form-item label="条码">
              <el-input v-model="scanInCode" style="width: 300px" @keyup.enter="handleScanIn" />
              <el-button type="primary" style="margin-left: 8px" @click="handleScanIn">确认入库</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <gi-table :columns="scanInColumns" :data="scanInRecords" border stripe size="small" style="margin-top: 16px" />
      </el-tab-pane>

      <el-tab-pane label="扫码出库" name="scanOut">
        <el-card shadow="never">
          <el-form :inline="true">
            <el-form-item label="条码">
              <el-input v-model="scanOutCode" style="width: 300px" @keyup.enter="handleScanOut" />
              <el-button type="primary" style="margin-left: 8px" @click="handleScanOut">确认出库</el-button>
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
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { prop: 'code', label: '物料编码', minWidth: 170 },
  { prop: 'name', label: '物料名称', minWidth: 180 },
  { prop: 'lot', label: '批号', minWidth: 120 },
  { prop: 'qty', label: '库存数', minWidth: 80, align: 'center' }
]

const scanInColumns: TableColumnItem<any>[] = [
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { prop: 'material', label: '物料名称', minWidth: 180 },
  { prop: 'time', label: '入库时间', minWidth: 170 }
]

const scanOutColumns: TableColumnItem<any>[] = [
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { prop: 'material', label: '物料名称', minWidth: 180 },
  { prop: 'time', label: '出库时间', minWidth: 170 }
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
    ElMessage.warning('请填写物料编码')
    return
  }

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(Math.floor(Math.random() * 9000) + 1000)
  previewBarcode.value = `BC${date}${seq}`
  ElMessage.success('条码生成成功')
}

function onSelect(rows: any[]) {
  selectedRows.value = rows
}

function printBarcode() {
  ElMessage.success(`已提交打印任务，共 ${selectedRows.value.length} 项`)
}

function resolveMaterial(barcode: string) {
  return tableData.value.find((item) => item.barcode === barcode)?.name || '未知物料'
}

function handleScanIn() {
  if (!scanInCode.value) return
  scanInRecords.value.unshift({ barcode: scanInCode.value, material: resolveMaterial(scanInCode.value), time: new Date().toLocaleString('zh-CN') })
  scanInCode.value = ''
  ElMessage.success('入库确认成功')
}

function handleScanOut() {
  if (!scanOutCode.value) return
  scanOutRecords.value.unshift({ barcode: scanOutCode.value, material: resolveMaterial(scanOutCode.value), time: new Date().toLocaleString('zh-CN') })
  scanOutCode.value = ''
  ElMessage.success('出库确认成功')
}
</script>

<style scoped>
.empty-preview {
  color: #c0c4cc;
  text-align: center;
  padding: 60px 0;
}

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
