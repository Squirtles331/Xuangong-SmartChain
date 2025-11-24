<template>
  <el-button circle type="text" @click="toggleTheme()">
    {{ isDark ? 'Dark' : 'Light' }}
  </el-button>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()

const toggleTheme = useToggle(isDark)
</script>

<style scoped></style>
