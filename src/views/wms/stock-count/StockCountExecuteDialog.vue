<template>
  <el-dialog v-model="visible" title="盘点执行" width="700px" :lock-scroll="false">
    <el-table :data="items" border size="small">
      <el-table-column prop="location" label="库位" width="120" />
      <el-table-column prop="material" label="物料名称" min-width="180" />
      <el-table-column prop="book_qty" label="账面数量" width="90" align="center" />
      <el-table-column label="实盘数量" width="130">
        <template #default="{ row }">
          <el-input-number v-model="row.actual" :min="0" size="small" />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="visible = false">保存草稿</el-button>
      <el-button type="primary" @click="emit('submit')">提交</el-button>
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
