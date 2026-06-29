<template>
  <gi-page-layout>
    <template #header><h3>约束理论排程配置</h3></template>
    <el-tabs v-model="tab">
      <el-tab-pane label="模具约束" name="mold">
        <template #tool><gi-button type="add" @click="openAdd('mold')" /></template>
        <gi-table :columns="moldCols" :data="pagedMolds" :pagination="moldPagination" border stripe size="small">
          <template #available="{ row }">
            <el-tag :type="row.available ? 'success' : 'danger'" size="small">{{ row.available ? '是' : '否' }}</el-tag>
          </template>
          <template #utilization="{ row }">
            <el-progress :percentage="getMoldUtil(row)" :stroke-width="8" :color="utilColor(getMoldUtil(row))" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit('mold', row)" />
            <gi-button type="delete" @click="del('mold', row.id)" />
          </template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="刀具约束" name="tool">
        <template #tool><gi-button type="add" @click="openAdd('tool')" /></template>
        <gi-table :columns="toolCols" :data="pagedTools" :pagination="toolPagination" border stripe size="small">
          <template #available="{ row }">
            <el-tag :type="row.available ? 'success' : 'danger'" size="small">{{ row.available ? '是' : '否' }}</el-tag>
          </template>
          <template #utilization="{ row }">
            <el-progress :percentage="getToolUtil(row)" :stroke-width="8" :color="utilColor(getToolUtil(row))" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit('tool', row)" />
            <gi-button type="delete" @click="del('tool', row.id)" />
          </template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="人员技能约束" name="skill">
        <template #tool><gi-button type="add" @click="openAdd('skill')" /></template>
        <gi-table :columns="skillCols" :data="pagedSkills" :pagination="skillPagination" border stripe size="small">
          <template #utilization="{ row }">
            <el-progress :percentage="getSkillUtil(row)" :stroke-width="8" :color="utilColor(getSkillUtil(row))" />
          </template>
          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit('skill', row)" />
            <gi-button type="delete" @click="del('skill', row.id)" />
          </template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增约束' : '编辑约束'" width="550px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import { useConstraintStore } from '@/stores/constraint'
const store = useConstraintStore()
const tab = ref('mold')

const moldCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '模具编码', minWidth: 150 },
  { prop: 'name', label: '名称', minWidth: 140 },
  { prop: 'applicable', label: '适用物料', minWidth: 120 },
  { prop: 'life', label: '设计寿命', minWidth: 100 },
  { label: '可用', minWidth: 70, slotName: 'available', align: 'center' },
  { label: '利用率', minWidth: 140, slotName: 'utilization' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const toolCols: TableColumnItem<any>[] = [
  { prop: 'code', label: '刀具编码', minWidth: 130 },
  { prop: 'name', label: '名称', minWidth: 160 },
  { prop: 'applicable', label: '适用设备', minWidth: 140 },
  { prop: 'life', label: '寿命', minWidth: 80 },
  { label: '可用', minWidth: 70, slotName: 'available', align: 'center' },
  { label: '利用率', minWidth: 140, slotName: 'utilization' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const skillCols: TableColumnItem<any>[] = [
  { prop: 'operation', label: '工序', minWidth: 100 },
  { prop: 'skill', label: '技能要求', minWidth: 160 },
  { prop: 'min_level', label: '最低等级', minWidth: 80, align: 'center' },
  { prop: 'workers_count', label: '具备人数', minWidth: 80, align: 'center' },
  { label: '利用率', minWidth: 140, slotName: 'utilization' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

// 分页
const moldPagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const toolPagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const skillPagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

watch(
  () => store.molds,
  (val) => {
    moldPagination.total = val.length
  },
  { immediate: true }
)
watch(
  () => store.tools,
  (val) => {
    toolPagination.total = val.length
  },
  { immediate: true }
)
watch(
  () => store.skills,
  (val) => {
    skillPagination.total = val.length
  },
  { immediate: true }
)

const pagedMolds = computed(() => {
  const s = (moldPagination.currentPage - 1) * moldPagination.pageSize
  return store.molds.slice(s, s + moldPagination.pageSize)
})
const pagedTools = computed(() => {
  const s = (toolPagination.currentPage - 1) * toolPagination.pageSize
  return store.tools.slice(s, s + toolPagination.pageSize)
})
const pagedSkills = computed(() => {
  const s = (skillPagination.currentPage - 1) * skillPagination.pageSize
  return store.skills.slice(s, s + skillPagination.pageSize)
})

// 利用率计算 (模拟)
function getMoldUtil(row: any): number {
  // 模拟: 基于 life 字符串提取数字，如 "10000模次" -> 10000
  const lifeNum = parseInt(row.life) || 100
  const used = Math.floor(Math.random() * lifeNum * 0.8)
  return Math.round((used / lifeNum) * 100)
}
function getToolUtil(row: any): number {
  const lifeNum = parseInt(row.life) || 100
  const used = Math.floor(Math.random() * lifeNum * 0.7)
  return Math.round((used / lifeNum) * 100)
}
function getSkillUtil(row: any): number {
  // workers_count 利用率: 已分配人数 / 总人数
  const assigned = Math.max(1, row.workers_count - Math.floor(Math.random() * 2))
  return Math.round((assigned / row.workers_count) * 100)
}
function utilColor(pct: number): string {
  if (pct >= 80) return '#f56c6c'
  if (pct >= 60) return '#e6a23c'
  return '#67c23a'
}

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const curType = ref('')
const form = reactive({ code: '', name: '', applicable: '', life: '' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '适用对象', field: 'applicable' },
  { type: 'input', label: '寿命/数量', field: 'life' }
]
function openAdd(t: string) {
  curType.value = t
  mode.value = 'add'
  Object.assign(form, { code: '', name: '', applicable: '', life: '' })
  vis.value = true
}
function openEdit(t: string, r: any) {
  curType.value = t
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.name) {
    ElMessage.warning('请填写必填项')
    return false
  }
  const list: any = { mold: store.molds, tool: store.tools, skill: store.skills }[curType.value]
  if (mode.value === 'add') {
    list.unshift({ id: Date.now().toString(), ...form })
  } else {
    const i = list.findIndex((e: any) => e.id === eid.value)
    if (i > -1) Object.assign(list[i], form)
  }
  return true
}
function del(t: string, id: string) {
  const list: any = { mold: store.molds, tool: store.tools, skill: store.skills }[t]
  const i = list.findIndex((e: any) => e.id === id)
  if (i > -1) list.splice(i, 1)
}
</script>
