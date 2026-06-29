<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="title"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface EmergencyFormModel {
  id: string
  name: string
  type: string
  level: string
  responsible: string
  last_drill: string
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<EmergencyFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => (props.mode === 'add' ? '新增预案' : '编辑预案'))

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '预案名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '事故类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '火灾', value: '火灾' },
        { label: '危化品', value: '危化品' },
        { label: '机械', value: '机械' },
        { label: '电力', value: '电力' },
        { label: '其他', value: '其他' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '响应等级',
    field: 'level',
    required: true,
    props: {
      options: [
        { label: 'I级', value: 'I' },
        { label: 'II级', value: 'II' },
        { label: 'III级', value: 'III' }
      ]
    } as any
  },
  { type: 'input', label: '负责人', field: 'responsible' },
  { type: 'date-picker', label: '最近演练', field: 'last_drill' }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
