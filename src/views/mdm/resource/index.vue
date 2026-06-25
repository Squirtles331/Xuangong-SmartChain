<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #status="{ row }"
        ><el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : 'danger'" size="small">{{
          row.status === 'running' ? '运行' : row.status === 'idle' ? '空闲' : '维修'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import { equipments as mockEqs } from '@/mock'
const data = ref(mockEqs)
const cols: TableColumnItem<any>[] = [
  { prop: 'code', label: '设备编码', width: 150 },
  { prop: 'name', label: '名称', width: 120 },
  { prop: 'model', label: '型号', width: 120 },
  { prop: 'workshop', label: '所属车间', width: 140 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { label: '操作', width: 160, slotName: 'actions', align: 'center' }
]
function openAdd() {}
function openEdit(_r: any) {}
function del(_id: string) {}
</script>
