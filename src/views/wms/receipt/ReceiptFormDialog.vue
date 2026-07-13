<template>
  <CrudFormDialog
    v-model:visible="visible"
    :title="mode === 'add' ? '新增入库单' : '编辑入库单'"
    v-model:form="formData"
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

export interface ReceiptFormModel {
  id: string
  code: string
  type: string
  material: string
  qty: number
  warehouse: string
  status: string
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ReceiptFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '入库单号', field: 'code', required: true },
  {
    type: 'select-v2',
    label: '入库类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '采购入库', value: 'purchase' },
        { label: '生产入库', value: 'production' }
      ]
    } as any
  },
  { type: 'input', label: '物料名称', field: 'material', required: true },
  { type: 'input-number', label: '数量', field: 'qty', required: true, props: { min: 1 } as any },
  {
    type: 'select-v2',
    label: '仓库',
    field: 'warehouse',
    props: {
      options: [
        { label: '原材料仓', value: '原材料仓' },
        { label: '标准件仓', value: '标准件仓' },
        { label: '半成品仓', value: '半成品仓' },
        { label: '成品仓', value: '成品仓' }
      ]
    } as any
  }
])

function beforeSubmit() {
  if (!formData.value.code || !formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }

  return true
}
</script>
