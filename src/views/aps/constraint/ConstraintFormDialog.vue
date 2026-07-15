<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增排程约束' : '编辑排程约束'"
    width="620px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="110" />
  </gi-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'
import type { ApsConstraintFormModel, ApsConstraintType } from '@/types/aps'

interface Props {
  mode: 'add' | 'edit'
  constraintType: ApsConstraintType
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ApsConstraintFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const moldToolColumns: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '适用对象', field: 'applicable', required: true },
  { type: 'input', label: '寿命 / 数量', field: 'life', required: true },
  { type: 'switch', label: '是否可用', field: 'available' },
  { type: 'input-number', label: '利用率', field: 'utilization', props: { min: 0, max: 100 } as any }
]

const skillColumns: FormColumnItem[] = [
  { type: 'input', label: '工序', field: 'operation', required: true },
  { type: 'input', label: '技能要求', field: 'skill', required: true },
  { type: 'input-number', label: '最低等级', field: 'minLevel', props: { min: 1, max: 5 } as any },
  { type: 'input-number', label: '配备人数', field: 'workersCount', props: { min: 1 } as any },
  { type: 'input-number', label: '利用率', field: 'utilization', props: { min: 0, max: 100 } as any }
]

const formColumns = computed(() => (props.constraintType === 'skill' ? skillColumns : moldToolColumns))

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  if (props.constraintType === 'skill') {
    if (!formData.value.operation || !formData.value.skill) {
      ElMessage.warning('请填写完整的工序和技能要求')
      return false
    }
  } else if (!formData.value.code || !formData.value.name || !formData.value.applicable || !formData.value.life) {
    ElMessage.warning('请填写完整的约束信息')
    return false
  }

  emit('submit')
  return false
}
</script>
