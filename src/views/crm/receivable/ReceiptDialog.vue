<template>
  <el-dialog v-model="visible" title="登记回款" width="500px" :lock-scroll="false">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="客户" required>
        <el-select v-model="formData.customer" style="width: 100%">
          <el-option v-for="item in customerOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="回款金额" required>
        <el-input-number v-model="formData.amount" :min="0" style="width: 100%" />
      </el-form-item>
      <el-form-item label="回款日期" required>
        <el-date-picker v-model="formData.date" value-format="YYYY-MM-DD" style="width: 100%" />
      </el-form-item>
      <el-form-item label="回款方式" required>
        <el-select v-model="formData.method" style="width: 100%">
          <el-option label="银行转账" value="bank" />
          <el-option label="现金" value="cash" />
          <el-option label="承兑汇票" value="draft" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="emit('submit')">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
export interface ReceiptFormModel {
  customer: string
  amount: number
  date: string
  method: string
}

interface Props {
  customerOptions: Array<{ label: string; value: string }>
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReceiptFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>
