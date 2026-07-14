<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增批次隔离' : '编辑批次隔离'"
    :columns="formColumns"
    :label-width="110"
    width="680px"
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

export interface BatchQuarantineFormModel {
  id: string
  code: string
  batchCode: string
  materialCode: string
  materialName: string
  warehouse: string
  location: string
  quarantineType: string
  sourceDocument: string
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<BatchQuarantineFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const warehouseOptions = [
  { label: '原材料仓', value: '原材料仓' },
  { label: '标准件仓', value: '标准件仓' },
  { label: '半成品仓', value: '半成品仓' },
  { label: '成品仓', value: '成品仓' }
]

const quarantineTypeOptions = [
  { label: '来料隔离', value: 'incoming' },
  { label: '制程隔离', value: 'process' },
  { label: '成品隔离', value: 'finished' },
  { label: '客户退回隔离', value: 'customer-return' }
]

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '隔离单号', field: 'code', required: true },
  { type: 'input', label: '批次号', field: 'batchCode', required: true },
  { type: 'input', label: '物料编码', field: 'materialCode', required: true },
  { type: 'input', label: '物料名称', field: 'materialName', required: true },
  { type: 'select-v2', label: '仓库', field: 'warehouse', required: true, props: { options: warehouseOptions } as any },
  { type: 'input', label: '库位', field: 'location', required: true },
  { type: 'select-v2', label: '隔离类型', field: 'quarantineType', required: true, props: { options: quarantineTypeOptions } as any },
  { type: 'input', label: '来源单据', field: 'sourceDocument', required: true }
])

function beforeSubmit() {
  if (!formData.value.code || !formData.value.batchCode || !formData.value.materialCode || !formData.value.materialName) {
    ElMessage.warning('请填写完整的批次隔离信息')
    return false
  }

  return true
}
</script>
