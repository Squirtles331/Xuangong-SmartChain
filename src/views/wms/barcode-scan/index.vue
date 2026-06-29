<template>
  <gi-page-layout>
    <el-card shadow="never" style="margin-bottom: 16px">
      <el-form :inline="true">
        <el-form-item label="扫描条码">
          <el-input ref="scanInputRef" v-model="scanCode" placeholder="扫描或输入条码" style="width: 300px" clearable @keyup.enter="handleScan" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleScanIn">确认入库</el-button>
          <el-button type="warning" style="margin-left: 8px" @click="handleScanOut">确认出库</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="currentResult" shadow="never" style="margin-bottom: 16px" header="解析结果">
      <el-descriptions :column="4" border>
        <el-descriptions-item label="物料编码">{{ currentResult.materialCode }}</el-descriptions-item>
        <el-descriptions-item label="物料名称">{{ currentResult.materialName }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ currentResult.qty }}</el-descriptions-item>
        <el-descriptions-item label="库位">{{ currentResult.location }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <gi-table :columns="cols" :data="records" :pagination="recordPagination" border stripe>
      <template #type="{ row }">
        <el-tag :type="row.type === '入库' ? 'success' : 'warning'" size="small">{{ row.type }}</el-tag>
      </template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'

interface ScanResult {
  barcode: string
  materialCode: string
  materialName: string
  qty: number
  location: string
}

interface ScanRecord {
  barcode: string
  materialCode: string
  materialName: string
  qty: number
  location: string
  type: string
  time: string
}

const scanCode = ref('')
const scanInputRef = ref<any>(null)
const records = ref<ScanRecord[]>([])
const currentResult = ref<ScanResult | null>(null)

const recordPagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => records.value.length)
}) as any

const pagedRecords = computed(() => {
  const start = (recordPagination.value.currentPage - 1) * recordPagination.value.pageSize
  const end = start + recordPagination.value.pageSize
  return records.value.slice(start, end)
})

const cols: TableColumnItem<ScanRecord>[] = [
  { prop: 'barcode', label: '条码', minWidth: 180 },
  { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'materialCode', label: '物料编码', minWidth: 160 },
  { prop: 'materialName', label: '物料名称', minWidth: 140 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { prop: 'location', label: '库位', minWidth: 100 },
  { prop: 'time', label: '操作时间', minWidth: 170 }
]

function parseBarcode(code: string): ScanResult | null {
  if (!code) return null
  const materialList: { code: string; name: string; location: string }[] = [
    { code: '01.01.001-00001', name: '45#圆钢 φ50', location: 'A-01-01' },
    { code: '02.04.001-00001', name: '轴承 6308', location: 'B-02-03' },
    { code: '04.01.001-00001', name: '离心泵 XJP-100', location: 'C-03-05' },
    { code: '01.01.001-00002', name: '螺栓 M16×60', location: 'A-02-01' },
    { code: '02.04.001-00002', name: '传动轴 DS-50', location: 'B-01-02' }
  ]
  const matched = materialList.find((m) => m.code === code) || materialList[Math.floor(Math.random() * materialList.length)]
  return {
    barcode: code,
    materialCode: matched.code,
    materialName: matched.name,
    qty: Math.floor(Math.random() * 50) + 1,
    location: matched.location
  }
}

function handleScan() {
  if (!scanCode.value) return
  const result = parseBarcode(scanCode.value)
  if (result) {
    currentResult.value = result
    scanCode.value = ''
    nextTick(() => {
      scanInputRef.value?.focus?.()
    })
  }
}

function handleScanIn() {
  if (!currentResult.value) {
    ElMessage.warning('请先扫描条码')
    return
  }
  records.value.unshift({
    ...currentResult.value,
    type: '入库',
    time: new Date().toLocaleString()
  })
  currentResult.value = null
  recordPagination.value.currentPage = 1
  ElMessage.success('入库成功')
  nextTick(() => {
    scanInputRef.value?.focus?.()
  })
}

function handleScanOut() {
  if (!currentResult.value) {
    ElMessage.warning('请先扫描条码')
    return
  }
  records.value.unshift({
    ...currentResult.value,
    type: '出库',
    time: new Date().toLocaleString()
  })
  currentResult.value = null
  recordPagination.value.currentPage = 1
  ElMessage.success('出库成功')
  nextTick(() => {
    scanInputRef.value?.focus?.()
  })
}
</script>
