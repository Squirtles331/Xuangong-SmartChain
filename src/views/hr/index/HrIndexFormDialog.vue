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

export interface HrEmployeeFormModel {
  id: string
  code: string
  name: string
  department: string
  position: string
  phone: string
  hire_date: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
  departmentOptions: Array<{ label: string; value: string }>
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<HrEmployeeFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const title = computed(() => (props.mode === 'add' ? '新增员工' : '编辑员工'))

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '工号', field: 'code', required: true },
  { type: 'input', label: '姓名', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '部门',
    field: 'department',
    required: true,
    props: {
      options: props.departmentOptions
    } as any
  },
  { type: 'input', label: '岗位', field: 'position', required: true },
  { type: 'input', label: '电话', field: 'phone' },
  { type: 'date-picker', label: '入职日期', field: 'hire_date' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '在职', value: 'active' },
        { label: '离职', value: 'inactive' }
      ]
    } as any
  }
])

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
