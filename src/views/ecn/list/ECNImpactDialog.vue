<template>
  <el-dialog v-model="visible" title="ECN 影响分析报告" width="800px" :lock-scroll="false">
    <el-descriptions :column="2" border style="margin-bottom: 16px">
      <el-descriptions-item label="变更单号">{{ data.code }}</el-descriptions-item>
      <el-descriptions-item label="变更对象">{{ data.material }}</el-descriptions-item>
      <el-descriptions-item label="变更类型">{{ data.change_type }}</el-descriptions-item>
      <el-descriptions-item label="当前版本">{{ data.current_version }}</el-descriptions-item>
    </el-descriptions>
    <el-table :data="data.items" border>
      <el-table-column prop="dimension" label="影响维度" width="120" />
      <el-table-column prop="detail" label="详情" />
      <el-table-column prop="count" label="数量" width="80" align="center" />
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts">
export interface ECNImpactItem {
  dimension: string
  detail: string
  count: number
}

export interface ECNImpactModel {
  code: string
  material: string
  change_type: string
  current_version: string
  items: ECNImpactItem[]
}

const visible = defineModel<boolean>('visible', { required: true })
const data = defineModel<ECNImpactModel>('data', { required: true })
</script>
