export function paginate<T>(list: T[], pageNum: number, pageSize: number): { list: T[]; total: number; pageNum: number; pageSize: number } {
  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  return {
    list: list.slice(start, end),
    total,
    pageNum,
    pageSize
  }
}

export function searchItems<T extends Record<string, any>>(items: T[], keyword: string, fields: (keyof T)[]): T[] {
  if (!keyword || !keyword.trim()) {
    return items
  }
  const lowerKeyword = keyword.toLowerCase().trim()
  return items.filter((item) =>
    fields.some((field) => {
      const value = item[field]
      return value != null && String(value).toLowerCase().includes(lowerKeyword)
    })
  )
}
