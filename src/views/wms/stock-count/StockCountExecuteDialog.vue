<template>
  <el-dialog v-model="visible" title="Count Execution" width="700px" :lock-scroll="false">
    <el-table :data="items" border size="small">
      <el-table-column prop="location" label="Location" width="120" />
      <el-table-column prop="material" label="Material" min-width="180" />
      <el-table-column prop="book_qty" label="Book Qty" width="90" align="center" />
      <el-table-column label="Actual Qty" width="130">
        <template #default="{ row }">
          <el-input-number v-model="row.actual" :min="0" size="small" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="visible = false">Save Draft</el-button>
      <el-button type="primary" @click="emit('submit')">Submit</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface StockCountExecuteItem {
  location: string
  material: string
  book_qty: number
  actual: number
}

const visible = defineModel<boolean>('visible', { required: true })
const items = defineModel<StockCountExecuteItem[]>('items', { required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>
