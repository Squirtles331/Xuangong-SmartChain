<template>
  <el-dialog v-model="visible" title="执行保养" width="500px" :lock-scroll="false">
    <el-table :data="items" border size="small">
      <el-table-column prop="name" label="保养项目" />
      <el-table-column label="结果" width="200">
        <template #default="{ row }">
          <el-radio-group v-model="row.result" size="small">
            <el-radio value="done">已完成</el-radio>
            <el-radio value="issue">有问题</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>
    <el-form label-width="80px" style="margin-top: 12px">
      <el-form-item label="备注">
        <el-input v-model="formData.remark" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="emit('submit')">提交</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface MaintainExecuteItem {
  name: string
  result: string
}

export interface MaintainExecuteFormModel {
  remark: string
}

const visible = defineModel<boolean>('visible', { required: true })
const items = defineModel<MaintainExecuteItem[]>('items', { required: true })
const formData = defineModel<MaintainExecuteFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>
