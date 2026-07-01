import type { PageConfig, PrintData, PrintElement, PrintTemplate, TableElement } from '@/api/print'
import { evaluateRaw } from './expression'

/**
 * 分页算法
 *
 * 核心难点：明细表格行数不定 → 跨页、表头每页重复、合计行仅末页。
 * 本文件分两层：
 *  - paginateTable：纯几何计算，把 N 行按可用高度切成多页 slice（可单测）
 *  - paginate：编排器，消费模板 + 数据，产出 RenderedPage[] 供 PrintRenderer 渲染
 *
 * 说明：Phase 2 采用「固定行高」几何分页；rowHeight='auto' 用估算行高兜底
 * （真实 DOM 离屏测量为后续增强）。正文区支持单个分页表格（发票/订单/报告
 * 的主流形态）；若正文有多个表格，仅第一个参与分页，其余在首页整体渲染。
 */

/** auto 行高兜底估算值（mm） */
export const AUTO_ROW_HEIGHT_MM = 8

export interface PaginateTableInput {
  totalRows: number
  /** 已解析的行高 mm */
  rowHeight: number
  /** 表头行高 mm */
  headerHeight: number
  /** 合计行高 mm，0 表示无合计 */
  summaryHeight: number
  /** 表头是否每页重复 */
  repeatHeader: boolean
  /** 是否存在合计行 */
  hasSummary: boolean
  /** 首页表格可用高度 mm（正文高 − 表格上方占用） */
  availableFirstPage: number
  /** 后续页表格可用高度 mm（整个正文高） */
  availableOtherPages: number
}

export interface TablePageSlice {
  pageIndex: number
  /** 起始行索引（含） */
  startRow: number
  /** 结束行索引（不含） */
  endRow: number
  showHeader: boolean
  showSummary: boolean
}

/**
 * 把表格行按可用高度切页。纯函数，便于单测。
 */
export function paginateTable(input: PaginateTableInput): TablePageSlice[] {
  const { totalRows, rowHeight, headerHeight, summaryHeight, repeatHeader, hasSummary, availableFirstPage, availableOtherPages } = input

  const slices: TablePageSlice[] = []

  // 无数据：仍输出一页（表头 + 可能的合计）
  if (totalRows <= 0) {
    slices.push({ pageIndex: 0, startRow: 0, endRow: 0, showHeader: true, showSummary: hasSummary })
    return slices
  }

  let row = 0
  let page = 0

  while (row < totalRows) {
    const available = page === 0 ? availableFirstPage : availableOtherPages
    const showHeader = page === 0 || repeatHeader
    const usable = available - (showHeader ? headerHeight : 0)
    const capacity = Math.max(1, Math.floor(usable / rowHeight))
    const end = Math.min(totalRows, row + capacity)
    const isLastData = end >= totalRows

    let showSummary = false
    if (isLastData && hasSummary) {
      const usedHeight = (showHeader ? headerHeight : 0) + (end - row) * rowHeight
      // 合计能否挤进本页
      showSummary = usedHeight + summaryHeight <= available
    }

    slices.push({ pageIndex: page, startRow: row, endRow: end, showHeader, showSummary })
    row = end
    page++
  }

  // 合计未能放入任何数据页 → 追加一张仅含合计的页
  if (hasSummary && !slices.some((s) => s.showSummary)) {
    slices.push({ pageIndex: page, startRow: totalRows, endRow: totalRows, showHeader: repeatHeader, showSummary: true })
  }

  return slices
}

/* PLACEHOLDER_ORCHESTRATOR */

/** 每页渲染指令：告诉 PrintRenderer 各区画什么、表格画哪几行 */
export interface RenderedPage {
  index: number
  showHeader: boolean
  showFooter: boolean
  /** 首页专属正文静态元素是否渲染（非分页表格的固定元素只在首页） */
  showBodyStatic: boolean
  /** 分页表格的行切片，null 表示本页无分页表格 */
  tableSlice: TablePageSlice | null
}

export interface PaginateResult {
  pages: RenderedPage[]
  /** 参与分页的表格元素 id，null 表示无 */
  tableId: string | null
  total: number
}

function resolveRowHeight(h: number | 'auto'): number {
  return h === 'auto' ? AUTO_ROW_HEIGHT_MM : h
}

function bandVisibleOnPage(repeat: PageConfig['header']['repeat'], pageIndex: number, totalPages: number): boolean {
  switch (repeat) {
    case 'every':
      return true
    case 'first':
      return pageIndex === 0
    case 'last':
      return pageIndex === totalPages - 1
    case 'exceptFirst':
      return pageIndex !== 0
    default:
      return true
  }
}

/** 找正文区第一个表格元素 */
function findBodyTable(elements: PrintElement[]): TableElement | null {
  const t = elements.find((el) => el.region === 'body' && el.type === 'table')
  return (t as TableElement) ?? null
}

/**
 * 编排分页：产出每页渲染指令。
 * 连续纸（continuous）不分页，整单一页。
 */
export function paginate(template: PrintTemplate, data: PrintData): PaginateResult {
  const page = template.page
  const ctx = { data, page: { current: 1, total: 1 }, sys: { now: new Date(), user: '' } }

  const table = findBodyTable(template.elements)

  // 连续纸 或 无分页表格：单页
  if (page.continuous || !table) {
    return {
      pages: [
        {
          index: 0,
          showHeader: page.header.height > 0,
          showFooter: page.footer.height > 0,
          showBodyStatic: true,
          tableSlice: table ? { pageIndex: 0, startRow: 0, endRow: Infinity, showHeader: true, showSummary: !!table?.summary } : null
        }
      ],
      tableId: table?.id ?? null,
      total: 1
    }
  }

  // 正文可用高度
  const bodyHeight = page.height - page.margin.top - page.margin.bottom - page.header.height - page.footer.height

  // 表格上方被其它正文元素占用的高度（表格 y 即上方留白）
  const tableTop = table.rect.y
  const availableFirstPage = Math.max(0, bodyHeight - tableTop)
  const availableOtherPages = bodyHeight

  const rowsData = evaluateRaw(table.dataKey, ctx)
  const dataRows = Array.isArray(rowsData) ? rowsData.length : 0
  const totalRows = Math.max(dataRows, table.minRows ?? 0)

  const rowHeight = resolveRowHeight(table.rowHeight)
  const headerHeight = rowHeight // 表头按一行高度估算
  const summaryHeight = table.summary ? rowHeight : 0

  const slices = paginateTable({
    totalRows,
    rowHeight,
    headerHeight,
    summaryHeight,
    repeatHeader: table.repeatHeader,
    hasSummary: !!table.summary,
    availableFirstPage,
    availableOtherPages
  })

  const totalPages = slices.length
  const pages: RenderedPage[] = slices.map((slice) => ({
    index: slice.pageIndex,
    showHeader: page.header.height > 0 && bandVisibleOnPage(page.header.repeat, slice.pageIndex, totalPages),
    showFooter: page.footer.height > 0 && bandVisibleOnPage(page.footer.repeat, slice.pageIndex, totalPages),
    // 正文静态元素（非表格）只在首页渲染，避免每页重复
    showBodyStatic: slice.pageIndex === 0,
    tableSlice: slice
  }))

  return { pages, tableId: table.id, total: totalPages }
}
