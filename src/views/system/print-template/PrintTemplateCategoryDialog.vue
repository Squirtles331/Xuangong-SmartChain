<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增打印模板分类' : '编辑打印模板分类'"
    width="620px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface PrintTemplateCategoryFormModel {
  id: string
  parentId: string | null
  name: string
  code: string
}

interface Props {
  mode: 'add' | 'edit'
  parentOptions: Array<{ label: string; value: string | null }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PrintTemplateCategoryFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: '上级分类',
    field: 'parentId',
    props: {
      options: props.parentOptions,
      clearable: true
    } as any
  },
  { type: 'input', label: '分类名称', field: 'name', required: true },
  { type: 'input', label: '分类编码', field: 'code', required: true }
])

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
