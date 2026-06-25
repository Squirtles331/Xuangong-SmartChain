<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="templates" border stripe>
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增模板' : '编辑模板'" width="650px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
      <el-divider />
      <div class="items-header"><strong>检验项目</strong><el-button type="primary" size="small" @click="addItem">+ 添加</el-button></div>
      <el-table :data="items" border size="small" style="margin-top: 8px">
        <el-table-column prop="name" label="项目名称" width="140"
          ><template #default="{ row }"><el-input v-model="row.name" size="small" /></template
        ></el-table-column>
        <el-table-column label="类型" width="90"
          ><template #default="{ row }"
            ><el-select v-model="row.type" size="small"
              ><el-option label="计量" value="measure" /><el-option label="计数" value="count" /><el-option
                label="感官"
                value="sensory" /></el-select></template
        ></el-table-column>
        <el-table-column prop="standard" label="标准值" width="140"
          ><template #default="{ row }"><el-input v-model="row.standard" size="small" /></template
        ></el-table-column>
        <el-table-column label="必检" width="60"
          ><template #default="{ row }"><el-switch v-model="row.required" size="small" /></template
        ></el-table-column>
        <el-table-column label="操作" width="60"
          ><template #default="{ $index }"
            ><el-button type="danger" link size="small" @click="items.splice($index, 1)">删除</el-button></template
          ></el-table-column
        >
      </el-table>
    </gi-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Tpl {
  id: string
  name: string
  category: string
  items: number
}
const templates = ref<Tpl[]>([
  { id: '1', name: '钢材来料检验标准', category: '原材料', items: 8 },
  { id: '2', name: '泵类成品检验标准', category: '成品', items: 12 },
  { id: '3', name: '轴承来料检验标准', category: '外购件', items: 6 }
])
const cols: TableColumnItem<Tpl>[] = [
  { prop: 'name', label: '模板名称', minWidth: 200 },
  { prop: 'category', label: '适用分类', width: 120 },
  { prop: 'items', label: '检验项目数', minWidth: 110, align: 'center' },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ name: '', category: '原材料' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '模板名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '适用分类',
    field: 'category',
    required: true,
    props: {
      options: [
        { label: '原材料', value: '原材料' },
        { label: '外购件', value: '外购件' },
        { label: '成品', value: '成品' },
        { label: '半成品', value: '半成品' }
      ]
    } as any
  }
]
const items = ref([
  { name: '外径', type: 'measure', standard: 'φ50 ±0.02', required: true },
  { name: '硬度', type: 'measure', standard: 'HRC 45-50', required: true },
  { name: '外观', type: 'sensory', standard: '无裂纹、无锈蚀', required: true }
])
function addItem() {
  items.value.push({ name: '', type: 'measure', standard: '', required: true })
}
function openAdd() {
  mode.value = 'add'
  form.name = ''
  form.category = '原材料'
  items.value = [{ name: '', type: 'measure', standard: '', required: true }]
  vis.value = true
}
function openEdit(r: Tpl) {
  mode.value = 'edit'
  eid.value = r.id
  form.name = r.name
  form.category = r.category
  vis.value = true
}
async function submit() {
  if (!form.name) {
    ElMessage.warning('请填写模板名称')
    return false
  }
  if (mode.value === 'add') {
    templates.value.unshift({ id: Date.now().toString(), ...form, items: items.value.length })
  }
  return true
}
function del(id: string) {
  templates.value = templates.value.filter((t) => t.id !== id)
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
