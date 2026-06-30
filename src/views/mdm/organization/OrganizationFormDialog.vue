<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增组织节点' : '编辑组织节点'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export type OrgType = 'group' | 'company' | 'plant' | 'workshop' | 'line'

export interface OrganizationFormModel {
  id: string
  parentId?: string
  name: string
  code: string
  type: OrgType
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<OrganizationFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const typeOptions: Array<{ label: string; value: OrgType }> = [
  { label: '集团', value: 'group' },
  { label: '公司', value: 'company' },
  { label: '工厂', value: 'plant' },
  { label: '车间', value: 'workshop' },
  { label: '产线', value: 'line' }
]

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '编码', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: typeOptions
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
