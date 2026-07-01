<template>
  <div class="print-root">
    <div v-for="pg in pages" :key="pg.index" class="print-page" :style="pageStyle">
      <!-- 背景套打底纹 -->
      <img v-if="page.background" class="print-bg" :src="page.background" alt="" />

      <!-- 页眉带 -->
      <div v-if="pg.showHeader" class="print-band print-header" :style="headerStyle">
        <PrintElementView v-for="el in headerElements" :key="el.id" :element="el" :ctx="pageCtx(pg)" />
      </div>

      <!-- 正文带 -->
      <div class="print-band print-body" :style="bodyStyle">
        <template v-for="el in bodyElements" :key="el.id">
          <!-- 分页表格：按本页切片渲染 -->
          <PrintTableView
            v-if="el.type === 'table' && el.id === tableId"
            :element="el"
            :ctx="pageCtx(pg)"
            :start-row="pg.tableSlice?.startRow ?? 0"
            :end-row="pg.tableSlice?.endRow ?? Infinity"
            :show-header="pg.tableSlice?.showHeader ?? true"
            :show-summary="pg.tableSlice?.showSummary ?? true"
          />
          <!-- 其它正文静态元素：仅首页 -->
          <PrintElementView v-else-if="pg.showBodyStatic" :element="el" :ctx="pageCtx(pg)" />
        </template>
      </div>

      <!-- 页脚带 -->
      <div v-if="pg.showFooter" class="print-band print-footer" :style="footerStyle">
        <PrintElementView v-for="el in footerElements" :key="el.id" :element="el" :ctx="pageCtx(pg)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { ElementRegion, PageConfig, PrintData, PrintElement, PrintTemplate } from '@/api/print'
import { evaluateRaw } from './expression'
import { paginate, type RenderedPage } from './paginate'
import { mm } from './style'
import PrintElementView from './PrintElementView.vue'
import PrintTableView from './PrintTableView.vue'

const props = defineProps<{
  template: PrintTemplate
  data: PrintData
}>()

const page = computed<PageConfig>(() => props.template.page)

const paginateResult = computed(() => paginate(props.template, props.data))
const pages = computed<RenderedPage[]>(() => paginateResult.value.pages)
const tableId = computed(() => paginateResult.value.tableId)

const pageStyle = computed(() => ({
  width: mm(page.value.width),
  height: page.value.continuous ? 'auto' : mm(page.value.height),
  minHeight: page.value.continuous ? mm(page.value.height) : undefined
}))

/** 正文区宽度 = 页宽 − 左右边距 */
const contentWidth = computed(() => page.value.width - page.value.margin.left - page.value.margin.right)

const headerStyle = computed(() => ({
  position: 'absolute' as const,
  top: mm(page.value.margin.top),
  left: mm(page.value.margin.left),
  width: mm(contentWidth.value),
  height: mm(page.value.header.height)
}))

const bodyStyle = computed(() => {
  const topOffset = page.value.margin.top + page.value.header.height
  const bottomReserve = page.value.margin.bottom + page.value.footer.height
  return {
    position: 'absolute' as const,
    top: mm(topOffset),
    left: mm(page.value.margin.left),
    width: mm(contentWidth.value),
    height: page.value.continuous ? 'auto' : mm(page.value.height - topOffset - bottomReserve)
  }
})

const footerStyle = computed(() => ({
  position: 'absolute' as const,
  top: mm(page.value.height - page.value.margin.bottom - page.value.footer.height),
  left: mm(page.value.margin.left),
  width: mm(contentWidth.value),
  height: mm(page.value.footer.height)
}))

function pageCtx(pg: RenderedPage) {
  return {
    data: props.data,
    page: { current: pg.index + 1, total: paginateResult.value.total },
    sys: { now: new Date(), user: '' }
  }
}

function regionElements(region: ElementRegion): PrintElement[] {
  const baseCtx = { data: props.data, page: { current: 1, total: paginateResult.value.total }, sys: { now: new Date(), user: '' } }
  return [...props.template.elements]
    .filter((el) => (el.region ?? 'body') === region)
    .filter((el) => {
      if (!el.visibleIf) return true
      return Boolean(evaluateRaw(el.visibleIf, baseCtx))
    })
    .sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1))
}

const headerElements = computed(() => regionElements('header'))
const bodyElements = computed(() => regionElements('body'))
const footerElements = computed(() => regionElements('footer'))
</script>

<style scoped>
.print-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.print-page {
  position: relative;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.print-band {
  box-sizing: border-box;
}

.print-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
}

@media print {
  .print-page {
    box-shadow: none;
  }
}
</style>
