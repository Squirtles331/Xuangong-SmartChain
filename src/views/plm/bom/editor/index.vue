<template>
  <gi-page-layout>
    <template #header>
      <div class="editor-header">
        <div class="header-left">
          <h2>{{ isCreateMode ? '新建产品结构' : `产品结构编辑 - ${bomMeta.material_name}` }}</h2>
          <p class="header-desc">{{ bomMeta.material_code || '待定义产品编码' }} ｜ {{ bomMeta.bom_type }} ｜ {{ bomMeta.version }}</p>
        </div>
        <div class="header-right">
          <el-button @click="importExcel">导入 Excel</el-button>
          <el-button @click="exportExcel">导出 Excel</el-button>
          <el-button type="primary" @click="saveBom">保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <div class="page-shell">
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
                <span :class="{ 'tree-node--phantom': data.material_type === 'phantom' }">
                  {{ data.label }}
                </span>
                <el-tag v-if="data.material_type === 'phantom'" size="small" type="warning" effect="light">虚拟件</el-tag>
                <el-tag v-if="data.material_type === 'auxiliary'" size="small" type="info" effect="light">辅料</el-tag>
              </span>
            </template>
          </el-tree>
        </div>

        <div class="form-panel">
          <el-card shadow="never" class="meta-card">
            <template #header>
              <div class="card-header">
                <span>版本头信息</span>
              </div>
            </template>

            <el-form :model="bomMeta" label-width="92px">
              <el-form-item label="产品编码">
                <el-input v-model="bomMeta.material_code" />
              </el-form-item>
              <el-form-item label="产品名称">
                <el-input v-model="bomMeta.material_name" />
              </el-form-item>
              <el-form-item label="BOM 类型">
                <el-select v-model="bomMeta.bom_type" style="width: 100%">
                  <el-option label="EBOM" value="EBOM" />
                  <el-option label="MBOM" value="MBOM" />
                </el-select>
              </el-form-item>
              <el-form-item label="版本">
                <el-input v-model="bomMeta.version" />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="bomMeta.status" style="width: 100%">
                  <el-option label="草稿" value="draft" />
                  <el-option label="待评审" value="pending_approval" />
                  <el-option label="已生效" value="active" />
                  <el-option label="已停用" value="disabled" />
                  <el-option label="已归档" value="archived" />
                </el-select>
              </el-form-item>
              <el-form-item label="生效日期">
                <el-input v-model="bomMeta.effective_date" />
              </el-form-item>
            </el-form>
          </el-card>

          <div v-if="!currentNode" class="empty-tip">
            <el-empty description="点击左侧节点进行编辑，或新增子件节点。" />
          </div>

          <el-card v-else shadow="never" class="node-card">
            <template #header>
              <div class="card-header">
                <span>{{ currentNode.id ? '节点维护' : '新增子件' }}</span>
                <el-button v-if="currentNode.id" type="success" link @click="addChild(currentNode.id)">新增子件</el-button>
              </div>
            </template>

            <el-form :model="nodeForm" label-width="100px">
              <el-form-item label="物料编码" required>
                <el-input v-model="nodeForm.material_code" placeholder="请输入物料编码" />
              </el-form-item>
              <el-form-item label="物料名称" required>
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
          </el-card>
        </div>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'

interface TreeNode {
  id: string
  label: string
  material_code: string
  material_name: string
  qty: number
  scrap_rate: number
  position_no: string
  material_type: 'normal' | 'phantom' | 'auxiliary'
  is_critical: boolean
  substitute_allowed: boolean
  children?: TreeNode[]
}

interface BOMMeta {
  material_code: string
  material_name: string
  bom_type: 'EBOM' | 'MBOM'
  version: string
  status: 'draft' | 'pending_approval' | 'active' | 'disabled' | 'archived'
  effective_date: string
}

const bomStatusOptions = [
  { value: 'draft', label: '草稿', type: 'info' as const },
  { value: 'pending_approval', label: '待评审', type: 'warning' as const },
  { value: 'active', label: '已生效', type: 'success' as const },
  { value: 'disabled', label: '已停用', type: 'warning' as const },
  { value: 'archived', label: '已归档', type: 'info' as const }
]

const route = useRoute()
const treeRef = ref()
const treeFilter = ref('')
const treeData = ref<TreeNode[]>([])
const currentNode = ref<(TreeNode & { _parentId?: string | null }) | null>(null)

const bomMeta = reactive<BOMMeta>({
  material_code: '',
  material_name: '',
  bom_type: 'EBOM',
  version: 'V1.0',
  status: 'draft',
  effective_date: '待评审'
})

const nodeForm = reactive({
  material_code: '',
  material_name: '',
  qty: 1,
  scrap_rate: 0,
  position_no: '',
  material_type: 'normal' as TreeNode['material_type'],
  is_critical: false,
  substitute_allowed: false
})

const bomTemplates: Record<string, { meta: BOMMeta; tree: TreeNode[] }> = {
  'BOM-EB-1001': {
    meta: {
      material_code: 'FG-ASSY-2101',
      material_name: '供液控制总成',
      bom_type: 'EBOM',
      version: 'V2.3',
      status: 'active',
      effective_date: '2026-07-01'
    },
    tree: [
      {
        id: 'n-100',
        label: '供液控制总成 ×1',
        material_code: 'FG-ASSY-2101',
        material_name: '供液控制总成',
        qty: 1,
        scrap_rate: 0,
        position_no: 'ROOT',
        material_type: 'normal',
        is_critical: true,
        substitute_allowed: false,
        children: [
          {
            id: 'n-110',
            label: '壳体粗加工件 ×1',
            material_code: 'SM-CNC-1001',
            material_name: '壳体粗加工件',
            qty: 1,
            scrap_rate: 2,
            position_no: 'A1',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: false
          },
          {
            id: 'n-120',
            label: '流量调节组件 ×1',
            material_code: 'SM-VAL-9001',
            material_name: '流量调节组件',
            qty: 1,
            scrap_rate: 0,
            position_no: 'A2',
            material_type: 'phantom',
            is_critical: false,
            substitute_allowed: true,
            children: [
              {
                id: 'n-121',
                label: 'O 型圈 ×2',
                material_code: 'PS-OR-011',
                material_name: 'O 型圈',
                qty: 2,
                scrap_rate: 3,
                position_no: 'A2-1',
                material_type: 'auxiliary',
                is_critical: false,
                substitute_allowed: true
              }
            ]
          }
        ]
      }
    ]
  },
  'BOM-MB-2101': {
    meta: {
      material_code: 'FG-ASSY-2101',
      material_name: '供液控制总成',
      bom_type: 'MBOM',
      version: 'V1.2',
      status: 'active',
      effective_date: '2026-07-05'
    },
    tree: [
      {
        id: 'n-200',
        label: '供液控制总成 ×1',
        material_code: 'FG-ASSY-2101',
        material_name: '供液控制总成',
        qty: 1,
        scrap_rate: 0,
        position_no: 'ROOT',
        material_type: 'normal',
        is_critical: true,
        substitute_allowed: false,
        children: [
          {
            id: 'n-210',
            label: '壳体粗加工件 ×1',
            material_code: 'SM-CNC-1001',
            material_name: '壳体粗加工件',
            qty: 1,
            scrap_rate: 1,
            position_no: 'A1',
            material_type: 'normal',
            is_critical: true,
            substitute_allowed: false
          },
          {
            id: 'n-220',
            label: '导热脂 ×1',
            material_code: 'AUX-GR-001',
            material_name: '导热脂',
            qty: 1,
            scrap_rate: 5,
            position_no: 'A3',
            material_type: 'auxiliary',
            is_critical: false,
            substitute_allowed: true
          }
        ]
      }
    ]
  }
}

const isCreateMode = computed(() => route.name === 'bomCreate')

watch(treeFilter, (value) => {
  treeRef.value?.filter(value)
})

function createEmptyMeta() {
  Object.assign(bomMeta, {
    material_code: '',
    material_name: '',
    bom_type: 'EBOM',
    version: 'V1.0',
    status: 'draft',
    effective_date: '待评审'
  })
}

function cloneTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneTree(node.children) : []
  }))
}

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

function filterNode(value: string, data: TreeNode) {
  if (!value) return true
  return data.label.toLowerCase().includes(value.toLowerCase()) || data.material_code.toLowerCase().includes(value.toLowerCase())
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
    substitute_allowed: false,
    _parentId: parentId
  }
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
    ElMessage.success('已更新静态结构节点')
  } else {
    const newNode: TreeNode = {
      id: `node-${Date.now()}`,
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

    const parentId = currentNode.value?._parentId
    if (parentId) {
      const parentNode = findNode(treeData.value, parentId)
      if (parentNode) {
        if (!parentNode.children) parentNode.children = []
        parentNode.children.push(newNode)
      }
    } else {
      treeData.value.push(newNode)
    }
    ElMessage.success('已新增静态结构节点')
  }

  currentNode.value = null
}

function deleteNode() {
  ElMessageBox.confirm('确认删除该节点及其所有子节点吗？', '删除确认', { type: 'warning' })
    .then(() => {
      if (currentNode.value?.id) removeNode(treeData.value, currentNode.value.id)
      currentNode.value = null
      ElMessage.success('已删除静态结构节点')
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
  ElMessage.success('已完成静态导入演示')
}

function exportExcel() {
  ElMessage.success('已完成静态导出演示')
}

function saveBom() {
  if (!bomMeta.material_code || !bomMeta.material_name) {
    ElMessage.warning('请先维护版本头信息')
    return
  }

  if (!treeData.value.length) {
    ElMessage.warning('请至少维护一个结构根节点')
    return
  }

  ElMessage.success('静态产品结构已保存，可作为下一阶段 mock 基线')
}

function loadTemplate() {
  const id = String(route.params.id || '')
  if (isCreateMode.value) {
    createEmptyMeta()
    treeData.value = []
    return
  }

  const template = bomTemplates[id] || bomTemplates['BOM-EB-1001']
  Object.assign(bomMeta, template.meta)
  treeData.value = cloneTree(template.tree)
}

onMounted(() => {
  loadTemplate()
})
</script>

<style scoped>
.page-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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
  flex-wrap: wrap;
  gap: 8px;
}

.editor-container {
  display: grid;
  grid-template-columns: 420px minmax(0, 1fr);
  gap: 16px;
  min-height: calc(100vh - 280px);
}

.tree-panel {
  padding: 12px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  background: var(--el-bg-color);
  overflow: auto;
}

.tree-toolbar {
  display: flex;
}

.tree-node {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.tree-node--phantom {
  padding: 2px 6px;
  border: 1px dashed #e6a23c;
  border-radius: 4px;
}

.form-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.meta-card,
.node-card {
  border-radius: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 320px;
  border: 1px dashed var(--el-border-color);
  border-radius: 12px;
  background: #fafcff;
}

@media (max-width: 1200px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
