<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="物料主数据"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :page-attrs="pageAttrs"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #left>
      <div class="material-tree-panel">
        <div class="panel-title">分类视图</div>
        <el-tree
          :data="categoryTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @node-click="onCategoryClick"
        />
      </div>
    </template>

    <template #index="{ $index }">
      {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
    </template>

    <template #type="{ row }">
      <StatusTag :value="row.type" :options="materialTypeOptions" />
    </template>

    <template #status="{ row }">
      <StatusTag :value="row.status" :options="materialStatusOptions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <MaterialFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudDialogMode, CrudRowActionItem } from '@/components/crud/types'
import { useTable } from '@/hooks/useTable'
import MaterialFormDialog, { type MaterialFormModel } from './MaterialFormDialog.vue'

interface MaterialCategoryNode {
  id: string
  name: string
  children?: MaterialCategoryNode[]
}

interface MaterialRecord {
  id: string
  code: string
  name: string
  spec: string
  category: string
  type: 'purchased' | 'manufactured' | 'outsourced'
  unit: string
  supplyMode: string
  status: 'draft' | 'active' | 'disabled' | 'archived'
  planner: string
  leadTimeDays: number
  safeStock: number
  updatedAt: string
}

const pageAttrs = {
  size: 240
}

const categoryTree: MaterialCategoryNode[] = [
  {
    id: 'metal',
    name: '金属原材',
    children: [
      { id: 'steel', name: '钢材' },
      { id: 'aluminum', name: '铝材' }
    ]
  },
  {
    id: 'semi',
    name: '半成品',
    children: [
      { id: 'machined', name: '机加件' },
      { id: 'assembly', name: '装配件' }
    ]
  },
  {
    id: 'purchase',
    name: '采购件',
    children: [
      { id: 'electrical', name: '电气件' },
      { id: 'standard', name: '标准件' }
    ]
  }
]

const materialTypeOptions = [
  { value: 'purchased', label: '外购', type: 'primary' as const },
  { value: 'manufactured', label: '自制', type: 'success' as const },
  { value: 'outsourced', label: '委外', type: 'warning' as const }
]

const materialStatusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'active', label: '已生效', type: 'success' as const },
  { value: 'disabled', label: '已停用', type: 'warning' as const },
  { value: 'archived', label: '已归档', type: 'info' as const }
]

const materialRecords = ref<MaterialRecord[]>([
  {
    id: 'MAT-001',
    code: 'RM-AL-6061-08',
    name: '铝板 6061',
    spec: '8mm',
    category: '铝材',
    type: 'purchased',
    unit: '张',
    supplyMode: '采购补货',
    status: 'active',
    planner: '周计划组',
    leadTimeDays: 5,
    safeStock: 24,
    updatedAt: '2026-07-11 09:20'
  },
  {
    id: 'MAT-002',
    code: 'SM-CNC-1001',
    name: '壳体粗加工件',
    spec: 'XG-HS-01',
    category: '机加件',
    type: 'manufactured',
    unit: '件',
    supplyMode: '按工单投产',
    status: 'active',
    planner: '机加计划组',
    leadTimeDays: 2,
    safeStock: 12,
    updatedAt: '2026-07-11 13:40'
  },
  {
    id: 'MAT-003',
    code: 'FG-ASSY-2101',
    name: '供液控制总成',
    spec: 'XG-FG-21',
    category: '装配件',
    type: 'manufactured',
    unit: '套',
    supplyMode: 'MTO 装配',
    status: 'draft',
    planner: '装配计划组',
    leadTimeDays: 3,
    safeStock: 6,
    updatedAt: '2026-07-12 10:18'
  },
  {
    id: 'MAT-004',
    code: 'PO-EL-3008',
    name: '伺服驱动器',
    spec: '7.5kW',
    category: '电气件',
    type: 'purchased',
    unit: '台',
    supplyMode: '订单采购',
    status: 'active',
    planner: '采购协同组',
    leadTimeDays: 12,
    safeStock: 4,
    updatedAt: '2026-07-10 16:12'
  },
  {
    id: 'MAT-005',
    code: 'OS-HT-5002',
    name: '热处理外协件',
    spec: '42CrMo',
    category: '标准件',
    type: 'outsourced',
    unit: '件',
    supplyMode: '委外回厂',
    status: 'disabled',
    planner: '工艺工程组',
    leadTimeDays: 4,
    safeStock: 0,
    updatedAt: '2026-07-08 08:55'
  },
  {
    id: 'MAT-006',
    code: 'RM-ST-45-20',
    name: '45# 圆钢',
    spec: '20mm',
    category: '钢材',
    type: 'purchased',
    unit: '支',
    supplyMode: '安全库存',
    status: 'archived',
    planner: '周计划组',
    leadTimeDays: 7,
    safeStock: 10,
    updatedAt: '2026-07-04 18:20'
  }
])

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码 / 物料名称 / 规格' } as never },
  {
    type: 'select-v2',
    label: '分类',
    field: 'category',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '钢材', value: '钢材' },
        { label: '铝材', value: '铝材' },
        { label: '机加件', value: '机加件' },
        { label: '装配件', value: '装配件' },
        { label: '电气件', value: '电气件' },
        { label: '标准件', value: '标准件' }
      ]
    } as never
  },
  {
    type: 'select-v2',
    label: '物料类型',
    field: 'type',
    props: { options: [{ label: '全部', value: '' }, ...materialTypeOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: { options: [{ label: '全部', value: '' }, ...materialStatusOptions.map((item) => ({ label: item.label, value: item.value }))] } as never
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }
}

const columns: TableColumnItem<MaterialRecord>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '物料编码', minWidth: 150 },
  { prop: 'name', label: '物料名称', minWidth: 170 },
  { prop: 'spec', label: '规格型号', minWidth: 120 },
  { prop: 'category', label: '分类', minWidth: 110 },
  { label: '物料类型', minWidth: 100, slotName: 'type', align: 'center' },
  { prop: 'supplyMode', label: '供应策略', minWidth: 120 },
  { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'unit', label: '单位', minWidth: 80, align: 'center' },
  { prop: 'leadTimeDays', label: '采购/制造提前期', minWidth: 130, align: 'center' },
  { prop: 'updatedAt', label: '最近维护时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  category: string
  type: '' | MaterialRecord['type']
  status: '' | MaterialRecord['status']
}>({
  keyword: '',
  category: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<CrudDialogMode>('add')
const formModel = ref<MaterialFormModel>(createDefaultFormModel())

const filteredRecords = computed(() =>
  materialRecords.value.filter((item) => {
    const keyword = queryParams.keyword.trim().toLowerCase()
    const matchKeyword =
      !keyword || item.code.toLowerCase().includes(keyword) || item.name.toLowerCase().includes(keyword) || item.spec.toLowerCase().includes(keyword)
    const matchCategory = !queryParams.category || item.category === queryParams.category
    const matchType = !queryParams.type || item.type === queryParams.type
    const matchStatus = !queryParams.status || item.status === queryParams.status
    return matchKeyword && matchCategory && matchType && matchStatus
  })
)

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<MaterialRecord>({
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
    materialRecords.value = materialRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function createDefaultFormModel(): MaterialFormModel {
  return {
    id: '',
    code: '',
    name: '',
    spec: '',
    category: '钢材',
    type: 'purchased',
    unit: '件',
    supplyMode: '',
    status: 'draft',
    planner: '',
    leadTimeDays: 0,
    safeStock: 0
  }
}

function getRowActions(row: MaterialRecord): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    {
      key: row.status === 'disabled' ? 'enable' : 'disable',
      label: row.status === 'disabled' ? '启用' : '停用',
      tone: 'warning',
      hidden: row.status === 'archived'
    },
    { key: 'delete', label: '删除', tone: 'danger' }
  ]
}

function onCategoryClick(data: MaterialCategoryNode) {
  queryParams.category = data.children?.length ? '' : data.name
  search()
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    category: '',
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

function openEdit(row: MaterialRecord) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    spec: row.spec,
    category: row.category,
    type: row.type,
    unit: row.unit,
    supplyMode: row.supplyMode,
    status: row.status,
    planner: row.planner,
    leadTimeDays: row.leadTimeDays,
    safeStock: row.safeStock
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: MaterialRecord) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'enable') {
    row.status = 'active'
    ElMessage.success('已启用静态物料')
    return
  }

  if (action === 'disable') {
    row.status = 'disabled'
    ElMessage.success('已停用静态物料')
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.category) {
    ElMessage.warning('请完整填写物料编码、物料名称和分类')
    return
  }

  if (dialogMode.value === 'add') {
    materialRecords.value.unshift({
      id: `MAT-${String(materialRecords.value.length + 1).padStart(3, '0')}`,
      code: formModel.value.code,
      name: formModel.value.name,
      spec: formModel.value.spec,
      category: formModel.value.category,
      type: formModel.value.type,
      unit: formModel.value.unit,
      supplyMode: formModel.value.supplyMode || '待定义',
      status: formModel.value.status,
      planner: formModel.value.planner || '待分配',
      leadTimeDays: formModel.value.leadTimeDays,
      safeStock: formModel.value.safeStock,
      updatedAt: '2026-07-13 23:50'
    })
    ElMessage.success('已新增静态物料数据')
  } else {
    materialRecords.value = materialRecords.value.map((item) =>
      item.id === formModel.value.id
        ? {
            ...item,
            code: formModel.value.code,
            name: formModel.value.name,
            spec: formModel.value.spec,
            category: formModel.value.category,
            type: formModel.value.type,
            unit: formModel.value.unit,
            supplyMode: formModel.value.supplyMode || '待定义',
            status: formModel.value.status,
            planner: formModel.value.planner || '待分配',
            leadTimeDays: formModel.value.leadTimeDays,
            safeStock: formModel.value.safeStock,
            updatedAt: '2026-07-13 23:50'
          }
        : item
    )
    ElMessage.success('已更新静态物料数据')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
.material-tree-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
