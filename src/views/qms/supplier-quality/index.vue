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

    <TableSetting title="供应商质量" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table :columns="settingColumns" :data="tableData" :pagination="pagination" :loading="loading" v-bind="tableProps" border stripe>
          <template #pass_rate="{ row }">
            <el-progress
              :percentage="row.pass_rate"
              :stroke-width="8"
              :color="row.pass_rate >= 95 ? '#67c23a' : row.pass_rate >= 80 ? '#e6a23c' : '#f56c6c'"
            />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <SupplierQualityFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createSupplierQuality, deleteSupplierQuality, getSupplierQualityList, updateSupplierQuality, type SupplierQuality } from '@/api/qms'
import { useTable } from '@/hooks/useTable'
import SupplierQualityFormDialog, { type SupplierQualityFormModel } from './SupplierQualityFormDialog.vue'

const queryParams = reactive({
  supplier: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<SupplierQualityFormModel>(createDefaultFormModel())

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '供应商', field: 'supplier' }]
const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const columns: TableColumnItem<SupplierQuality>[] = [
  { prop: 'supplier', label: '供应商', minWidth: 180 },
  { prop: 'total_batches', label: '总批次数', minWidth: 100, align: 'center' },
  { prop: 'pass_batches', label: '合格批次', minWidth: 100, align: 'center' },
  { label: '合格率', minWidth: 180, slotName: 'pass_rate' },
  { prop: 'repeat_issues', label: '重复问题', minWidth: 90, align: 'center' },
  { prop: 'last_inspection', label: '最近检验', width: 120 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SupplierQuality>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getSupplierQualityList({
      pageNum: page,
      pageSize: size,
      supplier: queryParams.supplier || undefined
    })
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSupplierQuality(id)))
})

function createDefaultFormModel(): SupplierQualityFormModel {
  return {
    id: '',
    supplier: '',
    total_batches: 0,
    pass_batches: 0,
    pass_rate: 0,
    repeat_issues: 0,
    last_inspection: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, { supplier: '' })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SupplierQuality) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  const payload = {
    ...formModel.value,
    pass_rate: formModel.value.total_batches > 0 ? Number(((formModel.value.pass_batches / formModel.value.total_batches) * 100).toFixed(1)) : 0
  }

  if (dialogMode.value === 'add') {
    await createSupplierQuality(payload)
    ElMessage.success('新增成功')
  } else {
    await updateSupplierQuality(formModel.value.id, payload)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>
