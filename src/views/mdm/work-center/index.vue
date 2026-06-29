<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="work-center-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #status="{ row }"
        ><el-tag :type="row.status === 'running' ? 'success' : row.status === 'idle' ? 'info' : 'danger'" size="small">{{
          row.status === 'running' ? '运行' : row.status === 'idle' ? '空闲' : '维修'
        }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增' : '编辑'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
const s = ref({ keyword: '' })
const sc: FormColumnItem[] = [{ type: 'input', label: '关键字', field: 'keyword' } as any]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
const data = ref([
  { id: '1', code: 'WC00000001', name: '数控车组', workshop: '机加工一车间', capacity: '16h/天', cost: '150元/h' },
  { id: '2', code: 'WC00000002', name: '钻床组', workshop: '机加工一车间', capacity: '8h/天', cost: '80元/h' },
  { id: '3', code: 'WC00000003', name: '磨床组', workshop: '机加工一车间', capacity: '8h/天', cost: '120元/h' },
  { id: '4', code: 'WC00000004', name: '装配组', workshop: '装配车间', capacity: '8h/天', cost: '100元/h' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'code', label: '编码', width: 140 },
  { prop: 'name', label: '名称', width: 120 },
  { prop: 'workshop', label: '车间', width: 140 },
  { prop: 'capacity', label: '日产能', width: 100 },
  { prop: 'cost', label: '工时费率', width: 100 },
  { label: '操作', minWidth: 160, slotName: 'actions', align: 'center' }
]
function openAdd() {}
function openEdit(_r: any) {}
function del(_id: string) {}
</script>
