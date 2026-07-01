<template>
  <div class="designer" tabindex="0" @keydown="onKeydown">
    <Toolbar :saving="saving" @back="$emit('back')" @preview="$emit('preview')" @save="$emit('save')" />
    <div class="workspace">
      <ElementPanel />
      <Canvas />
      <PropertyPanel />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { usePrintDesignerStore } from '@/stores/printDesigner'
import Canvas from './Canvas.vue'
import ElementPanel from './panels/ElementPanel.vue'
import PropertyPanel from './panels/PropertyPanel.vue'
import Toolbar from './widgets/Toolbar.vue'

defineProps<{ saving?: boolean }>()
defineEmits<{ back: []; preview: []; save: [] }>()

const store = usePrintDesignerStore()

function onKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement)?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA') return

  // 撤销/重做
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    e.preventDefault()
    if (e.shiftKey) store.redo()
    else store.undo()
    return
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
    e.preventDefault()
    store.redo()
    return
  }

  // 删除
  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (store.selectedIds.length) {
      e.preventDefault()
      store.removeSelected()
    }
    return
  }

  // 方向键微移
  const step = e.shiftKey ? 5 : store.template?.page.snapToGrid ? store.template.page.grid || 1 : 0.5
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step]
  }
  if (moves[e.key] && store.selectedElements.length) {
    e.preventDefault()
    const [dx, dy] = moves[e.key]
    store.commit()
    store.selectedElements.forEach((el) => {
      store.setRect(el.id, { ...el.rect, x: Math.max(0, el.rect.x + dx), y: Math.max(0, el.rect.y + dy) })
    })
  }
}
</script>

<style scoped>
.designer {
  display: flex;
  flex-direction: column;
  height: 100%;
  outline: none;
}

.workspace {
  flex: 1;
  display: flex;
  min-height: 0;
}
</style>
