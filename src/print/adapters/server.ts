import { createServerPrintJob } from '@/api/print'

/**
 * 后端批量打印适配器
 *
 * 前端只发起任务：传 templateKey + 数据 ID 列表，后端用同一份 Schema 渲染
 * （puppeteer 跑同一个 Vue 渲染器，或模板引擎复刻分页），生成 PDF / 直发打印机。
 * Schema 跨端共享是一致性关键。
 */

export interface ServerPrintResult {
  taskId: string
}

export async function serverPrint(templateKey: string, dataIds: string[]): Promise<ServerPrintResult> {
  const res = await createServerPrintJob({ templateKey, dataIds })
  const data = res.data as { taskId: string }
  return { taskId: data.taskId }
}
