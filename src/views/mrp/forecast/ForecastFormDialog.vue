<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增预测需求' : '编辑预测需求'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface ForecastFormModel {
  id: string
  material_code: string
  material_name: string
  qty: number
  need_date: string
  type: string
  probability: number
  remark: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ForecastFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '产品编码', field: 'material_code', required: true },
  { type: 'input', label: '产品名称', field: 'material_name', required: true },
  { type: 'input-number', label: '预测数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'date-picker', label: '需求日期', field: 'need_date', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    props: {
      options: [
        { label: '销售预测', value: 'sales' },
        { label: '独立需求', value: 'independent' }
      ]
    } as any
  },
  { type: 'input-number', label: '概率(%)', field: 'probability', props: { min: 0, max: 100 } as any },
  { type: 'input', label: '备注', field: 'remark' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
