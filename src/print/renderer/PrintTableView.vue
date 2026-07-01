<template>
  <table :style="tableStyle">
    <thead v-if="showHeader">
      <tr>
        <th v-for="col in element.columns" :key="col.id" :style="thStyle(col)">
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, ri) in pageRows" :key="ri" :class="{ stripe: element.stripe && (startRow + ri) % 2 === 1 }">
        <td v-for="col in element.columns" :key="col.id" :style="tdStyle(col)">
          {{ cellText(col, row, startRow + ri) }}
        </td>
      </tr>
    </tbody>
    <tfoot v-if="showSummary && element.summary">
      <tr>
        <td v-for="col in element.columns" :key="col.id" :style="tdStyle(col, true)">
          {{ summaryText(col) }}
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { TableColumn, TableElement } from '@/api/print'
import type { EvalContext } from './expression'
import { evaluate, evaluateRaw, interpolate } from './expression'
import { applyFormat, mm } from './style'

const props = withDefaults(
  defineProps<{
    element: TableElement
    ctx: EvalContext
    /** 本页渲染的起始行（含） */
    startRow?: number
    /** 本页渲染的结束行（不含），Infinity 表示到末尾 */
    endRow?: number
    showHeader?: boolean
    showSummary?: boolean
  }>(),
  {
    startRow: 0,
    endRow: Infinity,
    showHeader: true,
    showSummary: true
  }
)

/** 全量行（含 minRows 补空行） */
const allRows = computed<Record<string, unknown>[]>(() => {
  const data = evaluateRaw(props.element.dataKey, props.ctx)
  const list = Array.isArray(data) ? (data as Record<string, unknown>[]) : []
  const min = props.element.minRows ?? 0
  if (list.length < min) {
    return [...list, ...Array.from({ length: min - list.length }, () => ({}))]
  }
  return list
})

/** 本页切片行 */
const pageRows = computed<Record<string, unknown>[]>(() => {
  const end = props.endRow === Infinity ? allRows.value.length : props.endRow
  return allRows.value.slice(props.startRow, end)
})

const tableStyle = computed(() => ({
  position: 'absolute' as const,
  left: mm(props.element.rect.x),
  top: mm(props.element.rect.y),
  width: mm(props.element.rect.w),
  borderCollapse: 'collapse' as const,
  tableLayout: 'fixed' as const,
  fontSize: props.element.style.fontSize ? `${props.element.style.fontSize}pt` : '9pt'
}))

function rowHeightStyle(): Record<string, string> {
  const h = props.element.rowHeight
  return h === 'auto' ? {} : { height: mm(h) }
}

function thStyle(col: TableColumn): Record<string, string> {
  return {
    width: mm(col.width),
    border: '0.2mm solid #333',
    padding: '0.5mm 1mm',
    textAlign: col.align ?? 'left',
    background: '#f2f2f2',
    fontWeight: 'bold',
    ...rowHeightStyle()
  }
}

function tdStyle(col: TableColumn, isSummary = false): Record<string, string> {
  return {
    width: mm(col.width),
    border: '0.2mm solid #333',
    padding: '0.5mm 1mm',
    textAlign: col.align ?? 'left',
    fontWeight: isSummary ? 'bold' : 'normal',
    wordBreak: 'break-all',
    ...rowHeightStyle()
  }
}

function buildRowCtx(row: Record<string, unknown>, index: number): EvalContext {
  return { ...props.ctx, row, index }
}

function cellText(col: TableColumn, row: Record<string, unknown>, index: number): string {
  const rowCtx = buildRowCtx(row, index)
  if (col.format && col.format.kind !== 'none') {
    const m = col.expression.trim().match(/^\{\{([\s\S]+)\}\}$/)
    if (m) return applyFormat(evaluate(m[1].trim(), rowCtx), col.format)
  }
  return interpolate(col.expression, rowCtx)
}

function summaryText(col: TableColumn): string {
  const summary = props.element.summary
  if (!summary) return ''
  if (col.id === summary.labelColumnId) return summary.label
  const item = summary.items.find((s) => s.columnId === col.id)
  if (!item) return ''
  const values = allRows.value.map((row) => {
    const m = col.expression.trim().match(/^\{\{([\s\S]+)\}\}$/)
    const v = m ? evaluate(m[1].trim(), buildRowCtx(row, 0)) : undefined
    return Number(v) || 0
  })
  let result = 0
  switch (item.agg) {
    case 'sum':
      result = values.reduce((a, b) => a + b, 0)
      break
    case 'avg':
      result = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
      break
    case 'count':
      result = values.length
      break
    case 'max':
      result = Math.max(...values)
      break
    case 'min':
      result = Math.min(...values)
      break
  }
  return applyFormat(result, col.format)
}
</script>

<style scoped>
.stripe td {
  background: #fafafa;
}
</style>
