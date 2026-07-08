<template>
  <gi-page-layout>
    <template #header>
      <h3>工单拆分 - {{ workOrder.code }}</h3>
    </template>

    <el-descriptions :column="2" border style="margin-bottom: 16px">
      <el-descriptions-item label="工单编号">{{ workOrder.code }}</el-descriptions-item>
      <el-descriptions-item label="产品">{{ workOrder.material }}</el-descriptions-item>
      <el-descriptions-item label="计划数量">{{ workOrder.qty }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ workOrder.status }}</el-descriptions-item>
    </el-descriptions>

    <TableSetting title="拆分明细" :columns="columns">
      <template #default>
        <el-table :data="splits" border stripe>
          <el-table-column prop="line" label="产线" width="160">
            <template #default="{ row }">
              <el-select v-model="row.line" size="small">
                <el-option label="产线A" value="产线A" />
                <el-option label="产线B" value="产线B" />
                <el-option label="产线C" value="产线C" />
              </el-select>
            </template>
          </el-table-column>

          <el-table-column prop="qty" label="分配数量" width="180">
            <template #default="{ row }">
              <el-input-number v-model="row.qty" :min="1" :max="row.qty + remaining" size="small" />
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" align="center">
            <template #default="{ $index }">
              <el-button v-if="splits.length > 1" type="danger" link size="small" @click="removeSplit($index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </TableSetting>

    <div style="margin-top: 12px">
      <el-button size="small" @click="addSplit">新增产线</el-button>
    </div>

    <div class="split-footer">
      <span
        :style="{
          color: remaining > 0 ? '#e6a23c' : remaining < 0 ? '#f56c6c' : '#67c23a',
          marginRight: '12px',
          fontWeight: remaining !== 0 ? 600 : 400
        }"
      >
        剩余未分配：{{ remaining }}
        <span v-if="remaining > 0">（还需分配 {{ remaining }}）</span>
        <span v-else-if="remaining < 0">（超出 {{ Math.abs(remaining) }}，请调整）</span>
      </span>
      <el-button type="primary" :disabled="remaining !== 0" @click="confirmSplit">确认拆分</el-button>
      <div v-if="remaining !== 0" class="split-tip">子工单数量总和需等于总数量 {{ workOrder.qty }}</div>
    </div>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import type { TableColumnItem } from 'gi-component'
import TableSetting from '@/components/TableSetting.vue'

const router = useRouter()

const workOrder = ref({
  code: 'WO202501150001',
  material: '离心泵 XJP-100',
  qty: 100,
  status: '草稿'
})

const splits = ref<Array<{ line: string; qty: number }>>([
  { line: '产线A', qty: 50 },
  { line: '产线B', qty: 50 }
])

const columns: TableColumnItem[] = [
  { prop: 'line', label: '产线', width: 160 },
  { prop: 'qty', label: '分配数量', width: 180 }
]

const remaining = computed(() => workOrder.value.qty - splits.value.reduce((sum, item) => sum + item.qty, 0))

function addSplit() {
  splits.value.push({ line: '产线A', qty: 1 })
}

function removeSplit(index: number) {
  splits.value.splice(index, 1)
}

function confirmSplit() {
  ElMessage.success('拆分成功，已生成子工单')
  router.push('/mes/work-order/list')
}
</script>

<style scoped>
.split-footer {
  text-align: center;
  margin-top: 24px;
}

.split-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}
</style>
