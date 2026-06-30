<template>
  <gi-dialog
    v-model="visible"
    title="生成采购订单"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    width="620px"
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item label="申请编号">{{ currentRequest?.code || '-' }}</el-descriptions-item>
      <el-descriptions-item label="申请部门">{{ currentRequest?.dept || '-' }}</el-descriptions-item>
    </el-descriptions>

    <el-form label-width="100px" style="margin-top: 16px">
      <el-form-item label="供应商" required>
        <el-select v-model="formData.supplier" style="width: 100%">
          <el-option v-for="item in suppliers" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="交付日期" required>
        <el-date-picker v-model="formData.delivery" style="width: 100%" value-format="YYYY-MM-DD" />
      </el-form-item>
      <el-form-item label="付款条件">
        <el-select v-model="formData.terms" style="width: 100%">
          <el-option label="月结30天" value="月结30天" />
          <el-option label="月结60天" value="月结60天" />
          <el-option label="款到发货" value="款到发货" />
        </el-select>
      </el-form-item>
    </el-form>
  </gi-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

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

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.supplier || !formData.value.delivery) {
    ElMessage.warning('请选择供应商和交付日期')
    return false
  }
  emit('submit')
  return false
}
</script>
