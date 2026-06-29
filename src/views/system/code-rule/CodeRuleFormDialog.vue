<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :title="mode === 'add' ? '新增编码规则' : '编辑编码规则'"
    width="550px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="120" />
    <!-- 实时预览 -->
    <div class="preview-box" style="margin-top: 16px; padding: 12px; background: #f5f7fa; border-radius: 6px">
      <span style="font-size: 13px; color: #606266">编码预览：</span>
      <span style="font-size: 16px; font-weight: bold; color: #409eff; margin-left: 8px">{{ previewCode }}</span>
    </div>
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'

export interface CodeRuleFormModel {
  id: string
  code: string
  name: string
  prefix: string
  date_format: string
  serial_length: number
}

interface Props {
  mode: 'add' | 'edit'
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<CodeRuleFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '规则编码', field: 'code', required: true },
  { type: 'input', label: '规则名称', field: 'name', required: true },
  { type: 'input', label: '前缀', field: 'prefix', required: true },
  {
    type: 'select-v2',
    label: '日期格式',
    field: 'date_format',
    required: true,
    props: {
      options: [
        { label: 'YYYYMMDD', value: 'YYYYMMDD' },
        { label: 'YYMMDD', value: 'YYMMDD' },
        { label: 'YYYYMM', value: 'YYYYMM' }
      ]
    } as any
  },
  { type: 'input-number', label: '流水号长度', field: 'serial_length', required: true, props: { min: 2, max: 10 } as any }
]

const previewCode = computed(() => {
  const prefix = formData.value.prefix || '???'
  const now = new Date()
  const y = now.getFullYear().toString()
  const m = (now.getMonth() + 1).toString().padStart(2, '0')
  const d = now.getDate().toString().padStart(2, '0')
  let dateStr = ''
  switch (formData.value.date_format) {
    case 'YYYYMMDD':
      dateStr = y + m + d
      break
    case 'YYMMDD':
      dateStr = y.slice(2) + m + d
      break
    case 'YYYYMM':
      dateStr = y + m
      break
    default:
      dateStr = y + m + d
  }
  const serial = '1'.padStart(formData.value.serial_length || 4, '0')
  return `${prefix}${dateStr}${serial}`
})

async function handleSubmit() {
  emit('submit')
  return false
}
</script>
