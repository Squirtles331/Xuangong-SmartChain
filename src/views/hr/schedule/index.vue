<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #shift="{ row }">
        <el-tag :type="row.shift === 'day' ? 'warning' : row.shift === 'night' ? 'primary' : 'info'" size="small">{{
          row.shift === 'day' ? '白班' : row.shift === 'night' ? '夜班' : '中班'
        }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <ScheduleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import ScheduleFormDialog, { type ScheduleFormModel } from './ScheduleFormDialog.vue'

interface ScheduleRow {
  id: string
  team: string
  shift: string
  members: string
  leader: string
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ScheduleFormModel>(createDefaultFormModel())

const columns: TableColumnItem<ScheduleRow>[] = [
  { prop: 'team', label: '班组', minWidth: 80 },
  { label: '班次', minWidth: 60, slotName: 'shift', align: 'center' },
  { prop: 'members', label: '成员', minWidth: 180 },
  { prop: 'leader', label: '班组长', minWidth: 80 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const mockData = ref<ScheduleRow[]>([
  { id: '1', team: '甲班', shift: 'day', members: '李四,王五,赵六', leader: '李四' },
  { id: '2', team: '乙班', shift: 'night', members: '孙八,周九,吴十', leader: '孙八' }
])

const { tableData, pagination, loading, refresh, onDelete } = useTable<ScheduleRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    return { list: mockData.value.slice(start, start + size), total: mockData.value.length }
  },
  deleteAPI: (ids) =>
    Promise.all(
      ids.map((id) => {
        mockData.value = mockData.value.filter((e) => e.id !== id)
      })
    )
})

function createDefaultFormModel(): ScheduleFormModel {
  return { id: '', team: '', shift: 'day', members: '', leader: '' }
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ScheduleRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.team) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    mockData.value.unshift({ ...formModel.value, id: Date.now().toString() } as ScheduleRow)
  } else {
    const i = mockData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(mockData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: ScheduleRow) {
  onDelete(row)
}
</script>
