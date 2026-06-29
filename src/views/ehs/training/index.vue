<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
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

    <TrainingFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getEhsTrainingList } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import TrainingFormDialog, { type TrainingFormModel } from './TrainingFormDialog.vue'

interface TrainingRow {
  id: string
  title: string
  trainer: string
  trainees: string
  plan_date: string
  status: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ title: '', status: '' })

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<TrainingFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '培训名称', field: 'title' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待培训', value: 'pending' },
        { label: '已完成', value: 'completed' },
        { label: '已过期', value: 'expired' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const columns: TableColumnItem<TrainingRow>[] = [
  { prop: 'title', label: '培训主题', minWidth: 220 },
  { prop: 'trainer', label: '培训人', minWidth: 120 },
  { prop: 'trainees', label: '参训人员', minWidth: 180 },
  { prop: 'plan_date', label: '计划日期', minWidth: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<TrainingRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getEhsTrainingList({
      page,
      page_size: size,
      title: searchForm.value.title || undefined,
      status: searchForm.value.status || undefined
    })
    return { list: res.data.items, total: res.data.total }
  }
})

function createDefaultFormModel(): TrainingFormModel {
  return { id: '', title: '', trainer: '', trainees: '', plan_date: '', status: 'pending' }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { title: '', status: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: TrainingRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.title) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    tableData.value.unshift({ ...formModel.value, id: Date.now().toString() } as TrainingRow)
  } else {
    const i = tableData.value.findIndex((e) => e.id === formModel.value.id)
    if (i > -1) Object.assign(tableData.value[i], formModel.value)
  }

  dialogVisible.value = false
  await refresh()
}

function complete(row: TrainingRow) {
  row.status = 'completed'
  ElMessage.success('培训完成')
}
</script>
