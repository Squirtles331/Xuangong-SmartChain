/**
 * ID 生成器
 */
let _id = Date.now()

export function generateId(): string {
  return String(++_id)
}

export function resetIdCounter(start?: number): void {
  _id = start ?? Date.now()
}
