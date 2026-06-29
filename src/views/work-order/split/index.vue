<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><h3>工单拆分 — {{ wo?.code }}</h3></template
    >
    <el-descriptions :column="2" border style="margin-bottom: 16px"
      ><el-descriptions-item label="工单编号">{{ wo?.code }}</el-descriptions-item
      ><el-descriptions-item label="产品">{{ wo?.material }}</el-descriptions-item
      ><el-descriptions-item label="计划数量">{{ wo?.qty }}</el-descriptions-item
      ><el-descriptions-item label="状态">{{ wo?.status }}</el-descriptions-item></el-descriptions
    >
    <el-table :data="splits" border stripe>
      <el-table-column prop="line" label="产线" width="120"
        ><template #default="{ row }"
          ><el-select v-model="row.line" size="small"
            ><el-option label="产线A" value="产线A" /><el-option label="产线B" value="产线B" /></el-select></template
      ></el-table-column>
      <el-table-column prop="qty" label="分配数量" width="150"
        ><template #default="{ row }"><el-input-number v-model="row.qty" :min="1" :max="row.qty + remaining" size="small" /></template
      ></el-table-column>
      <el-table-column label="操作" width="60"
        ><template #default="{ $index }"
          ><el-button v-if="splits.length > 1" type="danger" link size="small" @click="splits.splice($index, 1)">删除</el-button></template
        ></el-table-column
      >
    </el-table>
    <div style="margin-top: 12px"><el-button size="small" @click="splits.push({ line: '产线A', qty: 1 })">+ 添加产线</el-button></div>
    <div style="text-align: center; margin-top: 24px">
      <span
        :style="{
          color: remaining > 0 ? '#e6a23c' : remaining < 0 ? '#f56c6c' : '#67c23a',
          marginRight: '12px',
          fontWeight: remaining !== 0 ? 600 : 400
        }"
      >
        剩余未分配: {{ remaining }}
        <span v-if="remaining > 0">（还需分配 {{ remaining }}）</span>
        <span v-if="remaining < 0">（超出 {{ Math.abs(remaining) }}，请调整）</span>
      </span>
      <el-button type="primary" :disabled="remaining !== 0" @click="confirmSplit">确认拆分</el-button>
      <div v-if="remaining !== 0" style="margin-top: 4px; font-size: 12px; color: #909399">
        ∑子工单 = {{ splits.reduce((s, i) => s + i.qty, 0) }}，需等于总数量 {{ wo?.qty }}
      </div>
    </div>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const wo = ref({ code: 'WO202501150001', material: '离心泵 XJP-100', qty: 100, status: '草稿' })
const splits = ref([
  { line: '产线A', qty: 50 },
  { line: '产线B', qty: 50 }
])
const remaining = computed(() => wo.value.qty - splits.value.reduce((s, i) => s + i.qty, 0))
function confirmSplit() {
  ElMessage.success('拆分成功，已生成2个子工单')
  router.push('/work-order/list')
}
</script>
