<template>
  <div :style="posStyle">
    <canvas ref="canvasEl" class="code-canvas" />
    <div v-if="error" class="code-error">{{ error }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import type { QRCodeElement } from '@/api/print'
import type { EvalContext } from './expression'
import { interpolate } from './expression'
import { rectStyle } from './style'

const props = defineProps<{
  element: QRCodeElement
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
    const QR = await import('qrcode')
    await QR.toCanvas(canvasEl.value, value.value, {
      errorCorrectionLevel: props.element.level,
      margin: 0,
      width: 200
    })
  } catch (e) {
    error.value = '二维码生成失败'
    if (import.meta.env?.DEV) console.warn('[qrcode]', e)
  }
}

onMounted(render)
watch([value, () => props.element.level], render)
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
