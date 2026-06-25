<template>
  <gi-page-layout :bordered="true" :size="320" style="height: calc(100vh - 120px)">
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
      <template #footer>
        <el-button type="primary" @click="saveNode">保存</el-button>
        <el-button v-if="currentNode?.id" type="danger" @click="removeNode">删除</el-button>
        <el-button @click="currentNode = null">取消</el-button>
      </template>
    </gi-form>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
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

const menuTree = ref<MenuNode[]>(JSON.parse(JSON.stringify(mockMenuTree)))
const currentNode = ref<MenuNode | null>(null)

const nodeForm = reactive({
  name: '',
  type: 'menu' as string,
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
  { type: 'input', label: '图标', field: 'icon', props: { placeholder: 'Element Plus 图标名' } as any },
  { type: 'input-number', label: '排序', field: 'sort_order', props: { min: 0 } as any },
  { type: 'switch', label: '是否可见', field: 'visible' }
]

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

function addNode(type: 'directory' | 'menu' | 'button') {
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
    const newNode: MenuNode = { id: Date.now().toString(), parent_id: currentNode.value!.parent_id, ...nodeForm }
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
  border-top: 1px solid #eee;
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
</style>
