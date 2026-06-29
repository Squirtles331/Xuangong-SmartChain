<template>
  <el-dialog v-model="visible" title="异常上报" width="500px" :lock-scroll="false">
    <el-form :model="formData" label-width="100px">
      <el-form-item label="异常类型" required>
        <el-select v-model="formData.type" style="width: 100%">
          <el-option label="设备故障" value="equipment" />
          <el-option label="来料不良" value="material" />
          <el-option label="图纸/工艺错误" value="process" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述" required>
        <el-input v-model="formData.description" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleConfirm">提交</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface ExceptionFormModel {
  type: string
  description: string
}

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<ExceptionFormModel>('form', { required: true })

const emit = defineEmits<{
  confirm: []
}>()

function handleConfirm() {
  emit('confirm')
  visible.value = false
}
</script>
