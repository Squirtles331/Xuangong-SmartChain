<template>
  <gi-page-layout>
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="stock-count-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool><gi-button type="add" @click="openCreate" /></template>
    <!-- 差异率统计汇总 -->
    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="6" v-for="d in diffSummary" :key="d.label">
        <el-card shadow="hover" class="diff-card">
          <div class="diff-label">{{ d.label }}</div>
          <div class="diff-value" :style="{ color: d.color }">{{ d.value }}</div>
        </el-card>
      </el-col>
    </el-row>
    <gi-table :columns="cols" :data="plans" border stripe>
      <template #type="{ row }"
        ><el-tag :type="row.type === 'full' ? 'danger' : 'warning'" size="small">{{
          row.type === 'full' ? '全面盘点' : '循环盘点'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'running' ? 'primary' : 'success'" size="small">{{
          row.status === 'pending' ? '待执行' : row.status === 'running' ? '执行中' : '已完成'
        }}</el-tag></template
      >
      <template #actions="{ row }">
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="startCount(row)">开始盘点</el-button>
        <el-button v-if="row.status === 'running'" type="success" link size="small" @click="viewDiff(row)">查看差异</el-button>
      </template>
    </gi-table>
    <el-dialog v-model="execVis" title="盘点执行" width="700px">
      <el-table :data="execItems" border size="small">
        <el-table-column prop="location" label="库位" width="100" />
        <el-table-column prop="material" label="物料" minWidth="140" />
        <el-table-column prop="book_qty" label="账面数" width="80" align="center" />
        <el-table-column label="实盘数" width="120"
          ><template #default="{ row }"><el-input-number v-model="row.actual" :min="0" size="small" /></template
        ></el-table-column>
      </el-table>
      <template #footer
        ><el-button @click="execVis = false">保存草稿</el-button><el-button type="primary" @click="submitCount">提交盘点结果</el-button></template
      >
    </el-dialog>
    <el-dialog v-model="diffVis" title="盘点差异" width="700px">
      <el-table :data="diffItems" border size="small">
        <el-table-column prop="location" label="库位" width="100" />
        <el-table-column prop="material" label="物料" minWidth="140" />
        <el-table-column prop="book_qty" label="账面数" width="80" align="center" />
        <el-table-column prop="actual" label="实盘数" width="80" align="center" />
        <el-table-column label="差异" width="80" align="center"
          ><template #default="{ row }"
            ><span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '' }"
              >{{ row.diff > 0 ? '+' : '' }}{{ row.diff }}</span
            ></template
          ></el-table-column
        >
        <el-table-column label="处理方式" width="120"
          ><template #default="{ row }"
            ><el-select v-model="row.disposition" size="small"
              ><el-option label="盘盈入库" value="profit" /><el-option label="盘亏出库" value="loss" /><el-option
                label="不处理"
                value="ignore" /></el-select></template
        ></el-table-column>
      </el-table>
      <template #footer
        ><el-button @click="diffVis = false">取消</el-button><el-button type="primary" @click="confirmDiff">确认调整</el-button></template
      >
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'

// 差异率统计汇总
const diffSummary = computed(() => {
  const totalItems = diffItems.value.length
  const hasDiff = diffItems.value.filter((d) => d.diff !== 0).length
  const totalBookQty = diffItems.value.reduce((sum, d) => sum + d.book_qty, 0)
  const totalDiff = diffItems.value.reduce((sum, d) => sum + Math.abs(d.diff), 0)
  const diffRate = totalBookQty > 0 ? ((totalDiff / totalBookQty) * 100).toFixed(2) : '0.00'
  return [
    { label: '盘点项数', value: String(totalItems), color: '#409eff' },
    { label: '差异项数', value: String(hasDiff), color: '#e6a23c' },
    { label: '差异率', value: diffRate + '%', color: '#f56c6c' },
    { label: '总差异量', value: String(totalDiff), color: '#67c23a' }
  ]
})
const s = ref({ keyword: '' })
const sc: FormColumnItem[] = [{ type: 'input', label: '关键字', field: 'keyword' } as any]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
function hs() {}
function hr() {
  s.value.keyword = ''
}
interface Plan {
  id: string
  code: string
  warehouse: string
  type: string
  plan_date: string
  executor: string
  status: string
}
const plans = ref<Plan[]>([
  { id: '1', code: 'PD20250115001', warehouse: '原材料仓', type: 'full', plan_date: '2025-01-15', executor: '李四', status: 'pending' },
  { id: '2', code: 'PD20250110002', warehouse: '成品仓', type: 'cycle', plan_date: '2025-01-10', executor: '王五', status: 'completed' }
])
const cols: TableColumnItem<Plan>[] = [
  { prop: 'code', label: '计划编号', width: 160 },
  { prop: 'warehouse', label: '盘点仓库', width: 120 },
  { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'plan_date', label: '计划日期', width: 110 },
  { prop: 'executor', label: '执行人', width: 80 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]
function openCreate() {}
const execVis = ref(false)
const execItems = ref(stockCountExec as any)
function startCount(r: Plan) {
  r.status = 'running'
  execVis.value = true
}
function submitCount() {
  const p = plans.value.find((p) => p.status === 'running')
  if (p) p.status = 'completed'
  execVis.value = false
  ElMessage.success('盘点提交成功')
}
const diffVis = ref(false)
const diffItems = ref(stockCountDiff as any)
function viewDiff(_r: Plan) {
  diffVis.value = true
}
function confirmDiff() {
  diffVis.value = false
  ElMessage.success('差异已调整')
}
</script>
<style scoped>
.diff-card :deep(.el-card__body) {
  padding: 16px;
  text-align: center;
}
.diff-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}
.diff-value {
  font-size: 28px;
  font-weight: 700;
}
</style>
