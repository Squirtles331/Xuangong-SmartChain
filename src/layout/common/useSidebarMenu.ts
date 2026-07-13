import { computed } from 'vue'
import { useRouter } from 'vue-router'

export interface SidebarItem {
  path: string
  title: string
  icon?: string
  menuTag?: string
  children?: SidebarItem[]
}

export interface SidebarGroup extends SidebarItem {
  children: SidebarItem[]
}

export function useSidebarMenu() {
  const router = useRouter()

  const orderByMeta = (a: any, b: any) => (a.meta?.order ?? 0) - (b.meta?.order ?? 0)
  const isHidden = (route: any) => !!route.meta?.hidden
  const hasChildren = (route: any) => Array.isArray(route.children)
  const toPath = (path?: string) => {
    if (!path) return '/'
    return path.startsWith('/') ? path : `/${path}`
  }
  const stripParams = (path: string) => path.replace(/\/:[^/]+/g, '')
  const normalize = (path: string) => {
    const normalized = stripParams(path).replace(/\/+/g, '/').replace(/\/+$/, '')
    return normalized || '/'
  }
  const titleOf = (route: any, fallback: string) => route.meta?.title ?? route.name ?? route.path ?? fallback

  const rootChildren = computed<any[]>(() => {
    const options: any = (router as any).options
    const routes = Array.isArray(options?.routes) ? options.routes : []
    const layout = routes.find((route: any) => route.path === '/')
    const children = Array.isArray(layout?.children) ? layout.children : []
    return children.slice().sort(orderByMeta)
  })

  const singleItems = computed<SidebarItem[]>(() => {
    return rootChildren.value
      .filter((route: any) => !isHidden(route) && !hasChildren(route))
      .map((route: any) => ({
        path: toPath(route.path),
        title: titleOf(route, toPath(route.path)),
        icon: route.meta?.icon as string | undefined,
        menuTag: route.meta?.menuTag as string | undefined
      }))
  })

  const buildItems = (parent: any, parentPath: string): SidebarItem[] => {
    return (parent.children || [])
      .filter((child: any) => !isHidden(child))
      .sort(orderByMeta)
      .map((child: any) => {
        const childPath = normalize(`${parentPath}/${child.path}`)
        const item: SidebarItem = {
          path: childPath,
          title: titleOf(child, childPath),
          icon: child.meta?.icon as string | undefined,
          menuTag: child.meta?.menuTag as string | undefined
        }

        if (hasChildren(child)) {
          item.children = buildItems(child, childPath)
        }

        return item
      })
  }

  const groups = computed<SidebarGroup[]>(() => {
    return rootChildren.value.filter(hasChildren).map((route: any) => {
      const groupPath = toPath(route.path)
      return {
        path: groupPath,
        title: titleOf(route, groupPath),
        icon: route.meta?.icon as string | undefined,
        menuTag: route.meta?.menuTag as string | undefined,
        children: buildItems(route, groupPath)
      }
    })
  })

  return { singleItems, groups }
}
