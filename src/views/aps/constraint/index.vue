<template>
  <CrudPage
    v-model:search-model="queryParams"
    v-model:segmented-value="constraintType"
    title="排程约束"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    :segmented-options="segmentedOptions"
    :segmented-auto-search="true"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
    @toolbar-action="handleToolbarAction"
    @segmented-change="handleTypeChange"
  >
    <template #headerTop>
      <div class="page-summary">
        <div class="page-summary__title">APS 排程约束维护</div>
        <div class="page-summary__desc">按模具、刀具、技能三类维护静态排程规则，供后续 mock 和 API 阶段直接继承。</div>
      </div>
    </template>

    <template #available="{ row }">
      <StatusTag :value="row.available" :options="availabilityOptions" />
    </template>

    <template #utilization="{ row }">
      <el-progress :percentage="row.utilization || 0" :stroke-width="8" :color="utilizationColor(row.utilization || 0)" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ConstraintFormDialog
        v-model:visible="dialogVisible"
        v-model:form="formModel"
        :mode="dialogMode"
        :constraint-type="constraintType"
        @submit="submitDialog"
      />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import { deleteApsConstraint, getApsConstraintList, saveApsConstraint } from '@/static/services/aps'
import type { ApsConstraintFormModel, ApsConstraintRecord, ApsConstraintType } from '@/types/aps'
import ConstraintFormDialog from './ConstraintFormDialog.vue'

const segmentedOptions = [
  { label: '模具约束', value: 'mold' },
  { label: '刀具约束', value: 'tool' },
  { label: '技能约束', value: 'skill' }
]

const availabilityOptions = [
  { value: true, label: '可用', type: 'success' as const },
  { value: false, label: '不可用', type: 'danger' as const }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const constraintType = ref<ApsConstraintType>('mold')
const queryParams = ref({
  keyword: '',
  applicable: ''
})

const searchColumns = computed<FormColumnItem[]>(() => {
  if (constraintType.value === 'skill') {
    return [{ type: 'input', label: '工序 / 技能', field: 'keyword', props: { clearable: true } as any }]
  }

  return [
    { type: 'input', label: '编码 / 名称', field: 'keyword', props: { clearable: true } as any },
    { type: 'input', label: '适用对象', field: 'applicable', props: { clearable: true } as any }
  ]
})

const columns = computed<TableColumnItem<any>[]>(() => {
  if (constraintType.value === 'skill') {
    return [
      { prop: 'operation', label: '工序', minWidth: 140 },
      { prop: 'skill', label: '技能要求', minWidth: 180 },
      { prop: 'minLevel', label: '最低等级', minWidth: 100, align: 'center' },
      { prop: 'workersCount', label: '配备人数', minWidth: 100, align: 'center' },
      { label: '利用率', minWidth: 180, slotName: 'utilization' },
      { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
    ]
  }

  return [
    { prop: 'code', label: '编码', minWidth: 150 },
    { prop: 'name', label: '名称', minWidth: 160 },
    { prop: 'applicable', label: '适用对象', minWidth: 160 },
    { prop: 'life', label: '寿命 / 数量', minWidth: 120 },
    { label: '可用状态', minWidth: 110, align: 'center', slotName: 'available' },
    { label: '利用率', minWidth: 180, slotName: 'utilization' },
    { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
  ]
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ApsConstraintRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getApsConstraintList({
      type: constraintType.value,
      pageNum: page,
      pageSize: size,
      keyword: queryParams.value.keyword || undefined,
      applicable: constraintType.value === 'skill' ? undefined : queryParams.value.applicable || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteApsConstraint(constraintType.value, id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ApsConstraintFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ApsConstraintFormModel {
  return {
    id: '',
    code: '',
    name: '',
    applicable: '',
    life: '',
    available: true,
    utilization: 0,
    operation: '',
    skill: '',
    minLevel: 1,
    workersCount: 1
  }
}

function utilizationColor(value: number) {
  if (value >= 90) return '#f56c6c'
  if (value >= 75) return '#e6a23c'
  return '#67c23a'
}

function handleReset() {
  queryParams.value = {
    keyword: '',
    applicable: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('排程约束静态数据已导出')
  }
}

function handleTypeChange() {
  queryParams.value = {
    keyword: '',
    applicable: ''
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ApsConstraintRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    ...createDefaultFormModel(),
    ...(row as Partial<ApsConstraintFormModel>)
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: ApsConstraintRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  await saveApsConstraint({
    ...formModel.value,
    type: constraintType.value
  })

  dialogVisible.value = false
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '编辑成功')
  await refresh()
}
</script>

<style scoped>
.page-summary {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-summary__title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.page-summary__desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
