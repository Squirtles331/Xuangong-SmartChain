<template>
  <gi-dialog v-model="visible" title="文件预览" width="800px" :footer="false" :lock-scroll="false">
    <div v-if="file?.type === 'image'" style="text-align: center">
      <img :src="file.url" style="max-width: 100%; max-height: 500px" />
    </div>
    <div v-else style="text-align: center; padding: 40px">
      <el-icon :size="64" color="#909399"><component :is="iconComponent(file?.type || '')" /></el-icon>
      <p style="margin-top: 16px; color: #909399">{{ file?.name }}</p>
      <p style="color: #c0c4cc; font-size: 12px">暂不支持在线预览，请下载后查看</p>
    </div>
  </gi-dialog>
</template>

<script setup lang="ts">
interface FilePreviewModel {
  name: string
  type: string
  url: string
}

interface Props {
  file: FilePreviewModel | null
  iconComponent: (type: string) => any
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
</script>
