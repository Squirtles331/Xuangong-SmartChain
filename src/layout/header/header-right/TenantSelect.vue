<template>
  <el-select v-model="tenant" size="small" class="tenant-select" placeholder="选择租户">
    <el-option label="阿里技术有限公司" value="tenant1" />
    <el-option label="杭州工厂" value="tenant2" />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tenant = ref('tenant1')
</script>

<style scoped>
.tenant-select {
  width: 150px;
}
</style>
