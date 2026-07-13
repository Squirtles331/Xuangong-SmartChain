<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增打印模板' : '编辑打印模板'"
    :columns="formColumns"
    :label-width="110"
    width="680px"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'

export interface PrintTemplateFormModel {
  id: string
  categoryId: string
  name: string
  systemBuiltin: boolean
  isDefault: boolean
  remark: string
}

interface Props {
  mode: CrudDialogMode
  categoryOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PrintTemplateFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: '模板分类',
    field: 'categoryId',
    required: true,
    props: {
      options: props.categoryOptions,
      filterable: true
    } as any
  },
  { type: 'input', label: '模板名称', field: 'name', required: true },
  { type: 'switch', label: '系统内置模板', field: 'systemBuiltin' },
  { type: 'switch', label: '默认模板', field: 'isDefault' },
  {
    type: 'textarea',
    label: '备注',
    field: 'remark',
    props: {
      rows: 4,
      maxlength: 200,
      showWordLimit: true
    } as any
  }
])
</script>
