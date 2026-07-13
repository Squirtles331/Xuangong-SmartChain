<template>
  <el-tag :type="tagType" :size="size" :effect="effect">
    {{ label }}
  </el-tag>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type StatusValue = string | number | boolean

export interface StatusOption {
  value: StatusValue
  label: string
  type?: 'success' | 'warning' | 'danger' | 'info' | 'primary'
}

const props = withDefaults(
  defineProps<{
    value: StatusValue
    options?: StatusOption[]
    size?: '' | 'small' | 'default' | 'large'
    effect?: 'dark' | 'light' | 'plain'
  }>(),
  {
    options: () => [],
    size: 'small',
    effect: 'light'
  }
)

const label = computed(() => {
  const opt = props.options.find((o) => o.value === props.value)
  return opt?.label ?? props.value
})

const tagType = computed(() => {
  const opt = props.options.find((o) => o.value === props.value)
  return (opt?.type || 'info') as 'success' | 'warning' | 'danger' | 'info' | 'primary'
})
</script>
