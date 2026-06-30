<template>
  <gi-page-layout :size="320" style="height: calc(100vh - 120px)">
    <template #left>
      <div class="tree-wrapper">
        <el-tree
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

    <div v-if="!currentNode" class="empty-tip">
      <el-empty description="选择左侧节点进行编辑，或点击下方按钮新增" />
    </div>

    <div v-else class="form-wrapper">
      <gi-form v-model="nodeForm" :columns="formColumns" :label-width="100">
        <template #footer>
          <el-button type="primary" @click="openDialog">打开编辑对话框</el-button>
          <el-button v-if="currentNode.id" type="danger" @click="removeNode">删除</el-button>
          <el-button @click="currentNode = null">取消</el-button>
        </template>
      </gi-form>
    </div>

    <MenuFormDialog v-model:visible="dialogVisible" v-model:form="dialogFormModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Folder, Operation } from '@element-plus/icons-vue'
import type { FormColumnItem } from 'gi-component'
import { createMenu, deleteMenu, getMenuTree, updateMenu, type SysMenu } from '@/api/system'
import MenuFormDialog, { type MenuFormModel } from './MenuFormDialog.vue'

interface MenuNode extends SysMenu {}

const menuTree = ref<MenuNode[]>([])
const currentNode = ref<MenuNode | null>(null)

onMounted(async () => {
  await loadTree()
})

async function loadTree() {
  const response = await getMenuTree()
  menuTree.value = response.data
}

const nodeForm = reactive({
  name: '',
  type: 'menu' as MenuNode['type'],
  path: '',
  component: '',
  permissionCode: '',
  icon: '',
  sortOrder: 1,
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
  { type: 'input', label: '路由路径', field: 'path' },
  { type: 'input', label: '组件路径', field: 'component' },
  { type: 'input', label: '权限编码', field: 'permissionCode', required: true },
  { type: 'input', label: '图标', field: 'icon' },
  { type: 'input-number', label: '排序', field: 'sortOrder', props: { min: 0 } as any },
  { type: 'switch', label: '是否可见', field: 'visible' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const dialogFormModel = ref<MenuFormModel>(createDefaultFormModel())

function createDefaultFormModel(): MenuFormModel {
  return {
    id: '',
    parentId: null,
    name: '',
    type: 'menu',
    path: '',
    component: '',
    permissionCode: '',
    icon: '',
    sortOrder: 1,
    visible: true
  }
}

function onNodeClick(data: MenuNode) {
  currentNode.value = data
  nodeForm.name = data.name
  nodeForm.type = data.type
  nodeForm.path = data.path || ''
  nodeForm.component = data.component || ''
  nodeForm.permissionCode = data.permissionCode
  nodeForm.icon = data.icon || ''
  nodeForm.sortOrder = data.sortOrder
  nodeForm.visible = data.visible
}

function addNode(type: MenuNode['type']) {
  const parent = currentNode.value
  currentNode.value = {
    id: '',
    parentId: parent?.id || null,
    name: '',
    type,
    path: '',
    component: '',
    permissionCode: '',
    icon: '',
    sortOrder: 1,
    visible: true
  }

  nodeForm.name = ''
  nodeForm.type = type
  nodeForm.path = ''
  nodeForm.component = ''
  nodeForm.permissionCode = ''
  nodeForm.icon = ''
  nodeForm.sortOrder = 1
  nodeForm.visible = true
}

function openDialog() {
  dialogMode.value = currentNode.value?.id ? 'edit' : 'add'
  dialogFormModel.value = {
    id: currentNode.value?.id || '',
    parentId: currentNode.value?.parentId || null,
    name: nodeForm.name,
    type: nodeForm.type,
    path: nodeForm.path,
    component: nodeForm.component,
    permissionCode: nodeForm.permissionCode,
    icon: nodeForm.icon,
    sortOrder: nodeForm.sortOrder,
    visible: nodeForm.visible
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!dialogFormModel.value.name || !dialogFormModel.value.permissionCode) {
    ElMessage.warning('请填写名称和权限编码')
    return
  }

  if (dialogMode.value === 'edit') {
    await updateMenu(dialogFormModel.value.id, {
      name: dialogFormModel.value.name,
      type: dialogFormModel.value.type,
      path: dialogFormModel.value.path || undefined,
      component: dialogFormModel.value.component || undefined,
      permissionCode: dialogFormModel.value.permissionCode,
      icon: dialogFormModel.value.icon || undefined,
      sortOrder: dialogFormModel.value.sortOrder,
      visible: dialogFormModel.value.visible
    })
    ElMessage.success('保存成功')
  } else {
    await createMenu({
      parentId: dialogFormModel.value.parentId || null,
      name: dialogFormModel.value.name,
      type: dialogFormModel.value.type,
      path: dialogFormModel.value.path || undefined,
      component: dialogFormModel.value.component || undefined,
      permissionCode: dialogFormModel.value.permissionCode,
      icon: dialogFormModel.value.icon || undefined,
      sortOrder: dialogFormModel.value.sortOrder,
      visible: dialogFormModel.value.visible
    })
    ElMessage.success('新增成功')
  }

  dialogVisible.value = false
  currentNode.value = null
  await loadTree()
}

async function removeNode() {
  if (!currentNode.value?.id) return
  await deleteMenu(currentNode.value.id)
  currentNode.value = null
  await loadTree()
  ElMessage.success('删除成功')
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

.form-wrapper {
  padding: 16px;
}
</style>
