<template>
  <div class="preview-view">
    <!-- 顶部工具条：打印时隐藏 -->
    <div class="preview-bar">
      <div class="bar-left">
        <el-button text @click="goBack">
          <el-icon><Back /></el-icon>
          返回
        </el-button>
        <span class="title">{{ template?.name ?? '加载中…' }}</span>
        <span v-if="template" class="paper">{{ template.page.paper }} · {{ pageW }}×{{ pageH }}mm · {{ orientationLabel }}</span>
      </div>
      <div class="bar-right">
        <el-radio-group v-model="sampleMode" size="small">
          <el-radio-button value="single">单行</el-radio-button>
          <el-radio-button value="multi">多行</el-radio-button>
          <el-radio-button value="empty">空数据</el-radio-button>
        </el-radio-group>
        <el-divider direction="vertical" />
        <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
        <el-button-group size="small">
          <el-button @click="zoomOut">-</el-button>
          <el-button @click="resetZoom">1:1</el-button>
          <el-button @click="zoomIn">+</el-button>
        </el-button-group>
        <el-divider direction="vertical" />
        <el-dropdown size="small" @command="onOutput">
          <el-button type="primary" size="small" :disabled="!template">
            <el-icon><Printer /></el-icon>
            输出<el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="browser">浏览器打印</el-dropdown-item>
              <el-dropdown-item command="pdf">导出 PDF（另存）</el-dropdown-item>
              <el-dropdown-item command="dotmatrix">针式套打</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 预览舞台 -->
    <div v-loading="loading" class="preview-stage">
      <div v-if="template" class="stage-scale" :style="{ transform: `scale(${zoom})` }">
        <PrintRenderer ref="rendererRef" :template="template" :data="sampleData" />
      </div>
      <el-empty v-else-if="!loading" description="模板不存在" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, Back, Printer } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getPrintTemplate, type PrintData, type PrintTemplate } from '@/api/print'
import PrintRenderer from '@/print/renderer/PrintRenderer.vue'
import { printElement } from '@/print/adapters/browser'
import { printDotMatrix } from '@/print/adapters/dotmatrix'
import { exportPdf } from '@/print/adapters/pdf'

const route = useRoute()
const router = useRouter()

const template = ref<PrintTemplate | null>(null)
const loading = ref(true)
const sampleMode = ref<'single' | 'multi' | 'empty'>('single')
const zoom = ref(1)
const rendererRef = ref<InstanceType<typeof PrintRenderer> | null>(null)

const pageW = computed(() => template.value?.page.width ?? 0)
const pageH = computed(() => template.value?.page.height ?? 0)
const orientationLabel = computed(() => (template.value?.page.orientation === 'landscape' ? '横向' : '纵向'))

/* PLACEHOLDER_SCRIPT */

const sampleData = computed<PrintData>(() => {
  if (!template.value) return {}
  const ds = template.value.dataSource
  const base: PrintData = {}
  for (const f of ds.fields) base[f.key] = f.sample ?? ''

  for (const set of ds.datasets) {
    const buildRow = () => {
      const row: Record<string, unknown> = {}
      for (const f of set.fields) row[f.key] = f.sample ?? ''
      return row
    }
    if (sampleMode.value === 'empty') {
      base[set.key] = []
    } else if (sampleMode.value === 'single') {
      base[set.key] = [buildRow()]
    } else {
      // 多行：生成 60 行，明确跨多页；行内容带序号差异
      base[set.key] = Array.from({ length: 60 }, (_, i) => {
        const row = buildRow()
        for (const f of set.fields) {
          if (f.type === 'number') {
            row[f.key] = (Number(f.sample) || 1) * (i + 1)
          } else if (f.type === 'string' && f.sample) {
            row[f.key] = `${f.sample} #${i + 1}`
          }
        }
        return row
      })
    }
  }
  return base
})

function goBack() {
  router.push({ name: 'printTemplate' })
}

function zoomIn() {
  zoom.value = Math.min(2, +(zoom.value + 0.1).toFixed(2))
}
function zoomOut() {
  zoom.value = Math.max(0.4, +(zoom.value - 0.1).toFixed(2))
}
function resetZoom() {
  zoom.value = 1
}

async function onOutput(command: 'browser' | 'pdf' | 'dotmatrix') {
  const root = rendererRef.value?.$el as HTMLElement | undefined
  if (!root || !template.value) return
  try {
    if (command === 'browser') {
      printElement(root, template.value)
    } else if (command === 'pdf') {
      await exportPdf(root, template.value, { mode: 'native' })
    } else if (command === 'dotmatrix') {
      printDotMatrix(root, template.value)
    }
  } catch (err) {
    ElMessage.error(err instanceof Error ? err.message : '输出失败')
  }
}

onMounted(async () => {
  try {
    const res = await getPrintTemplate(String(route.params.id))
    template.value = res.data
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.preview-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.bar-left,
.bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-weight: 600;
}

.paper {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.zoom-label {
  font-size: 12px;
  color: var(--el-text-color-regular);
  min-width: 40px;
  text-align: center;
}

.preview-stage {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.stage-scale {
  transform-origin: top center;
}
</style>
