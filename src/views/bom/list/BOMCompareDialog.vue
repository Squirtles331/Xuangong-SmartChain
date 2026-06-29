<template>
  <el-dialog v-model="visible" title="选择比较版本" width="500px" :lock-scroll="false">
    <el-form label-width="80px">
      <el-form-item label="当前 BOM">
        <el-tag>{{ currentBom?.material_code }} {{ currentBom?.material_name }} {{ currentBom?.version }}</el-tag>
      </el-form-item>
      <el-form-item label="比较版本">
        <el-select v-model="selectedVersionId" placeholder="选择要比较的版本" style="width: 100%">
          <el-option
            v-for="item in versions"
            :key="item.id"
            :label="`${item.version} (${item.status === 'active' ? '生效中' : item.status === 'draft' ? '草稿' : '已归档'})`"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="!selectedVersionId" @click="emit('submit')">开始比较</el-button>
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
</script>
