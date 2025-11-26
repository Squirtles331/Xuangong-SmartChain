import { defineStore } from 'pinia'
type LockState = { locked: boolean; password: string | null }
const STORAGE_KEY = 'app-lock-state'
const readState = (): LockState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as LockState
  } catch {}
  return { locked: false, password: null }
}
const writeState = (s: LockState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}
export const useLockStore = defineStore('lock', {
  state: (): LockState => readState(),
  getters: { isLocked: (s) => s.locked },
  actions: {
    lock(pwd: string) {
      this.locked = true
      this.password = pwd || ''
      writeState({ locked: this.locked, password: this.password })
    },
    tryUnlock(pwd: string) {
      const ok = (this.password ?? '') === (pwd || '')
      if (ok) {
        this.locked = false
        this.password = null
        writeState({ locked: this.locked, password: this.password })
      }
      return ok
    },
    forceUnlock() {
      this.locked = false
      this.password = null
      writeState({ locked: this.locked, password: this.password })
    }
  }
})
