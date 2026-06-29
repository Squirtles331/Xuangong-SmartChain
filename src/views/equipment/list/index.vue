<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="list-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>
    <div class="stats-row">
      <el-card shadow="hover" class="stat-card">
        <div class="stat-value">{{ eqs.length }}</div>
        <div class="stat-label">设备总数</div>
      </el-card>
      <el-card shadow="hover" class="stat-card stat-running">
        <div class="stat-value">{{ runningCount }}</div>
        <div class="stat-label">运行中</div>
      </el-card>
      <el-card shadow="hover" class="stat-card stat-idle">
        <div class="stat-value">{{ idleCount }}</div>
        <div class="stat-label">空闲</div>
      </el-card>
      <el-card shadow="hover" class="stat-card stat-repair">
        <div class="stat-value">{{ repairCount }}</div>
        <div class="stat-label">维修/保养</div>
      </el-card>
    </div>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="EQUIPMENT_STATUS" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
        <el-button type="warning" link size="small" @click="$router.push(`/equipment/check-plan/${row.id}`)">点检</el-button>
        <el-button type="success" link size="small" @click="$router.push(`/equipment/maintain-plan/${row.id}`)">保养</el-button>
        <gi-button type="delete" @click="del(row.id)" />
      </template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增设备' : '编辑设备'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { EQUIPMENT_STATUS } from '@/common/status-maps'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'

interface Eq {
  id: string
  code: string
  name: string
  model: string
  workshop: string
  status: string
  purchase_date: string
  commission_date: string
}
const eqs = ref<Eq[]>([
  {
    id: '1',
    code: 'EQ0000000001',
    name: '数控车床',
    model: 'CK6150',
    workshop: '机加工一车间',
    status: 'running',
    purchase_date: '2023-03-15',
    commission_date: '2023-04-01'
  },
  {
    id: '2',
    code: 'EQ0000000002',
    name: '数控车床',
    model: 'CK6150',
    workshop: '机加工一车间',
    status: 'idle',
    purchase_date: '2023-03-15',
    commission_date: '2023-04-01'
  },
  {
    id: '3',
    code: 'EQ0000000003',
    name: '钻床',
    model: 'Z3050',
    workshop: '机加工一车间',
    status: 'running',
    purchase_date: '2022-06-10',
    commission_date: '2022-07-01'
  },
  {
    id: '4',
    code: 'EQ0000000004',
    name: '磨床',
    model: 'M1432',
    workshop: '机加工一车间',
    status: 'repair',
    purchase_date: '2021-09-20',
    commission_date: '2021-10-15'
  },
  {
    id: '5',
    code: 'EQ0000000005',
    name: '加工中心',
    model: 'VMC850',
    workshop: '机加工二车间',
    status: 'running',
    purchase_date: '2024-01-10',
    commission_date: '2024-02-01'
  }
])
const s = reactive({ keyword: '', workshop: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '车间',
    field: 'workshop',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' }
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
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '保养', value: 'maintenance' },
        { label: '维修', value: 'repair' }
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
const cols: TableColumnItem<Eq>[] = [
  { prop: 'code', label: '设备编码', width: 150 },
  { prop: 'name', label: '设备名称', width: 120 },
  { prop: 'model', label: '型号', width: 100 },
  { prop: 'workshop', label: '所属车间', width: 140 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'purchase_date', label: '购置日期', width: 110 },
  { prop: 'commission_date', label: '投产日期', width: 110 },
  { label: '操作', minWidth: 280, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const runningCount = computed(() => eqs.value.filter((e) => e.status === 'running').length)
const idleCount = computed(() => eqs.value.filter((e) => e.status === 'idle').length)
const repairCount = computed(() => eqs.value.filter((e) => e.status === 'repair' || e.status === 'maintenance').length)
const fd = computed(() =>
  eqs.value.filter(
    (e) =>
      (!s.keyword || e.name.includes(s.keyword) || e.code.includes(s.keyword)) &&
      (!s.workshop || e.workshop === s.workshop) &&
      (!s.status || e.status === s.status)
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
  s.workshop = ''
  s.status = ''
  p.currentPage = 1
}
function handleExport() {
  ElMessage.success('导出成功')
}
function refresh() {
  hr()
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ code: '', name: '', model: '', workshop: '机加工一车间', status: 'running', purchase_date: '', commission_date: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '设备编码', field: 'code', required: true },
  { type: 'input', label: '设备名称', field: 'name', required: true },
  { type: 'input', label: '型号', field: 'model' },
  {
    type: 'select-v2',
    label: '车间',
    field: 'workshop',
    required: true,
    props: {
      options: [
        { label: '机加工一车间', value: '机加工一车间' },
        { label: '机加工二车间', value: '机加工二车间' },
        { label: '装配车间', value: '装配车间' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '保养', value: 'maintenance' },
        { label: '维修', value: 'repair' }
      ]
    } as any
  },
  { type: 'date-picker', label: '购置日期', field: 'purchase_date' },
  { type: 'date-picker', label: '投产日期', field: 'commission_date' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', name: '', model: '', workshop: '机加工一车间', status: 'running', purchase_date: '', commission_date: '' })
  vis.value = true
}
function openEdit(r: Eq) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.code || !form.name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    eqs.value.unshift({ id: Date.now().toString(), ...form } as Eq)
  } else {
    const i = eqs.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(eqs.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      eqs.value = eqs.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
<style scoped>
.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.stat-card {
  flex: 1;
  text-align: center;
  cursor: default;
}
.stat-card :deep(.el-card__body) {
  padding: 16px 12px;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
.stat-running .stat-value {
  color: #67c23a;
}
.stat-idle .stat-value {
  color: #909399;
}
.stat-repair .stat-value {
  color: #e6a23c;
}
</style>
