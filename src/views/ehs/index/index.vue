<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="隐患排查" name="hazard">
        <template #tool><gi-button type="add" @click="openAdd('hazard')" /></template>
        <gi-table :columns="hazardCols" :data="hazards" border stripe size="small">
          <template #level="{ row }"
            ><el-tag :type="row.level === 'major' ? 'danger' : row.level === 'moderate' ? 'warning' : 'info'" size="small">{{
              row.level === 'major' ? '重大' : row.level === 'moderate' ? '一般' : '低风险'
            }}</el-tag></template
          >
          <template #status="{ row }"
            ><el-tag :type="row.status === 'open' ? 'danger' : row.status === 'processing' ? 'warning' : 'success'" size="small">{{
              row.status === 'open' ? '待整改' : row.status === 'processing' ? '整改中' : '已关闭'
            }}</el-tag></template
          >
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="作业票管理" name="permit">
        <gi-table :columns="permitCols" :data="permits" border stripe size="small">
          <template #type="{ row }"
            ><el-tag size="small">{{
              row.type === 'hot' ? '动火' : row.type === 'height' ? '高处' : row.type === 'confined' ? '受限空间' : '临时用电'
            }}</el-tag></template
          >
          <template #status="{ row }"
            ><el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'info'" size="small">{{
              row.status === 'approved' ? '已批准' : row.status === 'pending' ? '待审批' : '已关闭'
            }}</el-tag></template
          >
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'

const tab = ref('hazard')
const hazards = ref([
  {
    id: '1',
    code: 'YH20250115001',
    location: '机加工一车间',
    desc: '冷却液泄漏',
    level: 'moderate',
    status: 'open',
    finder: '李四',
    found_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'YH20250110002',
    location: '装配车间',
    desc: '安全护栏损坏',
    level: 'major',
    status: 'processing',
    finder: '王五',
    found_at: '2025-01-10'
  },
  {
    id: '3',
    code: 'YH20250105003',
    location: '热处理车间',
    desc: '通风不畅',
    level: 'minor',
    status: 'closed',
    finder: '赵六',
    found_at: '2025-01-05'
  }
])
const hazardCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { prop: 'location', label: '位置', width: 140 },
  { prop: 'desc', label: '描述', minWidth: 180 },
  { label: '风险等级', width: 80, slotName: 'level', align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { prop: 'finder', label: '发现人', width: 80 },
  { prop: 'found_at', label: '发现时间', width: 110 }
]
const permits = ref([
  { id: '1', code: 'ZYP20250115001', type: 'hot', location: '机加工一车间', applicant: '李四', apply_date: '2025-01-15', status: 'approved' },
  { id: '2', code: 'ZYP20250116001', type: 'height', location: '装配车间', applicant: '王五', apply_date: '2025-01-16', status: 'pending' }
])
const permitCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编号', width: 160 },
  { label: '类型', width: 80, slotName: 'type', align: 'center' },
  { prop: 'location', label: '作业位置', width: 140 },
  { prop: 'applicant', label: '申请人', width: 80 },
  { prop: 'apply_date', label: '日期', width: 110 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' }
]
function openAdd(_t: string) {}
</script>
