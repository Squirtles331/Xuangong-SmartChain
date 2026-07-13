<template>
  <gi-page-layout>
    <template #header>
      <div class="explode-header">
        <el-input v-model="code" placeholder="请输入物料编码" style="width: 280px" />
        <el-button type="primary" @click="tab === 'explode' ? explode() : whereUsed()">查询</el-button>
      </div>
    </template>

    <el-tabs v-model="tab">
      <el-tab-pane label="BOM 展开" name="explode">
        <el-table v-if="explodeData.length" :data="explodeData" border stripe>
          <el-table-column prop="level" label="层级" width="70" />
          <el-table-column prop="material" label="物料" min-width="220" />
          <el-table-column prop="spec" label="规格" min-width="140" />
          <el-table-column prop="qty" label="单位用量" width="110" />
          <el-table-column prop="total" label="总需求" width="110" />
        </el-table>
        <el-empty v-else description="输入物料编码后可展开 BOM" />
      </el-tab-pane>

      <el-tab-pane label="反查引用" name="where">
        <el-table v-if="whereData.length" :data="whereData" border stripe>
          <el-table-column prop="parent" label="父项物料" min-width="220" />
          <el-table-column prop="bom_type" label="BOM 类型" width="100" />
          <el-table-column prop="version" label="版本" width="100" />
          <el-table-column prop="qty" label="单位用量" width="110" />
        </el-table>
        <el-empty v-else description="输入物料编码后可反查引用关系" />
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
    { level: 0, material: '离心泵 XJP-100', spec: '流量 100m3/h', qty: '1', total: '100 台' },
    { level: 1, material: '泵体组件', spec: '-', qty: '1', total: '100' },
    { level: 2, material: '泵体铸件', spec: '-', qty: '1', total: '100' },
    { level: 2, material: '耐磨环', spec: '-', qty: '2', total: '200' },
    { level: 2, material: '螺栓 M16×60', spec: '-', qty: '8', total: '800' },
    { level: 1, material: '叶轮组件', spec: '-', qty: '1', total: '100' },
    { level: 2, material: '叶轮铸件', spec: '-', qty: '1', total: '100' },
    { level: 2, material: '键 8×7×40', spec: '-', qty: '1', total: '100' },
    { level: 1, material: '轴承组件', spec: '-', qty: '1', total: '100' }
  ]
}

function whereUsed() {
  whereData.value = [
    { parent: '离心泵 XJP-100', bom_type: 'MBOM', version: 'V1.2', qty: '1' },
    { parent: '供水系统 XJ-SYS', bom_type: 'MBOM', version: 'V1.0', qty: '2' },
    { parent: '循环泵站 XJ-CP', bom_type: 'MBOM', version: 'V1.1', qty: '1' },
    { parent: '消防系统 XJ-FS', bom_type: 'EBOM', version: 'V2.0', qty: '3' },
    { parent: '冷却系统 XJ-CL', bom_type: 'MBOM', version: 'V1.0', qty: '2' }
  ]
}
</script>

<style scoped>
.explode-header {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
