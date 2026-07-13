<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增打印模板分类' : '编辑打印模板分类'"
    :columns="formColumns"
    :label-width="110"
    width="620px"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'

export interface PrintTemplateCategoryFormModel {
  id: string
  parentId: string | null
  name: string
  code: string
}

interface Props {
  mode: CrudDialogMode
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
</script>
