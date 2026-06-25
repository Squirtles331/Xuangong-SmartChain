<template>
  <gi-page-layout :bordered="true">
    <template #header><h3>BOM 版本比较</h3></template>
    <el-row :gutter="16" style="margin-bottom: 16px">
      <el-col :span="8"
        ><el-select v-model="v1" placeholder="选择版本1" style="width: 100%"
          ><el-option v-for="v in versions" :key="v" :label="v" :value="v" /></el-select
      ></el-col>
      <el-col :span="8"
        ><el-select v-model="v2" placeholder="选择版本2" style="width: 100%"
          ><el-option v-for="v in versions" :key="v" :label="v" :value="v" /></el-select
      ></el-col>
      <el-col :span="8"><el-button type="primary" @click="compare">开始比较</el-button><el-button @click="exportDiff">导出Excel</el-button></el-col>
    </el-row>
    <el-table v-if="diffData.length" :data="diffData" border stripe>
      <el-table-column prop="material" label="物料" minWidth="160" />
      <el-table-column label="变化" width="80" align="center"
        ><template #default="{ row }"
          ><el-tag :type="row.change === '新增' ? 'success' : row.change === '删除' ? 'danger' : 'warning'" size="small">{{
            row.change
          }}</el-tag></template
        ></el-table-column
      >
      <el-table-column prop="v1_qty" label="V1.2 用量" width="100" align="center" />
      <el-table-column prop="v2_qty" label="V2.0 用量" width="100" align="center" />
      <el-table-column prop="v1_scrap" label="V1.2 损耗率" width="100" align="center" />
      <el-table-column prop="v2_scrap" label="V2.0 损耗率" width="100" align="center" />
    </el-table>
    <el-empty v-else description="请选择两个版本进行比较" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const versions = ['MBOM V1.2 (生效中)', 'MBOM V1.1 (已归档)', 'MBOM V1.0 (已归档)']
const v1 = ref('MBOM V1.2 (生效中)')
const v2 = ref('MBOM V1.1 (已归档)')
const diffData = ref<any[]>([])
function compare() {
  diffData.value = [
    { material: '泵体组件', change: '无变化', v1_qty: '1', v2_qty: '1', v1_scrap: '0%', v2_scrap: '0%' },
    { material: '耐磨环', change: '修改', v1_qty: '2', v2_qty: '3', v1_scrap: '0%', v2_scrap: '2%' },
    { material: '油封', change: '新增', v1_qty: '-', v2_qty: '2', v1_scrap: '-', v2_scrap: '0%' },
    { material: '螺栓 M12×40', change: '删除', v1_qty: '4', v2_qty: '-', v1_scrap: '1%', v2_scrap: '-' }
  ]
}
function exportDiff() {
  ElMessage.success('差异报告已导出')
}
</script>
