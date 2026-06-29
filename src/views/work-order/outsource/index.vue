<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="outsource-search" @update:visible-fields="onSearchFieldsChange">
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
      <template #status="{ row }"
        ><el-tag
          :type="row.status === 'sent' ? 'warning' : row.status === 'processing' ? 'primary' : row.status === 'received' ? 'success' : 'info'"
          size="small"
          >{{ row.status === 'sent' ? '已发出' : row.status === 'processing' ? '加工中' : row.status === 'received' ? '已收回' : '已结算' }}</el-tag
        ></template
      >
      <template #actions="{ row }"
        ><gi-button type="edit" @click="openEdit(row)" /><el-button
          v-if="row.status === 'sent'"
          type="primary"
          link
          size="small"
          @click="confirmSend(row)"
          >确认发出</el-button
        ><el-button v-if="row.status === 'processing'" type="success" link size="small" @click="confirmReceive(row)">确认收回</el-button></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增委外工单' : '编辑委外工单'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
interface OS {
  id: string
  code: string
  material: string
  qty: number
  supplier: string
  operation: string
  send_date: string
  due_date: string
  price: number
  status: string
}
const data = ref<OS[]>([
  {
    id: '1',
    code: 'WO20250115001',
    material: '离心泵 XJP-100',
    qty: 50,
    supplier: 'XX热处理有限公司',
    operation: '工序50:热处理',
    send_date: '2025-01-15',
    due_date: '2025-01-25',
    price: 15000,
    status: 'sent'
  },
  {
    id: '2',
    code: 'WO20250110002',
    material: '齿轮箱 GBX-200',
    qty: 30,
    supplier: 'YY表面处理厂',
    operation: '工序40:镀锌',
    send_date: '2025-01-10',
    due_date: '2025-01-20',
    price: 9000,
    status: 'processing'
  },
  {
    id: '3',
    code: 'WO20250105003',
    material: '传动轴 DS-50',
    qty: 100,
    supplier: 'ZZ精密加工',
    operation: '工序30:磨削',
    send_date: '2025-01-05',
    due_date: '2025-01-12',
    price: 25000,
    status: 'received'
  }
])
const s = reactive({ keyword: '', status: '', supplier: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '已发出', value: 'sent' },
        { label: '加工中', value: 'processing' },
        { label: '已收回', value: 'received' },
        { label: '已结算', value: 'settled' }
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
const cols: TableColumnItem<OS>[] = [
  { prop: 'code', label: '工单号', minWidth: 170 },
  { prop: 'material', label: '产品', minWidth: 150 },
  { prop: 'qty', label: '数量', minWidth: 70, align: 'center' },
  { prop: 'supplier', label: '委外供应商', minWidth: 160 },
  { prop: 'operation', label: '委外工序', minWidth: 140 },
  { prop: 'send_date', label: '发出日期', minWidth: 100 },
  { prop: 'due_date', label: '交回日期', minWidth: 100 },
  { prop: 'price', label: '加工费(元)', minWidth: 110, align: 'right' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  data.value.filter(
    (r) => (!s.keyword || r.material.includes(s.keyword)) && (!s.status || r.status === s.status) && (!s.supplier || r.supplier.includes(s.supplier))
  )
)
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
  s.supplier = ''
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
const form = reactive({ code: '', material: '', qty: 1, supplier: '', operation: '', send_date: '', due_date: '', price: 0, status: 'sent' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'code', required: true },
  { type: 'input', label: '产品', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input', label: '委外供应商', field: 'supplier', required: true },
  { type: 'input', label: '委外工序', field: 'operation', required: true },
  { type: 'date-picker', label: '发出日期', field: 'send_date' },
  { type: 'date-picker', label: '交回日期', field: 'due_date' },
  { type: 'input-number', label: '加工费(元)', field: 'price', props: { min: 0 } as any }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', material: '', qty: 1, supplier: '', operation: '', send_date: '', due_date: '', price: 0, status: 'sent' })
  vis.value = true
}
function openEdit(r: OS) {
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
    data.value.unshift({ id: Date.now().toString(), ...form } as OS)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function confirmSend(r: OS) {
  r.status = 'processing'
  ElMessage.success('已确认发出')
}
function confirmReceive(r: OS) {
  r.status = 'received'
  ElMessage.success('已确认收回')
}
</script>
