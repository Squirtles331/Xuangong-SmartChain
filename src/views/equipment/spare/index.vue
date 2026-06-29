<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="spare-search" @update:visible-fields="onSearchFieldsChange">
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
      <template #stock_status="{ row }"
        ><el-tag :type="row.qty > row.safety ? 'success' : row.qty > 0 ? 'warning' : 'danger'" size="small">{{
          row.qty > row.safety ? '充足' : row.qty > 0 ? '偏低' : '缺货'
        }}</el-tag></template
      >
      <template #actions="{ row }"
        ><gi-button type="edit" @click="openEdit(row)" /><el-button type="primary" link size="small" @click="inbound(row)">入库</el-button
        ><el-button type="warning" link size="small" @click="outbound(row)">出库</el-button></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增备件' : '编辑备件'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
interface Sp {
  id: string
  code: string
  name: string
  spec: string
  applicable_equipment: string
  qty: number
  safety: number
  unit: string
  location: string
}
const data = ref<Sp[]>([
  {
    id: '1',
    code: 'SP00001',
    name: '主轴轴承',
    spec: '7012AC',
    applicable_equipment: '数控车床 CK6150',
    qty: 8,
    safety: 5,
    unit: '个',
    location: '备件仓-A01'
  },
  {
    id: '2',
    code: 'SP00002',
    name: '砂轮',
    spec: 'φ400×40',
    applicable_equipment: '磨床 M1432',
    qty: 3,
    safety: 5,
    unit: '片',
    location: '备件仓-A02'
  },
  {
    id: '3',
    code: 'SP00003',
    name: '冷却泵',
    spec: 'AB-100',
    applicable_equipment: '钻床 Z3050',
    qty: 2,
    safety: 2,
    unit: '台',
    location: '备件仓-B01'
  },
  {
    id: '4',
    code: 'SP00004',
    name: '刀柄',
    spec: 'BT40',
    applicable_equipment: '加工中心 VMC850',
    qty: 15,
    safety: 10,
    unit: '个',
    location: '备件仓-C01'
  }
])
const s = reactive({ keyword: '', stock_status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '库存状态',
    field: 'stock_status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '充足', value: 'ok' },
        { label: '偏低', value: 'low' },
        { label: '缺货', value: 'out' }
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
const cols: TableColumnItem<Sp>[] = [
  { prop: 'code', label: '备件编码', minWidth: 120 },
  { prop: 'name', label: '备件名称', minWidth: 140 },
  { prop: 'spec', label: '规格', minWidth: 100 },
  { prop: 'applicable_equipment', label: '适用设备', minWidth: 160 },
  { prop: 'qty', label: '库存数量', minWidth: 80, align: 'center' },
  { prop: 'safety', label: '安全库存', minWidth: 80, align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 50, align: 'center' },
  { label: '状态', minWidth: 70, slotName: 'stock_status', align: 'center' },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => !s.keyword || r.name.includes(s.keyword) || r.code.includes(s.keyword)))
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
  s.stock_status = ''
  p.currentPage = 1
}
function refresh() {
  hr()
}
function handleExport() {
  ElMessage.success('导出成功')
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ code: '', name: '', spec: '', applicable_equipment: '', qty: 0, safety: 5, unit: '个', location: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '备件编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '规格', field: 'spec' },
  { type: 'input', label: '适用设备', field: 'applicable_equipment' },
  { type: 'input-number', label: '库存数量', field: 'qty', props: { min: 0 } as any },
  { type: 'input-number', label: '安全库存', field: 'safety', props: { min: 1 } as any },
  { type: 'input', label: '单位', field: 'unit' },
  { type: 'input', label: '库位', field: 'location' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', name: '', spec: '', applicable_equipment: '', qty: 0, safety: 5, unit: '个', location: '' })
  vis.value = true
}
function openEdit(r: Sp) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), code: 'SP' + String(data.value.length + 1).padStart(5, '0'), ...form } as Sp)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function inbound(r: Sp) {
  r.qty += 1
  ElMessage.success(`入库1${r.unit}，当前库存${r.qty}`)
}
function outbound(r: Sp) {
  if (r.qty <= 0) {
    ElMessage.warning('库存不足')
    return
  }
  r.qty -= 1
  ElMessage.success(`出库1${r.unit}，当前库存${r.qty}`)
}
</script>
