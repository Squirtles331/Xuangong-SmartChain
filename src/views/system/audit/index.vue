<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" :required-fields="['user_name']" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          ref="searchFormRef"
          v-model="searchForm"
          :columns="visibleSearchColumns"
          search
          @search="handleSearch"
          @reset="handleReset"
        />
      </SearchSetting>
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
      <template #action_type="{ row }">
        <StatusTag :value="row.action" :options="AUDIT_ACTION" />
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click.stop="showDetail(row)">详情</el-button>
      </template>
    </gi-table>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="操作日志详情" width="600px" :lock-scroll="false">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作人">{{ detailLog?.user_name }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ detailLog?.created_at }}</el-descriptions-item>
        <el-descriptions-item label="模块">{{ detailLog?.module }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <StatusTag v-if="detailLog" :value="detailLog.action" :options="AUDIT_ACTION" />
        </el-descriptions-item>
        <el-descriptions-item label="操作对象">{{ detailLog?.target }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ detailLog?.ip }}</el-descriptions-item>
        <el-descriptions-item label="请求参数" :span="2">
          <pre class="json-preview">{{ detailLog?.request_params || '-' }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import StatusTag from '@/components/StatusTag.vue'
import { getAuditLogs, type AuditLog } from '@/api/system'
import { useTable } from '@/hooks/useTable'

const AUDIT_ACTION = [
  { value: 'CREATE', label: '新增', type: 'success' as const },
  { value: 'UPDATE', label: '修改', type: 'warning' as const },
  { value: 'DELETE', label: '删除', type: 'danger' as const },
  { value: 'APPROVE', label: '审批', type: 'primary' as const },
  { value: 'LOGIN', label: '登录', type: 'info' as const }
]

const searchFormRef = ref<FormInstance | null>()
const searchForm = ref({
  user_name: '',
  module: '',
  action: '',
  date_range: [] as string[]
})

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '操作人', field: 'user_name' },
  { type: 'input', label: '模块', field: 'module' },
  {
    type: 'select-v2',
    label: '操作类型',
    field: 'action',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '新增', value: 'CREATE' },
        { label: '修改', value: 'UPDATE' },
        { label: '删除', value: 'DELETE' },
        { label: '审批', value: 'APPROVE' },
        { label: '登录', value: 'LOGIN' }
      ]
    } as any
  },
  {
    type: 'date-picker',
    label: '时间范围',
    field: 'date_range',
    props: { type: 'daterange', startPlaceholder: '开始', endPlaceholder: '结束' } as any
  }
]

const allSearchColumns = computed(() => searchColumns)
const visibleSearchColumns = ref<FormColumnItem[]>([])

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

const columns: TableColumnItem<AuditLog>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'user_name', label: '操作人', width: 100 },
  { prop: 'module', label: '模块', width: 120 },
  { label: '操作', minWidth: 80, slotName: 'action_type', align: 'center' },
  { prop: 'target', label: '操作对象', minWidth: 160 },
  { prop: 'ip', label: 'IP', width: 140 },
  { prop: 'created_at', label: '时间', width: 170 },
  { label: '操作', minWidth: 80, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, search, refresh } = useTable<AuditLog>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const sf = searchForm.value
    const params: any = {
      page,
      page_size: size,
      user_name: sf.user_name || undefined,
      module: sf.module || undefined
    }
    if (sf.date_range?.length === 2) {
      params.start_date = sf.date_range[0]
      params.end_date = sf.date_range[1]
    }
    const response = await getAuditLogs(params)
    return {
      list: response.data.items as AuditLog[],
      total: response.data.total
    }
  }
})

function handleSearch() {
  search()
}

function handleReset() {
  searchForm.value = {
    user_name: '',
    module: '',
    action: '',
    date_range: []
  }
  search()
}

const detailVisible = ref(false)
const detailLog = ref<AuditLog | null>(null)

function showDetail(row: AuditLog) {
  detailLog.value = row
  detailVisible.value = true
}
</script>

<style scoped>
.json-preview {
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
</style>
