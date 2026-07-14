<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="生产领料单列表"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :toolbar-actions="toolbarActions"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
    @toolbar-action="handleToolbarAction"
  >
    <template #status="{ row }">
      <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'picked' ? 'primary' : 'success'" size="small">
        {{ row.status === 'pending' ? '待拣料' : row.status === 'picked' ? '已拣料' : '已出库' }}
      </el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="rowActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <PickingFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem, CrudToolbarActionItem } from '@/components/crud/types'
import { createPicking, deletePicking, getPickingList, updatePicking } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import PickingFormDialog, { type PickingFormModel } from './PickingFormDialog.vue'

interface PickingRow {
  id: string
  woCode: string
  material: string
  warehouse: string
  status: string
  createdAt: string
}

const warehouseOptions = [
  { label: '原材料仓', value: '原材料仓' },
  { label: '标准件仓', value: '标准件仓' },
  { label: '半成品仓', value: '半成品仓' },
  { label: '成品仓', value: '成品仓' }
]

const queryParams = ref({
  woCode: '',
  status: ''
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'woCode', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待拣料', value: 'pending' },
        { label: '已拣料', value: 'picked' },
        { label: '已出库', value: 'completed' }
      ],
      clearable: true
    } as any
  }
]

const columns: TableColumnItem<PickingRow>[] = [
  { prop: 'woCode', label: '工单号', width: 170 },
  { prop: 'material', label: '产品名称', minWidth: 160 },
  { prop: 'warehouse', label: '仓库', width: 110 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { prop: 'createdAt', label: '创建时间', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const toolbarActions: CrudToolbarActionItem[] = [{ key: 'export', label: '导出' }]
const rowActions: CrudRowActionItem[] = [
  { key: 'edit', label: '编辑', tone: 'primary' },
  { key: 'delete', label: '删除', tone: 'danger' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PickingRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getPickingList({
      pageNum: page,
      pageSize: size,
      code: queryParams.value.woCode || undefined,
      status: queryParams.value.status || undefined
    })

    return {
      list: response.data.list.map(mapRow),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deletePicking(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PickingFormModel>(createDefaultForm())

function mapRow(item: any): PickingRow {
  return {
    id: String(item.id),
    woCode: item.wo_code || '',
    material: item.material || '',
    warehouse: item.warehouse || '',
    status: item.status || '',
    createdAt: item.created_at || ''
  }
}

function handleReset() {
  queryParams.value = {
    woCode: '',
    status: ''
  }
  search()
}

function handleToolbarAction(action: string) {
  if (action === 'export') {
    ElMessage.success('导出成功')
  }
}

function createDefaultForm(): PickingFormModel {
  return {
    id: '',
    woCode: '',
    material: '',
    warehouse: warehouseOptions[0].value,
    status: 'pending'
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultForm()
  dialogVisible.value = true
}

function openEdit(row: PickingRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    woCode: row.woCode,
    material: row.material,
    warehouse: row.warehouse,
    status: row.status
  }
  dialogVisible.value = true
}

function handleRowAction(action: string, row: PickingRow) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (dialogMode.value === 'add') {
    await createPicking({
      woCode: formModel.value.woCode,
      material: formModel.value.material,
      warehouse: formModel.value.warehouse,
      status: formModel.value.status
    })
    ElMessage.success('领料单创建成功')
  } else {
    await updatePicking(formModel.value.id, {
      wo_code: formModel.value.woCode,
      material: formModel.value.material,
      warehouse: formModel.value.warehouse,
      status: formModel.value.status
    })
    ElMessage.success('领料单更新成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>
