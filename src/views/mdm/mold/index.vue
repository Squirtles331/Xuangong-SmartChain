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

    <TableSetting title="表格工具栏" :columns="columns" @refresh="refresh">
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

          <template #lifeProgress="{ row }">
            <el-progress :percentage="getUsagePercent(row)" :color="getProgressColor(row)" :stroke-width="16" />
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'using' ? 'success' : row.status === 'idle' ? 'info' : 'warning'" size="small">
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

    <MoldFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { createMold, deleteMold, getMoldList, updateMold, type Mold, type MoldQuery } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import MoldFormDialog, { type MoldFormModel } from './MoldFormDialog.vue'

type MoldRow = Mold

const moldTypeOptions = [
  { label: '铸模', value: '铸模' },
  { label: '锻模', value: '锻模' },
  { label: '冲模', value: '冲模' },
  { label: '注塑模', value: '注塑模' }
]

const statusOptions: Array<{ label: string; value: Mold['status'] }> = [
  { label: '使用中', value: 'using' },
  { label: '空闲', value: 'idle' },
  { label: '维护中', value: 'maintain' }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '模具编码/模具名称' } as any },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: moldTypeOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: statusOptions
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<MoldRow>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '模具编码', minWidth: 160 },
  { prop: 'name', label: '模具名称', minWidth: 160 },
  { prop: 'type', label: '模具类型', minWidth: 100, align: 'center' },
  { prop: 'lifeDesign', label: '设计寿命', minWidth: 100, align: 'center' },
  { prop: 'used', label: '已用次数', minWidth: 100, align: 'center' },
  { label: '寿命进度', minWidth: 180, slotName: 'lifeProgress' },
  { prop: 'status', label: '当前状态', minWidth: 100, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  type: string
  status: '' | Mold['status']
}>({
  keyword: '',
  type: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<MoldFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<MoldRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: MoldQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      type: queryParams.type || undefined,
      status: queryParams.status === '' ? undefined : queryParams.status
    }

    const response = await getMoldList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteMold(id)))
})

function createDefaultFormModel(): MoldFormModel {
  return {
    id: '',
    code: '',
    name: '',
    type: '',
    lifeDesign: 0,
    used: 0,
    status: 'idle'
  }
}

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    type: '',
    status: ''
  })
  search()
}

function getUsagePercent(row: MoldRow): number {
  if (row.lifeDesign <= 0) return 0
  return Math.min(100, Math.round((row.used / row.lifeDesign) * 100))
}

function getProgressColor(row: MoldRow): string {
  const percent = getUsagePercent(row)
  if (percent > 80) return '#f56c6c'
  if (percent >= 50) return '#e6a23c'
  return '#67c23a'
}

function getStatusLabel(status: Mold['status']) {
  const statusLabelMap: Record<Mold['status'], string> = {
    using: '使用中',
    idle: '空闲',
    maintain: '维护中'
  }
  return statusLabelMap[status]
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: MoldRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    type: row.type,
    lifeDesign: row.lifeDesign,
    used: row.used,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.type) {
    ElMessage.warning('请填写模具编码、模具名称和模具类型')
    return
  }

  const { id, ...payload } = formModel.value

  if (dialogMode.value === 'add') {
    await createMold(payload)
  } else {
    await updateMold(id, payload)
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
