<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @reset="handleReset" @search="handleSearch" />
    </template>

    <gi-table :columns="columns" :data="pagedReports" :pagination="pagination" border style="height: 100%">
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
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface Report {
  id: number
  name: string
  type: string
  createdAt: string
  status: string
}

const reports = ref<Report[]>([
  { id: 1, name: '2024年6月营收报表', type: '营收报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 2, name: '2024年6月工单汇总', type: '工单报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 3, name: '2024年6月设备OEE分析', type: 'OEE报表', createdAt: '2024-06-30', status: '生成中' },
  { id: 4, name: '2024年5月营收报表', type: '营收报表', createdAt: '2024-05-31', status: '已生成' },
  { id: 5, name: '2024年5月工单汇总', type: '工单报表', createdAt: '2024-05-31', status: '已生成' },
  { id: 6, name: '2024年5月设备OEE分析', type: 'OEE报表', createdAt: '2024-05-31', status: '已生成' },
  { id: 7, name: '2024年Q2质量分析报告', type: '质量报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 8, name: '2024年6月库存盘点', type: '库存报表', createdAt: '2024-06-30', status: '生成失败' },
  { id: 9, name: '2024年6月采购汇总', type: '采购报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 10, name: '2024年Q2交付率统计', type: '交付报表', createdAt: '2024-06-30', status: '已生成' },
  { id: 11, name: '2024年6月能耗统计', type: '能耗报表', createdAt: '2024-06-28', status: '已生成' },
  { id: 12, name: '2024年6月人员效率分析', type: '效率报表', createdAt: '2024-06-29', status: '生成中' }
])

const searchForm = ref({ name: '' })

const searchColumns: FormColumnItem[] = [{ type: 'input', label: '报表名称', field: 'name', props: { placeholder: '请输入报表名称' } }]

const filteredReports = computed(() => {
  return reports.value.filter((r) => !searchForm.value.name || r.name.includes(searchForm.value.name))
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: computed(() => filteredReports.value.length)
}) as any

const pagedReports = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredReports.value.slice(start, end)
})

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
    '已生成': 'success',
    '生成中': 'warning',
    '生成失败': 'danger'
  }
  return map[status] || 'info'
}

function handleSearch() {
  pagination.value.currentPage = 1
}

function handleReset() {
  searchForm.value = { name: '' }
  pagination.value.currentPage = 1
}

function handlePreview(row: Report) {
  ElMessage.info(`预览报表：${row.name}`)
}

function handleDownload(row: Report) {
  ElMessage.success(`下载报表：${row.name}`)
}

async function handleDelete(row: Report) {
  try {
    await ElMessageBox.confirm(`确认删除报表「${row.name}」？`, '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    reports.value = reports.value.filter((r) => r.id !== row.id)
    if ((pagination.value.currentPage - 1) * pagination.value.pageSize >= reports.value.length) {
      pagination.value.currentPage = Math.max(1, pagination.value.currentPage - 1)
    }
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped></style>
