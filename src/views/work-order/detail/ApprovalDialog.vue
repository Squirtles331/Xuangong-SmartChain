<template>
  <el-dialog v-model="visible" :title="title" width="480px" :close-on-click-modal="false" :lock-scroll="false">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="当前状态">
        <el-tag :type="currentStatusTagType">{{ currentStatusLabel }}</el-tag>
      </el-form-item>
      <el-form-item label="目标状态">
        <el-tag :type="targetStatusTagType">{{ targetStatusLabel }}</el-tag>
      </el-form-item>
      <el-form-item label="审批意见" required>
        <el-input v-model="formData.opinion" type="textarea" :rows="3" placeholder="请输入审批意见（通过/拒绝时必填）" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

export interface ApprovalFormModel {
  opinion: string
  targetStatus: string
}

interface Props {
  title: string
  currentStatusLabel: string
  currentStatusTagType: string
  targetStatusLabel: string
  targetStatusTagType: string
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ApprovalFormModel>('form', { required: true })

const emit = defineEmits<{
  confirm: []
}>()

function handleConfirm() {
  if (!formData.value.opinion.trim()) {
    ElMessage.warning('请填写审批意见')
    return
  }
  emit('confirm')
  visible.value = false
}
</script>
