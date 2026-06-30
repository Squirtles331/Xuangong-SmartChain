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

    <TableSetting title="作业票管理" :columns="columns" @refresh="refresh">
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
          <template #type="{ row }">
            <el-tag size="small">
              {{ permitTypeTextMap[row.type] }}
            </el-tag>
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="permitStatusOptions" />
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <PermitFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { deleteEhsPermit, getEhsPermitList, saveEhsPermit, type EhsPermit, type EhsPermitQuery } from '@/api/ehs'
import { useTable } from '@/hooks/useTable'
import PermitFormDialog, { type PermitFormModel } from './PermitFormDialog.vue'

const permitTypeTextMap: Record<EhsPermit['type'], string> = {
  hot: '动火',
  height: '高处',
  confined: '受限空间',
  electric: '临时用电'
}

const permitStatusOptions = [
  { value: 'pending', label: '待审批', type: 'warning' as const },
  { value: 'approved', label: '已批准', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '动火', value: 'hot' },
        { label: '高处', value: 'height' },
        { label: '受限空间', value: 'confined' },
        { label: '临时用电', value: 'electric' }
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
        { label: '待审批', value: 'pending' },
        { label: '已批准', value: 'approved' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<EhsPermit>[] = [
  { prop: 'code', label: '作业票编号', minWidth: 160 },
  { label: '类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'location', label: '作业位置', minWidth: 160 },
  { prop: 'applicant', label: '申请人', minWidth: 100 },
  { prop: 'apply_date', label: '申请日期', minWidth: 120 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  type: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PermitFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<EhsPermit>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: EhsPermitQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: (queryParams.type || undefined) as EhsPermit['type'] | undefined,
      status: (queryParams.status || undefined) as EhsPermit['status'] | undefined
    }
    const response = await getEhsPermitList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEhsPermit(id)))
})

function createDefaultFormModel(): PermitFormModel {
  return {
    id: '',
    code: '',
    type: 'hot',
    location: '',
    applicant: '',
    apply_date: '',
    status: 'pending'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: EhsPermit) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.location) {
    ElMessage.warning('请填写作业位置')
    return
  }

  await saveEhsPermit({
    ...formModel.value,
    type: formModel.value.type as EhsPermit['type'],
    status: formModel.value.status as EhsPermit['status']
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
