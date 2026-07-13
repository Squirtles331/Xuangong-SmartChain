<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增领料单' : '编辑领料单'"
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

export interface PickingFormModel {
  id: string
  woCode: string
  material: string
  warehouse: string
  status: string
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<PickingFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '工单号', field: 'woCode', required: true },
  { type: 'input', label: '产品名称', field: 'material', required: true },
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
  },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '待拣料', value: 'pending' },
        { label: '已拣料', value: 'picked' },
        { label: '已出库', value: 'completed' }
      ]
    } as any
  }
])

function beforeSubmit() {
  if (!formData.value.woCode || !formData.value.material) {
    ElMessage.warning('请填写必填项')
    return false
  }

  return true
}
</script>
