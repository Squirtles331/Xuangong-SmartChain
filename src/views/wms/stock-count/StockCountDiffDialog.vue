<template>
  <el-dialog v-model="visible" title="Count Diff" width="700px" :lock-scroll="false">
    <el-table :data="items" border size="small">
      <el-table-column prop="material" label="Material" min-width="180" />
      <el-table-column prop="book_qty" label="Book Qty" width="90" align="center" />
      <el-table-column prop="actual_qty" label="Actual Qty" width="90" align="center" />
      <el-table-column label="Diff" width="90" align="center">
        <template #default="{ row }">
          <span :style="{ color: row.diff > 0 ? '#f56c6c' : row.diff < 0 ? '#67c23a' : '' }">{{ row.diff > 0 ? '+' : '' }}{{ row.diff }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Disposition" width="140">
        <template #default="{ row }">
          <el-select v-model="row.disposition" size="small">
            <el-option label="profit" value="profit" />
            <el-option label="loss" value="loss" />
            <el-option label="ignore" value="ignore" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" @click="emit('submit')">Confirm</el-button>
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
