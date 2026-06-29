<template>
  <gi-page-layout :size="260" style="height: calc(100vh - 120px)">
    <template #left>
      <div class="tree-wrapper">
        <el-tree
          :data="orgTree"
          :props="{ children: 'children', label: 'name' }"
          node-key="id"
          default-expand-all
          highlight-current
          @node-click="onNodeClick"
        >
          <template #default="{ data }">
            <span class="tree-node">
              <el-icon v-if="data.type === 'group'" style="margin-right: 4px"><OfficeBuilding /></el-icon>
              <el-icon v-else-if="data.type === 'company'" style="margin-right: 4px"><OfficeBuilding /></el-icon>
              <el-icon v-else-if="data.type === 'plant'" style="margin-right: 4px"><HomeFilled /></el-icon>
              <el-icon v-else-if="data.type === 'workshop'" style="margin-right: 4px"><Grid /></el-icon>
              <el-icon v-else style="margin-right: 4px"><Location /></el-icon>
              <span>{{ data.name }}</span>
            </span>
          </template>
        </el-tree>
        <div class="tree-toolbar">
          <el-button type="primary" size="small" @click="addNode">+ 新增节点</el-button>
          <el-button v-if="currentNode" size="small" type="danger" @click="removeNode">删除</el-button>
        </div>
      </div>
    </template>
    <template #header>
      <h3 v-if="currentNode" style="margin: 0">
        {{
          currentNode.type === 'group'
            ? '集团'
            : currentNode.type === 'company'
              ? '公司'
              : currentNode.type === 'plant'
                ? '工厂'
                : currentNode.type === 'workshop'
                  ? '车间'
                  : currentNode.type === 'line'
                    ? '产线'
                    : '工位'
        }}信息
      </h3>
    </template>
    <div v-if="!currentNode" class="empty-tip"><el-empty description="请选择左侧组织节点" /></div>
    <gi-form v-else v-model="currentNode" :columns="orgColumns" :label-width="100" style="padding: 16px">
      <template #footer>
        <el-button type="primary" @click="saveNode">保存</el-button>
      </template>
    </gi-form>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { OfficeBuilding, HomeFilled, Grid, Location } from '@element-plus/icons-vue'
import type { FormColumnItem } from 'gi-component'
import { getOrgTree } from '@/api/mdm'

const orgTree = ref<any[]>([])
const currentNode = ref<any>(null)

const orgColumns: FormColumnItem[] = [
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '编码', field: 'code', props: { placeholder: '自动生成' } as any }
]

onMounted(() => {
  fetchData()
})

async function fetchData() {
  const res = await getOrgTree()
  orgTree.value = JSON.parse(JSON.stringify(res.data))
}

function onNodeClick(data: any) {
  currentNode.value = { ...data }
}
function saveNode() {
  ElMessage.success('保存成功')
}

function addNode() {
  const parent = currentNode.value
  const typeMap: Record<string, string> = { group: 'company', company: 'plant', plant: 'workshop', workshop: 'line', line: 'workstation' }
  const newType = parent ? typeMap[parent.type] : 'group'
  const newNode = { id: Date.now().toString(), name: '新节点', type: newType, children: [] }
  if (parent) {
    if (!parent.children) parent.children = []
    parent.children.push(newNode)
  } else {
    orgTree.value.push(newNode)
  }
  currentNode.value = newNode
  ElMessage.success('新增成功')
}

function removeNode() {
  if (!currentNode.value) return
  const id = currentNode.value.id
  const removed = removeFromTree(orgTree.value, id)
  if (removed) {
    currentNode.value = null
    ElMessage.success('删除成功')
  }
}

function removeFromTree(nodes: any[], id: string): boolean {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === id) {
      nodes.splice(i, 1)
      return true
    }
    if (nodes[i].children && removeFromTree(nodes[i].children, id)) return true
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
</style>
