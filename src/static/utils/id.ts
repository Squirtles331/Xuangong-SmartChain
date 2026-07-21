let idCounter = 0

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${++idCounter}`
}
