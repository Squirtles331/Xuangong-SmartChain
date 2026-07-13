export type AppTheme = 'light' | 'night-shift-dark'

const STORAGE_KEY = 'app-theme'
const DARK_CLASS = 'night-shift-dark'
const DEFAULT_THEME: AppTheme = 'light'
const THEME_LIST: AppTheme[] = ['light', 'night-shift-dark']

const root = document.documentElement

function normalizeTheme(theme?: string | null): AppTheme {
  return THEME_LIST.includes(theme as AppTheme) ? (theme as AppTheme) : DEFAULT_THEME
}

export function getStoredAppTheme(): AppTheme {
  return normalizeTheme(localStorage.getItem(STORAGE_KEY))
}

export function getActiveAppTheme(): AppTheme {
  return root.classList.contains(DARK_CLASS) ? 'night-shift-dark' : getStoredAppTheme()
}

export function applyAppTheme(theme: AppTheme) {
  const nextTheme = normalizeTheme(theme)
  root.classList.remove(DARK_CLASS)

  if (nextTheme === 'night-shift-dark') {
    root.classList.add(DARK_CLASS)
  }

  localStorage.setItem(STORAGE_KEY, nextTheme)
  root.dataset.theme = nextTheme

  return nextTheme
}

export function initAppTheme() {
  return applyAppTheme(getStoredAppTheme())
}
