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
      <gi-button type="add" @click="openAdd">新建 BOM</gi-button>
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="BOM 列表" :columns="columns" @refresh="refresh">
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
          <template #bomType="{ row }">
            <StatusTag :value="row.bom_type" :options="bomTypeOptions" />
          </template>

          <template #status="{ row }">
            <StatusTag :value="row.status" :options="bomStatusOptions" />
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click="openEditor(row)">编辑</el-button>
            <el-button type="primary" link size="small" @click="openCompare(row)">对比</el-button>
            <el-button v-if="row.bom_type === 'EBOM'" type="warning" link size="small" @click="convertToMBOM(row)">转 MBOM</el-button>
            <gi-button type="delete" size="small" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

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
import { computed, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { deleteBOM as deleteBOMApi, getBOMList, saveBOM, type BOMListQuery, type BOMVersion } from '@/api/bom'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { useTable } from '@/hooks/useTable'
import BOMCompareDialog from './BOMCompareDialog.vue'

const router = useRouter()

const bomTypeOptions = [
  { value: 'EBOM', label: 'EBOM', type: 'primary' as const },
  { value: 'PBOM', label: 'PBOM', type: 'warning' as const },
  { value: 'MBOM', label: 'MBOM', type: 'success' as const }
]

const bomStatusOptions = [
  { value: 'active', label: '生效中', type: 'success' as const },
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'archived', label: '已归档', type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码 / 物料名称' } as any },
  {
    type: 'select-v2',
    label: 'BOM 类型',
    field: 'bomType',
    props: {
      options: [{ label: '全部', value: '' }, ...bomTypeOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as any
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [{ label: '全部', value: '' }, ...bomStatusOptions.map((item) => ({ label: item.label, value: item.value }))]
    } as any
  }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<BOMVersion>[] = [
  { prop: 'material_code', label: '物料编码', minWidth: 170 },
  { prop: 'material_name', label: '物料名称', minWidth: 160 },
  { label: 'BOM 类型', minWidth: 100, align: 'center', slotName: 'bomType' },
  { prop: 'version', label: '版本', minWidth: 90, align: 'center' },
  { label: '状态', minWidth: 100, align: 'center', slotName: 'status' },
  { prop: 'effective_date', label: '生效日期', minWidth: 120 },
  { prop: 'created_by', label: '创建人', minWidth: 100 },
  { label: '操作', minWidth: 260, fixed: 'right', align: 'center', slotName: 'actions' }
]

const queryParams = reactive({
  keyword: '',
  bomType: '',
  status: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<BOMVersion>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: BOMListQuery = {
      pageNum: page,
      pageSize: size,
      materialCode: queryParams.keyword || undefined,
      materialName: queryParams.keyword || undefined,
      bomType: queryParams.bomType || undefined,
      status: queryParams.status || undefined
    }
    const response = await getBOMList(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteBOMApi(id)))
})

const compareVisible = ref(false)
const compareBom = ref<BOMVersion | null>(null)
const compareVersion = ref('')

const otherVersions = computed(() => {
  if (!compareBom.value) return []
  return tableData.value.filter((item) => item.material_code === compareBom.value?.material_code && item.id !== compareBom.value?.id)
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    bomType: '',
    status: ''
  })
  search()
}

function openAdd() {
  router.push('/engineering-plan/plm/bom/create')
}

function openEditor(row: BOMVersion) {
  router.push(`/engineering-plan/plm/bom/editor/${row.id}`)
}

function openCompare(row: BOMVersion) {
  compareBom.value = row
  compareVersion.value = ''
  compareVisible.value = true
}

function doCompare() {
  if (!compareBom.value || !compareVersion.value) return
  compareVisible.value = false
  router.push(`/engineering-plan/plm/bom/compare?ids=${compareBom.value.id},${compareVersion.value}`)
}

function convertToMBOM(row: BOMVersion) {
  ElMessageBox.confirm(`确认将 ${row.material_name} 的 ${row.version} 转换为 MBOM 草稿吗？`, '转换确认')
    .then(async () => {
      await saveBOM({
        ...row,
        bom_type: 'MBOM',
        version: 'V1.0',
        status: 'draft',
        id: undefined
      })
      ElMessage.success('已创建 MBOM 草稿，请继续完善')
      await refresh()
    })
    .catch(() => {})
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
