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

    <TableSetting title="应急预案" :columns="columns" @refresh="refresh">
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
          <template #level="{ row }">
            <el-tag :type="row.level === 'I' ? 'danger' : row.level === 'II' ? 'warning' : 'info'"> {{ row.level }}级响应 </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button type="primary" link size="small" @click="runDrill(row)">演练</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <EmergencyFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getEhsEmergencyList, runEhsEmergencyDrill, saveEhsEmergency, type EhsEmergencyPlan, type EhsEmergencyQuery } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import EmergencyFormDialog, { type EmergencyFormModel } from './EmergencyFormDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '预案名称', field: 'name' },
  {
    type: 'select-v2',
    label: '事故类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '火灾', value: '火灾' },
        { label: '危化品', value: '危化品' },
        { label: '机械', value: '机械' },
        { label: '电力', value: '电力' },
        { label: '其他', value: '其他' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EhsEmergencyPlan>[] = [
  { prop: 'name', label: '预案名称', minWidth: 220 },
  { prop: 'type', label: '事故类型', minWidth: 120 },
  { label: '响应等级', minWidth: 100, slotName: 'level', align: 'center' },
  { prop: 'responsible', label: '负责人', minWidth: 160 },
  { prop: 'last_drill', label: '最近演练日期', minWidth: 140 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  name: '',
  type: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EmergencyFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh } = useTable<EhsEmergencyPlan>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EhsEmergencyQuery = {
      pageNum: page,
      pageSize: size,
      name: queryParams.name || undefined,
      type: (queryParams.type || undefined) as EhsEmergencyPlan['type'] | undefined
    }
    const response = await getEhsEmergencyList(params)
    return response.data
  }
})

function createDefaultFormModel(): EmergencyFormModel {
  return {
    id: '',
    name: '',
    type: '火灾',
    level: 'II',
    responsible: '',
    last_drill: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    name: '',
    type: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EhsEmergencyPlan) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.name) {
    ElMessage.warning('请填写预案名称')
    return
  }

  await saveEhsEmergency({
    ...formModel.value,
    type: formModel.value.type as EhsEmergencyPlan['type'],
    level: formModel.value.level as EhsEmergencyPlan['level']
  })
  dialogVisible.value = false
  await refresh()
}

async function runDrill(row: EhsEmergencyPlan) {
  await runEhsEmergencyDrill(row.id)
  ElMessage.success(`演练完成: ${row.name}`)
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
