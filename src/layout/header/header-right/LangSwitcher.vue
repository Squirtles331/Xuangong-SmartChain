<template>
  <el-dropdown trigger="click">
    <el-button type="text" class="lang-btn">
      <img src="@/assets/icons/文A.svg" alt="Lang" class="lang-icon" />
    </el-button>
    <template #dropdown>
      <el-dropdown-menu class="lang-dropdown">
        <el-dropdown-item @click="setLang('zh')">
          <span class="lang-item">
            <span v-if="lang === 'zh'" class="lang-dot"></span>
            简体中文
          </span>
        </el-dropdown-item>
        <el-dropdown-item @click="setLang('en')">
          <span class="lang-item">
            <span v-if="lang === 'en'" class="lang-dot"></span>
            English
          </span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const lang = ref<'zh' | 'en'>('zh')
const savedLang = localStorage.getItem('app-lang') as 'zh' | 'en' | null
if (savedLang) lang.value = savedLang

const setLang = (val: 'zh' | 'en') => {
  lang.value = val
  localStorage.setItem('app-lang', val)
}
</script>

<style scoped>
.lang-btn {
  padding: 6px 8px;
}
.lang-icon {
  width: 18px;
  height: 18px;
  display: block;
}
.lang-dropdown {
  min-width: 140px;
}
.lang-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.lang-dot {
  width: 8px;
  height: 8px;
  background-color: var(--el-text-color-primary);
  border-radius: 50%;
}
</style>
