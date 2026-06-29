<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border stripe>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button style="margin-left: 8px" type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <TemplateFormDialog
      v-model:visible="dialogVisible"
      v-model:form="formModel"
      v-model:items="formItems"
      :mode="dialogMode"
      @submit="submitDialog"
    />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getQCTemplates } from '@/api/qms'
import { useTable } from '@/hooks/useTable'
import TemplateFormDialog, { type TemplateFormModel, type TemplateItem } from './TemplateFormDialog.vue'

interface TemplateRow {
  id: string
  name: string
  category: string
  items: number
}

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<TemplateFormModel>(createDefaultFormModel())
const formItems = ref<TemplateItem[]>([])

const columns: TableColumnItem<TemplateRow>[] = [
  { prop: 'name', label: '模板名称', minWidth: 220 },
  { prop: 'category', label: '类别', width: 140 },
  { prop: 'items', label: '项目数', minWidth: 100, align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]

function mapRow(raw: any): TemplateRow {
  return {
    id: String(raw.id),
    name: raw.name || '',
    category: raw.category || '',
    items: Number(raw.items) || 0
  }
}

const { tableData, pagination, loading, refresh, onDelete } = useTable<TemplateRow>({
  rowKey: 'id',
  listAPI: async () => {
    const res = await getQCTemplates()
    const items = (res.data || []).map(mapRow)
    return { list: items, total: items.length }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => Promise.resolve()))
})

function createDefaultItems(count = 1): TemplateItem[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `检验项目 ${index + 1}`,
    type: 'measure',
    standard: '',
    required: true
  }))
}

function createDefaultFormModel(): TemplateFormModel {
  return {
    id: '',
    name: '',
    category: 'raw',
    items: []
  }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  formItems.value = createDefaultItems()
  dialogVisible.value = true
}

function openEdit(row: TemplateRow) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    name: row.name,
    category: row.category,
    items: []
  }
  formItems.value = createDefaultItems(Math.max(1, row.items))
  dialogVisible.value = true
}

async function submitDialog() {
  dialogVisible.value = false
  await refresh()
}
</script>
