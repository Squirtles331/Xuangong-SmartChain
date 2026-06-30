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
      <gi-button type="add" @click="openAdd">新建变更单</gi-button>
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="ECN 变更单列表" :columns="columns" @refresh="refresh">
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
          <template #urgency="{ row }">
            <StatusTag :value="row.urgency" :options="ecnUrgencyOptions" />
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="ecnStatusOptions" />
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="viewImpact(row)">影响分析</el-button>
            <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitEcn(row)">提交审批</el-button>
            <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="executeEcn(row)">执行</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ECNFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <ECNImpactDialog v-model:visible="impactVisible" v-model:data="impactData" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { createECN, getECNList, updateECN, type ECNListQuery, type ECNOrder } from '@/api/ecn'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { useTable } from '@/hooks/useTable'
import ECNFormDialog, { type ECNFormModel } from './ECNFormDialog.vue'
import ECNImpactDialog, { type ECNImpactModel } from './ECNImpactDialog.vue'

const ecnUrgencyOptions = [
  { value: 'urgent', label: '紧急', type: 'danger' as const },
  { value: 'normal', label: '普通', type: 'warning' as const },
  { value: 'planned', label: '计划', type: 'info' as const }
]

const ecnStatusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'approved', label: '已审批', type: 'primary' as const },
  { value: 'executed', label: '已执行', type: 'success' as const },
  { value: 'verified', label: '已验证', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

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
        { label: '已审批', value: 'approved' },
        { label: '已执行', value: 'executed' },
        { label: '已验证', value: 'verified' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<ECNOrder>[] = [
  { prop: 'code', label: '变更单号', minWidth: 170 },
  { prop: 'change_type', label: '变更类型', minWidth: 140 },
  { prop: 'material', label: '变更对象', minWidth: 180 },
  { prop: 'current_version', label: '当前版本', minWidth: 120 },
  { label: '紧急程度', minWidth: 100, slotName: 'urgency', align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'applicant', label: '申请人', minWidth: 100 },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ECNFormModel>(createDefaultFormModel())
const impactVisible = ref(false)
const impactData = ref<ECNImpactModel>({
  code: '',
  material: '',
  change_type: '',
  current_version: '',
  items: []
})

const { tableData, pagination, loading, search, refresh } = useTable<ECNOrder>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: ECNListQuery = {
      pageNum: page,
      pageSize: size,
      code: queryParams.keyword || undefined,
      material: queryParams.keyword || undefined,
      status: queryParams.status || undefined
    }
    const response = await getECNList(params)
    return response.data
  }
})

function createDefaultFormModel(): ECNFormModel {
  return {
    id: '',
    code: '',
    change_type: 'BOM变更',
    material: '',
    current_version: '',
    status: 'draft',
    urgency: 'normal',
    applicant: ''
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

async function submitDialog() {
  const payload = {
    ...formModel.value,
    change_type: formModel.value.change_type as ECNOrder['change_type'],
    status: formModel.value.status as ECNOrder['status'],
    urgency: formModel.value.urgency as ECNOrder['urgency']
  }

  if (dialogMode.value === 'add') {
    await createECN(payload)
    ElMessage.success('新增成功')
  } else {
    await updateECN(formModel.value.id, payload)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}

function viewImpact(row: ECNOrder) {
  impactData.value = {
    code: row.code,
    material: row.material,
    change_type: row.change_type,
    current_version: row.current_version,
    items: [
      { dimension: '在制工单', detail: 'WO202606300015 在制 45 件', count: 1 },
      { dimension: '库存', detail: '旧版物料库存 120 件', count: 120 },
      { dimension: '在途采购', detail: 'PO202606250008 采购 200 件，预计 7 月 5 日到货', count: 200 },
      { dimension: '下游产品', detail: '被供液系统 XJ-SYS 引用', count: 1 }
    ]
  }
  impactVisible.value = true
}

async function submitEcn(row: ECNOrder) {
  await updateECN(row.id, { status: 'approved' })
  row.status = 'approved'
  ElMessage.success('已提交审批')
}

async function executeEcn(row: ECNOrder) {
  await updateECN(row.id, { status: 'executed' })
  row.status = 'executed'
  ElMessage.success('变更已执行')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
