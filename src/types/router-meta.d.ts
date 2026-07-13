import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    menuTag?: string
    order?: number
    hidden?: boolean
    activeMenu?: string
    placeholderDesc?: string
    plannedItems?: string[]
    ownerSystem?: string
    collaboratorSystems?: string[]
    coreObject?: string
    boundaryNote?: string
  }
}

export {}
