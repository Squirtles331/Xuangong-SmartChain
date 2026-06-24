import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getMenuTree, type SysMenu } from '@/api/system'

export const usePermissionStore = defineStore('permission', () => {
  // ==================== State ====================
  const menuTree = ref<SysMenu[]>([])
  const loaded = ref(false)

  // ==================== Getters ====================
  const flatPermissions = computed(() => {
    const result: string[] = []
    function walk(items: SysMenu[]) {
      for (const item of items) {
        if (item.permission_code) result.push(item.permission_code)
        if (item.children) walk(item.children)
      }
    }
    walk(menuTree.value)
    return result
  })

  // ==================== Actions ====================
  async function loadMenus() {
    if (loaded.value) return
    try {
      const res = await getMenuTree()
      menuTree.value = res.data.data || []
      loaded.value = true
    } catch {
      // 菜单加载失败不影响页面使用
      menuTree.value = []
    }
  }

  function reset() {
    menuTree.value = []
    loaded.value = false
  }

  return {
    menuTree, loaded, flatPermissions,
    loadMenus, reset
  }
})
