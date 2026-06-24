<template>
  <gi-page-layout :bordered="true">
    <template #tool>
      <gi-button type="add" @click="openAdd('directory')">新增目录</gi-button>
      <gi-button style="margin-left: 8px" type="add" @click="openAdd('menu')">新增菜单</gi-button>
      <gi-button style="margin-left: 8px" type="add" @click="openAdd('button')">新增按钮</gi-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <div class="menu-container">
      <!-- 左侧菜单树 -->
      <div class="menu-tree-panel">
        <el-tree
          ref="menuTreeRef"
          :data="menuTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <span class="tree-node">
              <el-icon v-if="data.type === 'directory'" style="margin-right: 6px"><Folder /></el-icon>
              <el-icon v-else-if="data.type === 'menu'" style="margin-right: 6px"><Document /></el-icon>
              <el-icon v-else style="margin-right: 6px"><Operation /></el-icon>
              <span>{{ data.name }}</span>
              <el-tag v-if="data.type === 'directory'" size="small" type="info" style="margin-left: 8px">目录</el-tag>
              <el-tag v-else-if="data.type === 'menu'" size="small" type="primary" style="margin-left: 8px">菜单</el-tag>
              <el-tag v-else size="small" type="warning" style="margin-left: 8px">按钮</el-tag>
            </span>
          </template>
        </el-tree>
      </div>

      <!-- 右侧表单 -->
      <div class="menu-form-panel">
        <div v-if="!currentMenu" class="empty-tip">
          <el-empty description="请选择左侧菜单节点进行编辑" />
        </div>
        <gi-form v-else v-model="menuForm" :columns="menuFormColumns" :label-width="100" style="padding: 16px">
          <template #footer>
            <el-button type="primary" @click="saveMenu">保存</el-button>
            <el-button v-if="currentMenu.id" type="danger" @click="deleteMenu">删除</el-button>
            <el-button @click="currentMenu = null">取消</el-button>
          </template>
        </gi-form>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Folder, Document, Operation } from '@element-plus/icons-vue'
import type { FormColumnItem } from 'gi-component'

interface MenuNode {
  id: string
  parent_id: string | null
  name: string
  type: 'directory' | 'menu' | 'button'
  path?: string
  component?: string
  permission_code: string
  icon?: string
  sort_order: number
  visible: boolean
  children?: MenuNode[]
}

// ==================== Mock 数据 ====================
const menuTree = ref<MenuNode[]>([
  {
    id: '1', parent_id: null, name: '首页', type: 'menu', path: '/', component: 'views/HomeView.vue',
    permission_code: 'home:view', icon: 'House', sort_order: 0, visible: true
  },
  {
    id: '2', parent_id: null, name: '系统管理', type: 'directory', permission_code: 'system', icon: 'Setting', sort_order: 10, visible: true,
    children: [
      { id: '21', parent_id: '2', name: '用户管理', type: 'menu', path: '/system/user', component: 'views/system/user/index.vue', permission_code: 'system:user:list', icon: 'User', sort_order: 1, visible: true, children: [
        { id: '211', parent_id: '21', name: '新增用户', type: 'button', permission_code: 'system:user:create', sort_order: 1, visible: true },
        { id: '212', parent_id: '21', name: '编辑用户', type: 'button', permission_code: 'system:user:edit', sort_order: 2, visible: true },
        { id: '213', parent_id: '21', name: '删除用户', type: 'button', permission_code: 'system:user:delete', sort_order: 3, visible: true }
      ]},
      { id: '22', parent_id: '2', name: '角色管理', type: 'menu', path: '/system/role', component: 'views/system/role/index.vue', permission_code: 'system:role:list', icon: 'UserFilled', sort_order: 2, visible: true },
      { id: '23', parent_id: '2', name: '菜单管理', type: 'menu', path: '/system/menu', component: 'views/system/menu/index.vue', permission_code: 'system:menu:list', icon: 'Menu', sort_order: 3, visible: true },
      { id: '24', parent_id: '2', name: '字典管理', type: 'menu', path: '/system/dict', component: 'views/system/dict/index.vue', permission_code: 'system:dict:list', icon: 'Notebook', sort_order: 4, visible: true }
    ]
  },
  {
    id: '3', parent_id: null, name: '生产管理', type: 'directory', permission_code: 'production', icon: 'Monitor', sort_order: 20, visible: true,
    children: [
      { id: '31', parent_id: '3', name: '工单管理', type: 'menu', path: '/work-order/list', component: 'views/work-order/List.vue', permission_code: 'work-order:list', icon: 'Tickets', sort_order: 1, visible: true },
      { id: '32', parent_id: '3', name: '车间看板', type: 'menu', path: '/work-order/kanban', component: 'views/work-order/Kanban.vue', permission_code: 'work-order:kanban', icon: 'DataBoard', sort_order: 2, visible: true }
    ]
  }
])

// ==================== 当前选中节点 ====================
const currentMenu = ref<MenuNode | null>(null)
const menuForm = reactive({
  name: '', type: 'menu' as string, path: '', component: '', permission_code: '',
  icon: '', sort_order: 1, visible: true, parent_id: null as string | null
})

const menuFormColumns: FormColumnItem[] = [
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'select-v2', label: '类型', field: 'type', required: true,
    props: { options: [{ label: '目录', value: 'directory' }, { label: '菜单', value: 'menu' }, { label: '按钮', value: 'button' }] } as any },
  { type: 'input', label: '路由路径', field: 'path', props: { placeholder: '如 /system/user' } as any },
  { type: 'input', label: '组件路径', field: 'component', props: { placeholder: '如 views/system/user/index.vue' } as any },
  { type: 'input', label: '权限编码', field: 'permission_code', required: true, props: { placeholder: '如 system:user:list' } as any },
  { type: 'input', label: '图标', field: 'icon', props: { placeholder: 'Element Plus 图标名' } as any },
  { type: 'input-number', label: '排序', field: 'sort_order', props: { min: 0 } as any },
  { type: 'switch', label: '是否可见', field: 'visible' }
]

function handleNodeClick(data: MenuNode) {
  currentMenu.value = data
  menuForm.name = data.name; menuForm.type = data.type; menuForm.path = data.path || ''
  menuForm.component = data.component || ''; menuForm.permission_code = data.permission_code
  menuForm.icon = data.icon || ''; menuForm.sort_order = data.sort_order
  menuForm.visible = data.visible; menuForm.parent_id = data.parent_id
}

function openAdd(type: 'directory' | 'menu' | 'button') {
  currentMenu.value = { id: '', parent_id: null, name: '', type, path: '', component: '', permission_code: '', icon: '', sort_order: 1, visible: true }
  menuForm.name = ''; menuForm.type = type; menuForm.path = ''; menuForm.component = ''
  menuForm.permission_code = ''; menuForm.icon = ''; menuForm.sort_order = 1; menuForm.visible = true; menuForm.parent_id = null
}

function saveMenu() {
  if (!menuForm.name || !menuForm.permission_code) { ElMessage.warning('请填写名称和权限编码'); return }
  if (currentMenu.value!.id) {
    Object.assign(currentMenu.value, menuForm)
    ElMessage.success('保存成功')
  } else {
    const newNode: MenuNode = { id: Date.now().toString(), ...menuForm, children: [] }
    // 简单加到根级
    menuTree.value.push(newNode)
    ElMessage.success('新增成功')
  }
  currentMenu.value = null
}

function deleteMenu() {
  ElMessageBox.confirm('确定删除该菜单节点？（子节点将一并删除）', '警告', { type: 'warning' }).then(() => {
    removeNode(menuTree.value, currentMenu.value!.id)
    currentMenu.value = null
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function removeNode(nodes: MenuNode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) { nodes.splice(i, 1); return true }
    if (nodes[i].children && removeNode(nodes[i].children!, id)) return true
  }
  return false
}

function refresh() { currentMenu.value = null }
</script>

<style scoped lang="scss">
.menu-container {
  display: flex;
  height: calc(100vh - 180px);
  gap: 0;
}

.menu-tree-panel {
  width: 340px;
  border-right: 1px solid var(--el-border-color-light);
  overflow: auto;
  padding: 12px;
}

.menu-form-panel {
  flex: 1;
  overflow: auto;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.tree-node {
  display: flex;
  align-items: center;
  font-size: 14px;
}
</style>
