<template>
  <gi-page-layout>
    <template #header>
      <div class="compare-header">
        <h3>BOM 版本对比</h3>
        <div class="compare-actions">
          <el-select v-model="v1" placeholder="选择版本 1" style="width: 240px">
            <el-option v-for="item in versions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-select v-model="v2" placeholder="选择版本 2" style="width: 240px">
            <el-option v-for="item in versions" :key="item" :label="item" :value="item" />
          </el-select>
          <el-button type="primary" @click="compare">开始对比</el-button>
          <el-button @click="exportDiff">导出 Excel</el-button>
        </div>
      </div>
    </template>

    <el-table v-if="diffData.length" :data="diffData" border stripe>
      <el-table-column prop="material" label="物料" min-width="180" />
      <el-table-column label="变化类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.change === '新增' ? 'success' : row.change === '删除' ? 'danger' : row.change === '修改' ? 'warning' : 'info'">
            {{ row.change }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="`${v1Label} 用量`" width="120" align="center">
        <template #default="{ row }">{{ row.v1_qty }}</template>
      </el-table-column>
      <el-table-column :label="`${v2Label} 用量`" width="120" align="center">
        <template #default="{ row }">{{ row.v2_qty }}</template>
      </el-table-column>
      <el-table-column :label="`${v1Label} 损耗率`" width="120" align="center">
        <template #default="{ row }">{{ row.v1_scrap }}</template>
      </el-table-column>
      <el-table-column :label="`${v2Label} 损耗率`" width="120" align="center">
        <template #default="{ row }">{{ row.v2_scrap }}</template>
      </el-table-column>
    </el-table>

    <el-empty v-else description="请选择两个版本后开始对比" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const versions = ['MBOM V1.2（生效中）', 'MBOM V1.1（已归档）', 'MBOM V1.0（已归档）']
const v1 = ref('MBOM V1.2（生效中）')
const v2 = ref('MBOM V1.1（已归档）')
const diffData = ref<any[]>([])

const v1Label = computed(() => v1.value.replace(/（.*?）$/, ''))
const v2Label = computed(() => v2.value.replace(/（.*?）$/, ''))

function compare() {
  diffData.value = [
    { material: '泵体组件', change: '无变化', v1_qty: '1', v2_qty: '1', v1_scrap: '0%', v2_scrap: '0%' },
    { material: '耐磨环', change: '修改', v1_qty: '2', v2_qty: '3', v1_scrap: '0%', v2_scrap: '2%' },
    { material: '油封', change: '新增', v1_qty: '-', v2_qty: '2', v1_scrap: '-', v2_scrap: '0%' },
    { material: '螺栓 M12×40', change: '删除', v1_qty: '4', v2_qty: '-', v1_scrap: '1%', v2_scrap: '-' }
  ]
}

function exportDiff() {
  if (!diffData.value.length) {
    ElMessage.warning('请先生成对比结果')
    return
  }

  const headers = ['物料', '变化类型', `${v1Label.value} 用量`, `${v2Label.value} 用量`, `${v1Label.value} 损耗率`, `${v2Label.value} 损耗率`]
  const rows = diffData.value.map((item) => [item.material, item.change, item.v1_qty, item.v2_qty, item.v1_scrap, item.v2_scrap])
  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `BOM对比_${v1Label.value}_vs_${v2Label.value}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('差异报告已导出')
}
</script>

<style scoped>
.compare-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.compare-header h3 {
  margin: 0;
}

.compare-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
