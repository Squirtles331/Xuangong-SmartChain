<template>
  <el-dialog v-model="visible" title="回款核销" width="650px" :lock-scroll="false">
    <p>
      当前回款余额: <strong>{{ receiptAmount.toLocaleString() }} 元</strong>
    </p>
    <el-table :data="rows" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="code" label="应收单号" width="160" />
      <el-table-column prop="amount" label="金额" width="120" align="right" />
      <el-table-column prop="balance" label="余额" width="120" align="right" />
      <el-table-column prop="aging" label="账龄" width="100" />
      <el-table-column label="核销金额" minWidth="120" align="center">
        <template #default="{ row }">
          <el-input-number
            v-model="amountMap[row.id]"
            :min="0"
            :max="row.balance"
            :precision="2"
            size="small"
            controls-position="right"
            style="width: 100%"
          />
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="emit('submit')">确认核销</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
interface SettleRow {
  id: string
  code: string
  amount: number
  balance: number
  aging: number
}

interface Props {
  receiptAmount: number
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const rows = defineModel<SettleRow[]>('rows', { required: true })
const selectedRows = defineModel<SettleRow[]>('selectedRows', { required: true })
const amountMap = defineModel<Record<string, number>>('amountMap', { required: true })

const emit = defineEmits<{
  submit: []
}>()

function handleSelectionChange(value: SettleRow[]) {
  selectedRows.value = value
}
</script>
