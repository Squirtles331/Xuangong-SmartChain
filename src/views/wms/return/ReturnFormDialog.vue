<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    title="新建退料/退货单"
    :columns="formColumns"
    :label-width="100"
    width="500px"
    :before-submit="beforeSubmit"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { FormColumnItem } from 'gi-component'

export interface ReturnFormModel {
  type: string
  source: string
  material: string
  qty: number
  reason: string
}

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReturnFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '生产退料', value: 'return' },
        { label: '采购退货', value: 'refund' }
      ]
    } as any
  },
  { type: 'input', label: '来源单号', field: 'source', required: true },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'input', label: '原因', field: 'reason' }
])

function beforeSubmit() {
  if (!formData.value.source || !formData.value.material) {
    ElMessage.warning('请填写来源单号和物料名称')
    return false
  }
  return true
}
</script>
