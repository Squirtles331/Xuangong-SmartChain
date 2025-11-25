<template>
  <el-card>
    <el-button type="primary">明暗主题</el-button>
    <el-switch v-model="value1" />
  </el-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref(true)
</script>

<style scoped></style>
