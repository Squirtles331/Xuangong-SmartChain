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

    <TableSetting title="商机列表" :columns="columns" @refresh="refresh">
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

          <template #stage="{ row }">
            <el-tag :type="stageTagType[row.stage]">
              {{ stageTextMap[row.stage] }}
            </el-tag>
          </template>

          <template #probability="{ row }">
            <el-progress
              :percentage="row.probability"
              :stroke-width="8"
              :color="row.probability >= 70 ? '#67c23a' : row.probability >= 40 ? '#e6a23c' : '#909399'"
            />
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
            <el-button type="success" link size="small" @click="handleConvert(row)">转订单</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <OpportunityFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { convertOpportunity, deleteOpportunity, getOpportunityList, saveOpportunity, type Opportunity, type OpportunityQuery } from '@/api/crm'
import { useTable } from '@/hooks/useTable'
import OpportunityFormDialog, { type OpportunityFormModel } from './OpportunityFormDialog.vue'

const stageTextMap: Record<Opportunity['stage'], string> = {
  initial: '初步接触',
  solution: '方案制定',
  quotation: '报价中',
  won: '已成交'
}

const stageTagType: Record<Opportunity['stage'], '' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
  initial: 'info',
  solution: 'warning',
  quotation: 'primary',
  won: 'success'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' },
  {
    type: 'select-v2',
    label: '阶段',
    field: 'stage',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '初步接触', value: 'initial' },
        { label: '方案制定', value: 'solution' },
        { label: '报价中', value: 'quotation' },
        { label: '已成交', value: 'won' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Opportunity>[] = [
  { prop: 'customer', label: '客户名称', minWidth: 160 },
  { prop: 'product', label: '商机描述', minWidth: 220 },
  { label: '预计金额(元)', minWidth: 130, align: 'right', slotName: 'amount' },
  { label: '阶段', minWidth: 120, align: 'center', slotName: 'stage' },
  { label: '赢单率', minWidth: 160, slotName: 'probability' },
  { prop: 'owner', label: '负责人', minWidth: 120 },
  { prop: 'close_date', label: '预计成交日期', minWidth: 140 },
  { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  keyword: '',
  stage: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<OpportunityFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Opportunity>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: OpportunityQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      stage: (queryParams.stage || undefined) as Opportunity['stage'] | undefined
    }
    const response = await getOpportunityList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteOpportunity(id)))
})

function createDefaultFormModel(): OpportunityFormModel {
  return {
    id: '',
    customer: '',
    product: '',
    amount: 0,
    stage: 'initial',
    probability: 20,
    owner: '',
    close_date: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    stage: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: Opportunity) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.customer || !formModel.value.product) {
    ElMessage.warning('请填写客户名称和商机描述')
    return
  }

  await saveOpportunity({
    ...formModel.value,
    stage: formModel.value.stage as Opportunity['stage']
  })
  dialogVisible.value = false
  await refresh()
}

async function handleConvert(row: Opportunity) {
  await convertOpportunity(row.id)
  ElMessage.success('商机已转为销售订单')
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
