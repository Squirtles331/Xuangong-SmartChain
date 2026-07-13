<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增发货单' : '编辑发货单'"
    :columns="formColumns"
    :label-width="100"
    width="600px"
    :before-submit="beforeSubmit"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'
import type { FormColumnItem } from 'gi-component'

export interface DeliveryFormModel {
  id: string
  code: string
  orderCode: string
  customer: string
  material: string
  qty: number
  status: string
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<DeliveryFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '发货单号', field: 'code', required: true },
  { type: 'input', label: '销售订单号', field: 'orderCode', required: true },
  { type: 'input', label: '客户名称', field: 'customer', required: true },
  { type: 'input', label: '产品名称', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any }
])

function beforeSubmit() {
  if (!formData.value.code || !formData.value.orderCode || !formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }

  return true
}
</script>
