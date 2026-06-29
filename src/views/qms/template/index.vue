<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
    </template>

    <gi-table :columns="columns" :data="templates" border stripe>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="removeTemplate(row.id)" />
      </template>
    </gi-table>

    <gi-dialog v-model="dialogVisible" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? 'Add Template' : 'Edit Template'" width="650px">
      <gi-form v-model="form" :columns="formColumns" :label-width="100" />
      <el-divider />
      <div class="items-header">
        <strong>Inspection Items</strong>
        <el-button type="primary" size="small" @click="addItem">+ Add</el-button>
      </div>
      <el-table :data="items" border size="small" style="margin-top: 8px">
        <el-table-column prop="name" label="Item" width="160">
          <template #default="{ row }">
            <el-input v-model="row.name" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="Type" width="120">
          <template #default="{ row }">
            <el-select v-model="row.type" size="small">
              <el-option label="measure" value="measure" />
              <el-option label="count" value="count" />
              <el-option label="sensory" value="sensory" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="standard" label="Standard" width="160">
          <template #default="{ row }">
            <el-input v-model="row.standard" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="Required" width="90">
          <template #default="{ row }">
            <el-switch v-model="row.required" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="80">
          <template #default="{ $index }">
            <el-button type="danger" link size="small" @click="items.splice($index, 1)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { getQCTemplates } from '@/api/qms'

interface TemplateItem {
  name: string
  type: string
  standard: string
  required: boolean
}

interface TemplateSummary {
  id: string
  name: string
  category: string
  items: number
}

const templates = ref<TemplateSummary[]>([])
const dialogVisible = ref(false)
const mode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const items = ref<TemplateItem[]>([])

const form = reactive({
  name: '',
  category: 'raw'
})

const columns: TableColumnItem<TemplateSummary>[] = [
  { prop: 'name', label: 'Template Name', minWidth: 220 },
  { prop: 'category', label: 'Category', width: 140 },
  { prop: 'items', label: 'Item Count', minWidth: 100, align: 'center' },
  { label: 'Actions', minWidth: 160, slotName: 'actions', align: 'center' }
]

const formColumns: FormColumnItem[] = [
  { type: 'input', label: 'Template Name', field: 'name', required: true },
  {
    type: 'select-v2',
    label: 'Category',
    field: 'category',
    required: true,
    props: {
      options: [
        { label: 'raw', value: 'raw' },
        { label: 'purchased', value: 'purchased' },
        { label: 'semi-finished', value: 'semi-finished' },
        { label: 'finished', value: 'finished' }
      ]
    } as any
  }
]

function createDefaultItems(count = 1): TemplateItem[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `Check Item ${index + 1}`,
    type: 'measure',
    standard: '',
    required: true
  }))
}

async function loadTemplates() {
  const res = await getQCTemplates()
  templates.value = (res.data || []).map((item: any) => ({
    id: String(item.id),
    name: item.name,
    category: item.category,
    items: Number(item.items || 0)
  }))
}

function addItem() {
  items.value.push({ name: '', type: 'measure', standard: '', required: true })
}

function openAdd() {
  mode.value = 'add'
  editingId.value = ''
  form.name = ''
  form.category = 'raw'
  items.value = createDefaultItems()
  dialogVisible.value = true
}

function openEdit(row: TemplateSummary) {
  mode.value = 'edit'
  editingId.value = row.id
  form.name = row.name
  form.category = row.category
  items.value = createDefaultItems(Math.max(1, row.items))
  dialogVisible.value = true
}

async function submit() {
  if (!form.name) {
    ElMessage.warning('Template name is required')
    return false
  }

  if (mode.value === 'add') {
    templates.value.unshift({ id: Date.now().toString(), name: form.name, category: form.category, items: items.value.length })
  } else {
    const index = templates.value.findIndex((item) => item.id === editingId.value)
    if (index > -1) {
      Object.assign(templates.value[index], { name: form.name, category: form.category, items: items.value.length })
    }
  }

  return true
}

function removeTemplate(id: string) {
  ElMessageBox.confirm('Delete this template?', 'Warning', { type: 'warning' })
    .then(() => {
      templates.value = templates.value.filter((item) => item.id !== id)
      ElMessage.success('Deleted')
    })
    .catch(() => {})
}

onMounted(() => {
  loadTemplates()
})
</script>

<style scoped>
.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
</style>
