<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="培训记录" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #status="{ row }">
            <el-tag :type="row.status === 'completed' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'completed' ? '已完成' : row.status === 'pending' ? '待培训' : '已过期' }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="complete(row)">完成</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <TrainingFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { completeEhsTraining, getEhsTrainingList, saveEhsTraining, type EhsTraining, type EhsTrainingQuery } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import TrainingFormDialog, { type TrainingFormModel } from './TrainingFormDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '培训名称', field: 'title' },
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
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EhsTraining>[] = [
  { prop: 'title', label: '培训主题', minWidth: 220 },
  { prop: 'trainer', label: '培训人', minWidth: 140 },
  { prop: 'trainees', label: '参训人员', minWidth: 220 },
  { prop: 'plan_date', label: '计划日期', minWidth: 120 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  title: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<TrainingFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<EhsTraining>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EhsTrainingQuery = {
      pageNum: page,
      pageSize: size,
      title: queryParams.title || undefined,
      status: (queryParams.status || undefined) as EhsTraining['status'] | undefined
    }
    const response = await getEhsTrainingList(params)
    return response.data
  }
})

function createDefaultFormModel(): TrainingFormModel {
  return {
    id: '',
    title: '',
    trainer: '',
    trainees: '',
    plan_date: '',
    status: 'pending'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    title: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EhsTraining) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.title) {
    ElMessage.warning('请填写培训主题')
    return
  }

  await saveEhsTraining({
    ...formModel.value,
    status: formModel.value.status as EhsTraining['status']
  })
  dialogVisible.value = false
  await refresh()
}

async function complete(row: EhsTraining) {
  await completeEhsTraining(row.id)
  ElMessage.success('培训完成')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
