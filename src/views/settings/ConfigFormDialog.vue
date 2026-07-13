<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增参数' : '编辑参数'"
    :columns="formColumns"
    :label-width="110"
    width="580px"
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
import type { SystemParam } from '@/api/system'

export interface ConfigFormModel {
  id: string
  code: string
  name: string
  value: string
  defaultValue: string
  category: string
  valueType: SystemParam['valueType']
  description: string
  status: SystemParam['status']
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ConfigFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '参数编码', field: 'code', required: true, props: { placeholder: '如：loginLockCount' } as any },
  { type: 'input', label: '参数名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '所属分类',
    field: 'category',
    required: true,
    props: {
      options: [
        { label: '认证与安全', value: 'auth' },
        { label: 'MRP 计划', value: 'mrp' },
        { label: '库存与仓储', value: 'stock' },
        { label: '生产管理', value: 'production' },
        { label: '财务管理', value: 'finance' },
        { label: '系统通用', value: 'system' },
        { label: '安全策略', value: 'security' },
        { label: '文件管理', value: 'file' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '值类型',
    field: 'valueType',
    required: true,
    props: {
      options: [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 'number' },
        { label: '布尔值', value: 'boolean' },
        { label: 'JSON', value: 'json' }
      ]
    } as any
  },
  { type: 'input', label: '参数值', field: 'value', required: true },
  { type: 'input', label: '默认值', field: 'defaultValue' },
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
  },
  { type: 'input', label: '说明', field: 'description', props: { type: 'textarea', rows: 2 } as any }
])

function beforeSubmit() {
  if (!formData.value.code || !formData.value.name || !formData.value.value) {
    ElMessage.warning('请完善参数信息')
    return false
  }
  return true
}
</script>
