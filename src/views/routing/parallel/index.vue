<template>
  <gi-page-layout>
    <template #header><h3>并行工序配置</h3></template>
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="groups" border stripe size="small">
      <template #operations="{ row }"
        ><el-tag v-for="(op, i) in row.operations" :key="i" size="small" style="margin: 2px">{{ op }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增并行组' : '编辑并行组'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface PG {
  id: string
  routing_name: string
  operations: string[]
  merge_rule: string
}
const groups = ref<PG[]>([
  { id: '1', routing_name: '离心泵 XJP-100 标准工艺', operations: ['工序40:钻孔', '工序50:热处理'], merge_rule: '全部完成后继续' },
  { id: '2', routing_name: '齿轮箱 GBX-200 标准工艺', operations: ['工序30:精车', '工序40:磨削'], merge_rule: '任一完成后继续' }
])
const cols: TableColumnItem<PG>[] = [
  { prop: 'routing_name', label: '工艺路线', minWidth: 220 },
  { label: '并行工序', minWidth: 200, slotName: 'operations' },
  { prop: 'merge_rule', label: '汇合规则', minWidth: 160 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ routing_name: '', operations: [] as string[], merge_rule: '全部完成后继续' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '工艺路线', field: 'routing_name', required: true },
  {
    type: 'select-v2',
    label: '并行工序',
    field: 'operations',
    required: true,
    props: {
      multiple: true,
      options: [
        { label: '工序10:下料', value: '工序10:下料' },
        { label: '工序20:粗车', value: '工序20:粗车' },
        { label: '工序30:精车', value: '工序30:精车' },
        { label: '工序40:钻孔', value: '工序40:钻孔' },
        { label: '工序50:热处理', value: '工序50:热处理' },
        { label: '工序60:磨削', value: '工序60:磨削' },
        { label: '工序70:装配', value: '工序70:装配' },
        { label: '工序80:测试', value: '工序80:测试' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '汇合规则',
    field: 'merge_rule',
    props: {
      options: [
        { label: '全部完成后继续', value: '全部完成后继续' },
        { label: '任一完成后继续', value: '任一完成后继续' }
      ]
    } as any
  }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { routing_name: '', operations: [], merge_rule: '全部完成后继续' })
  vis.value = true
}
function openEdit(r: PG) {
  mode.value = 'edit'
  eid.value = r.id
  form.operations = [...r.operations]
  form.routing_name = r.routing_name
  form.merge_rule = r.merge_rule
  vis.value = true
}
async function submit() {
  if (!form.routing_name || form.operations.length === 0) {
    ElMessage.warning('请填写必填项')
    return false
  }
  const ops = [...form.operations]
  if (mode.value === 'add') {
    groups.value.unshift({ id: Date.now().toString(), routing_name: form.routing_name, operations: ops, merge_rule: form.merge_rule } as PG)
  } else {
    const i = groups.value.findIndex((e) => e.id === eid.value)
    if (i > -1) {
      groups.value[i].routing_name = form.routing_name
      groups.value[i].operations = ops
      groups.value[i].merge_rule = form.merge_rule
    }
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      groups.value = groups.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
