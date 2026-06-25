<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <el-row :gutter="12"
        ><el-col :span="12"><el-input v-model="code" placeholder="输入物料编码" /></el-col
        ><el-col :span="4"><el-button type="primary" @click="explode">展开</el-button></el-col
        ><el-col :span="4"><el-button @click="whereUsed">反查</el-button></el-col></el-row
      >
    </template>
    <el-tabs v-model="tab">
      <el-tab-pane label="BOM展开" name="explode">
        <el-table v-if="explodeData.length" :data="explodeData" border stripe row-key="id" default-expand-all>
          <el-table-column prop="level" label="层级" width="60" />
          <el-table-column prop="material" label="物料" minWidth="200" />
          <el-table-column prop="spec" label="规格" width="120" />
          <el-table-column prop="qty" label="单位用量" width="100" />
          <el-table-column prop="total" label="总需求" width="100" />
        </el-table>
        <el-empty v-else description="输入物料编码展开BOM" />
      </el-tab-pane>
      <el-tab-pane label="反查(Where-Used)" name="where">
        <el-table v-if="whereData.length" :data="whereData" border stripe>
          <el-table-column prop="parent" label="父件物料" minWidth="180" />
          <el-table-column prop="bom_type" label="BOM类型" width="80" />
          <el-table-column prop="version" label="版本" width="80" />
          <el-table-column prop="qty" label="单位用量" width="100" />
        </el-table>
        <el-empty v-else description="输入物料编码反查引用" />
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const tab = ref('explode')
const code = ref('04.01.001-00001')
const explodeData = ref<any[]>([])
const whereData = ref<any[]>([])
function explode() {
  explodeData.value = [
    { level: 0, material: '离心泵 XJP-100', spec: '流量100m³/h', qty: '1', total: '100台' },
    { level: 1, material: '泵体组件', spec: '', qty: '1', total: '100' },
    { level: 2, material: '泵体铸件', spec: '', qty: '1', total: '100' },
    { level: 2, material: '耐磨环', spec: '', qty: '2', total: '200' },
    { level: 2, material: '螺栓 M16×60', spec: '', qty: '8', total: '800' },
    { level: 1, material: '叶轮组件', spec: '', qty: '1', total: '100' }
  ]
}
function whereUsed() {
  whereData.value = [
    { parent: '离心泵 XJP-100', bom_type: 'MBOM', version: 'V1.2', qty: '1' },
    { parent: '供水系统 XJ-SYS', bom_type: 'MBOM', version: 'V1.0', qty: '2' }
  ]
}
</script>
