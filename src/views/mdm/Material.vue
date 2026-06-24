<template>
  <gi-page-layout :bordered="true">
    <div class="mdm-layout">
      <div class="mdm-tree">
        <el-tree :data="catTree" :props="{ children: 'children', label: 'name' }" node-key="id" default-expand-all @node-click="onCatClick" />
      </div>
      <div class="mdm-content">
        <template #tool><gi-button type="add" @click="openAdd" size="small">新增物料</gi-button></template>
        <gi-table :columns="cols" :data="materials" border stripe size="small" style="margin-top: 12px">
          <template #type="{ row }"
            ><el-tag size="small">{{ row.type === 'purchased' ? '外购' : row.type === 'manufactured' ? '自制' : '委外' }}</el-tag></template
          >
        </gi-table>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'

const catTree = ref([
  {
    id: '1',
    name: '原材料',
    children: [
      {
        id: '11',
        name: '钢材',
        children: [
          { id: '111', name: '圆钢' },
          { id: '112', name: '板材' }
        ]
      }
    ]
  },
  {
    id: '2',
    name: '外购件',
    children: [
      { id: '21', name: '轴承' },
      { id: '22', name: '紧固件' }
    ]
  },
  { id: '3', name: '自制半成品' },
  { id: '4', name: '成品' }
])
interface M {
  id: string
  code: string
  name: string
  spec: string
  type: string
  unit: string
}
const materials = ref<M[]>([
  { id: '1', code: '01.01.001-00001', name: '45#圆钢', spec: 'φ50', type: 'purchased', unit: 'kg' },
  { id: '2', code: '02.04.001-00001', name: '轴承 6308', spec: 'SKF', type: 'purchased', unit: '个' },
  { id: '3', code: '03.01.001-00001', name: '传动轴 DS-50', spec: 'φ50×500', type: 'manufactured', unit: '根' },
  { id: '4', code: '04.01.001-00001', name: '离心泵 XJP-100', spec: '流量100m³/h', type: 'manufactured', unit: '台' }
])
const cols: TableColumnItem<M>[] = [
  { prop: 'code', label: '物料编码', width: 180 },
  { prop: 'name', label: '名称', minWidth: 140 },
  { prop: 'spec', label: '规格', width: 120 },
  { label: '类型', width: 80, slotName: 'type', align: 'center' },
  { prop: 'unit', label: '单位', width: 60, align: 'center' }
]
function onCatClick(_d: any) {}
function openAdd() {}
</script>
<style scoped>
.mdm-layout {
  display: flex;
  height: calc(100vh - 180px);
}
.mdm-tree {
  width: 260px;
  border-right: 1px solid #eee;
  overflow: auto;
  padding: 12px;
}
.mdm-content {
  flex: 1;
  padding: 12px;
  overflow: auto;
}
</style>
