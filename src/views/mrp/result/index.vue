<template>
  <gi-page-layout>
    <template #header>
      <div class="mrp-header">
        <h2>MRP 运算结果</h2>
        <div>
          <el-tag v-if="lastRunTime" type="success" style="margin-right: 8px">最近运行: {{ lastRunTime }}</el-tag>
          <el-button type="primary" @click="runMRP">运行 MRP</el-button>
          <el-button @click="$router.push('/mrp/history')">运行历史</el-button>
        </div>
      </div>
    </template>

    <el-tabs v-model="tab" @tab-change="onTabChange">
      <el-tab-pane label="建议采购" name="purchase">
        <div style="margin-bottom: 12px">
          <el-button type="primary" size="small" @click="confirmAll('purchase')">批量生成采购申请</el-button>
        </div>
        <gi-table :columns="purCols" :data="purchaseList" border stripe size="small" @selection-change="onPurSelect">
          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="confirmOne('purchase', row)">生成申请</el-button>
          </template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="建议生产" name="production">
        <div style="margin-bottom: 12px">
          <el-button type="primary" size="small" @click="confirmAll('production')">批量生成工单</el-button>
        </div>
        <gi-table :columns="prodCols" :data="productionList" border stripe size="small">
          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="confirmOne('production', row)">生成工单</el-button>
          </template>
        </gi-table>
      </el-tab-pane>

      <el-tab-pane label="例外报告" name="exception">
        <el-tag v-if="exceptions.length === 0" type="success" size="large">无例外</el-tag>
        <gi-table v-else :columns="excCols" :data="exceptions" border stripe size="small">
          <template #type="{ row }">
            <el-tag :type="levelTagType(row.level)" size="small" effect="dark">{{ row.type }}</el-tag>
          </template>
          <template #detail="{ row }">
            <span :style="{ color: levelColor(row.level), fontWeight: row.level === 'severe' ? 'bold' : 'normal' }">
              {{ row.detail }}
            </span>
          </template>
          <template #action="{ row }">
            <span :style="{ color: levelColor(row.level) }">{{ row.action }}</span>
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { TableColumnItem } from 'gi-component'
import { runMRP as runMRPApi, getMRPResults, confirmMRPSuggestions } from '@/api/mrp'

const tab = ref('purchase')
const router = useRouter()
const runId = ref('')
const lastRunTime = ref('')

const purchaseList = ref<any[]>([])
const purCols: TableColumnItem<any>[] = [
  { type: 'selection', width: 50 },
  { prop: 'code', label: '物料编码', width: 180 },
  { prop: 'name', label: '物料名称', minWidth: 140 },
  { prop: 'qty', label: '建议采购量', minWidth: 110, align: 'center' },
  { prop: 'order_date', label: '建议下单', width: 110 },
  { prop: 'need_date', label: '需求日期', width: 110 },
  { prop: 'supplier', label: '建议供应商', width: 150 },
  { prop: 'source', label: '来源需求', width: 150 },
  { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
]

const productionList = ref<any[]>([])
const prodCols: TableColumnItem<any>[] = [
  { type: 'selection', width: 50 },
  { prop: 'code', label: '产品编码', width: 180 },
  { prop: 'name', label: '产品名称', minWidth: 140 },
  { prop: 'qty', label: '建议生产量', minWidth: 110, align: 'center' },
  { prop: 'start_date', label: '建议开工', width: 110 },
  { prop: 'end_date', label: '建议完工', width: 110 },
  { prop: 'bom', label: 'BOM版本', width: 110 },
  { prop: 'routing', label: '工艺版本', width: 130 },
  { prop: 'source', label: '来源需求', width: 150 },
  { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
]

const exceptions = ref<any[]>([])
const excCols: TableColumnItem<any>[] = [
  { label: '类型', width: 100, slotName: 'type' },
  { prop: 'material', label: '物料', width: 150 },
  { label: '详情', minWidth: 250, slotName: 'detail' },
  { label: '建议动作', minWidth: 200, slotName: 'action' }
]

type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

function levelTagType(level: string): TagType {
  if (level === 'severe') return 'danger'
  if (level === 'warning') return 'warning'
  return 'info'
}

function levelColor(level: string): string {
  if (level === 'severe') return '#f56c6c'
  if (level === 'warning') return '#e6a23c'
  return '#909399'
}

const selectedPur = ref<any[]>([])
function onPurSelect(rows: any[]) {
  selectedPur.value = rows
}

async function fetchResults(type: string) {
  if (!runId.value) return
  try {
    const res = await getMRPResults(runId.value, {
      type: type as 'purchase' | 'production' | 'exception',
      pageNum: 1,
      pageSize: 100
    })
    if (type === 'purchase') purchaseList.value = res.data.list
    else if (type === 'production') productionList.value = res.data.list
    else if (type === 'exception') exceptions.value = res.data.list
  } catch {
    ElMessage.error('获取MRP结果失败')
  }
}

function onTabChange(val: string) {
  fetchResults(val)
}

async function confirmOne(type: string, row: any) {
  try {
    await confirmMRPSuggestions(runId.value, [row.id])
    ElMessage.success(type === 'purchase' ? '已生成采购申请' : '已生成工单')
  } catch {
    ElMessage.error('确认失败')
  }
}

async function confirmAll(type: string) {
  if (type === 'purchase' && selectedPur.value.length === 0) {
    ElMessage.warning('请先选择要生成的采购建议')
    return
  }
  try {
    const ids = selectedPur.value.map((r: any) => r.id)
    await confirmMRPSuggestions(runId.value, ids)
    ElMessage.success(type === 'purchase' ? `已批量生成 ${ids.length} 个采购申请` : `已批量生成工单`)
  } catch {
    ElMessage.error('批量确认失败')
  }
}

async function runMRP() {
  try {
    const res = await runMRPApi()
    runId.value = res.data.runId
    lastRunTime.value = new Date().toLocaleString()
    ElMessage.success('MRP 运算已启动，请稍候查看结果')
    fetchResults('purchase')
  } catch {
    ElMessage.error('MRP 运算启动失败')
  }
}

onMounted(async () => {
  try {
    const res = await runMRPApi()
    runId.value = res.data.runId
    lastRunTime.value = new Date().toLocaleString()
    fetchResults('purchase')
  } catch {
    // 静默失败，等待用户手动运行
  }
})
</script>

<style scoped>
.mrp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.mrp-header h2 {
  margin: 0;
  font-size: 18px;
}
</style>
