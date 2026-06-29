<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd">新建变更单</gi-button>
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe style="height: 100%">
      <template #urgency="{ row }">
        <StatusTag :value="row.urgency" :options="ECN_URGENCY" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="ECN_STATUS" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="viewImpact(row)">影响分析</el-button>
        <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitEcn(row)">提交审批</el-button>
        <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="executeEcn(row)">执行</el-button>
      </template>
    </gi-table>

    <ECNFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <ECNImpactDialog v-model:visible="impactVisible" v-model:data="impactData" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createECN, deleteECN, getECNList, updateECN } from '@/api/ecn'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import ECNFormDialog, { type ECNFormModel } from './ECNFormDialog.vue'
import ECNImpactDialog, { type ECNImpactModel } from './ECNImpactDialog.vue'

const ECN_URGENCY = [
  { value: 'urgent', label: '紧急', type: 'danger' as const },
  { value: 'normal', label: '普通', type: 'warning' as const },
  { value: 'planned', label: '计划', type: 'info' as const }
]

const ECN_STATUS = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'approved', label: '已审批', type: 'primary' as const },
  { value: 'executed', label: '已执行', type: 'success' as const },
  { value: 'verified', label: '已验证', type: 'success' as const },
  { value: 'closed', label: '已关闭', type: 'info' as const }
]

interface ECNRow {
  id: string
  code: string
  change_type: string
  material: string
  current_version: string
  status: string
  urgency: string
  applicant: string
  created_at: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
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
        { label: '已验证', value: 'verified' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<ECNRow>[] = [
  { prop: 'code', label: '变更单号', width: 170 },
  { prop: 'change_type', label: '变更类型', width: 130 },
  { prop: 'material', label: '变更对象', minWidth: 160 },
  { prop: 'current_version', label: '当前版本', width: 120 },
  { label: '紧急程度', minWidth: 80, slotName: 'urgency', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'applicant', label: '申请人', width: 80 },
  { prop: 'created_at', label: '日期', width: 110 },
  { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<ECNRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getECNList({
      page,
      page_size: size,
      code: searchForm.value.keyword || undefined,
      material: searchForm.value.keyword || undefined,
      status: searchForm.value.status || undefined
    })
    return {
      list: (res.data.items || []).map((item: any) => ({
        id: item.id,
        code: item.code,
        change_type: item.change_type,
        material: item.material,
        current_version: item.current_version || '',
        status: item.status,
        urgency: item.urgency,
        applicant: item.applicant || '',
        created_at: item.created_at || ''
      })),
      total: res.data.total || 0
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteECN(id)))
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', status: '' }
  search()
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ECNFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ECNFormModel {
  return { id: '', code: '', change_type: 'BOM变更', material: '', current_version: '', status: 'draft', urgency: 'normal', applicant: '' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

async function submitDialog() {
  const payload = {
    ...formModel.value,
    change_type: formModel.value.change_type as 'BOM变更' | '工艺变更' | 'BOM+工艺变更',
    status: formModel.value.status as 'draft' | 'approved' | 'executed' | 'verified' | 'closed',
    urgency: formModel.value.urgency as 'urgent' | 'normal' | 'planned'
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

const impactVisible = ref(false)
const impactData = ref<ECNImpactModel>({
  code: '',
  material: '',
  change_type: '',
  current_version: '',
  items: []
})

function viewImpact(row: ECNRow) {
  impactData.value = {
    code: row.code,
    material: row.material,
    change_type: row.change_type,
    current_version: row.current_version,
    items: [
      { dimension: '在制工单', detail: 'WO202501150001 离心泵 XJP-100 在制 45 台', count: 1 },
      { dimension: '库存', detail: '旧版物料库存 120 件', count: 120 },
      { dimension: '在途采购', detail: 'PO202501100008 泵体铸件 200 件，预计 1 月 20 日到货', count: 200 },
      { dimension: '下游产品', detail: '被供水系统 XJ-SYS 引用', count: 1 }
    ]
  }
  impactVisible.value = true
}

async function submitEcn(row: ECNRow) {
  try {
    await updateECN(row.id, { status: 'approved' })
    row.status = 'approved'
    ElMessage.success('已提交审批')
  } catch {
    ElMessage.error('提交审批失败')
  }
}

async function executeEcn(row: ECNRow) {
  try {
    await updateECN(row.id, { status: 'executed' })
    row.status = 'executed'
    ElMessage.success('变更已执行')
  } catch {
    ElMessage.error('执行失败')
  }
}
</script>
