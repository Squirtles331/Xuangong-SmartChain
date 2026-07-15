<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增预测需求' : '编辑预测需求'"
    width="640px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'
import type { ErpForecastRecord } from '@/static/services/erp'

export interface ForecastFormModel extends ErpForecastRecord {}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ForecastFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '物料编码', field: 'materialCode', required: true },
  { type: 'input', label: '物料名称', field: 'materialName', required: true },
  { type: 'input-number', label: '预测数量', field: 'qty', required: true, props: { min: 1 } as any },
  { type: 'date-picker', label: '需求日期', field: 'needDate', required: true, props: { valueFormat: 'YYYY-MM-DD' } as any },
  {
    type: 'select-v2',
    label: '预测类型',
    field: 'type',
    props: {
      options: [
        { label: '销售预测', value: 'sales' },
        { label: '独立预测', value: 'independent' }
      ]
    } as any
  },
  { type: 'input-number', label: '概率(%)', field: 'probability', props: { min: 0, max: 100 } as any },
  { type: 'input', label: '责任人', field: 'demandOwner', required: true },
  {
    type: 'select-v2',
    label: '需求池状态',
    field: 'consumptionStatus',
    props: {
      options: [
        { label: '待承接', value: 'pending' },
        { label: '已纳入需求池', value: 'consumed' },
        { label: '已归档', value: 'archived' }
      ]
    } as any
  },
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
