<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增倒冲记录' : '编辑倒冲记录'"
    :columns="formColumns"
    :label-width="100"
    width="600px"
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

export interface BackflushFormModel {
  id: string
  material: string
  woCode: string
  bomQty: number
  actualQty: number
  diff: number
  status: string
  backflushDate: string
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<BackflushFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input', label: '工单号', field: 'woCode', required: true },
  { type: 'input-number', label: 'BOM 用量', field: 'bomQty', required: true, props: { min: 0 } as any },
  { type: 'input-number', label: '实际用量', field: 'actualQty', required: true, props: { min: 0 } as any },
  { type: 'date-picker', label: '倒冲日期', field: 'backflushDate', props: { valueFormat: 'YYYY-MM-DD' } as any }
])

function beforeSubmit() {
  if (!formData.value.material || !formData.value.woCode) {
    ElMessage.warning('请填写必填项')
    return false
  }

  formData.value.diff = Number(formData.value.actualQty || 0) - Number(formData.value.bomQty || 0)
  return true
}
</script>
