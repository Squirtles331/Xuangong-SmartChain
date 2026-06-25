<template>
  <gi-page-layout :bordered="true">
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="rules" border style="height: 100%">
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="deleteRule(row.id)" />
      </template>
    </gi-table>

    <gi-dialog
      v-model="dialogVisible"
      :footer="true"
      :on-before-ok="submitDialog"
      :title="dialogMode === 'add' ? '新增编码规则' : '编辑编码规则'"
      width="550px"
    >
      <gi-form v-model="form" :columns="formColumns" :label-width="120" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { codeRules as mockCodeRules } from '@/mock'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface CodeRule {
  id: string
  code: string
  name: string
  prefix: string
  date_format: string
  serial_length: number
  example: string
}

const rules = ref<CodeRule[]>(mockCodeRules as any)

const columns: TableColumnItem<CodeRule>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '规则编码', width: 100 },
  { prop: 'name', label: '规则名称', minWidth: 150 },
  { prop: 'prefix', label: '前缀', width: 80 },
  { prop: 'date_format', label: '日期格式', width: 120 },
  { prop: 'serial_length', label: '流水号长度', width: 110, align: 'center' },
  { prop: 'example', label: '示例', minWidth: 180 },
  { label: '操作', width: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const form = reactive({ code: '', name: '', prefix: '', date_format: 'YYYYMMDD', serial_length: 4 })
const formColumns: FormColumnItem[] = [
  { type: 'input', label: '规则编码', field: 'code', required: true },
  { type: 'input', label: '规则名称', field: 'name', required: true },
  { type: 'input', label: '前缀', field: 'prefix', required: true },
  {
    type: 'select-v2',
    label: '日期格式',
    field: 'date_format',
    required: true,
    props: {
      options: [
        { label: 'YYYYMMDD', value: 'YYYYMMDD' },
        { label: 'YYMMDD', value: 'YYMMDD' },
        { label: 'YYYYMM', value: 'YYYYMM' }
      ]
    } as any
  },
  { type: 'input-number', label: '流水号长度', field: 'serial_length', required: true, props: { min: 2, max: 10 } as any }
]

function openAdd() {
  dialogMode.value = 'add'
  form.code = ''
  form.name = ''
  form.prefix = ''
  form.date_format = 'YYYYMMDD'
  form.serial_length = 4
  dialogVisible.value = true
}
function openEdit(row: CodeRule) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  form.code = row.code
  form.name = row.name
  form.prefix = row.prefix
  form.date_format = row.date_format
  form.serial_length = row.serial_length
  dialogVisible.value = true
}

async function submitDialog() {
  if (!form.code || !form.name || !form.prefix) {
    ElMessage.warning('请填写必填项')
    return false
  }
  const example = `${form.prefix}20250115${'0'.repeat(form.serial_length - 1)}1`
  if (dialogMode.value === 'add') {
    rules.value.unshift({ id: Date.now().toString(), ...form, example })
    ElMessage.success('新增成功')
  } else {
    const r = rules.value.find((r) => r.id === editingId.value)
    if (r) {
      Object.assign(r, form)
      r.example = example
    }
    ElMessage.success('保存成功')
  }
  return true
}

function deleteRule(id: string) {
  ElMessageBox.confirm('确定删除该编码规则？', '提示', { type: 'warning' })
    .then(() => {
      rules.value = rules.value.filter((r) => r.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

function refresh() {}
</script>
