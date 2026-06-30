<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="{ span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 } }"
          search
          @reset="handleReset"
          @search="search"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <TableSetting title="供应商列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          stripe
          style="height: 100%"
        >
          <template #score="{ row }">
            <div class="score-cell">
              <el-progress :percentage="row.score || 0" :stroke-width="8" :color="scoreColor(row.score || 0)" />
              <span class="score-text" :class="scoreClass(row.score || 0)">{{ row.score || 0 }}分</span>
            </div>
          </template>
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="SUPPLIER_STATUS" />
          </template>
          <template #qualified="{ row }">
            <el-tag :type="row.qualified ? 'success' : 'info'" size="small">{{ row.qualified ? '合格' : '待审核' }}</el-tag>
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <SupplierFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createSupplier, deleteSupplier, getSupplierList, updateSupplier, type Supplier, type SupplierQuery } from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import SupplierFormDialog, { type SupplierFormModel } from './SupplierFormDialog.vue'

const SUPPLIER_STATUS = [
  { value: 'active', label: '正常', type: 'success' as const },
  { value: 'frozen', label: '冻结', type: 'warning' as const },
  { value: 'eliminated', label: '淘汰', type: 'danger' as const }
]

interface SupplierRow {
  id: string
  code: string
  name: string
  contact: string
  phone: string
  terms: string
  status: 'active' | 'frozen' | 'eliminated'
  qualified: boolean
  score?: number
}

const queryParams = ref({
  name: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SupplierFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '供应商名称', field: 'name', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '正常', value: 'active' },
        { label: '冻结', value: 'frozen' },
        { label: '淘汰', value: 'eliminated' }
      ],
      clearable: true
    } as any
  }
]

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<SupplierRow>[] = [
  { prop: 'code', label: '编码', width: 150 },
  { prop: 'name', label: '名称', minWidth: 180 },
  { prop: 'contact', label: '联系人', width: 100 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'terms', label: '付款条款', width: 110 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '评分', minWidth: 140, slotName: 'score', align: 'center' },
  { label: '资质', minWidth: 80, slotName: 'qualified', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const scorePresets = [95, 88, 72, 60, 91, 85]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SupplierRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SupplierQuery = {
      pageNum: page,
      pageSize: size,
      name: queryParams.value.name || undefined,
      status: queryParams.value.status || undefined
    }
    const res = await getSupplierList(params)
    return {
      list: res.data.list.map((supplier: any, index: number) => mapSupplierRow(supplier, (page - 1) * size + index)),
      total: res.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSupplier(id)))
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function createDefaultFormModel(): SupplierFormModel {
  return {
    id: '',
    code: '',
    name: '',
    contact: '',
    phone: '',
    terms: '月结30天',
    status: 'active'
  }
}

function mapSupplierRow(supplier: Supplier, index: number): SupplierRow {
  return {
    id: String(supplier.id),
    code: supplier.code,
    name: supplier.name,
    contact: supplier.contact || '-',
    phone: supplier.phone || '-',
    terms: supplier.terms || '-',
    status: supplier.status as SupplierRow['status'],
    qualified: supplier.qualified,
    score: scorePresets[index % scorePresets.length]
  }
}

function handleReset() {
  queryParams.value = { name: '', status: '' }
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SupplierRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    contact: row.contact === '-' ? '' : row.contact,
    phone: row.phone === '-' ? '' : row.phone,
    terms: row.terms === '-' ? '月结30天' : row.terms,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  const payload = {
    code: formModel.value.code,
    name: formModel.value.name,
    contact: formModel.value.contact,
    phone: formModel.value.phone,
    terms: formModel.value.terms,
    status: formModel.value.status as 'active' | 'frozen'
  }

  if (!payload.code || !payload.name) {
    ElMessage.warning('请填写编码和名称')
    return
  }

  if (dialogMode.value === 'add') {
    await createSupplier(payload)
  } else {
    await updateSupplier(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}

function remove(row: SupplierRow) {
  onDelete(row)
}

function scoreColor(score: number) {
  if (score >= 90) return '#67c23a'
  if (score >= 70) return '#e6a23c'
  return '#f56c6c'
}

function scoreClass(score: number) {
  if (score >= 90) return 'score-good'
  if (score >= 70) return 'score-warn'
  return 'score-bad'
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 120px;
}

.score-text {
  font-size: 12px;
  white-space: nowrap;
}

.score-good {
  color: #67c23a;
  font-weight: 600;
}

.score-warn {
  color: #e6a23c;
  font-weight: 600;
}

.score-bad {
  color: #f56c6c;
  font-weight: 600;
}
</style>
