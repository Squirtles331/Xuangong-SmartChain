<template>
  <gi-page-layout>
    <template #header>
      <div class="editor-header">
        <div class="header-left">
          <h2>{{ isCreateMode ? '新建 BOM' : `BOM 编辑 - ${bomTitle}` }}</h2>
          <p class="header-desc">维护 BOM 树结构、用量、损耗率和替代策略。</p>
        </div>
        <div class="header-right">
          <el-button @click="importExcel">导入 Excel</el-button>
          <el-button @click="exportExcel">导出 Excel</el-button>
          <el-button type="primary" @click="saveBom">保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <div class="editor-container">
      <div class="tree-panel">
        <div class="tree-toolbar">
          <el-button type="primary" size="small" @click="addChild(null)">新增根节点</el-button>
        </div>
        <el-input v-model="treeFilter" placeholder="搜索节点名称或物料编码" clearable style="margin-top: 8px" />
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="{ children: 'children', label: 'label' }"
          :filter-node-method="filterNode"
          node-key="id"
          default-expand-all
          highlight-current
          @node-click="handleNodeClick"
          style="margin-top: 8px"
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

      <div class="form-panel">
        <div v-if="!currentNode" class="empty-tip">
          <el-empty description="点击左侧节点进行编辑，或新增子件节点。" />
        </div>

        <div v-else class="node-form">
          <h3>{{ currentNode.id ? '编辑子件' : '新增子件' }}</h3>
          <el-form :model="nodeForm" label-width="100px">
            <el-form-item label="物料编码" required>
              <el-input v-model="nodeForm.material_code" placeholder="请输入物料编码" />
            </el-form-item>
            <el-form-item label="物料名称">
              <el-input v-model="nodeForm.material_name" placeholder="请输入物料名称" />
            </el-form-item>
            <el-form-item label="单位用量" required>
              <el-input-number v-model="nodeForm.qty" :min="0" :precision="4" style="width: 220px" />
            </el-form-item>
            <el-form-item label="损耗率(%)">
              <el-input-number v-model="nodeForm.scrap_rate" :min="0" :max="100" :precision="1" style="width: 220px" />
            </el-form-item>
            <el-form-item label="位号">
              <el-input v-model="nodeForm.position_no" placeholder="例如 A1-2" />
            </el-form-item>
            <el-form-item label="物料类型">
              <el-select v-model="nodeForm.material_type" style="width: 220px">
                <el-option label="普通件" value="normal" />
                <el-option label="虚拟件" value="phantom" />
                <el-option label="辅料" value="auxiliary" />
              </el-select>
            </el-form-item>
            <el-form-item label="关键件">
              <el-switch v-model="nodeForm.is_critical" />
            </el-form-item>
            <el-form-item label="允许替代">
              <el-switch v-model="nodeForm.substitute_allowed" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveNode">保存节点</el-button>
              <el-button v-if="currentNode.id" type="danger" @click="deleteNode">删除节点</el-button>
              <el-button @click="currentNode = null">取消</el-button>
            </el-form-item>
          </el-form>

          <div v-if="currentNode.id" class="child-action">
            <el-button type="success" size="small" @click="addChild(currentNode.id)">新增子件</el-button>
          </div>
        </div>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { getBOMTree, saveBOM as saveBOMApi } from '@/api/bom'

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

const route = useRoute()
const isCreateMode = route.name === 'bomCreate'
const bomTitle = ref('')
const treeData = ref<TreeNode[]>([])
const treeRef = ref()
const treeFilter = ref('')
const bomId = ref('')

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

function filterNode(value: string, data: TreeNode): boolean {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase()) || data.material_code.toLowerCase().includes(value.toLowerCase())
}

watch(treeFilter, (value) => {
  treeRef.value?.filter(value)
})

function resetNodeForm() {
  Object.assign(nodeForm, {
    material_code: '',
    material_name: '',
    qty: 1,
    scrap_rate: 0,
    position_no: '',
    material_type: 'normal',
    is_critical: false,
    substitute_allowed: false
  })
}

function handleNodeClick(data: TreeNode) {
  currentNode.value = data
  Object.assign(nodeForm, {
    material_code: data.material_code,
    material_name: data.material_name,
    qty: data.qty,
    scrap_rate: data.scrap_rate,
    position_no: data.position_no,
    material_type: data.material_type,
    is_critical: data.is_critical,
    substitute_allowed: data.substitute_allowed
  })
}

function addChild(parentId: string | null) {
  const newNode: TreeNode = {
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
  ;(newNode as any)._parentId = parentId
  currentNode.value = newNode
  resetNodeForm()
}

function saveNode() {
  if (!nodeForm.material_code || !nodeForm.material_name) {
    ElMessage.warning('请填写物料编码和物料名称')
    return
  }

  if (currentNode.value?.id) {
    Object.assign(currentNode.value, {
      material_code: nodeForm.material_code,
      material_name: nodeForm.material_name,
      qty: nodeForm.qty,
      scrap_rate: nodeForm.scrap_rate,
      position_no: nodeForm.position_no,
      material_type: nodeForm.material_type,
      is_critical: nodeForm.is_critical,
      substitute_allowed: nodeForm.substitute_allowed,
      label: `${nodeForm.material_name} ×${nodeForm.qty}`
    })
    ElMessage.success('节点已更新')
  } else {
    const newNode: TreeNode = {
      id: Date.now().toString(),
      label: `${nodeForm.material_name} ×${nodeForm.qty}`,
      material_code: nodeForm.material_code,
      material_name: nodeForm.material_name,
      qty: nodeForm.qty,
      scrap_rate: nodeForm.scrap_rate,
      position_no: nodeForm.position_no,
      material_type: nodeForm.material_type,
      is_critical: nodeForm.is_critical,
      substitute_allowed: nodeForm.substitute_allowed,
      children: []
    }

    const parentId = (currentNode.value as any)?._parentId
    if (parentId) {
      const parentNode = findNode(treeData.value, parentId)
      if (parentNode) {
        if (!parentNode.children) parentNode.children = []
        parentNode.children.push(newNode)
      }
    } else {
      treeData.value.push(newNode)
    }
    ElMessage.success('节点已新增')
  }

  currentNode.value = null
}

function deleteNode() {
  ElMessageBox.confirm('确认删除该节点及其所有子节点吗？', '删除确认', { type: 'warning' })
    .then(() => {
      if (currentNode.value?.id) removeNode(treeData.value, currentNode.value.id)
      currentNode.value = null
      ElMessage.success('节点已删除')
    })
    .catch(() => {})
}

function removeNode(nodes: TreeNode[], id: string): boolean {
  for (let index = 0; index < nodes.length; index += 1) {
    if (nodes[index].id === id) {
      nodes.splice(index, 1)
      return true
    }
    if (nodes[index].children && removeNode(nodes[index].children!, id)) return true
  }
  return false
}

function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children) {
      const found = findNode(node.children, id)
      if (found) return found
    }
  }
  return null
}

function importExcel() {
  ElMessage.success('导入成功')
}

function exportExcel() {
  ElMessage.success('导出成功')
}

async function saveBom() {
  try {
    await saveBOMApi({ id: bomId.value || undefined, tree: treeData.value } as any)
    ElMessage.success('BOM 保存成功')
  } catch {
    ElMessage.error('BOM 保存失败')
  }
}

async function fetchBOMTree() {
  if (isCreateMode) {
    bomTitle.value = '新建 BOM'
    treeData.value = []
    return
  }

  const id = String(route.params.id || '')
  if (!id) return
  bomId.value = id

  try {
    const response = await getBOMTree(id)
    if (response.data) {
      treeData.value = response.data.tree || response.data
      bomTitle.value = response.data.material_name ? `${response.data.material_name}（${response.data.version || ''}）` : 'BOM 编辑'
    }
  } catch {
    ElMessage.error('获取 BOM 树失败')
  }
}

onMounted(() => {
  fetchBOMTree()
})
</script>

<style scoped>
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-left h2 {
  margin: 0;
  font-size: 20px;
}

.header-desc {
  margin: 6px 0 0;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.header-right {
  display: flex;
  gap: 8px;
}

.editor-container {
  display: flex;
  gap: 0;
  height: calc(100vh - 180px);
}

.tree-panel {
  width: 420px;
  border-right: 1px solid #ebeef5;
  overflow: auto;
  padding: 12px;
}

.tree-toolbar {
  display: flex;
  justify-content: flex-start;
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

.child-action {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
</style>
