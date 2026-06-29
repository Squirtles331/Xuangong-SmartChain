<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          :columns="visibleSearchColumns"
          ref="searchFormRef"
          v-model="searchForm"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd">新建BOM</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      border
      stripe
      style="height: 100%"
    >
      <template #bom_type="{ row }">
        <StatusTag :value="row.bom_type" :options="BOM_TYPE" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="BOM_STATUS" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="openEditor(row)">编辑</el-button>
        <el-button type="primary" link size="small" @click="openCompare(row)">比较</el-button>
        <el-button v-if="row.bom_type === 'EBOM'" type="warning" link size="small" @click="convertToMBOM(row)">
          转MBOM
        </el-button>
        <gi-button type="delete" size="small" @click="onDelete(row)" />
      </template>
    </gi-table>

    <!-- 版本比较选择弹窗 -->
    <el-dialog v-model="compareVisible" title="选择比较版本" width="500px" :lock-scroll="false">
      <el-form label-width="80px">
        <el-form-item label="当前BOM">
          <el-tag>{{ compareBom?.material_code }} {{ compareBom?.material_name }} {{ compareBom?.version }}</el-tag>
        </el-form-item>
        <el-form-item label="比较版本">
          <el-select v-model="compareVersion" placeholder="选择要比较的版本" style="width: 100%">
            <el-option
              v-for="b in otherVersions"
              :key="b.id"
              :label="`${b.version} (${b.status === 'active' ? '生效中' : b.status === 'draft' ? '草稿' : '已归档'})`"
              :value="b.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="compareVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!compareVersion" @click="doCompare">开始比较</el-button>
      </template>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { getBOMList, saveBOM, deleteBOM as deleteBOMApi } from '@/api/bom'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import { useTable } from '@/hooks/useTable'

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
    label: 'BOM类型',
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
  { label: 'BOM类型', minWidth: 80, slotName: 'bom_type', align: 'center' },
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

// 版本比较
const compareVisible = ref(false)
const compareBom = ref<BOMRow | null>(null)
const compareVersion = ref('')

const otherVersions = computed(() => {
  if (!compareBom.value) return []
  return tableData.value.filter(
    (b) => b.material_code === compareBom.value!.material_code && b.id !== compareBom.value!.id
  )
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

// EBOM → MBOM
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
