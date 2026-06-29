<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="sf"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          :grid-item-props="{
            span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
          }"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd">手动创建</gi-button>
      <el-button style="margin-left: 8px" type="primary" @click="$router.push('/mrp/result')">从MRP生成</el-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
    >
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="PR_STATUS" />
      </template>
      <template #source="{ row }">
        <el-tag :type="row.source === 'mrp' ? 'primary' : 'info'" size="small">
          {{ row.source === 'mrp' ? 'MRP' : '手动' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitApprove(row)">提交审批</el-button>
        <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="convertToPO(row)">转采购订单</el-button>
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button v-if="row.status === 'draft'" type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <PurchaseRequestFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      :mode="dialogMode"
      @submit="submitDialog"
    />

    <!-- 转采购订单弹窗 (business-specific) -->
    <el-dialog v-model="poVisible" title="生成采购订单" width="600px" :lock-scroll="false">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="申请单号">{{ currentPR?.code }}</el-descriptions-item>
        <el-descriptions-item label="申请部门">{{ currentPR?.dept }}</el-descriptions-item>
      </el-descriptions>
      <el-form label-width="100px" style="margin-top: 16px">
        <el-form-item label="供应商" required>
          <el-select v-model="poForm.supplier" style="width: 100%">
            <el-option v-for="s in suppliers" :key="s" :label="s" :value="s" />
          </el-select>
        </el-form-item>
        <el-form-item label="交货日期" required>
          <el-date-picker v-model="poForm.delivery" style="width: 100%" />
        </el-form-item>
        <el-form-item label="付款条款">
          <el-select v-model="poForm.terms" style="width: 100%">
            <el-option label="月结30天" value="30" />
            <el-option label="月结60天" value="60" />
            <el-option label="款到发货" value="0" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="poVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPO">确认生成</el-button>
      </template>
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import PurchaseRequestFormDialog, { type PurchaseRequestFormModel, type PurchaseRequestLine } from './PurchaseRequestFormDialog.vue'

const PR_STATUS = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'approved', label: '已审批', type: 'primary' as const },
  { value: 'ordered', label: '已转订单', type: 'success' as const },
  { value: 'rejected', label: '已驳回', type: 'warning' as const }
]

interface PRRow {
  id: string
  code: string
  dept: string
  reason: string
  need_date: string
  status: string
  source: string
  created_at: string
}

const localData = ref<PRRow[]>([
  {
    id: '1',
    code: 'PR202501150001',
    dept: '生产部',
    reason: '生产需求',
    need_date: '2025-01-20',
    status: 'draft',
    source: 'manual',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'PR202501150002',
    dept: '生产部',
    reason: '安全库存补货',
    need_date: '2025-01-22',
    status: 'approved',
    source: 'mrp',
    created_at: '2025-01-15'
  },
  {
    id: '3',
    code: 'PR202501100003',
    dept: '设备部',
    reason: '设备维修',
    need_date: '2025-01-18',
    status: 'ordered',
    source: 'manual',
    created_at: '2025-01-10'
  }
])

const sf = ref<FormInstance | null>()
const searchForm = ref({
  code: '',
  status: '',
  source: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PurchaseRequestFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '申请编号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '草稿', value: 'draft' },
        { label: '已审批', value: 'approved' },
        { label: '已转订单', value: 'ordered' },
        { label: '已驳回', value: 'rejected' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: 'MRP', value: 'mrp' },
        { label: '手动', value: 'manual' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<PRRow>[] = [
  { prop: 'code', label: '申请编号', width: 160 },
  { prop: 'dept', label: '申请部门', width: 100 },
  { prop: 'reason', label: '申请原因', width: 130 },
  { prop: 'need_date', label: '需求日期', width: 110 },
  { label: '来源', minWidth: 70, slotName: 'source', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建时间', width: 110 },
  { label: '操作', minWidth: 250, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<PRRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    let filtered = [...localData.value]
    const s = searchForm.value
    if (s.code) filtered = filtered.filter((r) => r.code.includes(s.code))
    if (s.status) filtered = filtered.filter((r) => r.status === s.status)
    if (s.source) filtered = filtered.filter((r) => r.source === s.source)
    const total = filtered.length
    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total
    }
  }
})

function createDefaultFormModel(): PurchaseRequestFormModel {
  return {
    id: '',
    dept: '生产部',
    reason: '生产需求',
    need_date: '',
    remark: ''
  }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { code: '', status: '', source: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: PRRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    dept: row.dept,
    reason: row.reason,
    need_date: row.need_date,
    remark: ''
  }
  dialogVisible.value = true
}

async function submitDialog(lines: PurchaseRequestLine[]) {
  if (!formModel.value.need_date) {
    ElMessage.warning('请填写必填项')
    return
  }

  if (dialogMode.value === 'add') {
    localData.value.unshift({
      id: Date.now().toString(),
      code: 'PR' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(localData.value.length + 1).padStart(4, '0'),
      ...formModel.value,
      status: 'draft',
      source: 'manual',
      created_at: new Date().toISOString().slice(0, 10)
    } as PRRow)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: PRRow) {
  localData.value = localData.value.filter((r) => r.id !== row.id)
  refresh()
}

function submitApprove(row: PRRow) {
  row.status = 'approved'
  ElMessage.success('已提交审批')
}

// PO conversion
const poVisible = ref(false)
const currentPR = ref<PRRow | null>(null)
const poForm = reactive({ supplier: 'XX钢材有限公司', delivery: '', terms: '30' })
const suppliers = ['XX钢材有限公司', 'YY轴承制造厂', 'ZZ标准件有限公司', 'AA铸件有限公司']

function convertToPO(row: PRRow) {
  currentPR.value = row
  poVisible.value = true
}

function confirmPO() {
  if (currentPR.value) currentPR.value.status = 'ordered'
  poVisible.value = false
  ElMessage.success('已生成采购订单 PO' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '001')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
