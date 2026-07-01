<template>
  <div class="designer-page">
    <Designer v-if="loaded" :saving="saving" @back="goBack" @preview="goPreview" @save="onSave" />
    <div v-else v-loading="true" class="loading" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getPrintTemplate, updatePrintTemplate } from '@/api/print'
import Designer from '@/components/print-designer/Designer.vue'
import { usePrintDesignerStore } from '@/stores/printDesigner'

const route = useRoute()
const router = useRouter()
const store = usePrintDesignerStore()

const loaded = ref(false)
const saving = ref(false)

function goBack() {
  router.push({ name: 'printTemplate' })
}

function goPreview() {
  router.push({ name: 'printTemplatePreview', params: { id: String(route.params.id) } })
}

async function onSave() {
  if (!store.template) return
  saving.value = true
  try {
    await updatePrintTemplate(store.template.id, store.template)
    store.dirty = false
    ElMessage.success('保存成功')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const res = await getPrintTemplate(String(route.params.id))
  if (res.data) {
    store.load(res.data)
    loaded.value = true
  } else {
    ElMessage.error('模板不存在')
    goBack()
  }
})
</script>

<style scoped>
.designer-page {
  height: calc(100vh - 100px);
  min-height: 500px;
}

.loading {
  height: 100%;
}
</style>
