<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="tableData" :pagination="pagination" :loading="loading" border style="height: 100%">
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button type="delete" @click="onDelete(row)" />
      </template>
    </gi-table>

    <CodeRuleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import { createCodeRule, deleteCodeRule, getCodeRules, updateCodeRule, type CodeRule } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import CodeRuleFormDialog, { type CodeRuleFormModel } from './CodeRuleFormDialog.vue'

const columns: TableColumnItem<CodeRule>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '规则编码', width: 100 },
  { prop: 'name', label: '规则名称', minWidth: 150 },
  { prop: 'prefix', label: '前缀', width: 80 },
  { prop: 'dateFormat', label: '日期格式', width: 120 },
  { prop: 'serialLength', label: '流水号长度', minWidth: 110, align: 'center' },
  { prop: 'example', label: '示例', minWidth: 180 },
  { label: '操作', minWidth: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]

const { tableData, pagination, loading, refresh, onDelete } = useTable<CodeRule>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const response = await getCodeRules()
    const start = (page - 1) * size
    return {
      list: response.data.slice(start, start + size),
      total: response.data.length
    }
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteCodeRule(id)))
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<CodeRuleFormModel>(createDefaultFormModel())

function createDefaultFormModel(): CodeRuleFormModel {
  return { id: '', code: '', name: '', prefix: '', dateFormat: 'YYYYMMDD', serialLength: 4 }
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: CodeRule) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    code: row.code,
    name: row.name,
    prefix: row.prefix,
    dateFormat: row.dateFormat,
    serialLength: row.serialLength
  }
  dialogVisible.value = true
}

async function submitDialog() {
  if (!formModel.value.code || !formModel.value.name || !formModel.value.prefix) {
    ElMessage.warning('请填写必填项')
    return
  }

  const example = `${formModel.value.prefix}20250115${'0'.repeat(formModel.value.serialLength - 1)}1`
  if (dialogMode.value === 'add') {
    await createCodeRule({ ...formModel.value, example })
    ElMessage.success('新增成功')
  } else {
    await updateCodeRule(formModel.value.id, { ...formModel.value, example })
    ElMessage.success('保存成功')
  }

  dialogVisible.value = false
  await refresh()
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
