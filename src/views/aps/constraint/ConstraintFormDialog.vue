<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增约束' : '编辑约束'"
    width="560px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'

export interface ConstraintFormModel {
  id: string
  code: string
  name: string
  applicable: string
  life: string
  available: boolean
  utilization: number
  operation: string
  skill: string
  min_level: number
  workers_count: number
}

interface Props {
  mode: 'add' | 'edit'
  constraintType: 'mold' | 'tool' | 'skill'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ConstraintFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const moldToolColumns: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '适用对象', field: 'applicable', required: true },
  { type: 'input', label: '寿命/数量', field: 'life', required: true },
  { type: 'switch', label: '是否可用', field: 'available' },
  { type: 'input-number', label: '利用率', field: 'utilization', props: { min: 0, max: 100 } as any }
]

const skillColumns: FormColumnItem[] = [
  { type: 'input', label: '工序', field: 'operation', required: true },
  { type: 'input', label: '技能要求', field: 'skill', required: true },
  { type: 'input-number', label: '最低等级', field: 'min_level', props: { min: 1, max: 5 } as any },
  { type: 'input-number', label: '具备人数', field: 'workers_count', props: { min: 1 } as any },
  { type: 'input-number', label: '利用率', field: 'utilization', props: { min: 0, max: 100 } as any }
]

const formColumns = computed(() => (props.constraintType === 'skill' ? skillColumns : moldToolColumns))

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (props.constraintType === 'skill') {
    if (!formData.value.operation || !formData.value.skill) {
      ElMessage.warning('请填写工序和技能要求')
      return false
    }
  } else if (!formData.value.code || !formData.value.name || !formData.value.applicable) {
    ElMessage.warning('请填写完整的约束信息')
    return false
  }

  emit('submit')
  return false
}
</script>
