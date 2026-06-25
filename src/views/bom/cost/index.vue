<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><el-select v-model="bom" placeholder="选择BOM版本" style="width: 300px"
        ><el-option v-for="b in boms" :key="b" :label="b" :value="b" /></el-select
      ><el-button type="primary" style="margin-left: 12px" @click="calc">计算成本</el-button></template
    >
    <el-table v-if="costData.length" :data="costData" border stripe>
      <el-table-column prop="level" label="层级" width="60" />
      <el-table-column prop="material" label="物料" minWidth="180" />
      <el-table-column prop="qty" label="用量" width="80" align="center" />
      <el-table-column prop="material_cost" label="材料成本" width="110" align="right" />
      <el-table-column prop="labor_cost" label="人工成本" width="110" align="right" />
      <el-table-column prop="overhead" label="制造费用" width="110" align="right" />
      <el-table-column prop="total" label="合计" width="110" align="right"
        ><template #default="{ row }"
          ><strong>{{ row.total }}</strong></template
        ></el-table-column
      >
    </el-table>
    <el-empty v-else description="选择BOM版本并点击计算" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const boms = ['MBOM V1.2 (生效中)', 'MBOM V1.1 (已归档)']
const bom = ref('MBOM V1.2 (生效中)')
const costData = ref<any[]>([])
function calc() {
  costData.value = [
    { level: 0, material: '泵体铸件', qty: '1', material_cost: '850.00', labor_cost: '-', overhead: '-', total: '850.00' },
    { level: 0, material: '耐磨环', qty: '2', material_cost: '120.00', labor_cost: '-', overhead: '-', total: '240.00' },
    { level: 0, material: '螺栓 M16×60', qty: '8', material_cost: '2.50', labor_cost: '-', overhead: '-', total: '20.00' },
    { level: 1, material: '泵体组件', qty: '1', material_cost: '1,110.00', labor_cost: '180.00', overhead: '54.00', total: '1,344.00' },
    { level: 1, material: '叶轮组件', qty: '1', material_cost: '580.00', labor_cost: '120.00', overhead: '36.00', total: '736.00' },
    { level: 'N', material: '离心泵 XJP-100', qty: '1', material_cost: '3,520.00', labor_cost: '820.00', overhead: '246.00', total: '4,586.00' }
  ]
}
</script>
