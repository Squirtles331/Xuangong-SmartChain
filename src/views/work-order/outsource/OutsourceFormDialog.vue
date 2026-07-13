<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增委外工单' : '编辑委外工单'"
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
import type { OutsourceOrder } from '@/api/work-order'

export interface OutsourceFormModel {
  id: string
  code: string
  material: string
  qty: number
  supplier: string
  operation: string
  send_date: string
  due_date: string
  price: number
  status: OutsourceOrder['status']
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<OutsourceFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '工单号', field: 'code', required: true },
  { type: 'input', label: '产品', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input', label: '委外供应商', field: 'supplier', required: true },
  { type: 'input', label: '委外工序', field: 'operation', required: true },
  { type: 'date-picker', label: '发出日期', field: 'send_date', props: { valueFormat: 'YYYY-MM-DD' } as any },
  { type: 'date-picker', label: '交回日期', field: 'due_date', props: { valueFormat: 'YYYY-MM-DD' } as any },
  { type: 'input-number', label: '加工费(元)', field: 'price', props: { min: 0 } as any }
])

function beforeSubmit() {
  if (!formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  return true
}
</script>
