<template>
  <div class="print-designer-page">
    <print-designer ref="designerRef" class="pd" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'

/** vue-print-designer Web Component 命令式实例 */
interface PrintDesignerEl extends HTMLElement {
  setBranding(payload?: { title?: string; showLogo?: boolean; showTitle?: boolean }): void
  setLanguage(lang: 'zh' | 'zh-Hant' | 'en' | 'ja' | 'ko' | 'de'): void
  loadTemplateData(data: unknown): boolean
  getTemplateData(): unknown
}

const designerRef = ref<PrintDesignerEl | null>(null)

function onReady() {
  const el = designerRef.value
  if (!el) return
  el.setBranding({ title: '打印模板设计器', showTitle: true, showLogo: false })
  el.setLanguage('zh')
}

function onError(e: Event) {
  const detail = (e as CustomEvent).detail
  ElMessage.error(detail?.error ? String(detail.error) : '打印设计器发生错误')
}

onMounted(() => {
  const el = designerRef.value
  if (!el) return
  el.addEventListener('ready', onReady)
  el.addEventListener('error', onError)
})
</script>

<style scoped>
.print-designer-page {
  height: calc(100vh - 100px);
  min-height: 500px;
}
.pd {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
