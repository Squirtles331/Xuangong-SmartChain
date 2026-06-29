<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <el-row :gutter="12">
        <el-col :span="12"><el-input v-model="code" placeholder="输入物料编码" /></el-col>
        <el-col :span="4"><el-button type="primary" @click="tab === 'explode' ? explode() : whereUsed()">查询</el-button></el-col>
      </el-row>
    </template>
    <el-tabs v-model="tab">
      <el-tab-pane label="BOM展开" name="explode">
        <el-table v-if="pagedExplodeData.length" :data="pagedExplodeData" border stripe>
          <el-table-column prop="level" label="层级" width="60" />
          <el-table-column prop="material" label="物料" minWidth="200" />
          <el-table-column prop="spec" label="规格" width="120" />
          <el-table-column prop="qty" label="单位用量" width="100" />
          <el-table-column prop="total" label="总需求" width="100" />
        </el-table>
        <el-empty v-else description="输入物料编码展开BOM" />
        <el-pagination
          v-if="explodeData.length > explodePageSize"
          v-model:current-page="explodePage"
          :page-size="explodePageSize"
          :total="explodeData.length"
          layout="total, prev, pager, next"
          style="margin-top: 12px; justify-content: flex-end"
        />
      </el-tab-pane>
      <el-tab-pane label="反查(Where-Used)" name="where">
        <el-table v-if="pagedWhereData.length" :data="pagedWhereData" border stripe>
          <el-table-column prop="parent" label="父件物料" minWidth="180" />
          <el-table-column prop="bom_type" label="BOM类型" width="80" />
          <el-table-column prop="version" label="版本" width="80" />
          <el-table-column prop="qty" label="单位用量" width="100" />
        </el-table>
        <el-empty v-else description="输入物料编码反查引用" />
        <el-pagination
          v-if="whereData.length > wherePageSize"
          v-model:current-page="wherePage"
          :page-size="wherePageSize"
          :total="whereData.length"
          layout="total, prev, pager, next"
          style="margin-top: 12px; justify-content: flex-end"
        />
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
const tab = ref('explode')
const code = ref('04.01.001-00001')
const explodeData = ref<any[]>([])
const whereData = ref<any[]>([])
const explodePage = ref(1)
const explodePageSize = ref(10)
const wherePage = ref(1)
const wherePageSize = ref(10)

const pagedExplodeData = computed(() => {
  const s = (explodePage.value - 1) * explodePageSize.value
  return explodeData.value.slice(s, s + explodePageSize.value)
})
const pagedWhereData = computed(() => {
  const s = (wherePage.value - 1) * wherePageSize.value
  return whereData.value.slice(s, s + wherePageSize.value)
})

function explode() {
  explodePage.value = 1
  const data = [
    { level: 0, material: '离心泵 XJP-100', spec: '流量100m³/h', qty: '1', total: '100台' },
    { level: 1, material: '泵体组件', spec: '', qty: '1', total: '100' },
    { level: 2, material: '泵体铸件', spec: '', qty: '1', total: '100' },
    { level: 2, material: '耐磨环', spec: '', qty: '2', total: '200' },
    { level: 2, material: '螺栓 M16×60', spec: '', qty: '8', total: '800' },
    { level: 1, material: '叶轮组件', spec: '', qty: '1', total: '100' },
    { level: 2, material: '叶轮铸件', spec: '', qty: '1', total: '100' },
    { level: 2, material: '轴套', spec: '', qty: '1', total: '100' },
    { level: 2, material: '键 8×7×40', spec: '', qty: '1', total: '100' },
    { level: 1, material: '密封组件', spec: '', qty: '1', total: '100' },
    { level: 2, material: '机械密封', spec: '', qty: '1', total: '100' },
    { level: 2, material: 'O型圈', spec: '', qty: '2', total: '200' },
    { level: 1, material: '轴承组件', spec: '', qty: '1', total: '100' }
  ]
  // 模拟更多数据以测试分页
  const extended = []
  for (let i = 0; i < 3; i++) {
    data.forEach((d) => extended.push({ ...d, level: d.level === 0 ? d.level : d.level + i * 3 }))
  }
  explodeData.value = extended
}
function whereUsed() {
  wherePage.value = 1
  const data = [
    { parent: '离心泵 XJP-100', bom_type: 'MBOM', version: 'V1.2', qty: '1' },
    { parent: '供水系统 XJ-SYS', bom_type: 'MBOM', version: 'V1.0', qty: '2' },
    { parent: '循环泵站 XJ-CP', bom_type: 'MBOM', version: 'V1.1', qty: '1' },
    { parent: '消防系统 XJ-FS', bom_type: 'EBOM', version: 'V2.0', qty: '3' },
    { parent: '冷却系统 XJ-CL', bom_type: 'MBOM', version: 'V1.0', qty: '2' },
    { parent: '化工泵站 XJ-HG', bom_type: 'PBOM', version: 'V1.5', qty: '1' },
    { parent: '海水淡化系统', bom_type: 'MBOM', version: 'V1.0', qty: '4' },
    { parent: '锅炉给水泵组', bom_type: 'EBOM', version: 'V3.0', qty: '2' },
    { parent: '暖通系统 XJ-NT', bom_type: 'MBOM', version: 'V1.2', qty: '1' },
    { parent: '排污系统 XJ-PW', bom_type: 'MBOM', version: 'V1.0', qty: '2' },
    { parent: '应急排水泵组', bom_type: 'EBOM', version: 'V2.1', qty: '1' }
  ]
  whereData.value = data
}
</script>
