import { useRouter } from 'vue-router'
import { computed } from 'vue'

export interface SidebarItem {
  path: string
  title: string
  icon?: string
  children?: SidebarItem[]
}

export interface SidebarGroup extends SidebarItem {
  children: SidebarItem[]
}

export function useSidebarMenu() {
  const router = useRouter()
  // 排序与选择逻辑的辅助函数，统一在此维护，便于复用与阅读
  const orderByMeta = (a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0)
  const isHidden = (r: any) => !!(r.meta && r.meta.hidden)
  const hasChildren = (r: any) => Array.isArray(r.children)
  const toPath = (p?: string) => (p ? `/${p}` : '/')
  // 去掉路径中的动态参数段（如 :id、:categoryId?），菜单项使用可直接跳转的静态路径
  const stripParams = (p: string) => p.replace(/\/:[^/]+/g, '')
  const normalize = (p: string) => stripParams(p).replace(/\/+/g, '/').replace(/\/+$/, '')
  const titleOf = (r: any, fallback: string) => r.meta?.title ?? r.name ?? r.path ?? fallback

  // 取根布局('/')的 children，并按 meta.order 排序
  const rootChildren = computed<any[]>(() => {
    const options: any = (router as any).options
    const routes = Array.isArray(options?.routes) ? options.routes : []
    const layout = routes.find((r: any) => r.path === '/')
    const children = Array.isArray(layout?.children) ? layout.children : []
    return children.slice().sort(orderByMeta)
  })

  // 非分组一级菜单：无 children 且未被 hidden 的路由
  const singleItems = computed<SidebarItem[]>(() => {
    return rootChildren.value
      .filter((r: any) => !isHidden(r) && !hasChildren(r))
      .map((r: any) => {
        // 统一生成路径与标题，图标来自 meta.icon
        const path = toPath(r.path)
        const title = titleOf(r, path)
        const icon = r.meta?.icon as string | undefined
        return { path, title, icon }
      })
  })

  // 分组一级菜单：有 children 的路由；组内子项递归构建，支持任意层级的子分组
  const buildItems = (parent: any, parentPath: string): SidebarItem[] => {
    return (parent.children || [])
      .filter((c: any) => !isHidden(c))
      .sort(orderByMeta)
      .map((c: any) => {
        const childPath = normalize(`${parentPath}/${c.path}`)
        const childTitle = titleOf(c, childPath)
        const childIcon = c.meta?.icon as string | undefined
        // 子项自身还有 children 时，作为可展开子分组继续递归
        if (hasChildren(c)) {
          return { path: childPath, title: childTitle, icon: childIcon, children: buildItems(c, childPath) }
        }
        return { path: childPath, title: childTitle, icon: childIcon }
      })
  }

  const groups = computed<SidebarGroup[]>(() => {
    return rootChildren.value.filter(hasChildren).map((r: any) => {
      const groupPath = toPath(r.path)
      const groupTitle = titleOf(r, groupPath)
      const groupIcon = r.meta?.icon as string | undefined
      return { path: groupPath, title: groupTitle, icon: groupIcon, children: buildItems(r, groupPath) }
    })
  })

  return { singleItems, groups }
}
