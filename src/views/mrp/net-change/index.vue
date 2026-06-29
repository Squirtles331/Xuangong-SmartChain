<template>
  <gi-page-layout>
    <template #header
      ><h3>净变更 MRP</h3>
      <p style="color: #909399; margin: 4px 0">仅重算自上次MRP以来发生变化的部分，大幅缩短运算时间</p></template
    >
    <template #tool><el-button type="primary" @click="runNetMRP">运行净变更MRP</el-button></template>
    <el-card header="变更事件列表" shadow="never" style="margin-bottom: 16px">
      <gi-table :columns="eventCols" :data="events" border stripe size="small" />
    </el-card>
    <el-card header="受影响物料" shadow="never">
      <gi-table :columns="resultCols" :data="affected" border stripe size="small">
        <template #action="{ row }"
          ><el-tag :type="row.action === 'increase' ? 'success' : row.action === 'decrease' ? 'danger' : 'warning'" size="small">{{
            row.action === 'increase' ? '增加' : row.action === 'decrease' ? '减少' : '不变'
          }}</el-tag></template
        >
        <template #expand="{ row }">
          <div style="padding: 8px 24px">
            <el-table :data="row.details || []" border size="small">
              <el-table-column prop="source" label="需求来源" minWidth="180" />
              <el-table-column prop="old_qty" label="原需求" minWidth="80" align="center" />
              <el-table-column prop="new_qty" label="新需求" minWidth="80" align="center" />
              <el-table-column prop="diff" label="变化量" minWidth="80" align="center">
                <template #default="{ row: d }"
                  ><span :style="{ color: d.diff > 0 ? '#67c23a' : d.diff < 0 ? '#f56c6c' : '#909399' }"
                    >{{ d.diff > 0 ? '+' : '' }}{{ d.diff }}</span
                  ></template
                >
              </el-table-column>
              <el-table-column prop="reason" label="原因" minWidth="150" />
            </el-table>
          </div>
        </template>
      </gi-table>
    </el-card>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
const events = ref(mrpExceptions as any)
const eventCols: TableColumnItem<any>[] = [
  { prop: 'type', label: '变更类型', minWidth: 140 },
  { prop: 'detail', label: '变更详情', minWidth: 280 },
  { prop: 'time', label: '时间', minWidth: 160 }
]
const affected = ref([] as any[])
const resultCols: TableColumnItem<any>[] = [
  { type: 'expand', slotName: 'expand' },
  { prop: 'material', label: '物料', minWidth: 160 },
  { prop: 'old_qty', label: '原需求', minWidth: 80, align: 'center' },
  { prop: 'new_qty', label: '新需求', minWidth: 80, align: 'center' },
  { prop: 'diff', label: '变化量', minWidth: 80, align: 'center' },
  { label: '动作', minWidth: 70, slotName: 'action', align: 'center' }
]
function runNetMRP() {
  ElMessage.success('净变更MRP运算完成')
}
</script>
