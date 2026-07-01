<template>
  <div :style="posStyle">
    <canvas ref="canvasEl" class="code-canvas" />
    <div v-if="error" class="code-error">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import type { BarcodeElement } from '@/api/print'
import type { EvalContext } from './expression'
import { interpolate } from './expression'
import { rectStyle } from './style'

const props = defineProps<{
  element: BarcodeElement
  ctx: EvalContext
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const error = ref('')

const posStyle = computed(() => rectStyle(props.element))

const value = computed(() => interpolate(props.element.expression, props.ctx) || ' ')

async function render() {
  if (!canvasEl.value) return
  error.value = ''
  try {
    const { default: JsBarcode } = await import('jsbarcode')
    JsBarcode(canvasEl.value, value.value, {
      format: props.element.symbology,
      displayValue: props.element.showText,
      width: 2,
      height: 40,
      fontSize: 12,
      margin: 0
    })
  } catch (e) {
    error.value = '条码生成失败'
    if (import.meta.env?.DEV) console.warn('[barcode]', e)
  }
}

onMounted(render)
watch([value, () => props.element.symbology, () => props.element.showText], render)
</script>

<style scoped>
.code-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.code-error {
  font-size: 8pt;
  color: #c00;
}
</style>
