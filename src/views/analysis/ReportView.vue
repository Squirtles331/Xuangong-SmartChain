<template>
  <gi-page-layout>
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @reset="handleReset" @search="handleSearch" />
    </template>

    <gi-table :columns="columns" :data="reports" :pagination="pagination" border style="height: 100%">
      <template #index="{ $index }">
        {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
      </template>
      <template #status="{ row }">
        <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="view" @click="handlePreview(row)" />
        <gi-button style="margin-left: 8px" type="edit" @click="handleDownload(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="handleDelete(row)" />
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { deleteReport, downloadReport, getReportList, previewReport } from '@/api/analysis'

interface Report {
  id: number
  name: string
  type: string
  createdAt: string
  status: string
}

const reports = ref<Report[]>([])
const searchForm = reactive({ name: '' })
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '报表名称', field: 'name', props: { placeholder: '请输入报表名称' } }]

const columns: TableColumnItem<Report>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'name', label: '报表名称', minWidth: 200 },
  { prop: 'type', label: '报表类型', minWidth: 120 },
  { prop: 'createdAt', label: '创建时间', minWidth: 140 },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

function statusType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    已生成: 'success',
    生成中: 'warning',
    生成失败: 'danger'
  }
  return map[status] || 'info'
}

async function loadReports() {
  const res = await getReportList({
    page: pagination.currentPage,
    page_size: pagination.pageSize,
    name: searchForm.name || undefined
  })

  reports.value = res.data.items || []
  pagination.total = res.data.total || 0
}

function handleSearch() {
  pagination.currentPage = 1
  loadReports()
}

function handleReset() {
  searchForm.name = ''
  pagination.currentPage = 1
  loadReports()
}

async function handlePreview(row: Report) {
  const res = await previewReport(row.id)
  ElMessage.info(`预览报表：${res.data.name || row.name}`)
}

async function handleDownload(row: Report) {
  const res = await downloadReport(row.id)
  ElMessage.success(res.message || `下载报表：${row.name}`)
}

async function handleDelete(row: Report) {
  try {
    await ElMessageBox.confirm(`确认删除报表「${row.name}」？`, '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteReport(row.id)
    if ((pagination.currentPage - 1) * pagination.pageSize >= pagination.total - 1) {
      pagination.currentPage = Math.max(1, pagination.currentPage - 1)
    }
    await loadReports()
    ElMessage.success('删除成功')
  } catch {
    // ignore cancel
  }
}

watch(
  () => pagination.currentPage,
  () => loadReports()
)

watch(
  () => pagination.pageSize,
  () => {
    pagination.currentPage = 1
    loadReports()
  }
)

onMounted(() => {
  loadReports()
})
</script>

<style scoped></style>
