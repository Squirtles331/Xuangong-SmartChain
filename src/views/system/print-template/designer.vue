<template>
  <gi-page-layout>
    <template #header>
      <div class="designer-header">
        <div class="designer-title">{{ templateName || '打印模板设计' }}</div>
        <div class="designer-subtitle">{{ categoryName || '打印模板设计器' }}</div>
      </div>
    </template>

    <template #tool>
      <el-button @click="router.back()">返回</el-button>
      <el-button type="primary" :loading="saving" @click="handleSave">保存设计</el-button>
    </template>

    <div class="print-designer-page">
      <print-designer ref="designerRef" class="pd" />
    </div>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { getPrintTemplateDetail, updatePrintTemplateDesign } from '@/api/system'

interface PrintDesignerEl extends HTMLElement {
  setBranding(payload?: { title?: string; showLogo?: boolean; showTitle?: boolean }): void
  setLanguage(lang: 'zh' | 'zh-Hant' | 'en' | 'ja' | 'ko' | 'de'): void
  setTheme(theme: 'light' | 'dark' | 'system'): void
  loadTemplateData(data: unknown): boolean
  getTemplateData(): unknown
}

const route = useRoute()
const router = useRouter()

const designerRef = ref<PrintDesignerEl | null>(null)
const saving = ref(false)
const designerReady = ref(false)
const templateName = ref('')
const categoryName = ref('')
const templateData = ref<unknown>(null)

const templateId = computed(() => String(route.params.id || ''))

function forceLightTheme() {
  designerRef.value?.setTheme('light')
}

function applyTemplateData() {
  if (!designerReady.value || !designerRef.value || !templateData.value) return
  designerRef.value.loadTemplateData(templateData.value)
}

function onReady() {
  const el = designerRef.value
  if (!el) return
  designerReady.value = true
  el.setTheme('light')
  el.setBranding({ title: '打印模板设计器', showTitle: true, showLogo: false })
  el.setLanguage('zh')
  applyTemplateData()
}

function onError(e: Event) {
  const detail = (e as CustomEvent).detail
  ElMessage.error(detail?.error ? String(detail.error) : '打印设计器发生错误')
}

async function loadTemplate() {
  if (!templateId.value) return
  const response = await getPrintTemplateDetail(templateId.value)
  templateName.value = response.data.name || ''
  categoryName.value = response.data.categoryName || ''
  templateData.value = response.data.templateData || null
  applyTemplateData()
}

async function handleSave() {
  if (!templateId.value || !designerRef.value) return

  saving.value = true
  try {
    await updatePrintTemplateDesign(templateId.value, designerRef.value.getTemplateData())
    ElMessage.success('打印模板设计已保存')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  const el = designerRef.value
  if (!el) return
  forceLightTheme()
  el.addEventListener('ready', onReady)
  el.addEventListener('error', onError)
  loadTemplate()
})

onUnmounted(() => {
  const el = designerRef.value
  if (!el) return
  el.removeEventListener('ready', onReady)
  el.removeEventListener('error', onError)
})
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

.designer-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.designer-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2d3d;
}

.designer-subtitle {
  font-size: 13px;
  color: #606266;
}

.print-designer-page {
  height: calc(100vh - 170px);
  min-height: 520px;
}

.pd {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
