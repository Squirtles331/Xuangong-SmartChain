<template>
  <el-dialog v-model="visible" title="执行过程检验" width="760px" :lock-scroll="false">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="检验单号">{{ task?.code }}</el-descriptions-item>
      <el-descriptions-item label="物料名称">{{ task?.material }}</el-descriptions-item>
      <el-descriptions-item label="工序任务号">{{ task?.sourceCode }}</el-descriptions-item>
      <el-descriptions-item label="来源说明">{{ task?.sourceName }}</el-descriptions-item>
      <el-descriptions-item label="检验模板" :span="2">{{ task?.templateName }}</el-descriptions-item>
    </el-descriptions>

    <el-table :data="items" border style="margin-top: 16px">
      <el-table-column prop="name" label="检验项目" min-width="140" />
      <el-table-column prop="standard" label="标准值" min-width="140" />
      <el-table-column label="实测值" min-width="160">
        <template #default="{ row }">
          <el-input v-model="row.value" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="判定" width="100">
        <template #default="{ row }">
          <el-tag :type="resolveItemTag(row)" size="small">
            {{ resolveItemLabel(row) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="result-panel">
      <span class="result-label">裁决结果</span>
      <el-radio-group v-model="result">
        <el-radio value="pass">合格</el-radio>
        <el-radio value="concession">让步接收</el-radio>
        <el-radio value="rework">返工</el-radio>
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
export interface ProcessInspectionExecuteTask {
  code: string
  material: string
  sourceCode: string
  sourceName: string
  templateName: string
}

export interface ProcessInspectionExecuteItem {
  name: string
  standard: string
  value: string
}

defineProps<{
  task: ProcessInspectionExecuteTask | null
}>()

const visible = defineModel<boolean>('visible', { required: true })
const items = defineModel<ProcessInspectionExecuteItem[]>('items', { required: true })
const result = defineModel<'pass' | 'concession' | 'rework' | 'return' | 'scrap'>('result', { required: true })

const emit = defineEmits<{
  submit: []
}>()

function resolveItemTag(row: Record<string, any>) {
  const item = row as ProcessInspectionExecuteItem
  if (!item.value) return 'info'
  return isItemPass(item) ? 'success' : 'danger'
}

function resolveItemLabel(row: Record<string, any>) {
  const item = row as ProcessInspectionExecuteItem
  if (!item.value) return '-'
  return isItemPass(item) ? '合格' : '不合格'
}

function isItemPass(row: ProcessInspectionExecuteItem) {
  const standardNumber = Number(row.standard)
  const valueNumber = Number(row.value)

  if (!Number.isNaN(standardNumber) && !Number.isNaN(valueNumber)) {
    return Math.abs(valueNumber - standardNumber) <= 0.5
  }

  return row.value.trim() === row.standard.trim()
}
</script>

<style scoped>
.result-panel {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.result-label {
  color: var(--el-text-color-secondary);
}
</style>
