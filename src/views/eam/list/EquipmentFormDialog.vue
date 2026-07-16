<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增设备' : '编辑设备'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface EquipmentFormModel {
  id: string
  code: string
  name: string
  model: string
  workshop: string
  status: string
  purchase_date: string
  commission_date: string
}

interface Props {
  mode: 'add' | 'edit'
  workshopOptions?: Array<{ label: string; value: string }>
  statusOptions?: Array<{ label: string; value: string }>
}

const props = withDefaults(defineProps<Props>(), {
  workshopOptions: () => [],
  statusOptions: () => []
})

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<EquipmentFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '设备编码', field: 'code', required: true },
  { type: 'input', label: '设备名称', field: 'name', required: true },
  { type: 'input', label: '型号', field: 'model' },
  {
    type: 'select-v2',
    label: '所属车间',
    field: 'workshop',
    required: true,
    props: {
      options: props.workshopOptions
    } as never
  },
  {
    type: 'select-v2',
    label: '设备状态',
    field: 'status',
    props: {
      options: props.statusOptions
    } as never
  },
  { type: 'date-picker', label: '购置日期', field: 'purchase_date' },
  { type: 'date-picker', label: '投产日期', field: 'commission_date' }
])

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
