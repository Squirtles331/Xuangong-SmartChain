import { describe, expect, it } from 'vitest'
import { paginateTable, type PaginateTableInput } from '@/print/renderer/paginate'

function baseInput(overrides: Partial<PaginateTableInput> = {}): PaginateTableInput {
  return {
    totalRows: 10,
    rowHeight: 8,
    headerHeight: 8,
    summaryHeight: 8,
    repeatHeader: true,
    hasSummary: false,
    availableFirstPage: 100,
    availableOtherPages: 100,
    ...overrides
  }
}

describe('paginateTable', () => {
  it('单页放得下所有行', () => {
    // 首页可用 100，表头 8 → 剩 92，每行 8 → 容量 11 行，10 行放得下
    const slices = paginateTable(baseInput({ totalRows: 10 }))
    expect(slices).toHaveLength(1)
    expect(slices[0]).toMatchObject({ startRow: 0, endRow: 10, showHeader: true })
  })

  it('超出容量时跨页', () => {
    // 每页容量 11 行，25 行 → 3 页
    const slices = paginateTable(baseInput({ totalRows: 25 }))
    expect(slices).toHaveLength(3)
    expect(slices[0]).toMatchObject({ startRow: 0, endRow: 11 })
    expect(slices[1]).toMatchObject({ startRow: 11, endRow: 22 })
    expect(slices[2]).toMatchObject({ startRow: 22, endRow: 25 })
  })

  it('repeatHeader=true 时每页都显示表头', () => {
    const slices = paginateTable(baseInput({ totalRows: 25, repeatHeader: true }))
    expect(slices.every((s) => s.showHeader)).toBe(true)
  })

  it('repeatHeader=false 时只有首页显示表头', () => {
    const slices = paginateTable(baseInput({ totalRows: 25, repeatHeader: false }))
    expect(slices[0].showHeader).toBe(true)
    expect(slices[1].showHeader).toBe(false)
    expect(slices[2].showHeader).toBe(false)
  })

  it('首页因上方元素占用而容量更小', () => {
    // 首页可用 40 → 表头 8 → 剩 32 → 4 行；后续页可用 100 → 11 行
    const slices = paginateTable(baseInput({ totalRows: 20, availableFirstPage: 40, availableOtherPages: 100 }))
    expect(slices[0].endRow).toBe(4)
    expect(slices[1].startRow).toBe(4)
  })

  it('合计行在末页且能放下', () => {
    const slices = paginateTable(baseInput({ totalRows: 5, hasSummary: true }))
    expect(slices).toHaveLength(1)
    expect(slices[0].showSummary).toBe(true)
  })

  it('末页放不下合计时追加一页', () => {
    // 首页可用 100，表头 8，容量 11。恰好 11 行填满，合计放不下 → 追加页
    const slices = paginateTable(baseInput({ totalRows: 11, hasSummary: true, availableFirstPage: 96, availableOtherPages: 96 }))
    // 96-8=88, /8=11 行；used=8+11*8=96，96+8>96 放不下 → 追加
    const summaryPages = slices.filter((s) => s.showSummary)
    expect(summaryPages).toHaveLength(1)
    expect(slices[slices.length - 1].showSummary).toBe(true)
    expect(slices[slices.length - 1].startRow).toBe(11)
    expect(slices[slices.length - 1].endRow).toBe(11)
  })

  it('无数据仍输出一页', () => {
    const slices = paginateTable(baseInput({ totalRows: 0, hasSummary: true }))
    expect(slices).toHaveLength(1)
    expect(slices[0]).toMatchObject({ startRow: 0, endRow: 0, showHeader: true, showSummary: true })
  })

  it('容量至少为 1，避免死循环', () => {
    // 可用高度小于一行，仍每页至少 1 行
    const slices = paginateTable(baseInput({ totalRows: 3, rowHeight: 200, headerHeight: 8, availableFirstPage: 20, availableOtherPages: 20 }))
    expect(slices).toHaveLength(3)
    expect(slices[0].endRow).toBe(1)
  })
})
