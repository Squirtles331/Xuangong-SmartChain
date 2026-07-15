<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="dialogTitle"
    width="720px"
  >
    <el-descriptions :column="2" border class="source-block">
      <el-descriptions-item label="处置单号">{{ formData.code || '-' }}</el-descriptions-item>
      <el-descriptions-item label="检验单号">{{ formData.inspectionCode || '-' }}</el-descriptions-item>
      <el-descriptions-item label="物料名称">{{ formData.material || '-' }}</el-descriptions-item>
      <el-descriptions-item label="来源单号">{{ formData.sourceCode || '-' }}</el-descriptions-item>
    </el-descriptions>
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" style="margin-top: 16px" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FormColumnItem } from 'gi-component'
import type { NonconformanceRecord } from '@/types/qms'

type DialogMode = 'add' | 'edit' | 'judge'

const props = defineProps<{
  mode: DialogMode
}>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<NonconformanceRecord>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const dialogTitle = computed(() => {
  if (props.mode === 'add') return '新增不合格处置'
  if (props.mode === 'judge') return '执行质量裁决'
  return '编辑不合格处置'
})

const formColumns: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '严重等级',
    field: 'severity',
    required: true,
    props: {
      options: [
        { label: '严重', value: 'critical' },
        { label: '主要', value: 'major' },
        { label: '次要', value: 'minor' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '裁决动作',
    field: 'disposition',
    required: true,
    props: {
      options: [
        { label: '待裁决', value: 'pending' },
        { label: '返工', value: 'rework' },
        { label: '报废', value: 'scrap' },
        { label: '让步接收', value: 'concession' },
        { label: '复检', value: 'reinspect' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '处理状态',
    field: 'status',
    required: true,
    props: {
      options: [
        { label: '待处理', value: 'open' },
        { label: '处理中', value: 'reviewing' },
        { label: '已关闭', value: 'closed' }
      ]
    } as any
  },
  { type: 'input', label: '责任人', field: 'owner', required: true },
  { type: 'input', label: '后续动作', field: 'followUp', required: true },
  {
    type: 'input',
    label: '问题描述',
    field: 'issueDesc',
    required: true,
    props: {
      type: 'textarea',
      rows: 4
    } as any
  }
]

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

<style scoped>
.source-block {
  margin-bottom: 8px;
}
</style>
