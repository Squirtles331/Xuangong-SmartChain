import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi, type LoginParams, type LoginResult } from '@/api/system'
import router from '@/router'
import { useLockStore } from '@/stores/lock'
import { usePermissionStore } from '@/stores/permission'

type LogoutOptions = {
  clearPreferences?: boolean
  redirectTo?: string
}

const AUTH_STORAGE_KEYS = ['access_token', 'refresh_token', 'user_info', 'tenant_id'] as const
const PREFERENCE_STORAGE_KEYS = ['app-theme', 'app-layout-mode', 'app-lang'] as const

export const useUserStore = defineStore('user', () => {
  // ==================== State ====================
  const token = ref<string>(localStorage.getItem('access_token') || '')
  const refreshToken = ref<string>(localStorage.getItem('refresh_token') || '')
  const userId = ref<string>('')
  const username = ref<string>('')
  const realName = ref<string>('')
  const avatar = ref<string>('')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])

  // ==================== Getters ====================
  const isLoggedIn = computed(() => !!token.value)
  const hasPermission = computed(() => (perm: string) => permissions.value.includes(perm))

  // ==================== Actions ====================
  async function doLogin(params: LoginParams): Promise<boolean> {
    try {
      const res = await loginApi(params)
      const data = res.data
      setAuthData(data)
      return true
    } catch {
      return false
    }
  }

  function setAuthData(data: LoginResult) {
    token.value = data.access_token
    refreshToken.value = data.refresh_token
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)

    userId.value = data.user_info.id
    username.value = data.user_info.username
    realName.value = data.user_info.real_name
    avatar.value = data.user_info.avatar || ''
    roles.value = data.user_info.roles
    permissions.value = data.user_info.permissions

    localStorage.setItem('user_info', JSON.stringify(data.user_info))
  }

  function setStaticAuthData(data: LoginResult) {
    setAuthData(data)
  }

  function restoreUserInfo() {
    const stored = localStorage.getItem('user_info')
    if (stored) {
      try {
        const info = JSON.parse(stored)
        userId.value = info.id
        username.value = info.username
        realName.value = info.real_name
        avatar.value = info.avatar || ''
        roles.value = info.roles
        permissions.value = info.permissions
      } catch {
        // ignore parse error
      }
    }
  }

  async function doLogout(options: LogoutOptions = {}) {
    try {
      await logoutApi()
    } catch {
      // 即使后端登出失败，前端也清除状态
    }
    clearAuth(options)
  }

  function clearAuth(options: LogoutOptions = {}) {
    const { clearPreferences = false, redirectTo = '/login' } = options
    const lockStore = useLockStore()
    const permissionStore = usePermissionStore()

    token.value = ''
    refreshToken.value = ''
    userId.value = ''
    username.value = ''
    realName.value = ''
    avatar.value = ''
    roles.value = []
    permissions.value = []
    AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))

    if (clearPreferences) {
      PREFERENCE_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
    }

    sessionStorage.clear()
    lockStore.forceUnlock()
    permissionStore.reset()
    router.replace(redirectTo)
  }

  // 初始化时尝试恢复用户信息
  restoreUserInfo()

  return {
    token,
    refreshToken,
    userId,
    username,
    realName,
    avatar,
    roles,
    permissions,
    isLoggedIn,
    hasPermission,
    doLogin,
    setStaticAuthData,
    doLogout,
    clearAuth,
    restoreUserInfo
  }
})
