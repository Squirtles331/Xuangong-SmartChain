<template>
  <gi-page-layout>
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="supplier-quality-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool
      ><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /><el-button
        style="margin-left: 8px"
        @click="handleExport"
        >导出</el-button
      ></template
    >
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #pass_rate="{ row }"
        ><el-progress
          :percentage="row.pass_rate"
          :stroke-width="8"
          :color="row.pass_rate >= 95 ? '#67c23a' : row.pass_rate >= 80 ? '#e6a23c' : '#f56c6c'"
      /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增' : '编辑'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
interface SQ {
  id: string
  supplier: string
  total_batches: number
  pass_batches: number
  pass_rate: number
  repeat_issues: number
  last_inspection: string
}
const data = ref<SQ[]>([
  { id: '1', supplier: 'XX钢材有限公司', total_batches: 24, pass_batches: 22, pass_rate: 91.7, repeat_issues: 1, last_inspection: '2025-01-15' },
  { id: '2', supplier: 'YY轴承制造厂', total_batches: 18, pass_batches: 17, pass_rate: 94.4, repeat_issues: 0, last_inspection: '2025-01-12' }
])
const s = reactive({ supplier: '', date_range: [] as string[] })
const sc: FormColumnItem[] = [
  { type: 'input', label: '供应商', field: 'supplier' } as any,
  { type: 'date-picker', label: '时间范围', field: 'date_range', props: { type: 'daterange' } as any }
]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
const cols: TableColumnItem<SQ>[] = [
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'total_batches', label: '总批次数', minWidth: 100, align: 'center' },
  { prop: 'pass_batches', label: '合格批次', minWidth: 100, align: 'center' },
  { label: '合格率', minWidth: 180, slotName: 'pass_rate' },
  { prop: 'repeat_issues', label: '重复问题', minWidth: 90, align: 'center' },
  { prop: 'last_inspection', label: '最近检验', width: 110 }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => !s.supplier || r.supplier.includes(s.supplier)))
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
  s.supplier = ''
  s.date_range = []
  p.currentPage = 1
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      data.value = data.value.filter((e: any) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ supplier: '' })
const formCols: FormColumnItem[] = [{ type: 'input', label: '名称', field: 'supplier', required: true }]
function openAdd() {
  mode.value = 'add'
  eid.value = ''
  vis.value = true
}
function openEdit(r: any) {
  mode.value = 'edit'
  eid.value = r.id
  form.supplier = r.supplier
  vis.value = true
}
async function submit() {
  if (!form.supplier) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      supplier: form.supplier,
      total_batches: 0,
      pass_batches: 0,
      pass_rate: 0,
      repeat_issues: 0,
      last_inspection: new Date().toISOString().slice(0, 10)
    })
  } else {
    const i = data.value.findIndex((e: any) => e.id === eid.value)
    if (i > -1) data.value[i].supplier = form.supplier
  }
  return true
}
function refresh() {
  hr()
}
function handleExport() {
  ElMessage.success('导出成功')
}
</script>
