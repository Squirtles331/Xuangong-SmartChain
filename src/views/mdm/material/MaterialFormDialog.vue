<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增物料主数据' : '编辑物料主数据'"
    width="720px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface MaterialFormModel {
  id: string
  code: string
  name: string
  spec: string
  category: string
  type: 'purchased' | 'manufactured' | 'outsourced'
  unit: string
  supplyMode: string
  status: 'draft' | 'active' | 'disabled' | 'archived'
  planner: string
  leadTimeDays: number
  safeStock: number
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<MaterialFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  { type: 'input', label: '物料编码', field: 'code', required: true },
  { type: 'input', label: '物料名称', field: 'name', required: true },
  { type: 'input', label: '规格型号', field: 'spec' },
  {
    type: 'select-v2',
    label: '分类',
    field: 'category',
    required: true,
    props: {
      options: ['钢材', '铝材', '机加件', '装配件', '电气件', '标准件'].map((item) => ({ label: item, value: item }))
    } as never
  },
  {
    type: 'select-v2',
    label: '物料类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '外购', value: 'purchased' },
        { label: '自制', value: 'manufactured' },
        { label: '委外', value: 'outsourced' }
      ]
    } as never
  },
  { type: 'input', label: '单位', field: 'unit', required: true },
  { type: 'input', label: '供应策略', field: 'supplyMode' },
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '已生效', value: 'active' },
        { label: '已停用', value: 'disabled' },
        { label: '已归档', value: 'archived' }
      ]
    } as never
  },
  { type: 'input', label: '责任计划组', field: 'planner' },
  { type: 'input-number', label: '提前期(天)', field: 'leadTimeDays', props: { min: 0, precision: 0 } as never },
  { type: 'input-number', label: '安全库存', field: 'safeStock', props: { min: 0, precision: 0 } as never }
])

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
