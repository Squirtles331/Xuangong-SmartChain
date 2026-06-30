<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增客户' : '编辑客户'"
    :footer="true"
    :lock-scroll="false"
    width="600px"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface CustomerFormModel {
  id: string
  code: string
  name: string
  contact_person: string
  contact_phone: string
  payment_terms: string
  credit_limit: number
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<CustomerFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '客户编码', field: 'code', required: true },
  { type: 'input', label: '客户名称', field: 'name', required: true },
  { type: 'input', label: '联系人', field: 'contact_person' },
  { type: 'input', label: '联系电话', field: 'contact_phone' },
  { type: 'input', label: '付款条件', field: 'payment_terms' },
  { type: 'input-number', label: '信用额度', field: 'credit_limit', props: { min: 0, step: 10000 } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '正常', value: 'active' },
        { label: '停用', value: 'disabled' }
      ]
    } as any
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
