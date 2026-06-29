<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增客户' : '编辑客户'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="120" />
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

const props = defineProps<Props>()

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
  { type: 'input', label: '付款条款', field: 'payment_terms' },
  { type: 'input-number', label: '信用额度', field: 'credit_limit', props: { min: 0, step: 10000 } as any }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
