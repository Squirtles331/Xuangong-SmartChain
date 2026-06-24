<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>

    <gi-table :columns="columns" :data="pagedLogs" :pagination="pagination" border style="height: 100%">
      <template #action_type="{ row }">
        <el-tag v-if="row.action === 'CREATE'" type="success" size="small">新增</el-tag>
        <el-tag v-else-if="row.action === 'UPDATE'" type="warning" size="small">修改</el-tag>
        <el-tag v-else-if="row.action === 'DELETE'" type="danger" size="small">删除</el-tag>
        <el-tag v-else-if="row.action === 'APPROVE'" type="primary" size="small">审批</el-tag>
        <el-tag v-else size="small">{{ row.action }}</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="showDetail(row)">详情</el-button>
      </template>
    </gi-table>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" title="操作日志详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作人">{{ detailLog?.user_name }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{ detailLog?.created_at }}</el-descriptions-item>
        <el-descriptions-item label="模块">{{ detailLog?.module }}</el-descriptions-item>
        <el-descriptions-item label="操作类型">
          <el-tag v-if="detailLog?.action === 'CREATE'" type="success" size="small">新增</el-tag>
          <el-tag v-else-if="detailLog?.action === 'UPDATE'" type="warning" size="small">修改</el-tag>
          <el-tag v-else-if="detailLog?.action === 'DELETE'" type="danger" size="small">删除</el-tag>
          <el-tag v-else size="small">{{ detailLog?.action }}</el-tag>
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
import { ref, reactive, computed } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface Log {
  id: string; user_name: string; module: string; action: string; target: string; ip: string; request_params?: string; created_at: string
}

const logs = ref<Log[]>([
  { id: '1', user_name: '张三', module: '工单管理', action: 'CREATE', target: 'WO202501150001', ip: '192.168.1.100', created_at: '2025-01-15 09:30:00', request_params: '{"wo_type":"production","material_id":"xxx","planned_qty":100}' },
  { id: '2', user_name: '李四', module: '工单管理', action: 'APPROVE', target: 'WO202501150001', ip: '192.168.1.101', created_at: '2025-01-15 10:00:00' },
  { id: '3', user_name: '王五', module: '用户管理', action: 'UPDATE', target: 'user_E00000001', ip: '192.168.1.102', created_at: '2025-01-15 11:00:00', request_params: '{"real_name":"王五(修改)"}' },
  { id: '4', user_name: '张三', module: 'BOM管理', action: 'DELETE', target: 'BOM_V1.1_xxx', ip: '192.168.1.100', created_at: '2025-01-15 14:00:00' },
  { id: '5', user_name: '赵六', module: '采购管理', action: 'CREATE', target: 'PO202501150001', ip: '192.168.1.103', created_at: '2025-01-15 15:30:00', request_params: '{"supplier_id":"SUP00000001","items":[...]}' },
  { id: '6', user_name: '张三', module: '系统管理', action: 'LOGIN', target: 'user_login', ip: '192.168.1.100', created_at: '2025-01-15 08:00:00' },
  { id: '7', user_name: '李四', module: '系统管理', action: 'LOGIN_FAILED', target: 'user_login', ip: '192.168.1.200', created_at: '2025-01-15 08:05:00' }
])

const searchForm = reactive({ user_name: '', module: '', action: '', date_range: [] as string[] })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '操作人', field: 'user_name' },
  { type: 'input', label: '模块', field: 'module' },
  { type: 'select-v2', label: '操作类型', field: 'action', props: { options: [{ label: '全部', value: '' }, { label: '新增', value: 'CREATE' }, { label: '修改', value: 'UPDATE' }, { label: '删除', value: 'DELETE' }, { label: '审批', value: 'APPROVE' }, { label: '登录', value: 'LOGIN' }] } as any },
  { type: 'date-picker', label: '时间范围', field: 'date_range', props: { type: 'daterange', startPlaceholder: '开始', endPlaceholder: '结束' } as any }
]

const columns: TableColumnItem<Log>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'user_name', label: '操作人', width: 100 },
  { prop: 'module', label: '模块', width: 120 },
  { label: '操作', width: 80, slotName: 'action_type', align: 'center' },
  { prop: 'target', label: '操作对象', minWidth: 160 },
  { prop: 'ip', label: 'IP', width: 140 },
  { prop: 'created_at', label: '时间', width: 170 },
  { label: '操作', width: 80, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

const filteredLogs = computed(() => {
  return logs.value.filter(l => {
    if (searchForm.user_name && !l.user_name.includes(searchForm.user_name)) return false
    if (searchForm.module && !l.module.includes(searchForm.module)) return false
    if (searchForm.action && l.action !== searchForm.action) return false
    return true
  })
})

const pagedLogs = computed(() => {
  pagination.total = filteredLogs.value.length
  const s = (pagination.currentPage - 1) * pagination.pageSize
  return filteredLogs.value.slice(s, s + pagination.pageSize)
})

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { searchForm.user_name = ''; searchForm.module = ''; searchForm.action = ''; searchForm.date_range = []; pagination.currentPage = 1 }

const detailVisible = ref(false)
const detailLog = ref<Log | null>(null)
function showDetail(row: Log) { detailLog.value = row; detailVisible.value = true }
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
