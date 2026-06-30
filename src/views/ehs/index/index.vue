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

    <TableSetting title="隐患台账" :columns="columns" @refresh="refresh">
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
            <StatusTag :value="row.level" :options="riskLevelOptions" />
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="hazardStatusOptions" />
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <EhsIndexFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { deleteEhsHazard, getEhsHazardList, saveEhsHazard, type EhsHazard, type EhsHazardQuery } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import EhsIndexFormDialog, { type EhsHazardFormModel } from './EhsIndexFormDialog.vue'

const riskLevelOptions = [
  { value: 'major', label: '重大', type: 'danger' as const },
  { value: 'moderate', label: '一般', type: 'warning' as const },
  { value: 'minor', label: '低风险', type: 'info' as const }
]

const hazardStatusOptions = [
  { value: 'open', label: '待整改', type: 'danger' as const },
  { value: 'processing', label: '整改中', type: 'warning' as const },
  { value: 'closed', label: '已关闭', type: 'success' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '风险等级',
    field: 'level',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '重大', value: 'major' },
        { label: '一般', value: 'moderate' },
        { label: '低风险', value: 'minor' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待整改', value: 'open' },
        { label: '整改中', value: 'processing' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EhsHazard>[] = [
  { prop: 'code', label: '隐患编号', minWidth: 160 },
  { prop: 'location', label: '位置', minWidth: 140 },
  { prop: 'desc', label: '隐患描述', minWidth: 220 },
  { label: '风险等级', minWidth: 100, slotName: 'level', align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'finder', label: '发现人', minWidth: 100 },
  { prop: 'found_at', label: '发现日期', minWidth: 120 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  level: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<EhsHazardFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EhsHazard>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EhsHazardQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      level: (queryParams.level || undefined) as EhsHazard['level'] | undefined,
      status: (queryParams.status || undefined) as EhsHazard['status'] | undefined
    }
    const response = await getEhsHazardList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEhsHazard(id)))
})

function createDefaultFormModel(): EhsHazardFormModel {
  return {
    id: '',
    code: '',
    location: '',
    desc: '',
    level: 'moderate',
    status: 'open',
    finder: '',
    found_at: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    level: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EhsHazard) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.location || !formModel.value.desc) {
    ElMessage.warning('请填写位置和隐患描述')
    return
  }

  await saveEhsHazard({
    ...formModel.value,
    level: formModel.value.level as EhsHazard['level'],
    status: formModel.value.status as EhsHazard['status']
  })
  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
