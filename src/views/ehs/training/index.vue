<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="training-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="sf" v-model="s" :columns="visibleSearchColumns" search @search="hs" @reset="hr" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>
    <gi-table :columns="cols" :data="pagedRecords" :pagination="pagination" border stripe>
      <template #status="{ row }">
        <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'" size="small">
          {{ row.status === 'completed' ? '已完成' : row.status === 'pending' ? '待培训' : '已过期' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="complete(row)">完成</el-button>
      </template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增培训记录' : '编辑培训记录'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'

interface TR {
  id: string
  title: string
  trainer: string
  trainees: string
  plan_date: string
  status: string
}

const s = ref({ title: '', status: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '培训名称', field: 'title' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待培训', value: 'pending' },
        { label: '已完成', value: 'completed' },
        { label: '已过期', value: 'expired' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => sc)
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const records = ref<TR[]>([
  { id: '1', title: '三级安全教育-新员工入职', trainer: '安全主管-陈工', trainees: '孙八,周九,吴十', plan_date: '2025-01-15', status: 'completed' },
  { id: '2', title: '消防演练培训', trainer: '消防队长-刘工', trainees: '全员', plan_date: '2025-02-01', status: 'pending' },
  { id: '3', title: '危化品操作培训', trainer: '安全主管-陈工', trainees: '李四,王五,赵六', plan_date: '2024-11-20', status: 'expired' }
])

const filteredRecords = computed(() => {
  return records.value.filter((r) => {
    const matchTitle = !s.value.title || r.title.includes(s.value.title)
    const matchStatus = !s.value.status || r.status === s.value.status
    return matchTitle && matchStatus
  })
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => filteredRecords.value.length)
}) as any

const pagedRecords = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredRecords.value.slice(start, end)
})

function hs() {
  pagination.value.currentPage = 1
}
function hr() {
  s.value = { title: '', status: '' }
  pagination.value.currentPage = 1
}

const cols: TableColumnItem<TR>[] = [
  { prop: 'title', label: '培训主题', minWidth: 220 },
  { prop: 'trainer', label: '培训人', minWidth: 120 },
  { prop: 'trainees', label: '参训人员', minWidth: 180 },
  { prop: 'plan_date', label: '计划日期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ title: '', trainer: '', trainees: '', plan_date: '', status: 'pending' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '培训主题', field: 'title', required: true },
  { type: 'input', label: '培训人', field: 'trainer', required: true },
  { type: 'input', label: '参训人员', field: 'trainees', props: { placeholder: '多人用逗号分隔' } as any },
  { type: 'date-picker', label: '计划日期', field: 'plan_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待培训', value: 'pending' },
        { label: '已完成', value: 'completed' },
        { label: '已过期', value: 'expired' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { title: '', trainer: '', trainees: '', plan_date: '', status: 'pending' })
  vis.value = true
}
function openEdit(r: TR) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.title) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    records.value.unshift({ id: Date.now().toString(), ...form } as TR)
  } else {
    const i = records.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(records.value[i], form)
  }
  return true
}
function complete(r: TR) {
  r.status = 'completed'
  ElMessage.success('培训完成')
}
function refresh() {
  pagination.value.currentPage = 1
}
function handleExport() {
  ElMessage.success('导出成功')
}
</script>
