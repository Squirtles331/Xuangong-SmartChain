export const plannedPage = () => import('@/views/shared/PlannedPage.vue')

export type PlannedMeta = {
  title: string
  icon: string
  order: number
  placeholderDesc?: string
  plannedItems?: string[]
  ownerSystem?: string
  collaboratorSystems?: string[]
  coreObject?: string
  boundaryNote?: string
}

export type OwnershipMeta = Pick<PlannedMeta, 'ownerSystem' | 'collaboratorSystems' | 'coreObject' | 'boundaryNote'>

export const planned = (title: string, icon: string, order: number, desc: string, items: string[], ownership: OwnershipMeta = {}): PlannedMeta => ({
  title,
  icon,
  order,
  placeholderDesc: desc,
  plannedItems: items,
  ...ownership
})
