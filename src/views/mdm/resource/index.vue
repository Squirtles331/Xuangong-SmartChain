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

    <TableSetting title="资源列表" :columns="columns" @refresh="refresh">
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
          <template #index="{ $index }">
            {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : 'danger'" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <gi-button type="delete" style="margin-left: 8px" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <ResourceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createResource, deleteResource, getResourceList, updateResource, type Resource, type ResourceQuery } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import ResourceFormDialog, { type ResourceFormModel } from './ResourceFormDialog.vue'

const statusOptions: Array<{ label: string; value: Resource['status'] }> = [
  { label: '运行', value: 'running' },
  { label: '空闲', value: 'idle' },
  { label: '维修', value: 'repair' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键词', field: 'keyword', props: { placeholder: '资源编码/资源名称' } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [{ label: '全部', value: '' }, ...statusOptions]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<Resource>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '资源编码', minWidth: 160 },
  { prop: 'name', label: '资源名称', minWidth: 140 },
  { prop: 'type', label: '资源类型', minWidth: 120 },
  { prop: 'model', label: '资源型号', minWidth: 120 },
  { prop: 'status', label: '资源状态', minWidth: 100, slotName: 'status', align: 'center' },
  { prop: 'workCenter', label: '所属工作中心', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  status: '' | Resource['status']
}>({
  keyword: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ResourceFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<Resource>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: ResourceQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      status: queryParams.status === '' ? undefined : queryParams.status
    }

    const response = await getResourceList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteResource(id)))
})

function createDefaultFormModel(): ResourceFormModel {
  return {
    id: '',
    code: '',
    name: '',
    type: '',
    model: '',
    status: 'idle',
    workCenter: ''
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    status: ''
  })
  search()
}

function getStatusLabel(status: Resource['status']) {
  const statusLabelMap: Record<Resource['status'], string> = {
    running: '运行',
    idle: '空闲',
    repair: '维修'
  }
  return statusLabelMap[status]
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: Resource) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写资源编码和资源名称')
    return
  }

  const { id, ...payload } = formModel.value

  if (dialogMode.value === 'add') {
    await createResource(payload)
    ElMessage.success('新增成功')
  } else {
    await updateResource(id, payload)
    ElMessage.success('编辑成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
