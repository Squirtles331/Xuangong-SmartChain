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

    <TableSetting title="合同列表" :columns="columns" @refresh="refresh">
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
          <template #amount="{ row }">
            {{ row.amount.toLocaleString('zh-CN') }}
          </template>

          <template #status="{ row }">
            <el-tag :type="statusTagType[row.status]">
              {{ statusTextMap[row.status] }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ContractFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { deleteContract, getContractList, saveContract, type Contract, type ContractQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import ContractFormDialog, { type ContractFormModel } from './ContractFormDialog.vue'

const statusTextMap: Record<Contract['status'], string> = {
  draft: '草稿',
  active: '生效中',
  expired: '已过期',
  terminated: '已终止'
}

const statusTagType: Record<Contract['status'], '' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
  draft: 'info',
  active: 'success',
  expired: 'warning',
  terminated: 'danger'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '草稿', value: 'draft' },
        { label: '生效中', value: 'active' },
        { label: '已过期', value: 'expired' },
        { label: '已终止', value: 'terminated' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Contract>[] = [
  { prop: 'code', label: '合同编号', minWidth: 160 },
  { prop: 'customer', label: '客户名称', minWidth: 160 },
  { label: '合同金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
  { prop: 'sign_date', label: '签订日期', minWidth: 120 },
  { prop: 'start_date', label: '生效日期', minWidth: 120 },
  { prop: 'end_date', label: '到期日期', minWidth: 120 },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { label: '操作', minWidth: 160, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  keyword: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ContractFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Contract>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: ContractQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      status: (queryParams.status || undefined) as Contract['status'] | undefined
    }
    const response = await getContractList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteContract(id)))
})

function createDefaultFormModel(): ContractFormModel {
  return {
    id: '',
    code: '',
    customer: '',
    amount: 0,
    sign_date: '',
    start_date: '',
    end_date: '',
    status: 'draft'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: Contract) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.customer) {
    ElMessage.warning('请填写合同编号和客户名称')
    return
  }

  await saveContract({
    ...formModel.value,
    status: formModel.value.status as Contract['status']
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
