<template>
  <gi-dialog v-model="visible" :footer="false" :lock-scroll="false" :title="title" width="800px" @close="handleClose">
    <div class="dict-items-header">
      <gi-button type="add" size="small" @click="openAddItem">新增字典项</gi-button>
    </div>

    <gi-table :columns="itemColumns" :data="items" border size="small" style="margin-top: 12px">
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
      </template>
      <template #itemActions="{ row }">
        <gi-button type="edit" size="small" @click="openEditItem(row)" />
        <gi-button type="delete" size="small" @click="emit('deleteItem', row.id)" />
      </template>
    </gi-table>

    <DictItemDialog v-model:visible="itemFormVisible" v-model:form="itemFormModel" :mode="itemDialogMode" @submit="submitItemDialog" />
  </gi-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DictItem } from '@/api/system'
import type { TableColumnItem } from 'gi-component'
import DictItemDialog, { type DictItemFormModel } from './DictItemDialog.vue'

interface Props {
  dictTypeName: string
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const items = defineModel<DictItem[]>('items', { required: true })

const emit = defineEmits<{
  close: []
  createItem: [form: DictItemFormModel]
  updateItem: [form: DictItemFormModel]
  deleteItem: [id: string]
}>()

const itemFormVisible = ref(false)
const itemDialogMode = ref<'add' | 'edit'>('add')
const itemFormModel = ref<DictItemFormModel>(createDefaultItemForm())

const title = computed(() => `字典项管理 - ${props.dictTypeName || ''}`)

const itemColumns: TableColumnItem<DictItem>[] = [
  { type: 'index', label: '#', width: 50 },
  { prop: 'code', label: '编码', width: 140 },
  { prop: 'name', label: '名称', width: 140 },
  { prop: 'sort_order', label: '排序', minWidth: 80, align: 'center' },
  { prop: 'css_class', label: '样式', width: 100 },
  { label: '状态', minWidth: 80, slotName: 'status' },
  { label: '操作', minWidth: 160, slotName: 'itemActions', align: 'center' }
]

function createDefaultItemForm(): DictItemFormModel {
  return { id: '', code: '', name: '', sort_order: 1, css_class: '' }
}

function openAddItem() {
  itemDialogMode.value = 'add'
  itemFormModel.value = createDefaultItemForm()
  itemFormVisible.value = true
}

function openEditItem(row: DictItem) {
  itemDialogMode.value = 'edit'
  itemFormModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    sort_order: row.sort_order,
    css_class: row.css_class || ''
  }
  itemFormVisible.value = true
}

function submitItemDialog() {
  if (itemDialogMode.value === 'add') {
    emit('createItem', itemFormModel.value)
  } else {
    emit('updateItem', itemFormModel.value)
  }
}

function handleClose() {
  emit('close')
}
</script>

<style scoped lang="scss">
.dict-items-header {
  display: flex;
  justify-content: flex-end;
}
</style>
