import { PrintService, type PrintOptions } from './PrintService'

/**
 * 业务页组合式 API：一行发起打印。
 *
 * @example
 * const { print } = usePrint()
 * await print({ templateKey: 'scm.purchase.order', data: row, output: 'browser' })
 */
export function usePrint() {
  async function print(opts: PrintOptions): Promise<void> {
    return PrintService.print(opts)
  }

  return { print }
}
