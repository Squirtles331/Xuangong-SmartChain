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
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
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
          <template #status="{ row }">
            <StatusTag :value="row.status" :options="supplierStatusOptions" />
          </template>

          <template #qualified="{ row }">
            <el-tag :type="row.qualified ? 'success' : 'warning'" size="small">
              {{ row.qualified ? '已合格' : '待复审' }}
            </el-tag>
          </template>

          <template #score="{ row }">
            <div class="score-cell">
              <el-progress :percentage="row.score" :stroke-width="8" :color="getScoreColor(row.score)" />
              <span class="score-text" :style="{ color: getScoreColor(row.score) }">{{ row.score }}分</span>
            </div>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <SupplierFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createSupplier, deleteSupplier, getSupplierList, updateSupplier, type Supplier, type SupplierQuery } from '@/api/scm'
import { useTable } from '@/hooks/useTable'
import SupplierFormDialog, { type SupplierFormModel } from './SupplierFormDialog.vue'

interface SupplierRow extends Supplier {
  score: number
}

const supplierStatusOptions = [
  { value: 'active', label: '正常', type: 'success' as const },
  { value: 'frozen', label: '冻结', type: 'warning' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '供应商名称', field: 'name', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: supplierStatusOptions.map((item) => ({ label: item.label, value: item.value }))
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SupplierRow>[] = [
  { prop: 'code', label: '供应商编码', minWidth: 150 },
  { prop: 'name', label: '供应商名称', minWidth: 180 },
  { prop: 'contact', label: '联系人', minWidth: 100 },
  { prop: 'phone', label: '联系电话', minWidth: 130 },
  { prop: 'terms', label: '付款条件', minWidth: 120 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '评分', minWidth: 160, slotName: 'score', align: 'center' },
  { label: '资质', minWidth: 90, slotName: 'qualified', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const scorePresets = [96, 92, 88, 75, 90, 84]

const queryParams = reactive({
  name: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SupplierFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SupplierRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SupplierQuery = {
      pageNum: page,
      pageSize: size,
      name: queryParams.name || undefined,
      status: queryParams.status || undefined
    }
    const response = await getSupplierList(params)
    return {
      list: response.data.list.map((item, index) => mapSupplierRow(item, (page - 1) * size + index)),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSupplier(id)))
})

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

function mapSupplierRow(item: Supplier, index: number): SupplierRow {
  return {
    ...item,
    id: String(item.id),
    score: scorePresets[index % scorePresets.length]
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    name: '',
    status: ''
  })
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
    contact: row.contact,
    phone: row.phone,
    terms: row.terms,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写供应商编码和名称')
    return
  }

  const payload = {
    code: formModel.value.code,
    name: formModel.value.name,
    contact: formModel.value.contact,
    phone: formModel.value.phone,
    terms: formModel.value.terms,
    status: formModel.value.status as Supplier['status']
  }

  if (dialogMode.value === 'add') {
    await createSupplier(payload)
  } else {
    await updateSupplier(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
}

function getScoreColor(score: number) {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#409eff'
  return '#e6a23c'
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
}

.score-text {
  min-width: 40px;
  font-size: 12px;
  font-weight: 600;
}
</style>
