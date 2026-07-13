<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增参数' : '编辑参数'"
    :columns="formColumns"
    :label-width="100"
    @submit="emit('submit')"
  />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'

export interface ParamFormModel {
  id: string
  code: string
  name: string
  value: string
  category: string
  description: string
  status: 'active' | 'inactive'
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ParamFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '参数编码', field: 'code', required: true },
  { type: 'input', label: '参数名称', field: 'name', required: true },
  { type: 'input', label: '参数值', field: 'value', required: true },
  { type: 'input', label: '所属分类', field: 'category', props: { placeholder: '如：MES配置' } as never },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '启用', value: 'active' },
        { label: '停用', value: 'inactive' }
      ]
    } as never
  },
  { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 3 } as never }
])
</script>
