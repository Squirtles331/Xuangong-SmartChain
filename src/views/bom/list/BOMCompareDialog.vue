<template>
  <el-dialog v-model="visible" title="选择对比版本" width="500px" :lock-scroll="false">
    <el-form label-width="88px">
      <el-form-item label="当前版本">
        <el-tag>{{ currentBom?.material_code }} {{ currentBom?.material_name }} {{ currentBom?.version }}</el-tag>
      </el-form-item>
      <el-form-item label="对比版本">
        <el-select v-model="selectedVersionId" placeholder="请选择对比版本" style="width: 100%">
          <el-option v-for="item in versions" :key="item.id" :label="`${item.version}（${formatStatus(item.status)}）`" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="!selectedVersionId" @click="emit('submit')">开始对比</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
interface BOMCompareRow {
  id: string
  material_code: string
  material_name: string
  version: string
  status: string
}

interface Props {
  currentBom: BOMCompareRow | null
  versions: BOMCompareRow[]
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const selectedVersionId = defineModel<string>('selectedVersionId', { required: true })

const emit = defineEmits<{
  submit: []
}>()

function formatStatus(status: string) {
  if (status === 'active') return '生效中'
  if (status === 'draft') return '草稿'
  return '已归档'
}
</script>
