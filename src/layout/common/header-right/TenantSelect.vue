<template>
  <div class="tenant-select-shell">
    <span class="tenant-select__label">工作空间</span>
    <el-select v-model="tenant" class="tenant-select" placeholder="选择租户">
      <el-option label="阿里技术有限公司" value="tenant1" />
      <el-option label="杭州工厂" value="tenant2" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tenant = ref('tenant1')
</script>

<style scoped>
.tenant-select-shell {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 6px 4px 12px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--layout-header-bg) 72%, #ffffff 28%);
  border: 1px solid color-mix(in srgb, var(--layout-header-border) 86%, transparent);
}

.tenant-select__label {
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 700;
  color: var(--el-text-color-secondary);
}

.tenant-select {
  width: 170px;
}

.tenant-select :deep(.el-select__wrapper) {
  min-height: 34px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--layout-header-border) 84%, transparent);
}

.tenant-select :deep(.el-select__selected-item) {
  font-size: 13px;
  font-weight: 600;
}
</style>
