<template>
  <!-- 文本 -->
  <div v-if="element.type === 'text'" :style="boxStyle">
    {{ interpolate(element.content, ctx) }}
  </div>

  <!-- 字段 -->
  <div v-else-if="element.type === 'field'" :style="boxStyle">
    {{ fieldText }}
  </div>

  <!-- 矩形/边框 -->
  <div v-else-if="element.type === 'rect'" :style="rectBoxStyle" />

  <!-- 直线 -->
  <div v-else-if="element.type === 'line'" :style="lineStyle" />

  <!-- 图片 -->
  <div v-else-if="element.type === 'image'" :style="posStyle">
    <img :src="imageSrc" :style="imageStyle" alt="" />
  </div>

  <!-- 条码 -->
  <PrintBarcodeView v-else-if="element.type === 'barcode'" :element="element" :ctx="ctx" />

  <!-- 二维码 -->
  <PrintQRCodeView v-else-if="element.type === 'qrcode'" :element="element" :ctx="ctx" />

  <!-- 富文本 -->
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-else-if="element.type === 'html'" :style="posStyle" v-html="interpolate(element.html, ctx)" />

  <!-- 表格 -->
  <PrintTableView v-else-if="element.type === 'table'" :element="element" :ctx="ctx" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { LineElement, PrintElement, RectElement } from '@/api/print'
import type { EvalContext } from './expression'
import { evaluate, interpolate } from './expression'
import { applyFormat, mm, rectStyle, textStyle } from './style'
import PrintBarcodeView from './PrintBarcodeView.vue'
import PrintQRCodeView from './PrintQRCodeView.vue'
import PrintTableView from './PrintTableView.vue'

const props = defineProps<{
  element: PrintElement
  ctx: EvalContext
}>()

const posStyle = computed(() => rectStyle(props.element))

const boxStyle = computed(() => ({
  ...posStyle.value,
  ...textStyle(props.element.style)
}))

const fieldText = computed(() => {
  if (props.element.type !== 'field') return ''
  const el = props.element
  // 含 {{ }} 走插值；纯表达式可带 format
  const raw = interpolate(el.expression, props.ctx)
  if (el.format && el.format.kind !== 'none') {
    // 尝试取纯表达式值做格式化
    const m = el.expression.trim().match(/^\{\{([\s\S]+)\}\}$/)
    if (m) return applyFormat(evaluate(m[1].trim(), props.ctx), el.format)
  }
  return raw
})

const rectBoxStyle = computed(() => {
  const el = props.element as RectElement
  return {
    ...posStyle.value,
    boxSizing: 'border-box' as const,
    background: el.style.background ?? 'transparent',
    borderRadius: el.radius ? mm(el.radius) : undefined,
    ...textStyle(el.style)
  }
})

const lineStyle = computed(() => {
  const el = props.element as LineElement
  const horizontal = el.rect.w >= el.rect.h
  return {
    ...posStyle.value,
    borderTop: horizontal ? `${el.lineWidth}mm ${el.lineStyle} ${el.lineColor}` : undefined,
    borderLeft: horizontal ? undefined : `${el.lineWidth}mm ${el.lineStyle} ${el.lineColor}`
  }
})

const imageSrc = computed(() => {
  if (props.element.type !== 'image') return ''
  const el = props.element
  return el.dynamic ? String(interpolate(el.src, props.ctx)) : el.src
})

const imageStyle = computed(() => {
  if (props.element.type !== 'image') return {}
  return { width: '100%', height: '100%', objectFit: props.element.fit ?? 'contain' }
})
</script>
