<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    title="工序派工"
    :columns="formColumns"
    :label-width="100"
    width="500px"
    :before-submit="beforeSubmit"
    @submit="handleConfirm"
  >
    <div class="assign-meta">
      <el-form-item label="工单">
        <span>{{ opInfo?.wo_code || '-' }}</span>
      </el-form-item>
      <el-form-item label="工序">
        <span>{{ opInfo ? `${opInfo.operation_no}: ${opInfo.name}` : '-' }}</span>
      </el-form-item>
    </div>
  </CrudFormDialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'

export interface AssignFormModel {
  team: string
  worker: string
  equipment: string
}

interface OpInfo {
  wo_code: string
  operation_no: number
  name: string
}

interface Props {
  opInfo: OpInfo | null
  teams: string[]
  workers: string[]
  equipment: string[]
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<AssignFormModel>('form', { required: true })

const emit = defineEmits<{
  confirm: []
}>()

const formColumns = computed<FormColumnItem[]>(() => [
  {
    type: 'select-v2',
    label: '执行班组',
    field: 'team',
    required: true,
    props: {
      options: props.teams.map((item) => ({ label: item, value: item }))
    } as any
  },
  {
    type: 'select-v2',
    label: '操作工',
    field: 'worker',
    props: {
      options: props.workers.map((item) => ({ label: item, value: item })),
      clearable: true
    } as any
  },
  {
    type: 'select-v2',
    label: '执行设备',
    field: 'equipment',
    props: {
      options: props.equipment.map((item) => ({ label: item, value: item })),
      clearable: true
    } as any
  }
])

function beforeSubmit() {
  if (!formData.value.team) {
    ElMessage.warning('请选择执行班组')
    return false
  }

  return true
}

function handleConfirm() {
  emit('confirm')
  visible.value = false
}
</script>

<style scoped>
.assign-meta {
  margin-bottom: 12px;
}
</style>
