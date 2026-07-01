<template>
  <div class="design-el" :class="{ selected }" :style="boxStyle" @pointerdown.stop="onBodyDown">
    <div class="el-content">{{ label }}</div>

    <!-- 缩放手柄 -->
    <template v-if="selected">
      <span v-for="h in handles" :key="h" class="handle" :class="'h-' + h" @pointerdown.stop="onHandleDown(h, $event)" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PrintElement } from '@/api/print'
import { usePrintDesignerStore } from '@/stores/printDesigner'

const props = defineProps<{
  element: PrintElement
  scale: number
  selected: boolean
}>()

const emit = defineEmits<{
  select: [{ id: string; additive: boolean }]
  'drag-start': []
  change: [{ id: string; rect: PrintElement['rect'] }]
}>()

const store = usePrintDesignerStore()
const DPI = 96

const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const
type Handle = (typeof handles)[number]

function mmToPx(v: number): number {
  return (v / 25.4) * DPI * props.scale
}
function pxToMm(v: number): number {
  return (v / DPI / props.scale) * 25.4
}

const boxStyle = computed(() => ({
  left: mmToPx(props.element.rect.x) + 'px',
  top: mmToPx(props.element.rect.y) + 'px',
  width: mmToPx(props.element.rect.w) + 'px',
  height: mmToPx(props.element.rect.h) + 'px',
  zIndex: String(props.element.zIndex ?? 1)
}))

const label = computed(() => {
  const el = props.element
  switch (el.type) {
    case 'text':
      return el.content
    case 'field':
      return el.expression
    case 'table':
      return '表格'
    case 'image':
      return '图片'
    case 'barcode':
      return '条码 ' + el.expression
    case 'qrcode':
      return '二维码'
    case 'line':
      return ''
    case 'rect':
      return ''
    case 'html':
      return 'HTML'
    default:
      return ''
  }
})

/* PLACEHOLDER_INTERACT */

function snap(v: number): number {
  const page = store.template?.page
  if (page?.snapToGrid && page.grid > 0) {
    return Math.round(v / page.grid) * page.grid
  }
  return Math.round(v * 10) / 10
}

interface DragState {
  mode: 'move' | Handle
  startX: number
  startY: number
  orig: PrintElement['rect']
}
let drag: DragState | null = null

function onBodyDown(e: PointerEvent) {
  emit('select', { id: props.element.id, additive: e.shiftKey })
  if (props.element.locked) return
  emit('drag-start')
  drag = { mode: 'move', startX: e.clientX, startY: e.clientY, orig: { ...props.element.rect } }
  attach()
}

function onHandleDown(h: Handle, e: PointerEvent) {
  emit('drag-start')
  drag = { mode: h, startX: e.clientX, startY: e.clientY, orig: { ...props.element.rect } }
  attach()
}

function attach() {
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
function detach() {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
}

function onMove(e: PointerEvent) {
  if (!drag) return
  const dxMm = pxToMm(e.clientX - drag.startX)
  const dyMm = pxToMm(e.clientY - drag.startY)
  const o = drag.orig
  const rect = { ...o }

  if (drag.mode === 'move') {
    rect.x = snap(o.x + dxMm)
    rect.y = snap(o.y + dyMm)
  } else {
    const m = drag.mode
    if (m.includes('e')) rect.w = Math.max(2, snap(o.w + dxMm))
    if (m.includes('s')) rect.h = Math.max(2, snap(o.h + dyMm))
    if (m.includes('w')) {
      const nx = snap(o.x + dxMm)
      rect.w = Math.max(2, o.w + (o.x - nx))
      rect.x = nx
    }
    if (m.includes('n')) {
      const ny = snap(o.y + dyMm)
      rect.h = Math.max(2, o.h + (o.y - ny))
      rect.y = ny
    }
  }

  rect.x = Math.max(0, rect.x)
  rect.y = Math.max(0, rect.y)
  emit('change', { id: props.element.id, rect })
}

function onUp() {
  drag = null
  detach()
}
</script>

<style scoped>
.design-el {
  position: absolute;
  box-sizing: border-box;
  border: 1px solid transparent;
  cursor: move;
  overflow: hidden;
  font-size: 11px;
  color: #333;
}

.design-el:hover {
  border-color: #a0c4ff;
}

.design-el.selected {
  border-color: #409eff;
  overflow: visible;
}

.el-content {
  padding: 1px 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1px solid #409eff;
  border-radius: 1px;
  z-index: 10;
}

.h-nw {
  left: -4px;
  top: -4px;
  cursor: nwse-resize;
}
.h-n {
  left: calc(50% - 4px);
  top: -4px;
  cursor: ns-resize;
}
.h-ne {
  right: -4px;
  top: -4px;
  cursor: nesw-resize;
}
.h-e {
  right: -4px;
  top: calc(50% - 4px);
  cursor: ew-resize;
}
.h-se {
  right: -4px;
  bottom: -4px;
  cursor: nwse-resize;
}
.h-s {
  left: calc(50% - 4px);
  bottom: -4px;
  cursor: ns-resize;
}
.h-sw {
  left: -4px;
  bottom: -4px;
  cursor: nesw-resize;
}
.h-w {
  left: -4px;
  top: calc(50% - 4px);
  cursor: ew-resize;
}
</style>
