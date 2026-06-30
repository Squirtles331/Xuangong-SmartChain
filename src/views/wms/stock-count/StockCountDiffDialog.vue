<template>
  <el-dialog v-model="visible" title="盘点差异处理" width="700px" :lock-scroll="false">
    <el-table :data="items" border size="small">
      <el-table-column prop="material" label="物料名称" min-width="180" />
      <el-table-column prop="book_qty" label="账面数量" width="90" align="center" />
      <el-table-column prop="actual_qty" label="实盘数量" width="90" align="center" />
      <el-table-column label="差异" width="90" align="center">
        <template #default="{ row }">
          <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '' }">{{ row.diff > 0 ? '+' : '' }}{{ row.diff }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处理方式" width="140">
        <template #default="{ row }">
          <el-select v-model="row.disposition" size="small">
            <el-option label="盘盈入账" value="profit" />
            <el-option label="盘亏出账" value="loss" />
            <el-option label="忽略" value="ignore" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="emit('submit')">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface StockCountDiffItem {
  material: string
  book_qty: number
  actual_qty: number
  diff: number
  disposition: string
}

const visible = defineModel<boolean>('visible', { required: true })
const items = defineModel<StockCountDiffItem[]>('items', { required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>
