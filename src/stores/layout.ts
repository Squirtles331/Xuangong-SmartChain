import { defineStore } from 'pinia'

export type LayoutMode = 'double-column'

const STORAGE_KEY = 'app-layout-mode'
const CANONICAL_MODE: LayoutMode = 'double-column'

const getInitialMode = (): LayoutMode => {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (saved && saved !== CANONICAL_MODE) {
    localStorage.setItem(STORAGE_KEY, CANONICAL_MODE)
  }

  return CANONICAL_MODE
}

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    mode: getInitialMode()
  }),
  getters: {
    showBreadcrumb: () => true
  },
  actions: {
    setMode() {
      this.mode = CANONICAL_MODE
      localStorage.setItem(STORAGE_KEY, CANONICAL_MODE)
    }
  }
})
