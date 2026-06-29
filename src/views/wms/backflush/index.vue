<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="backflush-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : 'success'" size="small">{{
          row.status === 'pending' ? '待冲销' : '已冲销'
        }}</el-tag></template
      >
      <template #diff="{ row }"
        ><span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }"
          >{{ row.diff > 0 ? '+' : '' }}{{ row.diff }}</span
        ></template
      >
      <template #diff_rate="{ row }"
        ><span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '#909399' }">
          {{ row.bom_qty > 0 ? ((Math.abs(row.diff) / row.bom_qty) * 100).toFixed(2) : '0.00' }}%</span
        ></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增倒冲规则' : '编辑倒冲规则'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
interface BF {
  id: string
  material: string
  wo_code: string
  bom_qty: number
  actual_qty: number
  diff: number
  status: string
  backflush_date: string
}
const data = ref<BF[]>([
  {
    id: '1',
    material: '螺栓 M16×60',
    wo_code: 'WO202501150001',
    bom_qty: 800,
    actual_qty: 780,
    diff: -20,
    status: 'pending',
    backflush_date: '2025-01-20'
  },
  {
    id: '2',
    material: '润滑油 Shell Tellus 46',
    wo_code: 'WO202501150001',
    bom_qty: 50,
    actual_qty: 48,
    diff: -2,
    status: 'pending',
    backflush_date: '2025-01-20'
  },
  {
    id: '3',
    material: '螺栓 M12×40',
    wo_code: 'WO202501140003',
    bom_qty: 400,
    actual_qty: 400,
    diff: 0,
    status: 'completed',
    backflush_date: '2025-01-14'
  }
])
const s = reactive({ keyword: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待冲销', value: 'pending' },
        { label: '已冲销', value: 'completed' }
      ]
    }
  } as any
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
const cols: TableColumnItem<BF>[] = [
  { prop: 'material', label: '物料', minWidth: 180 },
  { prop: 'wo_code', label: '工单号', minWidth: 170 },
  { prop: 'bom_qty', label: 'BOM用量', minWidth: 90, align: 'center' },
  { prop: 'actual_qty', label: '实际用量', minWidth: 90, align: 'center' },
  { prop: 'diff', label: '差异', minWidth: 80, align: 'center', slotName: 'diff' },
  { label: '差异率', minWidth: 90, slotName: 'diff_rate', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'backflush_date', label: '冲销日期', minWidth: 110 },
  { label: '操作', minWidth: 100, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => (!s.keyword || r.material.includes(s.keyword)) && (!s.status || r.status === s.status)))
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
  s.keyword = ''
  s.status = ''
  p.currentPage = 1
}
function refresh() {
  hr()
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ material: '', wo_code: '', bom_qty: 0, actual_qty: 0, diff: 0, status: 'pending', backflush_date: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input', label: '工单号', field: 'wo_code', required: true },
  { type: 'input-number', label: 'BOM用量', field: 'bom_qty', required: true },
  { type: 'input-number', label: '实际用量', field: 'actual_qty', required: true },
  { type: 'date-picker', label: '冲销日期', field: 'backflush_date' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { material: '', wo_code: '', bom_qty: 0, actual_qty: 0, diff: 0, status: 'pending', backflush_date: '' })
  vis.value = true
}
function openEdit(r: BF) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  form.diff = form.actual_qty - form.bom_qty
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), ...form } as BF)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function backflush(r: BF) {
  r.status = 'completed'
  ElMessage.success('倒冲完成，库存已更新')
}
</script>
