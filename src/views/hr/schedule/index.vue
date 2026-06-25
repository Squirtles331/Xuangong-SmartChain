<template>
  <gi-page-layout :bordered="true">
    <gi-table :columns="cols" :data="data" border stripe size="small">
      <template #shift="{ row }"><el-tag :type="row.shift==='day'?'warning':row.shift==='night'?'primary':'info'" size="small">{{ row.shift==='day'?'白班':row.shift==='night'?'夜班':'中班' }}</el-tag></template>
    </gi-table>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'
const data=ref([{id:'1',team:'甲班',shift:'day',members:'李四,王五,赵六',leader:'李四'},{id:'2',team:'乙班',shift:'night',members:'孙八,周九,吴十',leader:'孙八'}])
const cols:TableColumnItem<any>[]=[{prop:'team',label:'班组',width:80},{label:'班次',width:60,slotName:'shift',align:'center'},{prop:'members',label:'成员',minWidth:180},{prop:'leader',label:'班组长',width:80}]
</script>
