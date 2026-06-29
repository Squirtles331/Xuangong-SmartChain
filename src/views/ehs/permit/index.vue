<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="permit-search" @update:visible-fields="onSearchFieldsChange">
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
      <template #type="{ row }"
        ><el-tag size="small">{{
          row.type === 'hot' ? '动火' : row.type === 'height' ? '高处' : row.type === 'confined' ? '受限空间' : '临时用电'
        }}</el-tag></template
      >
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="PERMIT_STATUS" />
      </template>
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增作业票' : '编辑作业票'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

const PERMIT_STATUS = [
  { value: 'pending', label: '待审批', type: 'warning' as const },
  { value: 'approved', label: '已批准', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]
interface Pm {
  id: string
  code: string
  type: string
  location: string
  applicant: string
  apply_date: string
  status: string
}
const data = ref<Pm[]>([
  { id: '1', code: 'ZYP20250115001', type: 'hot', location: '机加工一车间', applicant: '李四', apply_date: '2025-01-15', status: 'approved' },
  { id: '2', code: 'ZYP20250116001', type: 'height', location: '装配车间', applicant: '王五', apply_date: '2025-01-16', status: 'pending' }
])
const s = reactive({ keyword: '', type: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '动火', value: 'hot' },
        { label: '高处', value: 'height' },
        { label: '受限空间', value: 'confined' },
        { label: '临时用电', value: 'electric' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待审批', value: 'pending' },
        { label: '已批准', value: 'approved' },
        { label: '已关闭', value: 'closed' }
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
const cols: TableColumnItem<Pm>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'location', label: '作业位置', width: 140 },
  { prop: 'applicant', label: '申请人', width: 80 },
  { prop: 'apply_date', label: '日期', width: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  data.value.filter((e) => (!s.keyword || e.location.includes(s.keyword)) && (!s.type || e.type === s.type) && (!s.status || e.status === s.status))
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
  s.type = ''
  s.status = ''
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
const form = reactive({ code: '', type: 'hot', location: '', applicant: '', apply_date: '', status: 'pending' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '编号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '动火', value: 'hot' },
        { label: '高处', value: 'height' },
        { label: '受限空间', value: 'confined' },
        { label: '临时用电', value: 'electric' }
      ]
    } as any
  },
  { type: 'input', label: '作业位置', field: 'location', required: true },
  { type: 'input', label: '申请人', field: 'applicant' },
  { type: 'date-picker', label: '日期', field: 'apply_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待审批', value: 'pending' },
        { label: '已批准', value: 'approved' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', type: 'hot', location: '', applicant: '', apply_date: '', status: 'pending' })
  vis.value = true
}
function openEdit(r: Pm) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.location) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      code: 'ZYP' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      ...form
    } as Pm)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      data.value = data.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
