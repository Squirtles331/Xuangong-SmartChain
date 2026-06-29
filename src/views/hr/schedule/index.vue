<template>
  <gi-page-layout>
    <template #tool
      ><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /><el-button
        style="margin-left: 8px"
        @click="handleExport"
        >导出</el-button
      ></template
    >
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #shift="{ row }"
        ><el-tag :type="row.shift === 'day' ? 'warning' : row.shift === 'night' ? 'primary' : 'info'" size="small">{{
          row.shift === 'day' ? '白班' : row.shift === 'night' ? '夜班' : '中班'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增排班' : '编辑排班'" width="500px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
interface Sch {
  id: string
  team: string
  shift: string
  members: string
  leader: string
}
const data = ref<Sch[]>([
  { id: '1', team: '甲班', shift: 'day', members: '李四,王五,赵六', leader: '李四' },
  { id: '2', team: '乙班', shift: 'night', members: '孙八,周九,吴十', leader: '孙八' }
])
const cols: TableColumnItem<Sch>[] = [
  { prop: 'team', label: '班组', minWidth: 80 },
  { label: '班次', minWidth: 60, slotName: 'shift', align: 'center' },
  { prop: 'members', label: '成员', minWidth: 180 },
  { prop: 'leader', label: '班组长', minWidth: 80 },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pd = computed(() => data.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize))
watch(
  data,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
function refresh() {}
function handleExport() {
  ElMessage.success('导出成功')
}
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ team: '', shift: 'day', members: '', leader: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '班组', field: 'team', required: true },
  {
    type: 'select-v2',
    label: '班次',
    field: 'shift',
    props: {
      options: [
        { label: '白班', value: 'day' },
        { label: '夜班', value: 'night' },
        { label: '中班', value: 'middle' }
      ]
    } as any
  },
  { type: 'input', label: '成员', field: 'members', props: { placeholder: '多人用逗号分隔' } as any },
  { type: 'input', label: '班组长', field: 'leader' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { team: '', shift: 'day', members: '', leader: '' })
  vis.value = true
}
function openEdit(r: Sch) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.team) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    data.value.unshift({ id: Date.now().toString(), ...form } as Sch)
  } else {
    const i = data.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(data.value[i], form)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      data.value = data.value.filter((e) => e.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
