<template>
  <div class="canvas-wrap" @pointerdown="onCanvasPointerDown">
    <div class="paper" :style="paperStyle" @pointerdown.stop>
      <!-- 网格 -->
      <div v-if="page.grid > 0" class="grid-layer" :style="gridStyle" />

      <!-- 分区参考线 -->
      <div v-if="page.header.height > 0" class="band-line" :style="{ top: mmToPx(page.margin.top + page.header.height) + 'px' }">
        <span>页眉</span>
      </div>
      <div v-if="page.footer.height > 0" class="band-line" :style="{ top: mmToPx(page.height - page.margin.bottom - page.footer.height) + 'px' }">
        <span>页脚</span>
      </div>

      <!-- 边距框 -->
      <div class="margin-box" :style="marginBoxStyle" />

      <!-- 元素 -->
      <DesignElement
        v-for="el in elements"
        :key="el.id"
        :element="el"
        :scale="scale"
        :selected="store.selectedIds.includes(el.id)"
        @select="onSelect"
        @drag-start="onInteractStart"
        @change="onElementChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PrintElement } from '@/api/print'
import { usePrintDesignerStore } from '@/stores/printDesigner'
import DesignElement from './DesignElement.vue'

const store = usePrintDesignerStore()

const DPI = 96
const scale = computed(() => store.zoom)

function mmToPx(v: number): number {
  return (v / 25.4) * DPI * scale.value
}

const page = computed(() => store.template!.page)
const elements = computed<PrintElement[]>(() => store.template?.elements ?? [])

const paperStyle = computed(() => ({
  width: mmToPx(page.value.width) + 'px',
  height: mmToPx(page.value.height) + 'px'
}))

const gridStyle = computed(() => {
  const g = mmToPx(page.value.grid)
  return {
    backgroundSize: `${g}px ${g}px`,
    backgroundImage: 'linear-gradient(to right, #e8eef5 1px, transparent 1px), linear-gradient(to bottom, #e8eef5 1px, transparent 1px)'
  }
})

const marginBoxStyle = computed(() => ({
  left: mmToPx(page.value.margin.left) + 'px',
  top: mmToPx(page.value.margin.top) + 'px',
  width: mmToPx(page.value.width - page.value.margin.left - page.value.margin.right) + 'px',
  height: mmToPx(page.value.height - page.value.margin.top - page.value.margin.bottom) + 'px'
}))

function onCanvasPointerDown() {
  store.selectElements([])
}

function onSelect(payload: { id: string; additive: boolean }) {
  if (payload.additive) store.toggleSelect(payload.id)
  else store.selectElements([payload.id])
}

/** 拖动/缩放开始：先 commit 一次快照，供撤销 */
function onInteractStart() {
  store.commit()
}

function onElementChange(payload: { id: string; rect: PrintElement['rect'] }) {
  store.setRect(payload.id, payload.rect)
}
</script>

<style scoped>
.canvas-wrap {
  flex: 1;
  overflow: auto;
  padding: 32px;
  background: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.paper {
  position: relative;
  background: #fff;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
}

.grid-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.margin-box {
  position: absolute;
  border: 1px dashed #c0c8d4;
  pointer-events: none;
}

.band-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #f0a020;
  pointer-events: none;
}

.band-line span {
  position: absolute;
  right: 2px;
  top: 1px;
  font-size: 10px;
  color: #f0a020;
}
</style>
