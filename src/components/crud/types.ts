export type CrudActionTone = 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
export type CrudDialogMode = 'add' | 'edit'

export interface CrudToolbarActionItem {
  key: string
  label: string
  tone?: Exclude<CrudActionTone, 'secondary'> | 'default'
  disabled?: boolean
}

export interface CrudRowActionItem {
  key: string
  label: string
  tone?: CrudActionTone
  disabled?: boolean
  hidden?: boolean
}
