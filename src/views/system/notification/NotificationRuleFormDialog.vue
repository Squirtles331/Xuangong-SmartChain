<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增通知规则' : '编辑通知规则'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface NotificationRuleFormModel {
  id: string
  bizType: string
  channel: 'wecom' | 'dingtalk' | 'internal'
  webhookUrl: string
  status: 'active' | 'disabled'
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<NotificationRuleFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
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
]

async function handleSubmit() {
  if (!formData.value.bizType || !formData.value.channel) {
    ElMessage.warning('请完善通知规则信息')
    return false
  }
  emit('submit')
  return false
}
</script>
