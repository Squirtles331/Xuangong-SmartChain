import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getMenuTree, type SysMenu } from '@/api/system'

export const usePermissionStore = defineStore('permission', () => {
  const menuTree = ref<SysMenu[]>([])
  const loaded = ref(false)

  const flatPermissions = computed(() => {
    const result: string[] = []

    function walk(items: SysMenu[]) {
      for (const item of items) {
        if (item.permissionCode) result.push(item.permissionCode)
        if (item.children) walk(item.children)
      }
    }

    walk(menuTree.value)
    return result
  })

  async function loadMenus() {
    if (loaded.value) return

    try {
      const response = await getMenuTree()
      menuTree.value = response.data
      loaded.value = true
    } catch {
      menuTree.value = []
    }
  }

  function reset() {
    menuTree.value = []
    loaded.value = false
  }

  return {
    menuTree,
    loaded,
    flatPermissions,
    loadMenus,
    reset
  }
})
