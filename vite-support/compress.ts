import type { Plugin } from 'vite'
import compressPlugin from 'vite-plugin-compression'

/**
 * 打包压缩格式的类型声明
 */
export type ViteCompression = 'none' | 'gzip' | 'brotli' | 'both' | 'gzip-clear' | 'brotli-clear' | 'both-clear'

export const configCompressPlugin = (compress: ViteCompression): Plugin | Plugin[] => {
  if (!compress || compress === 'none') return []

  const gz = {
    // 生成的压缩包后缀
    ext: '.gz',
    // 体积大于 threshold 才会被压缩
    threshold: 0,
    // 跳过已经压缩过的产物，避免递归生成 .gz.gz
    filter: (file: string) => !file.endsWith('.gz') && !file.endsWith('.br'),
    // 压缩后是否删除原始文件
    deleteOriginFile: false
  }
  const br = {
    ext: '.br',
    algorithm: 'brotliCompress',
    threshold: 0,
    filter: (file: string) => !file.endsWith('.gz') && !file.endsWith('.br'),
    deleteOriginFile: false
  }

  const codeList = [
    { k: 'gzip', v: gz },
    { k: 'brotli', v: br },
    { k: 'both', v: [gz, br] }
  ]

  const plugins: Plugin[] = []

  codeList.forEach((item: any) => {
    if (compress.includes(item.k)) {
      if (compress.includes('clear')) {
        if (Array.isArray(item.v)) {
          item.v.forEach((vItem: any) => {
            plugins.push(compressPlugin(Object.assign(vItem, { deleteOriginFile: true })))
          })
        } else {
          plugins.push(compressPlugin(Object.assign(item.v, { deleteOriginFile: true })))
        }
      } else {
        if (Array.isArray(item.v)) {
          item.v.forEach((vItem: any) => {
            plugins.push(compressPlugin(vItem))
          })
        } else {
          plugins.push(compressPlugin(item.v))
        }
      }
    }
  })

  return plugins
}
