<template>
  <gi-page-layout :bordered="true">
    <template #header
      ><SearchSetting :columns="allSearchColumns" storage-key="config-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" /> </SearchSetting
    ></template>
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #protocol="{ row }"
        ><el-tag size="small">{{ row.protocol }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" size="small" @click="editCfg(row)" /></template>
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
  { id: '1', name: '数控车床 CK6150', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.10:4840', interval: '1s' },
  { id: '2', name: '钻床 Z3050', protocol: 'MQTT', address: 'mqtt://192.168.1.11:1883/topics/z3050', interval: '5s' },
  { id: '3', name: '加工中心 VMC850', protocol: 'OPC UA', address: 'opc.tcp://192.168.1.12:4840', interval: '1s' }
])
const cols: TableColumnItem<any>[] = [
  { prop: 'name', label: '设备名称', width: 180 },
  { label: '协议', minWidth: 80, slotName: 'protocol', align: 'center' },
  { prop: 'address', label: '采集地址', minWidth: 280 },
  { prop: 'interval', label: '采集间隔', minWidth: 80, align: 'center' },
  { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
]
function openAdd() {}
function editCfg(_r: any) {}
</script>
