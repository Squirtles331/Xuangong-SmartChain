<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="操作日志"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    :table-attrs="{ border: true, stripe: true, style: 'height: 100%' }"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
  >
    <template #actionType="{ row }">
      <StatusTag :value="row.action" :options="auditActions" />
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="detailActions" @action="showDetail(row)" />
    </template>

    <template #dialog>
      <LogFormDialog v-model:visible="detailVisible" v-model:detail-log="detailLog" @close="detailVisible = false" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { AuditLog } from '@/api/system'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import StatusTag from '@/components/StatusTag.vue'
import { useTable } from '@/hooks/useTable'
import { sysAuditLogRecords } from '../static-data'
import LogFormDialog from './LogFormDialog.vue'

const auditActions = [
  { value: 'CREATE', label: '新增', type: 'success' as const },
  { value: 'UPDATE', label: '修改', type: 'warning' as const },
  { value: 'DELETE', label: '删除', type: 'danger' as const },
  { value: 'APPROVE', label: '审批', type: 'primary' as const },
  { value: 'LOGIN', label: '登录', type: 'info' as const }
]

const detailActions = [{ key: 'detail', label: '详情', tone: 'primary' as const }]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '操作人', field: 'userName', props: { clearable: true } as any },
  { type: 'input', label: '模块', field: 'module', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '操作类型',
    field: 'action',
    props: {
      clearable: true,
      options: auditActions.map((item) => ({ label: item.label, value: item.value }))
    } as any
  },
  {
    type: 'date-picker',
    label: '时间范围',
    field: 'dateRange',
    props: {
      type: 'daterange',
      valueFormat: 'YYYY-MM-DD',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    } as any
  }
]

const columns: TableColumnItem<AuditLog>[] = [
  { prop: 'userName', label: '操作人', minWidth: 100 },
  { prop: 'module', label: '模块', minWidth: 130 },
  { label: '操作类型', minWidth: 100, slotName: 'actionType', align: 'center' },
  { prop: 'target', label: '操作对象', minWidth: 180 },
  { prop: 'ip', label: 'IP 地址', minWidth: 130 },
  { prop: 'createdAt', label: '操作时间', minWidth: 170 },
  { label: '操作', minWidth: 90, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  userName: '',
  module: '',
  action: '',
  dateRange: [] as string[]
})

const detailVisible = ref(false)
const detailLog = ref<AuditLog | null>(null)

const filteredLogs = computed(() => {
  return sysAuditLogRecords.value.filter((item) => {
    const matchUser = !queryParams.userName || item.userName.includes(queryParams.userName)
    const matchModule = !queryParams.module || item.module.includes(queryParams.module)
    const matchAction = !queryParams.action || item.action === queryParams.action
    const matchRange =
      queryParams.dateRange.length !== 2 ||
      (item.createdAt.slice(0, 10) >= queryParams.dateRange[0] && item.createdAt.slice(0, 10) <= queryParams.dateRange[1])

    return matchUser && matchModule && matchAction && matchRange
  })
})

const { tableData, pagination, loading, search, refresh } = useTable<AuditLog>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredLogs.value.slice(start, end),
      total: filteredLogs.value.length
    }
  }
})

function handleReset() {
  Object.assign(queryParams, {
    userName: '',
    module: '',
    action: '',
    dateRange: []
  })
  search()
}

function showDetail(row: AuditLog) {
  detailLog.value = row
  detailVisible.value = true
}
</script>
