<template>
  <gi-page-layout :bordered="true">
    <template #header><SearchSetting :columns="allSearchColumns" storage-key="forecast-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #type="{ row }"
        ><el-tag :type="row.type === 'sales' ? 'primary' : 'warning'" size="small">{{
          row.type === 'sales' ? '销售预测' : '独立需求'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增预测需求' : '编辑预测需求'" width="600px">
      <SearchSetting :columns="allSearchColumns" storage-key="forecast-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface FC {
  id: string
  material_code: string
  material_name: string
  qty: number
  need_date: string
  type: string
  probability: number
  remark: string
}
const data = ref<FC[]>([
  {
    id: '1',
    material_code: '04.01.001-00001',
    material_name: '离心泵 XJP-100',
    qty: 30,
    need_date: '2025-03-01',
    type: 'sales',
    probability: 80,
    remark: 'Q1销售预测'
  },
  {
    id: '2',
    material_code: '04.02.001-00001',
    material_name: '齿轮箱 GBX-200',
    qty: 15,
    need_date: '2025-03-15',
    type: 'sales',
    probability: 60,
    remark: '新客户意向'
  },
  {
    id: '3',
    material_code: '03.01.001-00001',
    material_name: '传动轴 DS-50',
    qty: 50,
    need_date: '2025-02-20',
    type: 'independent',
    probability: 100,
    remark: '安全库存补充'
  }
])
const s = reactive({ keyword: '', type: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '销售预测', value: 'sales' },
        { label: '独立需求', value: 'independent' }
      ]
    }
  } as any
]
const cols: TableColumnItem<FC>[] = [
  { prop: 'material_name', label: '产品', minWidth: 160 },
  { prop: 'qty', label: '预测数量', minWidth: 90, align: 'center' },
  { prop: 'need_date', label: '需求日期', minWidth: 110 },
  { label: '类型', minWidth: 90, slotName: 'type', align: 'center' },
  { prop: 'probability', label: '概率(%)', minWidth: 90, align: 'center' },
  { prop: 'remark', label: '备注', minWidth: 150 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => (!s.keyword || r.material_name.includes(s.keyword)) && (!s.type || r.type === s.type)))
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
  s.type = ''
  p.currentPage = 1
}
function refresh() {
  hr()
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ material_code: '', material_name: '', qty: 1, need_date: '', type: 'sales', probability: 80, remark: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '产品编码', field: 'material_code', required: true },
  { type: 'input', label: '产品名称', field: 'material_name', required: true },
  { type: 'input-number', label: '预测数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'date-picker', label: '需求日期', field: 'need_date', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '销售预测', value: 'sales' },
        { label: '独立需求', value: 'independent' }
      ]
    } as any
  },
  { type: 'input-number', label: '概率(%)', field: 'probability', props: { min: 0, max: 100 } as any },
  { type: 'input', label: '备注', field: 'remark' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { material_code: '', material_name: '', qty: 1, need_date: '', type: 'sales', probability: 80, remark: '' })
  vis.value = true
}
function openEdit(r: FC) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.material_name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), ...form } as FC)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm(\'确定删除？\', \'警告\', { type: \'warning\' }).then(() => {
  data.value = data.value.filter((e) => e.id !== id)
}
</script>
