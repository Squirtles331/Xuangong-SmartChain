<template>
  <gi-page-layout :size="320" style="height: calc(100vh - 120px)">
    <template #left>
      <div class="tree-wrapper">
        <el-tree
          ref="treeRef"
          :data="menuTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          highlight-current
          @node-click="onNodeClick"
        >
          <template #default="{ data }">
            <span class="tree-node">
              <el-icon v-if="data.type === 'directory'" style="margin-right: 4px"><Folder /></el-icon>
              <el-icon v-else-if="data.type === 'menu'" style="margin-right: 4px"><Document /></el-icon>
              <el-icon v-else style="margin-right: 4px"><Operation /></el-icon>
              <span>{{ data.name }}</span>
              <el-tag v-if="data.type === 'directory'" size="small" type="info" style="margin-left: 6px">目录</el-tag>
              <el-tag v-else-if="data.type === 'menu'" size="small" type="primary" style="margin-left: 6px">菜单</el-tag>
              <el-tag v-else size="small" type="warning" style="margin-left: 6px">按钮</el-tag>
            </span>
          </template>
        </el-tree>
        <div class="tree-toolbar">
          <el-button type="primary" size="small" @click="addNode('directory')">+ 目录</el-button>
          <el-button type="success" size="small" @click="addNode('menu')">+ 菜单</el-button>
          <el-button type="warning" size="small" @click="addNode('button')">+ 按钮</el-button>
        </div>
      </div>
    </template>
    <template #header>
      <h3 style="margin: 0">{{ currentNode ? (currentNode.id ? '编辑' : '新增') + '菜单节点' : '请选择左侧节点' }}</h3>
    </template>
    <div v-if="!currentNode" class="empty-tip"><el-empty description="选择左侧菜单节点进行编辑，或点击下方按钮新增" /></div>
    <gi-form v-else v-model="nodeForm" :columns="formColumns" :label-width="100" style="padding: 16px">
      <!-- 图标选择器 -->
      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #ebeef5">
        <el-form-item label="图标预览">
          <div style="display: flex; align-items: center; gap: 12px">
            <el-icon v-if="nodeForm.icon" :size="28"><component :is="iconComponent" /></el-icon>
            <span v-else style="color: #999">未选择</span>
            <el-button type="primary" link @click="iconDialogVisible = true">选择图标</el-button>
          </div>
        </el-form-item>
      </div>
      <template #footer>
        <el-button type="primary" @click="saveNode">保存</el-button>
        <el-button v-if="currentNode?.id" type="danger" @click="removeNode">删除</el-button>
        <el-button @click="currentNode = null">取消</el-button>
      </template>
    </gi-form>

    <!-- 图标选择对话框 -->
    <el-dialog v-model="iconDialogVisible" title="选择图标" width="700px">
      <el-input v-model="iconSearch" placeholder="搜索图标名称..." clearable style="margin-bottom: 12px" />
      <div class="icon-grid">
        <div v-for="name in filteredIcons" :key="name" class="icon-item" :class="{ active: nodeForm.icon === name }" @click="selectIcon(name)">
          <el-icon :size="24"><component :is="name" /></el-icon>
          <span class="icon-name">{{ name }}</span>
        </div>
      </div>
      <el-empty v-if="!filteredIcons.length" description="未找到匹配图标" />
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Folder, Document, Operation } from '@element-plus/icons-vue'
import type { FormColumnItem } from 'gi-component'
import { menuTree as mockMenuTree } from '@/mock'

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

type MenuNodeType = MenuNode['type']
type MenuForm = Omit<MenuNode, 'id' | 'parent_id' | 'children'>

const menuTree = ref<MenuNode[]>(JSON.parse(JSON.stringify(mockMenuTree)))
const currentNode = ref<MenuNode | null>(null)

const nodeForm = reactive<MenuForm>({
  name: '',
  type: 'menu',
  path: '',
  component: '',
  permission_code: '',
  icon: '',
  sort_order: 1,
  visible: true
})

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '目录', value: 'directory' },
        { label: '菜单', value: 'menu' },
        { label: '按钮', value: 'button' }
      ]
    } as any
  },
  { type: 'input', label: '路由路径', field: 'path', props: { placeholder: '菜单类型时必填' } as any },
  { type: 'input', label: '组件路径', field: 'component', props: { placeholder: '如 views/system/user/index.vue' } as any },
  { type: 'input', label: '权限编码', field: 'permission_code', required: true },
  { type: 'input', label: '图标', field: 'icon', props: { placeholder: '搜索并选择图标' } as any },
  { type: 'input-number', label: '排序', field: 'sort_order', props: { min: 0 } as any },
  { type: 'switch', label: '是否可见', field: 'visible' }
]

// 图标选择
const iconSearch = ref('')
const iconDialogVisible = ref(false)
const commonIcons = ref([
  'HomeFilled',
  'Setting',
  'User',
  'Lock',
  'Key',
  'List',
  'Grid',
  'Menu',
  'Document',
  'Folder',
  'FolderOpened',
  'Edit',
  'Delete',
  'Plus',
  'Minus',
  'Check',
  'Close',
  'Search',
  'Refresh',
  'Upload',
  'Download',
  'Share',
  'Message',
  'Bell',
  'Warning',
  'InfoFilled',
  'CircleCheck',
  'Clock',
  'Calendar',
  'Picture',
  'VideoCamera',
  'Monitor',
  'DataAnalysis',
  'TrendCharts',
  'Histogram',
  'PieChart',
  'Connection',
  'Link',
  'Switch',
  'Operation',
  'Tools',
  'Platform',
  'Management',
  'Promotion',
  'Collection',
  'Tickets',
  'Postcard',
  'Box',
  'Goods',
  'ShoppingBag',
  'ShoppingCart',
  'PriceTag',
  'Coin',
  'Money',
  'Wallet',
  'CreditCard',
  'BankCard',
  'MapLocation',
  'Position',
  'LocationFilled',
  'Aim',
  'Compass',
  'ChatDotRound',
  'ChatLineRound',
  'ChatLineSquare',
  'ChatRound',
  'Service',
  'Headset',
  'Phone',
  'PhoneFilled',
  'MessageBox',
  'View',
  'Hide',
  'Unlock',
  'Finished',
  'More',
  'MoreFilled',
  'Star',
  'StarFilled',
  'Thumb',
  'Pointer',
  'Flag',
  'Sell',
  'Filter',
  'Sort',
  'Rank',
  'Guide',
  'Opportunity'
])
const filteredIcons = computed(() => {
  if (!iconSearch.value) return commonIcons.value
  const kw = iconSearch.value.toLowerCase()
  return commonIcons.value.filter((i) => i.toLowerCase().includes(kw))
})

const iconComponent = computed(() => nodeForm.icon || undefined)

function selectIcon(name: string) {
  nodeForm.icon = name
  iconDialogVisible.value = false
}

function onNodeClick(data: MenuNode) {
  currentNode.value = data
  nodeForm.name = data.name
  nodeForm.type = data.type
  nodeForm.path = data.path || ''
  nodeForm.component = data.component || ''
  nodeForm.permission_code = data.permission_code
  nodeForm.icon = data.icon || ''
  nodeForm.sort_order = data.sort_order
  nodeForm.visible = data.visible
}

function addNode(type: MenuNodeType) {
  const parent = currentNode.value
  const newNode: MenuNode = {
    id: '',
    parent_id: parent?.id || null,
    name: '',
    type,
    path: '',
    component: '',
    permission_code: '',
    icon: '',
    sort_order: 1,
    visible: true
  }
  currentNode.value = newNode
  nodeForm.name = ''
  nodeForm.type = type
  nodeForm.path = ''
  nodeForm.component = ''
  nodeForm.permission_code = ''
  nodeForm.icon = ''
  nodeForm.sort_order = 1
  nodeForm.visible = true
}

function saveNode() {
  if (!nodeForm.name || !nodeForm.permission_code) {
    ElMessage.warning('请填写名称和权限编码')
    return
  }
  if (currentNode.value!.id) {
    Object.assign(currentNode.value, nodeForm)
    ElMessage.success('保存成功')
  } else {
    const newNode: MenuNode = {
      id: Date.now().toString(),
      parent_id: currentNode.value!.parent_id,
      name: nodeForm.name,
      type: nodeForm.type,
      path: nodeForm.path,
      component: nodeForm.component,
      permission_code: nodeForm.permission_code,
      icon: nodeForm.icon,
      sort_order: nodeForm.sort_order,
      visible: nodeForm.visible
    }
    const parent = currentNode.value!.parent_id
    if (parent) {
      const parentNode = findNode(menuTree.value, parent)
      if (parentNode) {
        if (!parentNode.children) parentNode.children = []
        parentNode.children.push(newNode)
      }
    } else {
      menuTree.value.push(newNode)
    }
    ElMessage.success('新增成功')
  }
  currentNode.value = null
}

function removeNode() {
  if (!currentNode.value?.id) return
  const id = currentNode.value.id
  removeFromTree(menuTree.value, id)
  currentNode.value = null
  ElMessage.success('删除成功')
}

function findNode(nodes: MenuNode[], id: string): MenuNode | null {
  for (const n of nodes) {
    if (n.id === id) return n
    if (n.children) {
      const f = findNode(n.children, id)
      if (f) return f
    }
  }
  return null
}

function removeFromTree(nodes: MenuNode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children && removeFromTree(nodes[i].children!, id)) return true
  }
  return false
}
</script>

<style scoped>
.tree-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tree-wrapper :deep(.el-tree) {
  flex: 1;
  overflow: auto;
}
.tree-toolbar {
  padding: 8px 0;
  border-top: 1px solid #ebeef5;
  display: flex;
  gap: 8px;
}
.tree-node {
  display: flex;
  align-items: center;
  font-size: 13px;
}
.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  max-height: 400px;
  overflow: auto;
}
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 4px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.icon-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}
.icon-item.active {
  border-color: #409eff;
  background: #d9ecff;
}
.icon-name {
  font-size: 11px;
  margin-top: 6px;
  color: #666;
  text-align: center;
  word-break: break-all;
}
</style>
