/**
 * 模拟网络延迟
 * 默认 200-500ms 随机延迟
 */
export function simulateDelay(min = 200, max = 500): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}
