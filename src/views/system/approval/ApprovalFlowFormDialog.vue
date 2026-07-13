<template>
  <CrudFormDialog
    v-model:visible="visible"
    :title="mode === 'add' ? '新增审批流' : '编辑审批流'"
    v-model:form="formData"
    :columns="formColumns"
    :label-width="120"
    width="600px"
    :before-submit="beforeSubmit"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'
import type { FormColumnItem } from 'gi-component'

export interface ApprovalFlowFormModel {
  id: string
  name: string
  businessType: string
  nodes: string
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ApprovalFlowFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '审批流名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '关联业务',
    field: 'businessType',
    required: true,
    props: {
      options: [
        { label: '普通工单', value: 'workOrderNormal' },
        { label: '紧急工单', value: 'workOrderUrgent' },
        { label: 'BOM/工艺', value: 'bomRouting' },
        { label: 'ECN 变更', value: 'ecn' },
        { label: '销售订单', value: 'salesOrder' },
        { label: '采购订单', value: 'purchaseOrder' }
      ]
    } as any
  },
  {
    type: 'input',
    label: '审批节点',
    field: 'nodes',
    required: true,
    props: { placeholder: '多个节点用逗号分隔，例如：车间主任,生产部长' } as any
  }
])

function beforeSubmit() {
  if (!formData.value.name || !formData.value.businessType || !formData.value.nodes) {
    ElMessage.warning('请完善审批流信息')
    return false
  }
  return true
}
</script>
