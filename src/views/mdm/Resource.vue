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

const tab = ref('equipment')
const equipments = ref([
  { id: '1', code: 'EQ0000000001', name: '数控车床', model: 'CK6150', workshop: '机加工一车间', status: 'running' },
  { id: '2', code: 'EQ0000000002', name: '数控车床', model: 'CK6150', workshop: '机加工一车间', status: 'idle' },
  { id: '3', code: 'EQ0000000003', name: '钻床', model: 'Z3050', workshop: '机加工一车间', status: 'running' },
  { id: '4', code: 'EQ0000000004', name: '磨床', model: 'M1432', workshop: '机加工一车间', status: 'repair' }
])
const eqCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '设备编码', width: 150 },
  { prop: 'name', label: '名称', width: 120 },
  { prop: 'model', label: '型号', width: 120 },
  { prop: 'workshop', label: '所属车间', width: 140 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' }
]

const wcs = ref([
  { id: '1', code: 'WC00000001', name: '数控车组', workshop: '机加工一车间', capacity: '16h/天', cost: '150元/h' },
  { id: '2', code: 'WC00000002', name: '钻床组', workshop: '机加工一车间', capacity: '8h/天', cost: '80元/h' },
  { id: '3', code: 'WC00000003', name: '磨床组', workshop: '机加工一车间', capacity: '8h/天', cost: '120元/h' }
])
const wcCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编码', width: 140 },
  { prop: 'name', label: '名称', width: 120 },
  { prop: 'workshop', label: '车间', width: 140 },
  { prop: 'capacity', label: '日产能', width: 100 },
  { prop: 'cost', label: '工时费率', width: 100 }
]

const molds = ref([
  { id: '1', code: 'MD0000000001', name: '泵体铸造模具', type: '铸模', life: '10000模次', used: '3500' },
  { id: '2', code: 'MD0000000002', name: '叶轮锻模', type: '锻模', life: '5000模次', used: '1200' }
])
const mdCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编码', width: 150 },
  { prop: 'name', label: '名称', width: 150 },
  { prop: 'type', label: '类型', width: 80 },
  { prop: 'life', label: '设计寿命', width: 120 },
  { prop: 'used', label: '已用', width: 80, align: 'center' }
]
</script>
