<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="inspection-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form ref="sf" v-model="s" :columns="visibleSearchColumns" search @search="hs" @reset="hr" />
      </SearchSetting>
    </template>
    <gi-table :columns="cols" :data="pagedData" :pagination="pagination" border stripe>
      <template #verdict="{ row }">
        <StatusTag :value="row.verdict || ''" :options="INSPECTION_VERDICT" />
      </template>
      <template #status="{ row }">
        <StatusTag :value="row.status" :options="INSPECTION_STATUS" />
      </template>
      <template #actions="{ row }">
        <el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="inspect(row)">检验</el-button>
      </template>
    </gi-table>
    <el-dialog v-model="iv" title="执行检验" width="700px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="任务编号">{{ ic?.code }}</el-descriptions-item>
        <el-descriptions-item label="物料">{{ ic?.material }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="items" border style="margin-top: 16px">
        <el-table-column prop="name" label="检验项目" width="140" />
        <el-table-column prop="standard" label="标准值" width="140" />
        <el-table-column label="实测值" width="140">
          <template #default="{ row }">
            <el-input v-model="row.value" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="判定" width="100">
          <template #default="{ row }">
            <el-tag :type="row.value ? (Math.abs(Number(row.value) - Number(row.standard)) < 0.5 ? 'success' : 'danger') : 'info'" size="small">
              {{ row.value ? (Math.abs(Number(row.value) - Number(row.standard)) < 0.5 ? '合格' : '不合格') : '-' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 16px">
        <el-radio-group v-model="ir">
          <el-radio value="qualified">合格</el-radio>
          <el-radio value="concession">让步接收</el-radio>
          <el-radio value="sorting">挑选使用</el-radio>
          <el-radio value="return">退货</el-radio>
          <el-radio value="scrap">报废</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="iv = false">取消</el-button>
        <el-button type="primary" @click="submitInspect">提交</el-button>
      </template>
    </el-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getInspectionTaskList, updateInspectionTask } from '@/api/qms'

const INSPECTION_VERDICT = [
  { value: '合格', label: '合格', type: 'success' as const },
  { value: '让步', label: '让步', type: 'warning' as const },
  { value: '返工', label: '返工', type: 'danger' as const },
  { value: '退货', label: '退货', type: 'danger' as const },
  { value: '报废', label: '报废', type: 'info' as const }
]

const INSPECTION_STATUS = [
  { value: 'pending', label: '待检', type: 'warning' as const },
  { value: 'done', label: '已完成', type: 'success' as const }
]

const s = ref({ keyword: '', type: '', verdict: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  {
    type: 'select-v2',
    label: '检验类型',
    field: 'type',
    props: {
      options: [
        { label: '来料检验', value: '来料检验' },
        { label: '过程检验', value: '过程检验' },
        { label: '最终检验', value: '最终检验' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '判定结果',
    field: 'verdict',
    props: {
      options: [
        { label: '合格', value: '合格' },
        { label: '让步', value: '让步' },
        { label: '返工', value: '返工' },
        { label: '退货', value: '退货' },
        { label: '报废', value: '报废' }
      ]
    } as any
  }
]

const allSearchColumns = computed(() => sc)
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

interface T {
  id: string
  code: string
  type: string
  material: string
  lot: string
  qty: number
  status: string
  verdict?: string
}
const data = ref<T[]>([])

const filteredData = computed(() => {
  return data.value.filter((d) => {
    const matchKeyword =
      !s.value.keyword || d.code.includes(s.value.keyword) || d.material.includes(s.value.keyword) || d.lot.includes(s.value.keyword)
    const matchType = !s.value.type || d.type === s.value.type
    const matchVerdict = !s.value.verdict || d.verdict === s.value.verdict
    return matchKeyword && matchType && matchVerdict
  })
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => filteredData.value.length)
}) as any

const pagedData = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredData.value.slice(start, end)
})

async function fetchList() {
  try {
    const res = await getInspectionTaskList({
      page: 1,
      page_size: 200,
      code: s.value.keyword || undefined,
      type: s.value.type || undefined,
      material: s.value.keyword || undefined
    })
    data.value = (res.data.items || res.data || []).map((t: any) => ({
      ...t,
      verdict: t.verdict || ''
    })) as T[]
  } catch {
    ElMessage.error('获取检验任务列表失败')
  }
}

function hs() {
  pagination.value.currentPage = 1
  fetchList()
}
function hr() {
  s.value = { keyword: '', type: '', verdict: '' }
  pagination.value.currentPage = 1
  fetchList()
}

const cols: TableColumnItem<T>[] = [
  { prop: 'code', label: '任务编号', width: 170 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'lot', label: '批号', width: 160 },
  { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
  { label: '判定', minWidth: 80, slotName: 'verdict', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 80, slotName: 'actions', align: 'center' }
]

const iv = ref(false)
const ic = ref<T | null>(null)
const ir = ref('qualified')
const items = ref<any[]>([])
function inspect(r: T) {
  ic.value = r
  iv.value = true
  items.value = [
    { name: '尺寸', standard: '100.00', value: '' },
    { name: '硬度', standard: '45', value: '' },
    { name: '表面粗糙度', standard: '3.2', value: '' }
  ]
}
async function submitInspect() {
  if (ic.value) {
    const verdictMap: Record<string, string> = {
      qualified: '合格',
      concession: '让步',
      sorting: '返工',
      return: '退货',
      scrap: '报废'
    }
    try {
      await updateInspectionTask(ic.value.id, {
        status: 'done',
        verdict: verdictMap[ir.value] || ''
      })
      ic.value.status = 'done'
      ic.value.verdict = verdictMap[ir.value] || ''
      ElMessage.success(`检验完成: ${ir.value}`)
    } catch {
      ElMessage.error('提交检验结果失败')
    }
  }
  iv.value = false
}

onMounted(() => {
  fetchList()
})
</script>
