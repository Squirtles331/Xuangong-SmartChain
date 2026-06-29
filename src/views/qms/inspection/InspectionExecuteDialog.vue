<template>
  <el-dialog v-model="visible" title="执行检验" width="700px" :lock-scroll="false">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="任务编号">{{ task?.code }}</el-descriptions-item>
      <el-descriptions-item label="物料">{{ task?.material }}</el-descriptions-item>
    </el-descriptions>
    <el-table :data="items" border style="margin-top: 16px">
      <el-table-column prop="name" label="检验项目" width="140" />
      <el-table-column prop="standard" label="标准值" width="140" />
      <el-table-column label="实测值" width="140">
        <template #default="{ row }">
          <el-input v-model="row.value" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="判定" width="100">
        <template #default="{ row }">
          <el-tag :type="row.value ? (Math.abs(Number(row.value) - Number(row.standard)) < 0.5 ? 'success' : 'danger') : 'info'" size="small">
            {{ row.value ? (Math.abs(Number(row.value) - Number(row.standard)) < 0.5 ? '合格' : '不合格') : '-' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 16px">
      <el-radio-group v-model="result">
        <el-radio value="qualified">合格</el-radio>
        <el-radio value="concession">让步接收</el-radio>
        <el-radio value="sorting">挑选使用</el-radio>
        <el-radio value="return">退货</el-radio>
        <el-radio value="scrap">报废</el-radio>
      </el-radio-group>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="emit('submit')">提交</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
export interface InspectionExecuteTask {
  code: string
  material: string
}

export interface InspectionExecuteItem {
  name: string
  standard: string
  value: string
}

interface Props {
  task: InspectionExecuteTask | null
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const items = defineModel<InspectionExecuteItem[]>('items', { required: true })
const result = defineModel<string>('result', { required: true })

const emit = defineEmits<{
  submit: []
}>()
</script>
