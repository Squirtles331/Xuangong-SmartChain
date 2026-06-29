/**
 * 分页模拟工具
 */

/**
 * 对数组进行分页和过滤
 * @param items 原始数据数组
 * @param page 页码（从1开始）
 * @param pageSize 每页条数
 * @param filterFn 可选的过滤函数
 */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
  filterFn?: (item: T) => boolean
): { items: T[]; total: number; page: number; page_size: number } {
  const filtered = filterFn ? items.filter(filterFn) : items
  const total = filtered.length
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return {
    items: paged,
    total,
    page,
    page_size: pageSize
  }
}

/**
 * 对数组进行简单关键词搜索（模糊匹配）
 */
export function searchItems<T extends Record<string, any>>(
  items: T[],
  keyword: string,
  fields: (keyof T)[]
): T[] {
  if (!keyword) return items
  const kw = keyword.toLowerCase()
  return items.filter(item =>
    fields.some(field => {
      const val = item[field]
      return val != null && String(val).toLowerCase().includes(kw)
    })
  )
}
