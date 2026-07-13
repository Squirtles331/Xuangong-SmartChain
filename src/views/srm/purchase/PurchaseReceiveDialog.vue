<template>
  <gi-dialog
    v-model="visible"
    title="采购收货"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    width="520px"
  >
    <el-descriptions :column="1" border>
      <el-descriptions-item label="采购订单">{{ currentOrder?.code || '-' }}</el-descriptions-item>
      <el-descriptions-item label="供应商">{{ currentOrder?.supplier || '-' }}</el-descriptions-item>
      <el-descriptions-item label="物料名称">{{ currentOrder?.material || '-' }}</el-descriptions-item>
      <el-descriptions-item label="待收货数量">{{ currentOrder?.remain ?? 0 }}</el-descriptions-item>
    </el-descriptions>

    <el-form label-width="100px" style="margin-top: 16px">
      <el-form-item label="本次收货">
        <el-input-number v-model="formData.qty" :min="1" :max="currentOrder?.remain || 1" />
      </el-form-item>
      <el-form-item label="批次号">
        <el-input v-model="formData.lot" placeholder="按需填写批次号" />
      </el-form-item>
    </el-form>
  </gi-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

export interface PurchaseReceiveFormModel {
  qty: number
  lot: string
}

interface PurchaseOrderRow {
  code: string
  supplier: string
  material: string
  remain: number
}

interface Props {
  currentOrder: PurchaseOrderRow | null
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PurchaseReceiveFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.qty || formData.value.qty <= 0) {
    ElMessage.warning('请填写有效的收货数量')
    return false
  }
  emit('submit')
  return false
}
</script>
