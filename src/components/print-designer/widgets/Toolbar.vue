<template>
  <div class="toolbar">
    <div class="left">
      <el-button text size="small" @click="$emit('back')">
        <el-icon><Back /></el-icon>返回
      </el-button>
      <el-divider direction="vertical" />
      <span class="tpl-name">{{ store.template?.name }}</span>
      <el-tag v-if="store.dirty" type="warning" size="small">未保存</el-tag>
    </div>

    <div class="center">
      <el-button-group size="small">
        <el-button :disabled="!store.canUndo" @click="store.undo()">
          <el-icon><RefreshLeft /></el-icon>
        </el-button>
        <el-button :disabled="!store.canRedo" @click="store.redo()">
          <el-icon><RefreshRight /></el-icon>
        </el-button>
      </el-button-group>
      <el-divider direction="vertical" />
      <!-- 对齐（多选时） -->
      <el-button-group size="small">
        <el-button :disabled="!multi" title="左对齐" @click="align('left')">
          <el-icon><Fold /></el-icon>
        </el-button>
        <el-button :disabled="!multi" title="顶对齐" @click="align('top')">
          <el-icon><Sort /></el-icon>
        </el-button>
      </el-button-group>
      <el-divider direction="vertical" />
      <el-button-group size="small">
        <el-button @click="store.setZoom(store.zoom - 0.1)">-</el-button>
        <el-button @click="store.setZoom(1)">{{ Math.round(store.zoom * 100) }}%</el-button>
        <el-button @click="store.setZoom(store.zoom + 0.1)">+</el-button>
      </el-button-group>
    </div>

    <div class="right">
      <el-button size="small" :disabled="!store.selectedIds.length" type="danger" plain @click="store.removeSelected()">
        <el-icon><Delete /></el-icon>删除
      </el-button>
      <el-button size="small" @click="$emit('preview')">
        <el-icon><View /></el-icon>预览
      </el-button>
      <el-button size="small" type="primary" :loading="saving" @click="$emit('save')">
        <el-icon><Select /></el-icon>保存
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Back, Delete, Fold, RefreshLeft, RefreshRight, Select, Sort, View } from '@element-plus/icons-vue'
import { usePrintDesignerStore } from '@/stores/printDesigner'

defineProps<{ saving?: boolean }>()
defineEmits<{ back: []; preview: []; save: [] }>()

const store = usePrintDesignerStore()
const multi = computed(() => store.selectedIds.length > 1)

function align(dir: 'left' | 'top') {
  const els = store.selectedElements
  if (els.length < 2) return
  store.commit()
  if (dir === 'left') {
    const minX = Math.min(...els.map((e) => e.rect.x))
    els.forEach((e) => store.setRect(e.id, { ...e.rect, x: minX }))
  } else {
    const minY = Math.min(...els.map((e) => e.rect.y))
    els.forEach((e) => store.setRect(e.id, { ...e.rect, y: minY }))
  }
}
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  gap: 12px;
}

.left,
.center,
.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tpl-name {
  font-weight: 600;
  font-size: 13px;
}
</style>
