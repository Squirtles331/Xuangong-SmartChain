<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <div class="editor-header">
        <div class="header-left">
          <h2>BOM 编辑器 — 离心泵 XJP-100 (MBOM V1.2)</h2>
        </div>
        <div class="header-right">
          <el-button @click="importExcel">📥 导入Excel</el-button>
          <el-button @click="exportExcel">📤 导出Excel</el-button>
          <el-button type="primary" @click="saveBom">💾 保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <div class="editor-container">
      <!-- 左侧树 -->
      <div class="tree-panel">
        <div class="tree-toolbar">
          <el-button type="primary" size="small" @click="addChild(null)">+ 添加根节点</el-button>
        </div>
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="{ children: 'children', label: 'label' }"
          node-key="id"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
          style="margin-top: 12px"
        >
          <template #default="{ data }">
            <span class="tree-node">
              <span :class="data.material_type === 'phantom' ? 'phantom-node' : ''">
                {{ data.label }}
                <el-tag v-if="data.material_type === 'phantom'" size="small" type="warning" style="margin-left: 6px">虚拟件</el-tag>
                <el-tag v-if="data.material_type === 'auxiliary'" size="small" type="info" style="margin-left: 6px">辅料</el-tag>
              </span>
            </span>
          </template>
        </el-tree>
      </div>

      <!-- 右侧表单 -->
      <div class="form-panel">
        <div v-if="!currentNode" class="empty-tip">
          <el-empty description="选择左侧节点编辑或添加子件" />
        </div>
        <div v-else class="node-form">
          <h3>{{ currentNode.id ? '编辑子件' : '新增子件' }}</h3>
          <el-form :model="nodeForm" label-width="100px">
            <el-form-item label="物料编码" required>
              <el-input v-model="nodeForm.material_code" placeholder="搜索选择物料" />
            </el-form-item>
            <el-form-item label="物料名称">
              <el-input v-model="nodeForm.material_name" disabled />
            </el-form-item>
            <el-form-item label="单位用量" required>
              <el-input-number v-model="nodeForm.qty" :min="0" :precision="4" style="width: 200px" />
            </el-form-item>
            <el-form-item label="损耗率(%)">
              <el-input-number v-model="nodeForm.scrap_rate" :min="0" :max="100" :precision="1" style="width: 200px" />
            </el-form-item>
            <el-form-item label="位号">
              <el-input v-model="nodeForm.position_no" placeholder="装配位置标识" />
            </el-form-item>
            <el-form-item label="物料类型">
              <el-select v-model="nodeForm.material_type" style="width: 200px">
                <el-option label="普通件" value="normal" />
                <el-option label="虚拟件" value="phantom" />
                <el-option label="工艺辅料" value="auxiliary" />
              </el-select>
            </el-form-item>
            <el-form-item label="关键件">
              <el-switch v-model="nodeForm.is_critical" />
            </el-form-item>
            <el-form-item label="允许替代料">
              <el-switch v-model="nodeForm.substitute_allowed" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveNode">保存节点</el-button>
              <el-button v-if="currentNode.id" type="danger" @click="deleteNode">删除节点</el-button>
              <el-button @click="currentNode = null">取消</el-button>
            </el-form-item>
          </el-form>
          <!-- 子件操作 -->
          <div v-if="currentNode.id" style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #EBEEF5">
            <el-button type="success" size="small" @click="addChild(currentNode.id)">+ 添加子件</el-button>
          </div>
        </div>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { bomTree as mockBomTree } from '@/mock'

interface TreeNode {
  id: string
  label: string
  material_code: string
  material_name: string
  qty: number
  scrap_rate: number
  position_no: string
  material_type: string
  is_critical: boolean
  substitute_allowed: boolean
  children?: TreeNode[]
}

const treeData = ref<TreeNode[]>(JSON.parse(JSON.stringify(mockBomTree)))

const currentNode = ref<TreeNode | null>(null)
const nodeForm = reactive({
  material_code: '',
  material_name: '',
  qty: 1,
  scrap_rate: 0,
  position_no: '',
  material_type: 'normal',
  is_critical: false,
  substitute_allowed: false
})

function handleNodeClick(data: TreeNode) {
  currentNode.value = data
  nodeForm.material_code = data.material_code
  nodeForm.material_name = data.material_name
  nodeForm.qty = data.qty
  nodeForm.scrap_rate = data.scrap_rate
  nodeForm.position_no = data.position_no
  nodeForm.material_type = data.material_type
  nodeForm.is_critical = data.is_critical
  nodeForm.substitute_allowed = data.substitute_allowed
}

function addChild(parentId: string | null) {
  currentNode.value = {
    id: '',
    label: '',
    material_code: '',
    material_name: '',
    qty: 1,
    scrap_rate: 0,
    position_no: '',
    material_type: 'normal',
    is_critical: false,
    substitute_allowed: false
  }
  nodeForm.material_code = ''
  nodeForm.material_name = ''
  nodeForm.qty = 1
  nodeForm.scrap_rate = 0
  nodeForm.position_no = ''
  nodeForm.material_type = 'normal'
  nodeForm.is_critical = false
  nodeForm.substitute_allowed = false
}

function saveNode() {
  if (!nodeForm.material_code) {
    ElMessage.warning('请填写物料编码')
    return
  }
  if (currentNode.value!.id) {
    const node = currentNode.value!
    node.material_code = nodeForm.material_code
    node.material_name = nodeForm.material_name || nodeForm.material_code
    node.qty = nodeForm.qty
    node.scrap_rate = nodeForm.scrap_rate
    node.position_no = nodeForm.position_no
    node.material_type = nodeForm.material_type
    node.is_critical = nodeForm.is_critical
    node.substitute_allowed = nodeForm.substitute_allowed
    node.label = `${nodeForm.material_name || nodeForm.material_code} ×${nodeForm.qty}`
    ElMessage.success('保存成功')
  } else {
    const newNode: TreeNode = {
      id: Date.now().toString(),
      label: `${nodeForm.material_name || nodeForm.material_code} ×${nodeForm.qty}`,
      ...nodeForm,
      children: []
    }
    if (!currentNode.value!.id) {
      treeData.value.push(newNode)
    } else {
      if (!currentNode.value!.children) currentNode.value!.children = []
      currentNode.value!.children.push(newNode)
    }
    ElMessage.success('添加成功')
  }
  currentNode.value = null
}

function deleteNode() {
  ElMessageBox.confirm('确定删除该节点及其所有子节点？', '警告', { type: 'warning' })
    .then(() => {
      removeNode(treeData.value, currentNode.value!.id)
      currentNode.value = null
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function removeNode(nodes: TreeNode[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children && removeNode(nodes[i].children!, id)) return true
  }
  return false
}

function importExcel() {
  ElMessage.success('导入成功')
}
function exportExcel() {
  ElMessage.success('导出成功')
}
function saveBom() {
  ElMessage.success('BOM 已保存')
}
</script>

<style scoped>
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.editor-header h2 {
  margin: 0;
  font-size: 18px;
}
.editor-container {
  display: flex;
  gap: 0;
  height: calc(100vh - 180px);
}
.tree-panel {
  width: 420px;
  border-right: 1px solid #EBEEF5;
  overflow: auto;
  padding: 12px;
}
.form-panel {
  flex: 1;
  overflow: auto;
  padding: 16px;
}
.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.tree-node {
  font-size: 13px;
}
.phantom-node {
  border: 1px dashed #e6a23c;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
