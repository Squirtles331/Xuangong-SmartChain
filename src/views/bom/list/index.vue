<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="searchFormRef" v-model="searchForm" :columns="visibleSearchColumns" search @search="handleSearch" @reset="handleReset" />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd">新建 BOM</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe style="height: 100%">
      <template #bom_type="{ row }">
        <StatusTag :value="row.bom_type" :options="BOM_TYPE" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="BOM_STATUS" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="openEditor(row)">编辑</el-button>
        <el-button type="primary" link size="small" @click="openCompare(row)">比较</el-button>
        <el-button v-if="row.bom_type === 'EBOM'" type="warning" link size="small" @click="convertToMBOM(row)">转 MBOM</el-button>
        <gi-button type="delete" size="small" @click="onDelete(row)" />
      </template>
    </gi-table>

    <BOMCompareDialog
      v-model:visible="compareVisible"
      v-model:selected-version-id="compareVersion"
      :current-bom="compareBom"
      :versions="otherVersions"
      @submit="doCompare"
    />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { deleteBOM as deleteBOMApi, getBOMList, saveBOM } from '@/api/bom'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'
import BOMCompareDialog from './BOMCompareDialog.vue'

const BOM_TYPE = [
  { value: 'EBOM', label: 'EBOM', type: 'primary' as const },
  { value: 'PBOM', label: 'PBOM', type: 'warning' as const },
  { value: 'MBOM', label: 'MBOM', type: 'success' as const }
]

const BOM_STATUS = [
  { value: 'active', label: '生效中', type: 'success' as const },
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'archived', label: '已归档', type: 'info' as const }
]

interface BOMRow {
  id: string
  material_code: string
  material_name: string
  bom_type: string
  version: string
  status: string
  effective_date: string
  created_by: string
  created_at: string
}

const router = useRouter()
const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({ keyword: '', bom_type: '' })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码/名称' } as any },
  {
    type: 'select-v2',
    label: 'BOM 类型',
    field: 'bom_type',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: 'EBOM', value: 'EBOM' },
        { label: 'PBOM', value: 'PBOM' },
        { label: 'MBOM', value: 'MBOM' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<BOMRow>[] = [
  { prop: 'material_code', label: '产品编码', width: 180 },
  { prop: 'material_name', label: '产品名称', minWidth: 160 },
  { label: 'BOM 类型', minWidth: 80, slotName: 'bom_type', align: 'center' },
  { prop: 'version', label: '版本', minWidth: 80, align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'effective_date', label: '生效日期', width: 110 },
  { prop: 'created_by', label: '创建人', width: 80 },
  { label: '操作', minWidth: 300, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<BOMRow>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const res = await getBOMList({
      page,
      page_size: size,
      material_code: searchForm.value.keyword || undefined,
      material_name: searchForm.value.keyword || undefined,
      status: searchForm.value.bom_type || undefined
    })
    return {
      list: (res.data.items || []).map((item: any) => ({
        id: item.id,
        material_code: item.material_code,
        material_name: item.material_name,
        bom_type: item.bom_type,
        version: item.version,
        status: item.status,
        effective_date: item.effective_date || '',
        created_by: item.created_by || '',
        created_at: item.created_at || ''
      })),
      total: res.data.total || 0
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteBOMApi(id)))
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { keyword: '', bom_type: '' }
  search()
}

function openAdd() {
  router.push('/bom/create')
}

function openEditor(row: BOMRow) {
  router.push(`/bom/editor/${row.id}`)
}

const compareVisible = ref(false)
const compareBom = ref<BOMRow | null>(null)
const compareVersion = ref('')

const otherVersions = computed(() => {
  if (!compareBom.value) return []
  return tableData.value.filter((item) => item.material_code === compareBom.value?.material_code && item.id !== compareBom.value?.id)
})

function openCompare(row: BOMRow) {
  compareBom.value = row
  compareVersion.value = ''
  compareVisible.value = true
}

function doCompare() {
  if (!compareBom.value || !compareVersion.value) return
  compareVisible.value = false
  router.push(`/bom/compare?ids=${compareBom.value.id},${compareVersion.value}`)
}

function convertToMBOM(row: BOMRow) {
  ElMessageBox.confirm(`将 ${row.material_name} 的 EBOM ${row.version} 转换为 MBOM？`, '转换确认')
    .then(async () => {
      try {
        await saveBOM({
          ...row,
          bom_type: 'MBOM',
          version: 'V1.0 (新)',
          status: 'draft',
          id: undefined
        })
        ElMessage.success('已创建 MBOM 草稿，请在编辑器中完善')
        await refresh()
      } catch {
        ElMessage.error('转换失败')
      }
    })
    .catch(() => {})
}
</script>
