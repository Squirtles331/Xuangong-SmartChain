<template>
  <CrudFormDialog
    v-model:visible="visible"
    :title="mode === 'add' ? '新增通知规则' : '编辑通知规则'"
    v-model:form="formData"
    :columns="formColumns"
    :label-width="100"
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

export interface NotificationRuleFormModel {
  id: string
  bizType: string
  channel: 'wecom' | 'dingtalk' | 'internal'
  webhookUrl: string
  status: 'active' | 'disabled'
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<NotificationRuleFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: '业务类型',
    field: 'bizType',
    required: true,
    props: {
      options: [
        { label: '工单审批', value: '工单审批' },
        { label: '工序派工', value: '工序派工' },
        { label: '质检通知', value: '质检通知' },
        { label: '异常上报', value: '异常上报' },
        { label: 'ECN 生效', value: 'ECN 生效' },
        { label: '应收逾期', value: '应收逾期' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '通知渠道',
    field: 'channel',
    required: true,
    props: {
      options: [
        { label: '企业微信', value: 'wecom' },
        { label: '钉钉', value: 'dingtalk' },
        { label: '站内信', value: 'internal' }
      ]
    } as any
  },
  { type: 'input', label: 'Webhook 地址', field: 'webhookUrl', props: { placeholder: '企业微信/钉钉机器人 webhook' } as any },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '停用', value: 'disabled' }
      ]
    } as any
  }
])

function beforeSubmit() {
  if (!formData.value.bizType || !formData.value.channel) {
    ElMessage.warning('请完善通知规则信息')
    return false
  }
  return true
}
</script>
