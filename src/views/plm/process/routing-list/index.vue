<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="工艺路线"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    add-text="新建路线"
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

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="routingStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import PageOwnershipNotice from '@/components/PageOwnershipNotice.vue'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'

interface RoutingRecord {
  id: string
  routing_name: string
  material_code: string
  material_name: string
  version: string
  status: 'draft' | 'active' | 'disabled'
  operation_count: number
  work_center_count: number
  qc_gate_count: number
  total_duration: number
  updated_by: string
  updated_at: string
}

const router = useRouter()

const routingStatusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'active', label: '已生效', type: 'success' as const },
  { value: 'disabled', label: '已停用', type: 'warning' as const }
]

const routingRecords = ref<RoutingRecord[]>([
  {
    id: 'RT-2101-V2.0',
    routing_name: '供液控制总成主装路线',
    material_code: 'FG-ASSY-2101',
    material_name: '供液控制总成',
    version: 'V2.0',
    status: 'active',
    operation_count: 8,
    work_center_count: 5,
    qc_gate_count: 2,
    total_duration: 186,
    updated_by: '周制造',
    updated_at: '2026-07-10 18:30'
  },
  {
    id: 'RT-2101-V2.1',
    routing_name: '供液控制总成优化路线',
    material_code: 'FG-ASSY-2101',
    material_name: '供液控制总成',
    version: 'V2.1',
    status: 'draft',
    operation_count: 9,
    work_center_count: 5,
    qc_gate_count: 3,
    total_duration: 172,
    updated_by: '周制造',
    updated_at: '2026-07-13 10:10'
  },
  {
    id: 'RT-1001-V1.0',
    routing_name: '壳体粗加工路线',
    material_code: 'SM-CNC-1001',
    material_name: '壳体粗加工件',
    version: 'V1.0',
    status: 'active',
    operation_count: 6,
    work_center_count: 4,
    qc_gate_count: 1,
    total_duration: 96,
    updated_by: '王工艺',
    updated_at: '2026-07-11 09:40'
  }
])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '路线名称 / 产品编码 / 产品名称' } as never },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: [{ label: '全部', value: '' }, ...routingStatusOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<RoutingRecord>[] = [
  { prop: 'routing_name', label: '工艺路线', minWidth: 180 },
  { prop: 'material_code', label: '产品编码', minWidth: 150 },
  { prop: 'material_name', label: '产品名称', minWidth: 170 },
  { prop: 'version', label: '版本', minWidth: 90, align: 'center' },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'operation_count', label: '工序数', minWidth: 90, align: 'center' },
  { prop: 'work_center_count', label: '工作中心数', minWidth: 100, align: 'center' },
  { prop: 'qc_gate_count', label: '质检关卡', minWidth: 100, align: 'center' },
  { prop: 'total_duration', label: '总工时(分)', minWidth: 110, align: 'center' },
  { prop: 'updated_by', label: '维护人', minWidth: 100 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: '',
  status: ''
})

const filteredRecords = computed(() =>
  routingRecords.value.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword ||
      item.routing_name.toLowerCase().includes(keyword) ||
      item.material_code.toLowerCase().includes(keyword) ||
      item.material_name.toLowerCase().includes(keyword)
    const matchStatus = !queryParams.status || item.status === queryParams.status
    return matchKeyword && matchStatus
  })
)

const overviewCards = computed(() => {
  const activeCount = routingRecords.value.filter((item) => item.status === 'active').length
  const totalOps = routingRecords.value.reduce((sum, item) => sum + item.operation_count, 0)
  const totalQc = routingRecords.value.reduce((sum, item) => sum + item.qc_gate_count, 0)

  return [
    { label: '路线版本总量', value: routingRecords.value.length, desc: '已纳入静态阶段的一体化工艺路线版本' },
    { label: '已生效路线', value: activeCount, desc: '可直接被排产、派工和执行页引用' },
    { label: '工序总数', value: totalOps, desc: '用于检视当前版本覆盖的工序颗粒度' },
    { label: '质检关卡', value: totalQc, desc: '用于表达工序级质量裁决插入点' }
  ]
})

const { tableData, pagination, loading, search, refresh } = useTable<RoutingRecord>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  }
})

function getRowActions(row: RoutingRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: row.status === 'disabled' ? 'enable' : 'disable', label: row.status === 'disabled' ? '启用' : '停用', tone: 'warning' }
  ]
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    status: ''
  })
  search()
}

function openAdd() {
  router.push({ name: 'routingEditor', params: { id: 'new' } })
}

function handleRowAction(action: string, row: RoutingRecord) {
  if (action === 'edit') {
    router.push({ name: 'routingEditor', params: { id: row.id } })
    return
  }

  if (action === 'enable') {
    row.status = 'active'
    ElMessage.success('已启用静态工艺路线')
    return
  }

  if (action === 'disable') {
    row.status = 'disabled'
    ElMessage.success('已停用静态工艺路线')
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
