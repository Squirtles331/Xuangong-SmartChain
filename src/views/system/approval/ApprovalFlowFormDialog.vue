<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增审批流' : '编辑审批流'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="120" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface ApprovalFlowFormModel {
  id: string
  name: string
  business_type: string
  nodes: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ApprovalFlowFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '审批流名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '关联业务',
    field: 'business_type',
    required: true,
    props: {
      options: [
        { label: '普通工单', value: 'work_order_normal' },
        { label: '紧急工单', value: 'work_order_urgent' },
        { label: 'BOM/工艺', value: 'bom_routing' },
        { label: 'ECN变更', value: 'ecn' },
        { label: '销售订单', value: 'sales_order' },
        { label: '采购订单', value: 'purchase_order' }
      ]
    } as any
  },
  { type: 'input', label: '审批节点', field: 'nodes', required: true, props: { placeholder: '多个节点用逗号分隔，如：车间主任,生产部长' } as any }
]

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
