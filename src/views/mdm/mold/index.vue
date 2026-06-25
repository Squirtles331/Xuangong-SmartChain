<template>
  <gi-page-layout :bordered="true">
    <template #header><gi-form ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" /></template>
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增' : '编辑'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
const data = ref([
  { id: '1', code: 'MD0000000001', name: '泵体铸造模具', type: '铸模', life: '10000模次', used: '3500' },
  { id: '2', code: 'MD0000000002', name: '叶轮锻模', type: '锻模', life: '5000模次', used: '1200' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编码', width: 150 },
  { prop: 'name', label: '名称', width: 150 },
  { prop: 'type', label: '类型', width: 80 },
  { prop: 'life', label: '设计寿命', width: 120 },
  { prop: 'used', label: '已用', width: 80, align: 'center' },
  { label: '操作', width: 160, slotName: 'actions', align: 'center' }
]
function openAdd() {}
function openEdit(_r: any) {}
function del(_id: string) {}
</script>
