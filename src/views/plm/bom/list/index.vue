<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="产品结构清单"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    add-text="新建 BOM"
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

    <template #bomType="{ row }">
      <StatusTag :value="row.bom_type" :options="bomTypeOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="bomStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <BOMCompareDialog
        v-model:visible="compareVisible"
        v-model:selected-version-id="compareVersion"
        :current-bom="compareBom"
        :versions="otherVersions"
        @submit="doCompare"
      />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
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
import BOMCompareDialog from './BOMCompareDialog.vue'

interface BOMVersion {
  id: string
  material_code: string
  material_name: string
  product_line: string
  bom_type: 'EBOM' | 'MBOM'
  version: string
  status: 'draft' | 'pending_approval' | 'active' | 'disabled' | 'archived'
  effective_date: string
  item_count: number
  route_binding: string
  change_order: string
  updated_by: string
  updated_at: string
}

const router = useRouter()

const bomTypeOptions = [
  { value: 'EBOM', label: 'EBOM', type: 'primary' as const },
  { value: 'MBOM', label: 'MBOM', type: 'success' as const }
]

const bomStatusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'pending_approval', label: '待评审', type: 'warning' as const },
  { value: 'active', label: '已生效', type: 'success' as const },
  { value: 'disabled', label: '已停用', type: 'warning' as const },
  { value: 'archived', label: '已归档', type: 'info' as const }
]

const bomRecords = ref<BOMVersion[]>([
  {
    id: 'BOM-EB-1001',
    material_code: 'FG-ASSY-2101',
    material_name: '供液控制总成',
    product_line: '注液装备',
    bom_type: 'EBOM',
    version: 'V2.3',
    status: 'active',
    effective_date: '2026-07-01',
    item_count: 28,
    route_binding: 'RT-2101-V2.0',
    change_order: 'ECN-202607-001',
    updated_by: '李工艺',
    updated_at: '2026-07-10 11:20'
  },
  {
    id: 'BOM-EB-1002',
    material_code: 'FG-ASSY-2101',
    material_name: '供液控制总成',
    product_line: '注液装备',
    bom_type: 'EBOM',
    version: 'V2.4',
    status: 'pending_approval',
    effective_date: '2026-07-18',
    item_count: 30,
    route_binding: 'RT-2101-V2.1',
    change_order: 'ECN-202607-004',
    updated_by: '李工艺',
    updated_at: '2026-07-12 16:05'
  },
  {
    id: 'BOM-MB-2101',
    material_code: 'FG-ASSY-2101',
    material_name: '供液控制总成',
    product_line: '注液装备',
    bom_type: 'MBOM',
    version: 'V1.2',
    status: 'active',
    effective_date: '2026-07-05',
    item_count: 34,
    route_binding: 'RT-2101-V2.0',
    change_order: 'ECN-202607-001',
    updated_by: '周制造',
    updated_at: '2026-07-10 19:12'
  },
  {
    id: 'BOM-MB-3102',
    material_code: 'SM-CNC-1001',
    material_name: '壳体粗加工件',
    product_line: '机加中心',
    bom_type: 'MBOM',
    version: 'V1.0',
    status: 'draft',
    effective_date: '2026-07-15',
    item_count: 12,
    route_binding: 'RT-1001-V1.0',
    change_order: 'ECN-202607-005',
    updated_by: '周制造',
    updated_at: '2026-07-13 09:48'
  },
  {
    id: 'BOM-EB-4106',
    material_code: 'FG-ASSY-1888',
    material_name: '真空模组总成',
    product_line: '封装设备',
    bom_type: 'EBOM',
    version: 'V3.1',
    status: 'archived',
    effective_date: '2026-06-01',
    item_count: 42,
    route_binding: 'RT-1888-V1.8',
    change_order: 'ECN-202606-017',
    updated_by: '陈设计',
    updated_at: '2026-06-28 15:32'
  }
])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '产品编码 / 产品名称 / 变更单号' } as never },
  {
    type: 'select-v2',
    label: 'BOM 类型',
    field: 'bomType',
    props: {
      options: [{ label: '全部', value: '' }, ...bomTypeOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [{ label: '全部', value: '' }, ...bomStatusOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<BOMVersion>[] = [
  { prop: 'material_code', label: '产品编码', minWidth: 150 },
  { prop: 'material_name', label: '产品名称', minWidth: 170 },
  { prop: 'product_line', label: '所属产品线', minWidth: 120 },
  { label: 'BOM 类型', minWidth: 100, align: 'center', slotName: 'bomType' },
  { prop: 'version', label: '版本', minWidth: 90, align: 'center' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'item_count', label: '子项数', minWidth: 90, align: 'center' },
  { prop: 'route_binding', label: '工艺路线绑定', minWidth: 150 },
  { prop: 'effective_date', label: '生效日期', minWidth: 120 },
  { prop: 'updated_by', label: '维护人', minWidth: 100 },
  { label: '操作', minWidth: 220, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  keyword: '',
  bomType: '',
  status: ''
})

const filteredRecords = computed(() =>
  bomRecords.value.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword ||
      item.material_code.toLowerCase().includes(keyword) ||
      item.material_name.toLowerCase().includes(keyword) ||
      item.change_order.toLowerCase().includes(keyword)
    const matchType = !queryParams.bomType || item.bom_type === queryParams.bomType
    const matchStatus = !queryParams.status || item.status === queryParams.status
    return matchKeyword && matchType && matchStatus
  })
)

const overviewCards = computed(() => {
  const activeCount = bomRecords.value.filter((item) => item.status === 'active').length
  const pendingCount = bomRecords.value.filter((item) => item.status === 'pending_approval').length
  const mbomCount = bomRecords.value.filter((item) => item.bom_type === 'MBOM').length

  return [
    { label: '结构版本总量', value: bomRecords.value.length, desc: '已纳入静态页的一体化结构版本对象' },
    { label: '已生效版本', value: activeCount, desc: '可被工单、领料口径、工艺路线直接消费' },
    { label: '待评审版本', value: pendingCount, desc: '等待工程评审或变更审批放行' },
    { label: 'MBOM 数量', value: mbomCount, desc: '已转换为制造执行口径的结构版本' }
  ]
})

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<BOMVersion>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    bomRecords.value = bomRecords.value.filter((item) => !ids.includes(item.id))
  }
})

const compareVisible = ref(false)
const compareBom = ref<BOMVersion | null>(null)
const compareVersion = ref('')

const otherVersions = computed(() => {
  if (!compareBom.value) return []
  return bomRecords.value.filter((item) => item.material_code === compareBom.value?.material_code && item.id !== compareBom.value?.id)
})

function getRowActions(row: BOMVersion): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'compare', label: '对比', tone: 'secondary' },
    { key: 'derive-mbom', label: '派生 MBOM', tone: 'success', hidden: row.bom_type !== 'EBOM' },
    {
      key: row.status === 'draft' ? 'submit' : 'archive',
      label: row.status === 'draft' ? '提交评审' : '归档',
      tone: row.status === 'draft' ? 'warning' : 'danger',
      hidden: row.status === 'archived' && row.bom_type !== 'EBOM'
    }
  ]
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    bomType: '',
    status: ''
  })
  search()
}

function openAdd() {
  router.push({ name: 'bomCreate' })
}

function openEditor(row: BOMVersion) {
  router.push({ name: 'bomEditor', params: { id: row.id } })
}

function openCompare(row: BOMVersion) {
  compareBom.value = row
  compareVersion.value = ''
  compareVisible.value = true
}

function doCompare() {
  if (!compareBom.value || !compareVersion.value) return
  compareVisible.value = false
  router.push({ name: 'bomCompare', query: { ids: `${compareBom.value.id},${compareVersion.value}` } })
}

function convertToMBOM(row: BOMVersion) {
  bomRecords.value.unshift({
    ...row,
    id: `BOM-MB-${Date.now()}`,
    bom_type: 'MBOM',
    version: 'V1.0',
    status: 'draft',
    effective_date: '待评审',
    updated_by: '静态派生',
    updated_at: '2026-07-13 23:55'
  })
  ElMessage.success('已派生 MBOM 草稿')
  refresh()
}

function handleRowAction(action: string, row: BOMVersion) {
  if (action === 'edit') {
    openEditor(row)
    return
  }

  if (action === 'compare') {
    openCompare(row)
    return
  }

  if (action === 'derive-mbom') {
    convertToMBOM(row)
    return
  }

  if (action === 'submit') {
    row.status = 'pending_approval'
    ElMessage.success('已提交结构版本评审')
    return
  }

  if (action === 'archive') {
    row.status = 'archived'
    ElMessage.success('已归档当前结构版本')
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
