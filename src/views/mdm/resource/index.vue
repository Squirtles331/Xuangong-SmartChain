<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="设备台账" name="equipment"
        ><gi-table :columns="eqCols" :data="equipments" border stripe size="small"
          ><template #status="{ row }"
            ><el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : 'danger'" size="small">{{
              row.status === 'running' ? '运行' : row.status === 'idle' ? '空闲' : '维修'
            }}</el-tag></template
          ></gi-table
        ></el-tab-pane
      >
      <el-tab-pane label="工作中心" name="wc"><gi-table :columns="wcCols" :data="wcs" border stripe size="small" /></el-tab-pane>
      <el-tab-pane label="模具" name="mold"><gi-table :columns="mdCols" :data="molds" border stripe size="small" /></el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import { equipments as mockEqs, workCenters as mockWCs, molds as mockMolds } from '@/mock'

const tab = ref('equipment')
const equipments = ref(mockEqs)
const eqCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '设备编码', width: 150 },
  { prop: 'name', label: '名称', width: 120 },
  { prop: 'model', label: '型号', width: 120 },
  { prop: 'workshop', label: '所属车间', width: 140 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' }
]

const wcs = ref(mockWCs)
const wcCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编码', width: 140 },
  { prop: 'name', label: '名称', width: 120 },
  { prop: 'workshop', label: '车间', width: 140 },
  { prop: 'capacity', label: '日产能', width: 100 },
  { prop: 'cost', label: '工时费率', width: 100 }
]

const molds = ref(mockMolds)
const mdCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编码', width: 150 },
  { prop: 'name', label: '名称', width: 150 },
  { prop: 'type', label: '类型', width: 80 },
  { prop: 'life', label: '设计寿命', width: 120 },
  { prop: 'used', label: '已用', width: 80, align: 'center' }
]
</script>
