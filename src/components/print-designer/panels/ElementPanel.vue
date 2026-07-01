<template>
  <div class="panel">
    <div class="panel-title">元素</div>
    <div class="palette">
      <div v-for="item in items" :key="item.type" class="palette-item" @click="add(item.type)">
        <el-icon :size="18"><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </div>
    </div>

    <div class="panel-title">数据字段</div>
    <div class="hint">点击字段插入到画布</div>
    <el-tree :data="fieldTree" :props="treeProps" default-expand-all node-key="key" @node-click="onFieldClick" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Document, Grid, Histogram, Picture, PictureRounded, Postcard, Rank, Tickets } from '@element-plus/icons-vue'
import type { ElementType } from '@/api/print'
import { usePrintDesignerStore } from '@/stores/printDesigner'

const store = usePrintDesignerStore()

const items: { type: ElementType; label: string; icon: unknown }[] = [
  { type: 'text', label: '文本', icon: Document },
  { type: 'field', label: '字段', icon: Postcard },
  { type: 'table', label: '表格', icon: Grid },
  { type: 'image', label: '图片', icon: Picture },
  { type: 'barcode', label: '条码', icon: Histogram },
  { type: 'qrcode', label: '二维码', icon: PictureRounded },
  { type: 'line', label: '直线', icon: Rank },
  { type: 'rect', label: '矩形', icon: Tickets }
]

const treeProps = { label: 'label', children: 'children' }

interface TreeNode {
  key: string
  label: string
  expr?: string
  children?: TreeNode[]
}

const fieldTree = computed<TreeNode[]>(() => {
  const ds = store.template?.dataSource
  if (!ds) return []
  const nodes: TreeNode[] = ds.fields.map((f) => ({ key: f.key, label: `${f.label} (${f.key})`, expr: `{{ data.${f.key} }}` }))
  for (const set of ds.datasets) {
    nodes.push({
      key: set.key,
      label: `${set.label} [数组]`,
      children: set.fields.map((f) => ({ key: `${set.key}.${f.key}`, label: `${f.label} (${f.key})`, expr: `{{ row.${f.key} }}` }))
    })
  }
  return nodes
})

function add(type: ElementType) {
  store.addElement(type, 'body', 5, 5)
}

function onFieldClick(node: TreeNode) {
  if (!node.expr) return
  store.addElement('field', 'body', 5, 5)
  const el = store.primarySelected
  if (el && el.type === 'field') store.updateElement(el.id, { expression: node.expr } as never)
}
</script>

<style scoped>
.panel {
  width: 200px;
  border-right: 1px solid var(--el-border-color-light);
  overflow-y: auto;
  padding: 8px;
  background: var(--el-bg-color);
}

.panel-title {
  font-weight: 600;
  font-size: 13px;
  margin: 8px 0 6px;
  color: var(--el-text-color-primary);
}

.palette {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.palette-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--el-text-color-regular);
}

.palette-item:hover {
  border-color: var(--el-color-primary);
  color: var(--el-color-primary);
}

.hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}
</style>
