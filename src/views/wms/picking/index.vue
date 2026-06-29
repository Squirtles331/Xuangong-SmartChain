<template>
  <gi-page-layout :bordered="true">
    <template #header><SearchSetting :columns="allSearchColumns" storage-key="picking-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool
      ><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /><el-button
        style="margin-left: 8px"
        @click="handleExport"
        >导出</el-button
      ></template
    >
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }"
        ><el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'picked' ? 'primary' : 'success'" size="small">{{
          row.status === 'pending' ? '待拣货' : row.status === 'picked' ? '已拣货' : '已出库'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增领料单' : '编辑领料单'" width="600px">
      <SearchSetting :columns="allSearchColumns" storage-key="picking-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Pick {
  id: string
  wo_code: string
  material: string
  status: string
  created_at: string
}
const data = ref<Pick[]>([
  { id: '1', wo_code: 'WO202501150001', material: '离心泵 XJP-100', status: 'pending', created_at: '2025-01-15' },
  { id: '2', wo_code: 'WO202501150002', material: '齿轮箱 GBX-200', status: 'pending', created_at: '2025-01-15' }
])
const s = reactive({ wo_code: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'wo_code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待拣货', value: 'pending' },
        { label: '已拣货', value: 'picked' },
        { label: '已出库', value: 'completed' }
      ]
    }
  } as any
]
const cols: TableColumnItem<Pick>[] = [
  { prop: 'wo_code', label: '工单号', width: 170 },
  { prop: 'material', label: '产品', minWidth: 160 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建时间', width: 110 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() => data.value.filter((r) => (!s.wo_code || r.wo_code.includes(s.wo_code)) && (!s.status || r.status === s.status)))
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
const form = reactive({ wo_code: '', material: '', status: 'pending' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'wo_code', required: true },
  { type: 'input', label: '产品', field: 'material', required: true },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待拣货', value: 'pending' },
        { label: '已拣货', value: 'picked' },
        { label: '已出库', value: 'completed' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { wo_code: '', material: '', status: 'pending' })
  vis.value = true
}
function openEdit(r: Pick) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.wo_code) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), created_at: new Date().toISOString().slice(0, 10), ...form } as Pick)
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
