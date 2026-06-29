<template>
  <gi-dialog
    v-model="visible"
    :footer="true"
    :lock-scroll="false"
    :on-before-ok="handleSubmit"
    :on-cancel="handleCancel"
    :title="mode === 'add' ? '新增检验模板' : '编辑检验模板'"
    width="650px"
  >
    <gi-form v-model="formData" :columns="formColumns" :label-width="100" />
    <el-divider />
    <div class="items-header">
      <strong>检验项目</strong>
      <el-button type="primary" size="small" @click="addItem">+ 添加</el-button>
    </div>
    <el-table :data="items" border size="small" style="margin-top: 8px">
      <el-table-column label="项目" width="160">
        <template #default="{ row }">
          <el-input v-model="row.name" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-select v-model="row.type" size="small">
            <el-option label="measure" value="measure" />
            <el-option label="count" value="count" />
            <el-option label="sensory" value="sensory" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="标准值" width="160">
        <template #default="{ row }">
          <el-input v-model="row.standard" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="必检" width="90">
        <template #default="{ row }">
          <el-switch v-model="row.required" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template #default="{ $index }">
          <el-button type="danger" link size="small" @click="items.splice($index, 1)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </gi-dialog>
</template>

<script lang="ts" setup>
import type { FormColumnItem } from 'gi-component'

export interface TemplateItem {
  name: string
  type: string
  standard: string
  required: boolean
}

export interface TemplateFormModel {
  id: string
  name: string
  category: string
  items: TemplateItem[]
}

interface Props {
  mode: 'add' | 'edit'
}

const props = defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<TemplateFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const items = defineModel<TemplateItem[]>('items', { required: true })

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '模板名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '类别',
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

function addItem() {
  items.value.push({ name: '', type: 'measure', standard: '', required: true })
}

function handleCancel() {
  visible.value = false
}

async function handleSubmit() {
  emit('submit')
  return false
}
</script>

<style scoped>
.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
</style>
