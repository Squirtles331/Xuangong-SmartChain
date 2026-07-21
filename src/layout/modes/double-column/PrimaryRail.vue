<template>
  <aside class="primary-rail">
    <div class="rail-head">
      <img class="rail-logo" :src="logoUrl" alt="玄工智链" />
    </div>

    <div class="rail-body">
      <button
        v-for="item in topLevelItems"
        :key="item.path"
        type="button"
        class="rail-item"
        :class="{ 'is-active': item.path === activeTopLevelPath }"
        @click="emit('select-top-level', item.path)"
      >
        <el-icon class="rail-icon">
          <component :is="getIcon(item.icon || (item.path === '/' ? 'House' : 'Menu'))" />
        </el-icon>
        <span class="rail-label">{{ item.title }}</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import logoUrl from '@/assets/images/logo.png'
import type { TopLevelNavItem } from '@/layout/common/useSidebarMenu'

defineProps<{
  topLevelItems: TopLevelNavItem[]
  activeTopLevelPath: string
}>()

const emit = defineEmits<{
  (e: 'select-top-level', path: string): void
}>()

const getIcon = (name?: string) => {
  const icons = Icons as Record<string, unknown>
  return (name && icons[name]) || icons.Document
}
</script>

<style scoped>
.primary-rail {
  width: 92px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.12), transparent 18%), linear-gradient(180deg, #17314c 0%, #1d3f5c 46%, #234968 100%);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.04);
}

.rail-head {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

.rail-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
  padding: 6px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 24px rgba(8, 18, 36, 0.22);
}

.rail-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: none;
}

.rail-body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.rail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 74px;
  padding: 10px 8px;
  border: 1px solid rgba(255, 255, 255, 0.02);
  border-radius: 18px;
  background: transparent;
  color: rgba(227, 235, 255, 0.76);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.rail-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f4f8fc;
}

.rail-item.is-active {
  background: linear-gradient(180deg, rgba(112, 177, 241, 0.2) 0%, rgba(59, 126, 201, 0.22) 100%);
  border-color: rgba(170, 211, 255, 0.2);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 10px 20px rgba(6, 18, 38, 0.16);
  color: #ffffff;
  transform: translateY(-1px);
}

.rail-icon {
  font-size: 18px;
}

.rail-label {
  font-size: 12px;
  line-height: 1.35;
  font-weight: 600;
  text-align: center;
  word-break: break-word;
}

@media (max-width: 768px) {
  .primary-rail {
    width: 82px;
  }

  .rail-head {
    height: 60px;
  }

  .rail-logo {
    width: 34px;
    height: 34px;
  }

  .rail-item {
    min-height: 68px;
    padding: 8px 6px;
  }
}
</style>
