<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" :required-fields="['keyword']" @update:visible-fields="onSearchFieldsChange">
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

    <TableSetting title="系统参数" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ParamFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createSystemParam, deleteSystemParam, getSystemParams, updateSystemParam, type SystemParam, type SystemParamQuery } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import ParamFormDialog, { type ParamFormModel } from './ParamFormDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '参数编码/参数名称' } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SystemParam>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '参数编码', minWidth: 180 },
  { prop: 'name', label: '参数名称', minWidth: 180 },
  { prop: 'value', label: '参数值', minWidth: 140 },
  { prop: 'category', label: '分类', minWidth: 120 },
  { prop: 'description', label: '说明', minWidth: 240 },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ParamFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SystemParam>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SystemParamQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined
    }

    const response = await getSystemParams(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSystemParam(id)))
})

function createDefaultFormModel(): ParamFormModel {
  return {
    id: '',
    code: '',
    name: '',
    value: '',
    description: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  queryParams.keyword = ''
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: SystemParam) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    value: row.value,
    description: row.description
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写参数编码和参数名称')
    return
  }

  if (dialogMode.value === 'add') {
    await createSystemParam({
      code: formModel.value.code,
      name: formModel.value.name,
      value: formModel.value.value,
      description: formModel.value.description,
      category: 'general',
      valueType: 'string',
      status: 'active'
    })
  } else {
    await updateSystemParam(formModel.value.id, formModel.value.value)
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
