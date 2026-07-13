<template>
  <gi-page-layout>
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @reset="handleReset" @search="handleSearch" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border style="height: 100%">
      <template #index="{ $index }">
        {{ $index + 1 + (pagination.currentPage - 1) * pagination.pageSize }}
      </template>
      <template #status="{ row }">
        <el-tag :type="statusType(row.status)">{{ row.status }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="view" @click="handlePreview(row)" />
        <gi-button style="margin-left: 8px" type="edit" @click="handleDownload(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="remove(row)" />
      </template>
    </gi-table>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { deleteReport, downloadReport, getReportList, previewReport, type ReportItem } from '@/api/analysis'
import { useTable } from '@/hooks/useTable'

interface Report extends ReportItem {
  type: string
}

const searchForm = ref({ name: '' })

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '报表名称', field: 'name', props: { placeholder: '请输入报表名称' } as any }]

const columns: TableColumnItem<Report>[] = [
  { type: 'index', label: '#', minWidth: 60, slotName: 'index', align: 'center' },
  { prop: 'name', label: '报表名称', minWidth: 200 },
  { prop: 'type', label: '报表类型', minWidth: 120 },
  { prop: 'createdAt', label: '创建时间', minWidth: 140 },
  { prop: 'status', label: '状态', minWidth: 100, slotName: 'status' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, onDelete } = useTable<Report>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getReportList({
      pageNum: page,
      pageSize: size,
      name: searchForm.value.name || undefined
    })
    return {
      list: response.data.list.map((item) => ({ ...item, type: (item as any).type || (item as any).category || '-' })),
      total: response.data.total
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteReport(Number(id))))
})

function statusType(status: string): 'success' | 'warning' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    已生成: 'success',
    生成中: 'warning',
    生成失败: 'danger'
  }
  return map[status] || 'info'
}

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { name: '' }
  search()
}

async function handlePreview(row: Report) {
  const response = await previewReport(row.id)
  ElMessage.info(`预览报表：${response.data.name || row.name}`)
}

async function handleDownload(row: Report) {
  const response = await downloadReport(row.id)
  ElMessage.success(response.msg || `下载报表：${row.name}`)
}

function remove(row: Report) {
  onDelete(row)
}
</script>

<style scoped></style>
