export type DataMode = 'static' | 'mock' | 'api'

function normalizeDataMode(value: unknown): DataMode | undefined {
  const mode = String(value ?? '')
    .trim()
    .toLowerCase()

  if (mode === 'static' || mode === 'mock' || mode === 'api') {
    return mode
  }

  if (mode === 'real') {
    return 'api'
  }

  return undefined
}

const configuredDataMode = normalizeDataMode(import.meta.env.VITE_DATA_MODE)
const legacyApiMode = normalizeDataMode(import.meta.env.VITE_API_MODE)

export const dataMode: DataMode = configuredDataMode ?? legacyApiMode ?? 'api'
export const isStaticMode = dataMode === 'static'
export const isMockMode = dataMode === 'mock' || dataMode === 'static'
export const isApiMode = dataMode === 'api'
