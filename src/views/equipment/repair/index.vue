<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool
      ><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /><el-button
        style="margin-left: 8px"
        @click="handleExport"
        >导出</el-button
      ></template
    >
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #priority="{ row }"
        ><el-tag :type="row.priority === 'urgent' ? 'danger' : row.priority === 'high' ? 'warning' : 'info'" size="small">{{
          row.priority === 'urgent' ? '紧急' : row.priority === 'high' ? '高' : '普通'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag
          :type="row.status === 'pending' ? 'warning' : row.status === 'running' ? 'primary' : row.status === 'done' ? 'success' : 'info'"
          size="small"
          >{{ row.status === 'pending' ? '待派工' : row.status === 'running' ? '维修中' : row.status === 'done' ? '已完成' : '已验收' }}</el-tag
        ></template
      >
      <template #actions="{ row }"
        ><gi-button type="edit" @click="openEdit(row)" /><el-button
          v-if="row.status === 'pending'"
          type="primary"
          link
          size="small"
          @click="dispatch(row)"
          >派工</el-button
        ><el-button v-if="row.status === 'running'" type="success" link size="small" @click="complete(row)">完工</el-button></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增维修工单' : '编辑维修工单'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface R {
  id: string
  code: string
  equipment: string
  fault_desc: string
  priority: string
  status: string
  worker: string
  created_at: string
}
const data = ref<R[]>([
  {
    id: '1',
    code: 'WX20250115001',
    equipment: '数控车床 CK6150',
    fault_desc: '主轴异响，加工精度偏差',
    priority: 'urgent',
    status: 'running',
    worker: '张维修',
    created_at: '2025-01-15 09:00'
  },
  {
    id: '2',
    code: 'WX20250114002',
    equipment: '磨床 M1432',
    fault_desc: '砂轮磨损需更换',
    priority: 'high',
    status: 'pending',
    worker: '',
    created_at: '2025-01-14 14:00'
  },
  {
    id: '3',
    code: 'WX20250110003',
    equipment: '钻床 Z3050',
    fault_desc: '冷却液泵故障',
    priority: 'normal',
    status: 'done',
    worker: '李维修',
    created_at: '2025-01-10 10:00'
  },
  {
    id: '4',
    code: 'WX20250112004',
    equipment: '加工中心 VMC850',
    fault_desc: '刀库换刀异常',
    priority: 'high',
    status: 'verified',
    worker: '王维修',
    created_at: '2025-01-12 08:00'
  }
])
const s = reactive({ keyword: '', status: '', priority: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待派工', value: 'pending' },
        { label: '维修中', value: 'running' },
        { label: '已完成', value: 'done' },
        { label: '已验收', value: 'verified' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '紧急', value: 'urgent' },
        { label: '高', value: 'high' },
        { label: '普通', value: 'normal' }
      ]
    }
  } as any
]
const cols: TableColumnItem<R>[] = [
  { prop: 'code', label: '维修单号', minWidth: 170 },
  { prop: 'equipment', label: '设备', minWidth: 160 },
  { prop: 'fault_desc', label: '故障描述', minWidth: 200 },
  { label: '优先级', minWidth: 70, slotName: 'priority', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'worker', label: '维修人', minWidth: 80 },
  { prop: 'created_at', label: '创建时间', minWidth: 150 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  data.value.filter(
    (r) => (!s.keyword || r.equipment.includes(s.keyword)) && (!s.status || r.status === s.status) && (!s.priority || r.priority === s.priority)
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
  s.priority = ''
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
const form = reactive({ code: '', equipment: '', fault_desc: '', priority: 'normal', status: 'pending', worker: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '维修单号', field: 'code', required: true },
  { type: 'input', label: '设备', field: 'equipment', required: true },
  { type: 'input', label: '故障描述', field: 'fault_desc', required: true, props: { type: 'textarea', rows: 3 } as any },
  {
    type: 'select-v2',
    label: '优先级',
    field: 'priority',
    required: true,
    props: {
      options: [
        { label: '紧急', value: 'urgent' },
        { label: '高', value: 'high' },
        { label: '普通', value: 'normal' }
      ]
    } as any
  },
  { type: 'input', label: '维修人', field: 'worker' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', equipment: '', fault_desc: '', priority: 'normal', status: 'pending', worker: '' })
  vis.value = true
}
function openEdit(r: R) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.equipment) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({
      id: Date.now().toString(),
      code: 'WX' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(data.value.length + 1).padStart(4, '0'),
      created_at: new Date().toLocaleString(),
      ...form
    } as R)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function dispatch(r: R) {
  r.status = 'running'
  r.worker = r.worker || '张维修'
  ElMessage.success('已派工')
}
function complete(r: R) {
  r.status = 'done'
  ElMessage.success('维修完成，待验收')
}
</script>
