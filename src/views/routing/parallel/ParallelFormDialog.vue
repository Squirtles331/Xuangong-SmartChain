<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增并行组' : '编辑并行组'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface ParallelFormModel {
  id: string
  routing_name: string
  operations: string[]
  merge_rule: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ParallelFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '工艺路线', field: 'routing_name', required: true },
  {
    type: 'select-v2',
    label: '并行工序',
    field: 'operations',
    required: true,
    props: {
      multiple: true,
      options: [
        { label: '工序10:下料', value: '工序10:下料' },
        { label: '工序20:粗车', value: '工序20:粗车' },
        { label: '工序30:精车', value: '工序30:精车' },
        { label: '工序40:钻孔', value: '工序40:钻孔' },
        { label: '工序50:热处理', value: '工序50:热处理' },
        { label: '工序60:磨削', value: '工序60:磨削' },
        { label: '工序70:装配', value: '工序70:装配' },
        { label: '工序80:测试', value: '工序80:测试' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '汇合规则',
    field: 'merge_rule',
    props: {
      options: [
        { label: '全部完成后继续', value: '全部完成后继续' },
        { label: '任一完成后继续', value: '任一完成后继续' }
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
