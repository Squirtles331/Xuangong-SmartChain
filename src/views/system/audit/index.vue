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

    <TableSetting title="系统审计日志" :columns="columns" @refresh="refresh">
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
          <template #actionType="{ row }">
            <StatusTag :value="row.action" :options="auditActionOptions" />
          </template>

          <template #actions="{ row }">
            <el-button type="primary" link size="small" @click.stop="showDetail(row)">详情</el-button>
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <AuditDetailDialog v-model:visible="detailVisible" :detail-log="detailLog" :action-options="auditActionOptions" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import TableSetting from '@/components/TableSetting.vue'
import { getAuditLogs, type AuditLog, type AuditLogQuery } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import AuditDetailDialog from './AuditDetailDialog.vue'

const auditActionOptions = [
  { value: 'CREATE', label: '新增', type: 'success' as const },
  { value: 'UPDATE', label: '修改', type: 'warning' as const },
  { value: 'DELETE', label: '删除', type: 'danger' as const },
  { value: 'APPROVE', label: '审批', type: 'primary' as const },
  { value: 'LOGIN', label: '登录', type: 'info' as const }
]

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '操作人', field: 'userName', props: { clearable: true } as any },
  { type: 'input', label: '模块', field: 'module', props: { clearable: true } as any },
  {
    type: 'select-v2',
    label: '操作类型',
    field: 'action',
    props: {
      clearable: true,
      options: auditActionOptions.map((item) => ({ label: item.label, value: item.value }))
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

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<AuditLog>[] = [
  { prop: 'userName', label: '操作人', minWidth: 100 },
  { prop: 'module', label: '模块', minWidth: 120 },
  { label: '操作类型', minWidth: 100, slotName: 'actionType', align: 'center' },
  { prop: 'target', label: '操作对象', minWidth: 180 },
  { prop: 'ip', label: 'IP 地址', minWidth: 140 },
  { prop: 'createdAt', label: '操作时间', minWidth: 170 },
  { label: '操作', minWidth: 90, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  userName: string
  module: string
  action: string
  dateRange: string[]
}>({
  userName: '',
  module: '',
  action: '',
  dateRange: []
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
const detailVisible = ref(false)
const detailLog = ref<AuditLog | null>(null)

const { tableData, pagination, loading, search, refresh } = useTable<AuditLog>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: AuditLogQuery = {
      pageNum: page,
      pageSize: size,
      userName: queryParams.userName || undefined,
      module: queryParams.module || undefined,
      action: queryParams.action || undefined
    }

    if (queryParams.dateRange.length === 2) {
      params.startDate = queryParams.dateRange[0]
      params.endDate = queryParams.dateRange[1]
    }

    const response = await getAuditLogs(params)
    return response.data
  }
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

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
