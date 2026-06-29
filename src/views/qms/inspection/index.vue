<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @reset="handleReset"
          @search="handleSearch"
        />
      </SearchSetting>
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #verdict="{ row }">
        <StatusTag :value="row.verdict || ''" :options="INSPECTION_VERDICT" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="INSPECTION_STATUS" />
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="inspect(row)">检验</el-button>
      </template>
    </gi-table>

    <InspectionFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    <InspectionExecuteDialog v-model:visible="iv" v-model:items="items" v-model:result="ir" :task="ic" @submit="submitInspect" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getInspectionTaskList, updateInspectionTask } from '@/api/qms'
import { useTable } from '@/hooks/useTable'
import InspectionFormDialog, { type InspectionFormModel } from './InspectionFormDialog.vue'
import InspectionExecuteDialog, { type InspectionExecuteItem, type InspectionExecuteTask } from './InspectionExecuteDialog.vue'

const INSPECTION_VERDICT = [
  { value: '合格', label: '合格', type: 'success' as const },
  { value: '让步', label: '让步', type: 'warning' as const },
  { value: '返工', label: '返工', type: 'danger' as const },
  { value: '退货', label: '退货', type: 'danger' as const },
  { value: '报废', label: '报废', type: 'info' as const }
]

const INSPECTION_STATUS = [
  { value: 'pending', label: '待检', type: 'warning' as const },
  { value: 'done', label: '已完成', type: 'success' as const }
]

interface InspectionRow {
  id: string
  code: string
  type: string
  material: string
  lot: string
  qty: number
  status: string
  verdict?: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  keyword: '',
  type: '',
  verdict: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<InspectionFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '检验类型',
    field: 'type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '来料检验', value: '来料检验' },
        { label: '过程检验', value: '过程检验' },
        { label: '最终检验', value: '最终检验' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '判定结果',
    field: 'verdict',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '合格', value: '合格' },
        { label: '让步', value: '让步' },
        { label: '返工', value: '返工' },
        { label: '退货', value: '退货' },
        { label: '报废', value: '报废' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

const cols: TableColumnItem<InspectionRow>[] = [
  { prop: 'code', label: '任务编号', width: 170 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'lot', label: '批号', width: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '判定', minWidth: 80, slotName: 'verdict', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, slotName: 'actions', align: 'center' }
]

function mapRow(raw: any): InspectionRow {
  return {
    id: String(raw.id),
    code: raw.code || '',
    type: raw.type || '',
    material: raw.material || '',
    lot: raw.lot || '',
    qty: Number(raw.qty) || 0,
    status: raw.status || 'pending',
    verdict: raw.verdict || ''
  }
}

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<InspectionRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getInspectionTaskList({
      page,
      page_size: size,
      code: searchForm.value.keyword || undefined,
      type: searchForm.value.type || undefined,
      material: searchForm.value.keyword || undefined
    })
    const items = (res.data.items || res.data || []).map(mapRow)
    return { list: items, total: res.data.total || items.length }
  },
  deleteAPI: (ids) => Promise.all(ids.map(() => Promise.resolve()))
})

function createDefaultFormModel(): InspectionFormModel {
  return {
    id: '',
    code: '',
    type: '来料检验',
    material: '',
    lot: '',
    qty: 1,
    status: 'pending'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', type: '', verdict: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: InspectionRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    type: row.type,
    material: row.material,
    lot: row.lot,
    qty: row.qty,
    status: row.status,
    verdict: row.verdict
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

const iv = ref(false)
const ic = ref<InspectionExecuteTask | null>(null)
const ir = ref('qualified')
const items = ref<InspectionExecuteItem[]>([])

function inspect(row: InspectionRow) {
  ic.value = { code: row.code, material: row.material }
  iv.value = true
  ir.value = 'qualified'
  items.value = [
    { name: '尺寸', standard: '100.00', value: '' },
    { name: '硬度', standard: '45', value: '' },
    { name: '表面粗糙度', standard: '3.2', value: '' }
  ]
}

async function submitInspect() {
  if (ic.value) {
    const verdictMap: Record<string, string> = {
      qualified: '合格',
      concession: '让步',
      sorting: '返工',
      return: '退货',
      scrap: '报废'
    }
    try {
      const target = tableData.value.find((row) => row.code === ic.value?.code)
      if (!target) return
      await updateInspectionTask(target.id, {
        status: 'done',
        verdict: verdictMap[ir.value] || ''
      })
      target.status = 'done'
      target.verdict = verdictMap[ir.value] || ''
      ElMessage.success(`检验完成: ${verdictMap[ir.value] || ''}`)
    } catch {
      ElMessage.error('提交检验结果失败')
    }
  }
  iv.value = false
}
</script>
