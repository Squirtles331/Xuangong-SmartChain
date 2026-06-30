<template>
  <gi-dialog
    v-model="visible"
    :title="mode === 'add' ? '新增价格记录' : '编辑价格记录'"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    width="620px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface PriceFormModel {
  id: string
  material: string
  supplier: string
  price: number
  currency: string
  valid_from: string
  valid_to: string
  source: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PriceFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '供应商', field: 'supplier', required: true },
  { type: 'input-number', label: '单价', field: 'price', required: true, props: { min: 0, precision: 2 } as any },
  { type: 'input', label: '币种', field: 'currency' },
  { type: 'date-picker', label: '生效日期', field: 'valid_from', props: { valueFormat: 'YYYY-MM-DD' } as any },
  { type: 'date-picker', label: '失效日期', field: 'valid_to', props: { valueFormat: 'YYYY-MM-DD' } as any },
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      options: [
        { label: '报价单', value: '报价单' },
        { label: '比价结果', value: '比价结果' },
        { label: '年度合同', value: '年度合同' },
        { label: '历史价格', value: '历史价格' }
      ]
    } as any
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.material || !formData.value.supplier) {
    ElMessage.warning('请填写物料名称和供应商')
    return false
  }
  emit('submit')
  return false
}
</script>
