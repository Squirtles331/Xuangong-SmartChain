<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
      <el-button style="margin-left: 8px" @click="handleExport">导出</el-button>
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #status="{ row }">
        <el-tag :type="row.status === 'pending' ? 'warning' : row.status === 'picked' ? 'primary' : 'success'" size="small">
          {{ row.status === 'pending' ? '待拣货' : row.status === 'picked' ? '已拣货' : '已出库' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="remove(row)" />
      </template>
    </gi-table>

    <PickingFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { getPickingList } from '@/api/wms'
import { useTable } from '@/hooks/useTable'
import PickingFormDialog, { type PickingFormModel } from './PickingFormDialog.vue'

interface PickingRow {
  id: string
  wo_code: string
  material: string
  status: string
  created_at: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ wo_code: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'wo_code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '待拣货', value: 'pending' },
        { label: '已拣货', value: 'picked' },
        { label: '已出库', value: 'completed' }
      ]
    }
  } as any
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const cols: TableColumnItem<PickingRow>[] = [
  { prop: 'wo_code', label: '工单号', width: 170 },
  { prop: 'material', label: '产品', minWidth: 160 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建时间', width: 110 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<PickingRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getPickingList({
      pageNum: page,
      pageSize: size,
      code: searchForm.value.wo_code || undefined,
      warehouse: undefined,
      status: searchForm.value.status || undefined
    })
    return {
      list: res.data.list.map(mapRow),
      total: res.data.total
    }
  }
})

function mapRow(item: any): PickingRow {
  return {
    id: String(item.id),
    wo_code: item.wo_code || '',
    material: item.material || '',
    status: item.status || '',
    created_at: item.created_at || ''
  }
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<PickingFormModel>(createDefaultForm())

function createDefaultForm(): PickingFormModel {
  return { id: '', wo_code: '', material: '', status: 'pending' }
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { wo_code: '', status: '' }
  search()
}

function handleExport() {
  ElMessage.success('导出成功')
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
    wo_code: row.wo_code,
    material: row.material,
    status: row.status
  }
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}

function remove(row: PickingRow) {
  onDelete(row)
}
</script>
