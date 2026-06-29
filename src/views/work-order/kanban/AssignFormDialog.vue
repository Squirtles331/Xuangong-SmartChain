<template>
  <el-dialog
    v-model="visible"
    title="工序派工"
    width="500px"
    :lock-scroll="false"
  >
    <el-form :model="formData" label-width="100px">
      <el-form-item label="工单">{{ opInfo?.wo_code }}</el-form-item>
      <el-form-item label="工序">{{ opInfo?.operation_no }}: {{ opInfo?.name }}</el-form-item>
      <el-form-item label="执行班组" required>
        <el-select v-model="formData.team" style="width: 100%">
          <el-option v-for="t in teams" :key="t" :label="t" :value="t" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作工">
        <el-select v-model="formData.worker" style="width: 100%">
          <el-option v-for="w in workers" :key="w" :label="w" :value="w" />
        </el-select>
      </el-form-item>
      <el-form-item label="执行设备">
        <el-select v-model="formData.equipment" style="width: 100%">
          <el-option v-for="e in equipment" :key="e" :label="e" :value="e" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认派工</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
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

function handleConfirm() {
  emit('confirm')
  visible.value = false
}
</script>
