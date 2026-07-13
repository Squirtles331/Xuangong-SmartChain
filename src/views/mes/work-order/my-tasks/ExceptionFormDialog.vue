<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    title="异常上报"
    :columns="formColumns"
    :label-width="100"
    width="500px"
    :before-submit="beforeSubmit"
    @submit="handleConfirm"
  />
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'

export interface ExceptionFormModel {
  type: string
  description: string
}

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ExceptionFormModel>('form', { required: true })

const emit = defineEmits<{
  confirm: []
}>()

const formColumns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '异常类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '设备故障', value: 'equipment' },
        { label: '来料不良', value: 'material' },
        { label: '图纸或工艺错误', value: 'process' },
        { label: '其他', value: 'other' }
      ]
    } as any
  },
  {
    type: 'textarea',
    label: '描述',
    field: 'description',
    required: true,
    props: {
      rows: 3,
      maxlength: 200,
      showWordLimit: true
    } as any
  }
]

function beforeSubmit() {
  if (!formData.value.type || !formData.value.description) {
    ElMessage.warning('请填写异常类型和描述')
    return false
  }

  return true
}

function handleConfirm() {
  emit('confirm')
  visible.value = false
}
</script>
