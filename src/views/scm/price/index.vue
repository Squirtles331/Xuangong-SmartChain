<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="records" border stripe>
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增价格记录' : '编辑价格记录'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface PR {
  id: string
  material: string
  supplier: string
  price: number
  currency: string
  valid_from: string
  valid_to: string
  source: string
}
const records = ref<PR[]>([
  {
    id: '1',
    material: '45#圆钢 φ50',
    supplier: 'XX钢材有限公司',
    price: 5.8,
    currency: 'CNY',
    valid_from: '2025-01-01',
    valid_to: '2025-06-30',
    source: '年度合同'
  },
  {
    id: '2',
    material: '45#圆钢 φ50',
    supplier: 'AA铸件有限公司',
    price: 6.2,
    currency: 'CNY',
    valid_from: '2025-01-01',
    valid_to: '2025-03-31',
    source: '询价'
  },
  {
    id: '3',
    material: '轴承 6308',
    supplier: 'YY轴承制造厂',
    price: 85.0,
    currency: 'CNY',
    valid_from: '2025-01-01',
    valid_to: '2025-12-31',
    source: '年度合同'
  },
  {
    id: '4',
    material: '螺栓 M16×60',
    supplier: 'ZZ标准件有限公司',
    price: 2.5,
    currency: 'CNY',
    valid_from: '2024-07-01',
    valid_to: '2025-06-30',
    source: '询价'
  }
])
const cols: TableColumnItem<PR>[] = [
  { prop: 'material', label: '物料', minWidth: 150 },
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'price', label: '单价', minWidth: 100, align: 'right' },
  { prop: 'currency', label: '币种', minWidth: 60, align: 'center' },
  { prop: 'valid_from', label: '生效日期', minWidth: 110 },
  { prop: 'valid_to', label: '失效日期', minWidth: 110 },
  { prop: 'source', label: '来源', minWidth: 100 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ material: '', supplier: '', price: 0, currency: 'CNY', valid_from: '', valid_to: '', source: '询价' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '物料', field: 'material', required: true },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input-number', label: '单价', field: 'price', required: true, props: { min: 0, precision: 2 } as any },
  { type: 'input', label: '币种', field: 'currency' },
  { type: 'date-picker', label: '生效日期', field: 'valid_from' },
  { type: 'date-picker', label: '失效日期', field: 'valid_to' },
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      options: [
        { label: '询价', value: '询价' },
        { label: '比价', value: '比价' },
        { label: '年度合同', value: '年度合同' },
        { label: '历史价格', value: '历史价格' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { material: '', supplier: '', price: 0, currency: 'CNY', valid_from: '', valid_to: '', source: '询价' })
  vis.value = true
}
function openEdit(r: PR) {
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
  if (mode.value === 'add') {
    records.value.unshift({ id: Date.now().toString(), ...form } as PR)
  } else {
    const i = records.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(records.value[i], form)
  }
  return true
}
function del(id: string) {
  records.value = records.value.filter((e) => e.id !== id)
}
function refresh() {}
</script>
