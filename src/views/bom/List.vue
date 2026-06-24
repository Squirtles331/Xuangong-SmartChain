<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>
    <template #tool>
      <gi-button type="add" @click="$router.push('/bom/create')">新建BOM</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="pagedBoms" :pagination="pagination" border stripe style="height: 100%">
      <template #bom_type="{ row }">
        <el-tag v-if="row.bom_type === 'EBOM'" type="primary" size="small">EBOM</el-tag>
        <el-tag v-else-if="row.bom_type === 'PBOM'" type="warning" size="small">PBOM</el-tag>
        <el-tag v-else type="success" size="small">MBOM</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag v-if="row.status === 'active'" type="success" size="small">生效中</el-tag>
        <el-tag v-else-if="row.status === 'draft'" type="info" size="small">草稿</el-tag>
        <el-tag v-else type="info" size="small">已归档</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="$router.push(`/bom/editor/${row.id}`)">编辑</el-button>
        <el-button type="primary" link size="small" @click="$router.push(`/bom/compare?ids=${row.id},${row.id}`)">比较</el-button>
        <el-button v-if="row.bom_type === 'EBOM'" type="warning" link size="small" @click="convertToMBOM(row)">转MBOM</el-button>
        <gi-button type="delete" size="small" @click="deleteBom(row.id)" />
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface BOM {
  id: string; material_code: string; material_name: string; bom_type: string; version: string
  status: string; effective_date: string; created_by: string; created_at: string
}

const boms = ref<BOM[]>([
  { id: '1', material_code: '04.01.001-00001', material_name: '离心泵 XJP-100', bom_type: 'EBOM', version: 'V2.0', status: 'active', effective_date: '2025-01-10', created_by: '张工', created_at: '2025-01-10' },
  { id: '2', material_code: '04.01.001-00001', material_name: '离心泵 XJP-100', bom_type: 'MBOM', version: 'V1.2', status: 'active', effective_date: '2025-01-12', created_by: '李工', created_at: '2025-01-12' },
  { id: '3', material_code: '04.02.001-00001', material_name: '齿轮箱 GBX-200', bom_type: 'EBOM', version: 'V1.0', status: 'active', effective_date: '2025-01-05', created_by: '张工', created_at: '2025-01-05' },
  { id: '4', material_code: '04.02.001-00001', material_name: '齿轮箱 GBX-200', bom_type: 'MBOM', version: 'V1.0', status: 'active', effective_date: '2025-01-08', created_by: '李工', created_at: '2025-01-08' },
  { id: '5', material_code: '03.01.001-00001', material_name: '传动轴 DS-50', bom_type: 'MBOM', version: 'V1.1', status: 'draft', effective_date: '-', created_by: '李工', created_at: '2025-01-15' },
  { id: '6', material_code: '04.01.001-00001', material_name: '离心泵 XJP-100', bom_type: 'MBOM', version: 'V1.1', status: 'archived', effective_date: '2024-12-01', created_by: '王工', created_at: '2024-12-01' },
  { id: '7', material_code: '04.01.001-00001', material_name: '离心泵 XJP-100', bom_type: 'MBOM', version: 'V1.0', status: 'archived', effective_date: '2024-10-15', created_by: '王工', created_at: '2024-10-15' }
])

const searchForm = reactive({ keyword: '', bom_type: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '物料编码/名称' } as any },
  { type: 'select-v2', label: 'BOM类型', field: 'bom_type', props: { options: [{ label: '全部', value: '' }, { label: 'EBOM', value: 'EBOM' }, { label: 'PBOM', value: 'PBOM' }, { label: 'MBOM', value: 'MBOM' }] } as any }
]

const columns: TableColumnItem<BOM>[] = [
  { prop: 'material_code', label: '产品编码', width: 180 },
  { prop: 'material_name', label: '产品名称', minWidth: 160 },
  { label: 'BOM类型', width: 80, slotName: 'bom_type', align: 'center' },
  { prop: 'version', label: '版本', width: 80, align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { prop: 'effective_date', label: '生效日期', width: 110 },
  { prop: 'created_by', label: '创建人', width: 80 },
  { label: '操作', width: 300, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

const filteredBoms = computed(() => {
  return boms.value.filter(b => {
    if (searchForm.keyword && !b.material_name.includes(searchForm.keyword) && !b.material_code.includes(searchForm.keyword)) return false
    if (searchForm.bom_type && b.bom_type !== searchForm.bom_type) return false
    return true
  })
})

const pagedBoms = computed(() => {
  pagination.total = filteredBoms.value.length
  return filteredBoms.value.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize)
})

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { searchForm.keyword = ''; searchForm.bom_type = ''; pagination.currentPage = 1 }
function refresh() { handleReset() }

function convertToMBOM(row: BOM) {
  ElMessageBox.confirm(`将 ${row.material_name} 的 EBOM ${row.version} 转换为 MBOM？`, '转换确认').then(() => {
    boms.value.unshift({ ...row, id: Date.now().toString(), bom_type: 'MBOM', version: 'V1.0 (新)', status: 'draft', effective_date: '-', created_by: '当前用户', created_at: new Date().toISOString().slice(0, 10) })
    ElMessage.success('已创建 MBOM 草稿，请在编辑器中完善')
  }).catch(() => {})
}

function deleteBom(id: string) {
  ElMessageBox.confirm('确定删除该BOM版本？', '警告', { type: 'warning' }).then(() => {
    boms.value = boms.value.filter(b => b.id !== id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>
