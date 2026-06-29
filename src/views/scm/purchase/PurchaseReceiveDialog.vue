<template>
  <el-dialog v-model="visible" title="采购收货" width="500px" :lock-scroll="false">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="采购订单">{{ currentOrder?.code }}</el-descriptions-item>
      <el-descriptions-item label="供应商">{{ currentOrder?.supplier }}</el-descriptions-item>
      <el-descriptions-item label="物料">{{ currentOrder?.material }}</el-descriptions-item>
      <el-descriptions-item label="订购数量">{{ currentOrder?.qty }}</el-descriptions-item>
    </el-descriptions>
    <el-form label-width="100px" style="margin-top: 16px">
      <el-form-item label="实收数量">
        <el-input-number v-model="formData.qty" :min="1" :max="currentOrder?.remain || 1" />
      </el-form-item>
      <el-form-item label="批号">
        <el-input v-model="formData.lot" placeholder="批次管理物料必填" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="emit('submit')">确认收货</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
export interface PurchaseReceiveFormModel {
  qty: number
  lot: string
}

interface PurchaseOrderRow {
  code: string
  supplier: string
  material: string
  qty: number
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
</script>
