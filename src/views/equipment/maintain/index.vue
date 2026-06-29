<template>
  <gi-page-layout>
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @reset="handleReset" @search="handleSearch" />
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #type="{ row }">
        <el-tag :type="row.type === 'daily' ? 'info' : row.type === 'weekly' ? 'warning' : 'primary'" size="small">
          {{ row.type === 'daily' ? '日常' : row.type === 'weekly' ? '周保养' : '大修' }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'done' ? 'success' : 'danger'" size="small">
          {{ row.status === 'pending' ? '待执行' : row.status === 'done' ? '已完成' : '已逾期' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="execute(row)">执行</el-button>
        <gi-button type="edit" @click="openEdit(row)" />
      </template>
    </gi-table>

    <MaintainFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />

    <el-dialog v-model="execVis" title="执行保养" width="500px">
      <el-table :data="items" border size="small">
        <el-table-column prop="name" label="保养项目" />
        <el-table-column label="结果" width="200">
          <template #default="{ row }">
            <el-radio-group v-model="row.result" size="small">
              <el-radio value="done">已完成</el-radio>
              <el-radio value="issue">有问题</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <el-form label-width="80px" style="margin-top: 12px">
        <el-form-item label="备注">
          <el-input v-model="execForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="execVis = false">取消</el-button>
        <el-button type="primary" @click="confirmExec">提交</el-button>
      </template>
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import MaintainFormDialog, { type MaintainFormModel } from './MaintainFormDialog.vue'

interface MaintainRow {
  id: string
  code: string
  equipment: string
  type: string
  plan_date: string
  executor: string
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<MaintainFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '设备名称', field: 'keyword', props: { placeholder: '请输入设备名称' } } as any,
  {
    type: 'select-v2',
    label: '保养类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '日常', value: 'daily' },
        { label: '周保', value: 'weekly' },
        { label: '大修', value: 'overhaul' }
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
        { label: '待执行', value: 'pending' },
        { label: '已完成', value: 'done' },
        { label: '已逾期', value: 'overdue' }
      ]
    }
  } as any
]

const cols: TableColumnItem<MaintainRow>[] = [
  { prop: 'code', label: '计划编号', width: 160 },
  { prop: 'equipment', label: '设备', minWidth: 160 },
  { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
  { prop: 'plan_date', label: '计划日期', width: 110 },
  { prop: 'executor', label: '执行人', width: 100 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<MaintainRow>({
  rowKey: 'id',
  listAPI: async () => {
    return { list: [], total: 0 }
  }
})

function createDefaultFormModel(): MaintainFormModel {
  return {
    id: '',
    code: '',
    equipment: '',
    type: 'daily',
    plan_date: '',
    executor: '',
    status: 'pending'
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', type: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: MaintainRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    equipment: row.equipment,
    type: row.type,
    plan_date: row.plan_date,
    executor: row.executor,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

const execVis = ref(false)
const execForm = ref({ remark: '' })
const execPlanId = ref('')
const items = ref([
  { name: '清洁设备表面', result: 'done' },
  { name: '检查润滑油', result: 'done' },
  { name: '紧固螺栓', result: 'done' },
  { name: '更换滤芯', result: 'done' },
  { name: '电气检查', result: 'done' }
])

function execute(r: MaintainRow) {
  execPlanId.value = r.id
  execForm.value.remark = ''
  items.value.forEach((item) => (item.result = 'done'))
  execVis.value = true
}

function confirmExec() {
  const item = tableData.value.find((p) => p.id === execPlanId.value)
  if (item) item.status = 'done'
  execVis.value = false
  ElMessage.success('保养完成')
}
</script>
