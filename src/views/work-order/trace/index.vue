<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #actions="{ row }"><el-button type="primary" link size="small" @click="viewDetail(row)">详情</el-button></template>
    </gi-table>
    <el-dialog v-model="detailVis" title="报工详情" width="600px">
      <el-descriptions :column="2" border
        ><el-descriptions-item label="工单">{{ detail?.wo_code }}</el-descriptions-item
        ><el-descriptions-item label="工序">{{ detail?.op_name }}</el-descriptions-item
        ><el-descriptions-item label="操作人">{{ detail?.worker }}</el-descriptions-item
        ><el-descriptions-item label="报工时间">{{ detail?.time }}</el-descriptions-item
        ><el-descriptions-item label="合格数">{{ detail?.qualified }}</el-descriptions-item
        ><el-descriptions-item label="不良数">{{ detail?.defective }}</el-descriptions-item
        ><el-descriptions-item label="不良原因">{{ detail?.reasons || '-' }}</el-descriptions-item
        ><el-descriptions-item label="工时(分钟)">{{ detail?.hours }}</el-descriptions-item></el-descriptions
      >
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Rpt {
  id: string
  wo_code: string
  op_name: string
  worker: string
  qualified: number
  defective: number
  reasons: string
  hours: number
  time: string
}
const reports = ref<Rpt[]>([
  {
    id: '1',
    wo_code: 'WO202501150001',
    op_name: '工序10:下料',
    worker: '李四',
    qualified: 100,
    defective: 2,
    reasons: '尺寸超差',
    hours: 510,
    time: '2025-01-11 17:00'
  },
  {
    id: '2',
    wo_code: 'WO202501150001',
    op_name: '工序20:粗车',
    worker: '王五',
    qualified: 98,
    defective: 1,
    reasons: '外观缺陷',
    hours: 960,
    time: '2025-01-14 12:00'
  },
  {
    id: '3',
    wo_code: 'WO202501150001',
    op_name: '工序30:精车',
    worker: '赵六',
    qualified: 45,
    defective: 3,
    reasons: '尺寸超差,设备精度',
    hours: 720,
    time: '2025-01-15 14:00'
  },
  {
    id: '4',
    wo_code: 'WO202501150005',
    op_name: '工序20:车削',
    worker: '孙八',
    qualified: 120,
    defective: 0,
    reasons: '',
    hours: 1440,
    time: '2025-01-15 10:00'
  }
])
const s = reactive({ wo_code: '', worker: '' })
const sc: FormColumnItem[] = [{ type: 'input', label: '工单号', field: 'wo_code' } as any, { type: 'input', label: '操作人', field: 'worker' } as any]
const cols: TableColumnItem<Rpt>[] = [
  { prop: 'wo_code', label: '工单号', width: 170 },
  { prop: 'op_name', label: '工序', width: 130 },
  { prop: 'worker', label: '操作人', width: 80 },
  { prop: 'qualified', label: '合格数', width: 80, align: 'center' },
  { prop: 'defective', label: '不良数', width: 80, align: 'center' },
  { prop: 'hours', label: '工时(分)', width: 90, align: 'center' },
  { prop: 'time', label: '时间', width: 150 },
  { label: '操作', width: 80, slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => reports.value.filter((r) => (!s.wo_code || r.wo_code.includes(s.wo_code)) && (!s.worker || r.worker.includes(s.worker))))
const pd = computed(() => fd.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize))
watch(
  fd,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
function hs() {
  p.currentPage = 1
}
function hr() {
  s.wo_code = ''
  s.worker = ''
  p.currentPage = 1
}
const detailVis = ref(false)
const detail = ref<Rpt | null>(null)
function viewDetail(r: Rpt) {
  detail.value = r
  detailVis.value = true
}
</script>
