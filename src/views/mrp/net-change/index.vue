<template>
  <gi-page-layout>
    <template #header>
      <h3>Net Change MRP</h3>
      <p style="color: #909399; margin: 4px 0">Only changed demand and supply signals are recalculated.</p>
    </template>
    <template #tool>
      <el-button type="primary" @click="reload">Run Net Change MRP</el-button>
    </template>

    <el-card header="Change Events" shadow="never" style="margin-bottom: 16px">
      <gi-table :columns="eventColumns" :data="events" border stripe size="small" />
    </el-card>

    <el-card header="Affected Materials" shadow="never">
      <gi-table :columns="resultColumns" :data="affected" border stripe size="small">
        <template #action="{ row }">
          <el-tag :type="row.action === 'increase' ? 'success' : row.action === 'decrease' ? 'danger' : 'warning'" size="small">
            {{ row.action }}
          </el-tag>
        </template>
        <template #expand="{ row }">
          <div style="padding: 8px 24px">
            <el-table :data="row.details || []" border size="small">
              <el-table-column prop="source" label="Source" min-width="180" />
              <el-table-column prop="old_qty" label="Old Qty" min-width="90" align="center" />
              <el-table-column prop="new_qty" label="New Qty" min-width="90" align="center" />
              <el-table-column prop="diff" label="Diff" min-width="90" align="center">
                <template #default="{ row: detail }">
                  <span :style="{ color: detail.diff > 0 ? '#67c23a' : detail.diff < 0 ? '#f56c6c' : '#909399' }">
                    {{ detail.diff > 0 ? '+' : '' }}{{ detail.diff }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="reason" label="Reason" min-width="180" />
            </el-table>
          </div>
        </template>
      </gi-table>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { getNetChangeMRP } from '@/api/mrp'

const events = ref<any[]>([])
const affected = ref<any[]>([])

const eventColumns: TableColumnItem<any>[] = [
  { prop: 'type', label: 'Change Type', minWidth: 140 },
  { prop: 'detail', label: 'Detail', minWidth: 320 },
  { prop: 'time', label: 'Time', minWidth: 170 }
]

const resultColumns: TableColumnItem<any>[] = [
  { type: 'expand', slotName: 'expand' },
  { prop: 'material', label: 'Material', minWidth: 160 },
  { prop: 'old_qty', label: 'Old Qty', minWidth: 90, align: 'center' },
  { prop: 'new_qty', label: 'New Qty', minWidth: 90, align: 'center' },
  { prop: 'diff', label: 'Diff', minWidth: 90, align: 'center' },
  { label: 'Action', minWidth: 90, slotName: 'action', align: 'center' }
]

async function loadData() {
  const res = await getNetChangeMRP({ pageNum: 1, pageSize: 100 })
  events.value = res.data.events || []
  affected.value = res.data.affected || []
}

async function reload() {
  await loadData()
  ElMessage.success('Net change MRP finished')
}

onMounted(() => {
  loadData()
})
</script>
