<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增并行工序配置' : '编辑并行工序配置'"
    width="640px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface ParallelFormModel {
  id: string
  routing_id: string
  routing_name: string
  operations: string[]
  merge_rule: string
  remark: string
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ParallelFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const routingOptions = [
  { label: '离心泵 XJP-100 标准工艺', value: 'routing-1' },
  { label: '齿轮箱 GBX-200 标准工艺', value: 'routing-2' }
]

const operationOptions = [
  { label: '工序10：下料', value: '工序10：下料' },
  { label: '工序20：粗车', value: '工序20：粗车' },
  { label: '工序30：精车', value: '工序30：精车' },
  { label: '工序40：钻孔', value: '工序40：钻孔' },
  { label: '工序50：热处理', value: '工序50：热处理' },
  { label: '工序60：磨削', value: '工序60：磨削' },
  { label: '工序70：装配', value: '工序70：装配' },
  { label: '工序80：试压', value: '工序80：试压' }
]

const mergeRuleOptions = [
  { label: '全部完成后继续', value: '全部完成后继续' },
  { label: '任一完成后继续', value: '任一完成后继续' }
]

const formColumns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '工艺路线',
    field: 'routing_id',
    required: true,
    props: {
      options: routingOptions,
      onChange: (value: string) => {
        const option = routingOptions.find((item) => item.value === value)
        if (option) formData.value.routing_name = option.label
      }
    } as any
  },
  { type: 'input', label: '工艺路线名称', field: 'routing_name', required: true, props: { disabled: true } as any },
  {
    type: 'select-v2',
    label: '并行工序',
    field: 'operations',
    required: true,
    props: {
      multiple: true,
      collapseTags: true,
      options: operationOptions
    } as any
  },
  {
    type: 'select-v2',
    label: '汇合规则',
    field: 'merge_rule',
    required: true,
    props: {
      options: mergeRuleOptions
    } as any
  },
  { type: 'textarea', label: '备注', field: 'remark', props: { rows: 3, maxlength: 120, showWordLimit: true } as any }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (!formData.value.routing_id || !formData.value.operations.length || !formData.value.merge_rule) {
    ElMessage.warning('请填写完整的并行工序配置信息')
    return false
  }
  emit('submit')
  return false
}
</script>
