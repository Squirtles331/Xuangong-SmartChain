<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增参数' : '编辑参数'"
    width="560px"
  >
    <gi-form ref="formRef" v-model="formData" :columns="formColumns" label-width="100px" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { SystemParam } from '@/api/system'

const CATEGORIES: Record<string, string> = {
  auth: '认证与安全',
  mrp: 'MRP计划',
  stock: '库存与仓库',
  production: '生产管理',
  finance: '财务管理',
  system: '系统通用'
}

export interface ConfigFormModel {
  id: string
  code: string
  name: string
  value: string
  default_value: string
  category: string
  value_type: SystemParam['value_type']
  description: string
  status: SystemParam['status']
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ConfigFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formRef = ref()

const formColumns: FormColumnItem[] = [
  {
    type: 'input',
    label: '参数编码',
    field: 'code',
    props: { placeholder: '唯一标识，如: login_lock_count' },
    rules: [{ required: true, message: '请输入参数编码', trigger: 'blur' }]
  },
  {
    type: 'input',
    label: '参数名称',
    field: 'name',
    props: { placeholder: '如: 登录失败锁定次数' },
    rules: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
  },
  {
    type: 'select-v2',
    label: '所属分类',
    field: 'category',
    props: {
      options: Object.entries(CATEGORIES).map(([k, v]) => ({ label: v, value: k })),
      placeholder: '请选择分类'
    },
    rules: [{ required: true, message: '请选择分类', trigger: 'change' }]
  },
  {
    type: 'select-v2',
    label: '值类型',
    field: 'value_type',
    props: {
      options: [
        { label: '字符串', value: 'string' },
        { label: '数字', value: 'number' },
        { label: '布尔值', value: 'boolean' },
        { label: 'JSON', value: 'json' }
      ]
    },
    rules: [{ required: true, message: '请选择值类型', trigger: 'change' }]
  },
  {
    type: 'input',
    label: '参数值',
    field: 'value',
    props: { placeholder: '当前值' },
    rules: [{ required: true, message: '请输入参数值', trigger: 'blur' }]
  },
  {
    type: 'input',
    label: '默认值',
    field: 'default_value',
    props: { placeholder: '系统默认值' }
  },
  {
    type: 'input',
    label: '描述',
    field: 'description',
    props: { type: 'textarea', rows: 2, placeholder: '参数用途说明' }
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formRef.value) return false
  try {
    const valid = await formRef.value.validate()
    if (!valid) return false
    emit('submit')
    return false
  } catch {
    return false
  }
}
</script>
