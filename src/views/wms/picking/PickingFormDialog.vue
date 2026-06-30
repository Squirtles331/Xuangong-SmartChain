<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增领料单' : '编辑领料单'"
    width="600px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface PickingFormModel {
  id: string
  wo_code: string
  material: string
  status: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PickingFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '工单号', field: 'wo_code', required: true },
  { type: 'input', label: '产品名称', field: 'material', required: true },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待拣货', value: 'pending' },
        { label: '已拣货', value: 'picked' },
        { label: '已出库', value: 'completed' }
      ]
    } as any
  }
]

async function handleSubmit() {
  if (!formData.value.wo_code || !formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }
  emit('submit')
  return false
}
</script>
