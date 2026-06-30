<template>
  <gi-page-layout>
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border style="height: 100%">
      <template #actionType="{ row }">
        <StatusTag :value="row.action" :options="auditActions" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
      </template>
    </gi-table>

    <LogFormDialog v-model:visible="detailVisible" v-model:detail-log="detailLog" @close="detailVisible = false" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import StatusTag from '@/components/StatusTag.vue'
import { getAuditLogs, type AuditLog } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import LogFormDialog from './LogFormDialog.vue'

const auditActions = [
  { value: 'CREATE', label: '新增', type: 'success' as const },
  { value: 'UPDATE', label: '修改', type: 'warning' as const },
  { value: 'DELETE', label: '删除', type: 'danger' as const },
  { value: 'APPROVE', label: '审批', type: 'primary' as const },
  { value: 'LOGIN', label: '登录', type: 'info' as const }
]

const searchForm = ref({ userName: '', module: '', action: '', dateRange: [] as string[] })

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '操作人', field: 'userName' },
  { type: 'input', label: '模块', field: 'module' },
  {
    type: 'select-v2',
    label: '操作类型',
    field: 'action',
    props: {
      options: [{ label: '全部', value: '' }, ...auditActions.map((item) => ({ label: item.label, value: item.value }))]
    } as any
  },
  {
    type: 'date-picker',
    label: '时间范围',
    field: 'dateRange',
    props: { type: 'daterange', startPlaceholder: '开始', endPlaceholder: '结束' } as any
  }
]

const columns: TableColumnItem<AuditLog>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'userName', label: '操作人', width: 100 },
  { prop: 'module', label: '模块', width: 120 },
  { label: '操作', minWidth: 80, slotName: 'actionType', align: 'center' },
  { prop: 'target', label: '操作对象', minWidth: 160 },
  { prop: 'ip', label: 'IP', width: 140 },
  { prop: 'createdAt', label: '时间', width: 170 },
  { label: '操作', minWidth: 80, fixed: 'right', slotName: 'actions', align: 'center' }
]

const allLogs = ref<AuditLog[]>([])

const { tableData, pagination, loading, search } = useTable<AuditLog>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getAuditLogs({
      pageNum: 1,
      pageSize: 9999,
      userName: searchForm.value.userName || undefined,
      module: searchForm.value.module || undefined,
      startDate: searchForm.value.dateRange?.[0] || undefined,
      endDate: searchForm.value.dateRange?.[1] || undefined
    })

    allLogs.value = response.data.list

    let filtered = allLogs.value
    if (searchForm.value.action) {
      filtered = filtered.filter((item) => item.action === searchForm.value.action)
    }

    const start = (page - 1) * size
    return {
      list: filtered.slice(start, start + size),
      total: filtered.length
    }
  }
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = { userName: '', module: '', action: '', dateRange: [] }
  search()
}

const detailVisible = ref(false)
const detailLog = ref<AuditLog | null>(null)

function showDetail(row: AuditLog) {
  detailLog.value = row
  detailVisible.value = true
}
</script>

<style scoped></style>
