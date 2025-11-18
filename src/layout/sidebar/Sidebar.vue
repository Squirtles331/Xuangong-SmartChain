<template>
  <aside class="app-sidebar" :class="{ collapsed: collapsed, show: show }">
    <el-menu
      class="sidebar-menu"
      :default-active="activeMenu"
      :collapse="collapsed"
      :unique-opened="true"
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      @select="onSelect"
    >
      <el-menu-item v-for="item in singleItems" :key="item.path" :index="item.path">
        {{ item.title }}
      </el-menu-item>

      <el-sub-menu v-for="group in groups" :key="group.path" :index="group.path">
        <template #title>
          <span>{{ group.title }}</span>
        </template>
        <el-menu-item v-for="child in group.children" :key="child.path" :index="child.path">
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
    <div class="sidebar-footer">
      <el-button type="text" class="collapse-toggle" @click="emit('toggle-collapse')">
        <el-icon><Fold /></el-icon>
      </el-button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Fold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{ activeMenu: string; collapsed: boolean; show: boolean }>()
const emit = defineEmits<{ (e: 'select'): void; (e: 'toggle-collapse'): void }>()

const router = useRouter()

const singleItems = computed(() => {
  const options: any = (router as any).options
  const routes = Array.isArray(options?.routes) ? options.routes : []
  const layout = routes.find((r: any) => r.path === '/')
  const children = Array.isArray(layout?.children) ? layout.children : []
  return children
    .filter((r: any) => !(r.meta && r.meta.hidden) && !Array.isArray(r.children))
    .map((r: any) => {
      const path = r.path ? `/${r.path}` : '/'
      const title = r.meta?.title ?? r.name ?? r.path ?? path
      return { path, title }
    })
})

const groups = computed(() => {
  const options: any = (router as any).options
  const routes = Array.isArray(options?.routes) ? options.routes : []
  const layout = routes.find((r: any) => r.path === '/')
  const children = Array.isArray(layout?.children) ? layout.children : []
  return children
    .filter((r: any) => Array.isArray(r.children))
    .map((r: any) => {
      const groupPath = r.path ? `/${r.path}` : '/'
      const groupTitle = r.meta?.title ?? r.name ?? r.path ?? groupPath
      const items = (r.children || [])
        .filter((c: any) => !(c.meta && c.meta.hidden))
        .map((c: any) => {
          const childPath = `${groupPath}/${c.path}`.replace(/\/+/g, '/').replace(/\/+$/, '')
          const childTitle = c.meta?.title ?? c.name ?? c.path ?? childPath
          return { path: childPath, title: childTitle }
        })
      return { path: groupPath, title: groupTitle, children: items }
    })
})

const onSelect = () => emit('select')
</script>

<style scoped>
.app-sidebar {
  width: 200px;
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.app-sidebar.collapsed {
  width: 64px;
}
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}
.sidebar-menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.sidebar-menu::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.app-sidebar :deep(.el-menu) {
  border-right: none;
}
.app-sidebar :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
}
.app-sidebar :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
}
.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px;
  background-color: #304156;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.collapse-toggle {
  color: #bfcbd9;
}
@media (max-width: 768px) {
  .app-sidebar {
    position: absolute;
    top: 60px;
    left: 0;
    height: calc(100vh - 60px);
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  .sidebar-menu {
    flex: 1;
    overflow-y: auto;
  }
  .app-sidebar.show {
    transform: translateX(0);
  }
}
</style>
