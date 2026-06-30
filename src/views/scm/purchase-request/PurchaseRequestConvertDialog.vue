<template>
  <el-dialog v-model="visible" title="生成采购订单" width="600px" :lock-scroll="false">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="申请单号">{{ currentRequest?.code }}</el-descriptions-item>
      <el-descriptions-item label="申请部门">{{ currentRequest?.dept }}</el-descriptions-item>
    </el-descriptions>
    <el-form label-width="100px" style="margin-top: 16px">
      <el-form-item label="供应商" required>
        <el-select v-model="formData.supplier" style="width: 100%">
          <el-option v-for="item in suppliers" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="交货日期" required>
        <el-date-picker v-model="formData.delivery" style="width: 100%" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="付款条款">
        <el-select v-model="formData.terms" style="width: 100%">
          <el-option label="月结30天" value="30" />
          <el-option label="月结60天" value="60" />
          <el-option label="款到发货" value="0" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="emit('submit')">确认生成</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
export interface PurchaseRequestConvertFormModel {
  supplier: string
  delivery: string
  terms: string
}

interface RequestRow {
  code: string
  dept: string
}

interface Props {
  currentRequest: RequestRow | null
  suppliers: string[]
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PurchaseRequestConvertFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>
