<template>
  <gi-dialog
    v-model="visible"
    :footer="showFooter"
    :lock-scroll="false"
    :title="title"
    :width="width"
    :on-before-ok="showFooter ? handleSubmit : undefined"
    :on-cancel="handleCancel"
  >
    <gi-form v-if="columns.length" v-model="formData" :columns="columns" :label-width="labelWidth" />
    <slot />
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

defineOptions({
  name: 'CrudFormDialog'
})

interface CrudFormDialogProps<T = Record<string, any>> {
  title: string
  columns: FormColumnItem[]
  labelWidth?: string | number
  width?: string | number
  showFooter?: boolean
  beforeSubmit?: (form: T) => boolean | Promise<boolean>
}

const props = withDefaults(defineProps<CrudFormDialogProps>(), {
  columns: () => [],
  labelWidth: 100,
  width: undefined,
  showFooter: true,
  beforeSubmit: undefined
})

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<Record<string, any>>('form', { required: true })

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

function handleCancel() {
  visible.value = false
  emit('cancel')
}

async function handleSubmit() {
  if (props.beforeSubmit) {
    const passed = await props.beforeSubmit(formData.value)
    if (!passed) return false
  }

  emit('submit')
  return false
}
</script>
