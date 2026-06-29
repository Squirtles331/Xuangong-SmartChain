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
    </template>

    <gi-table :columns="cols" :data="tableData" :pagination="pagination" :loading="loading" border stripe size="small">
      <template #index="{ $index }">
        {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : 'danger'" size="small">
          {{ row.status === 'running' ? '运行' : row.status === 'idle' ? '空闲' : '维修' }}
        </el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <ResourceFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import { getEquipmentList, createEquipment, updateEquipment, deleteEquipment } from '@/api/mdm'
import { useTable } from '@/hooks/useTable'
import ResourceFormDialog, { type ResourceFormModel } from './ResourceFormDialog.vue'

interface ResourceRow {
  id: string
  code: string
  name: string
  type: string
  model: string
  status: string
  workCenter: string
}

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', status: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      clearable: true,
      options: [
        { label: '运行', value: 'running' },
        { label: '空闲', value: 'idle' },
        { label: '维修', value: 'repair' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const cols: TableColumnItem<ResourceRow>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'code', label: '编码', minWidth: 140 },
  { prop: 'name', label: '名称', minWidth: 120 },
  { prop: 'type', label: '类型', minWidth: 100 },
  { prop: 'model', label: '型号', minWidth: 100 },
  { prop: 'status', label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'workCenter', label: '所属工作中心', minWidth: 140 },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<ResourceRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: { page: number; page_size: number; name?: string; status?: string } = {
      page,
      page_size: size
    }
    if (searchForm.value.keyword) {
      params.name = searchForm.value.keyword
    }
    if (searchForm.value.status) {
      params.status = searchForm.value.status
    }
    const res = await getEquipmentList(params)
    return {
      list: (res.data.items as any[]).map((item: any) => ({
        id: item.id,
        code: item.code,
        name: item.name,
        type: item.type || item.model || '',
        model: item.model || '',
        status: item.status,
        workCenter: item.workshop || item.workCenter || ''
      })),
      total: res.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteEquipment(id)))
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', status: '' }
  search()
}

// Dialog
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<ResourceFormModel>(createDefaultFormModel())

function createDefaultFormModel(): ResourceFormModel {
  return { id: '', code: '', name: '', type: '', model: '', status: 'idle', workCenter: '' }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: ResourceRow) {
  dialogMode.value = 'edit'
  formModel.value = { ...row }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name) {
    ElMessage.warning('请填写编码和名称')
    return
  }
  const payload = { ...formModel.value }
  if (dialogMode.value === 'add') {
    await createEquipment(payload as any)
  } else {
    await updateEquipment(formModel.value.id, payload as any)
  }
  dialogVisible.value = false
  await refresh()
}
</script>
