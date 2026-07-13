<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    title="新建调拨单"
    :columns="formColumns"
    :label-width="100"
    width="550px"
    :before-submit="beforeSubmit"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { FormColumnItem } from 'gi-component'

export interface TransferFormModel {
  material: string
  qty: number
  from_wh: string
  to_wh: string
}

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<TransferFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '调出仓库',
    field: 'from_wh',
    required: true,
    props: {
      options: [
        { label: '原材料仓', value: '原材料仓' },
        { label: '标准件仓', value: '标准件仓' },
        { label: '半成品仓', value: '半成品仓' },
        { label: '成品仓', value: '成品仓' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '调入仓库',
    field: 'to_wh',
    required: true,
    props: {
      options: [
        { label: '机加工线边仓', value: '机加工线边仓' },
        { label: '装配线边仓', value: '装配线边仓' },
        { label: '发货暂存区', value: '发货暂存区' },
        { label: '成品仓', value: '成品仓' }
      ]
    } as any
  }
])

function beforeSubmit() {
  if (!formData.value.material || !formData.value.from_wh || !formData.value.to_wh) {
    ElMessage.warning('请填写必填项')
    return false
  }
  return true
}
</script>
