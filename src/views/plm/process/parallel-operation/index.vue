<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="并行工序"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    add-text="新增并行规则"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #headerTop>
      <PageOwnershipNotice />
    </template>

    <template #beforeTable>
      <div class="page-overview">
        <div v-for="card in overviewCards" :key="card.label" class="overview-card">
          <div class="overview-label">{{ card.label }}</div>
          <div class="overview-value">{{ card.value }}</div>
          <div class="overview-desc">{{ card.desc }}</div>
        </div>
      </div>
    </template>

    <template #operations="{ row }">
      <div class="operation-tags">
        <el-tag v-for="item in row.operations" :key="item" effect="light" round>{{ item }}</el-tag>
      </div>
    </template>

    <template #mergeRule="{ row }">
      <el-tag :type="row.merge_rule === '全部完成后继续' ? 'success' : 'warning'" effect="light" round>
        {{ row.merge_rule }}
      </el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <ParallelFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import {
  deleteRoutingParallel,
  getRoutingParallelList,
  saveRoutingParallel,
  type RoutingParallelGroup,
  type RoutingParallelQuery
} from '@/api/routing'
import { useTable } from '@/hooks/useTable'
import ParallelFormDialog, { type ParallelFormModel } from './ParallelFormDialog.vue'

const mergeRuleOptions = [
  { label: '全部完成后继续', value: '全部完成后继续' },
  { label: '任一完成后继续', value: '任一完成后继续' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工艺路线', field: 'routingName', props: { placeholder: '请输入工艺路线名称' } as never },
  {
    type: 'select-v2',
    label: '汇合规则',
    field: 'mergeRule',
    props: {
      options: [{ label: '全部', value: '' }, ...mergeRuleOptions]
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<RoutingParallelGroup>[] = [
  { prop: 'routing_name', label: '工艺路线', minWidth: 220 },
  { label: '并行工序', minWidth: 280, slotName: 'operations' },
  { label: '汇合规则', minWidth: 150, align: 'center', slotName: 'mergeRule' },
  { prop: 'remark', label: '备注', minWidth: 240 },
  { label: '操作', minWidth: 140, align: 'center', fixed: 'right', slotName: 'actions' }
]

const queryParams = reactive({
  routingName: '',
  mergeRule: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ParallelFormModel>(createDefaultFormModel())
const loadedRecords = ref<RoutingParallelGroup[]>([])

const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const overviewCards = computed(() => {
  const totalOperations = loadedRecords.value.reduce((sum, item) => sum + item.operations.length, 0)
  const strictMergeCount = loadedRecords.value.filter((item) => item.merge_rule === '全部完成后继续').length
  const flexibleMergeCount = loadedRecords.value.filter((item) => item.merge_rule === '任一完成后继续').length

  return [
    { label: '并行规则数', value: loadedRecords.value.length, desc: '当前已纳入 PLM 路线定义的并行配置数量' },
    { label: '并行工序数', value: totalOperations, desc: '被并行规则覆盖的工序节点总量' },
    { label: '严格汇合', value: strictMergeCount, desc: '全部完成后才允许进入下一工序的规则数量' },
    { label: '弹性汇合', value: flexibleMergeCount, desc: '任一完成后即可继续的高级路线规则数量' }
  ]
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<RoutingParallelGroup>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: RoutingParallelQuery = {
      pageNum: page,
      pageSize: size,
      routingName: queryParams.routingName || undefined,
      mergeRule: queryParams.mergeRule || undefined
    }
    const response = await getRoutingParallelList(params)
    loadedRecords.value = response.data.list
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteRoutingParallel(id)))
})

function createDefaultFormModel(): ParallelFormModel {
  return {
    id: '',
    routing_id: '',
    routing_name: '',
    operations: [],
    merge_rule: '全部完成后继续',
    remark: ''
  }
}

function handleReset() {
  Object.assign(queryParams, {
    routingName: '',
    mergeRule: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: RoutingParallelGroup) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    routing_id: row.routing_id,
    routing_name: row.routing_name,
    operations: [...row.operations],
    merge_rule: row.merge_rule,
    remark: row.remark || ''
  }
  dialogVisible.value = true
}

async function submitDialog() {
  await saveRoutingParallel({
    ...formModel.value
  })
  dialogVisible.value = false
  await refresh()
}

function handleRowAction(action: string, row: RoutingParallelGroup) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}
</script>

<style scoped>
.page-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.overview-card {
  padding: 14px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  background: linear-gradient(180deg, #fcfdff 0%, #f7faff 100%);
}

.overview-label {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.overview-value {
  margin-top: 10px;
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: 600;
}

.overview-desc {
  margin-top: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.operation-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

@media (max-width: 1200px) {
  .page-overview {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .page-overview {
    grid-template-columns: 1fr;
  }
}
</style>
