<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增供应商' : '编辑供应商'"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface SupplierFormModel {
  id: string
  code: string
  name: string
  contact: string
  phone: string
  terms: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<SupplierFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '供应商编码', field: 'code', required: true },
  { type: 'input', label: '供应商名称', field: 'name', required: true },
  { type: 'input', label: '联系人', field: 'contact' },
  { type: 'input', label: '联系电话', field: 'phone' },
  { type: 'input', label: '付款条件', field: 'terms' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '正常', value: 'active' },
        { label: '冻结', value: 'frozen' }
      ]
    } as any
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.code || !formData.value.name) {
    ElMessage.warning('请填写供应商编码和名称')
    return false
  }
  emit('submit')
  return false
}
</script>
