<template>
  <gi-page-layout :bordered="true">
    <div class="mdm-layout">
      <div class="mdm-tree">
        <el-tree :data="catTree" :props="{ children: 'children', label: 'name' }" node-key="id" default-expand-all @node-click="onCatClick" />
      </div>
      <div class="mdm-content">
        <gi-button type="add" @click="openAdd" size="small">新增物料</gi-button>
        <gi-table :columns="cols" :data="materials" border stripe size="small" style="margin-top: 12px">
          <template #type="{ row }">
            <el-tag size="small">{{ row.type === 'purchased' ? '外购' : row.type === 'manufactured' ? '自制' : '委外' }}</el-tag>
          </template>
        </gi-table>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TableColumnItem } from 'gi-component'
import { materialTree as mockCatTree, materialList as mockMaterials } from '@/mock'

const catTree = ref(JSON.parse(JSON.stringify(mockCatTree)))

interface M {
  id: string
  code: string
  name: string
  spec: string
  type: string
  unit: string
}
const materials = ref<M[]>(mockMaterials as any)

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
