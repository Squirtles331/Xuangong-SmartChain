<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo">
        <img src="@/assets/icons/demo.svg" alt="Logo" />
        <span class="logo-text">玄工智链 · XIC</span>
      </div>
    </div>

    <div class="header-center">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
          {{ item.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <HeaderRight />
  </header>
</template>

<script setup lang="ts">
import HeaderRight from './HeaderRight.vue'

interface Breadcrumb {
  title: string
  path: string
}
defineProps<{ breadcrumbs: Breadcrumb[] }>()
</script>

<style scoped>
.app-header {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo img {
  width: 32px;
  height: 32px;
}
.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}
.header-center {
  flex: 1;
  margin: 0 20px;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 12px;
  }
  .header-center {
    display: none;
  }
}
</style>
