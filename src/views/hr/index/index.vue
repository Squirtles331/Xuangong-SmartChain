<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="员工管理" name="employee">
        <gi-table :columns="empCols" :data="employees" border stripe size="small">
          <template #status="{ row }"><el-tag :type="row.status==='active'?'success':'info'" size="small">{{ row.status==='active'?'在职':'离职' }}</el-tag></template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="考勤记录" name="attendance">
        <gi-table :columns="attCols" :data="attendances" border stripe size="small">
          <template #result="{ row }"><el-tag :type="row.result==='normal'?'success':row.result==='late'?'warning':'danger'" size="small">{{ row.result==='normal'?'正常':row.result==='late'?'迟到':'旷工' }}</el-tag></template>
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="班组排班" name="schedule">
        <gi-table :columns="schCols" :data="schedules" border stripe size="small">
          <template #shift="{ row }"><el-tag :type="row.shift==='day'?'warning':row.shift==='night'?'primary':'info'" size="small">{{ row.shift==='day'?'白班':row.shift==='night'?'夜班':'中班' }}</el-tag></template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';import type { TableColumnItem } from 'gi-component'

const tab=ref('employee')
const employees=ref([{id:'1',code:'E00000001',name:'李四',department:'机加工一车间',position:'数控操作工',phone:'13800000001',hire_date:'2022-03-01',status:'active'},{id:'2',code:'E00000002',name:'王五',department:'机加工一车间',position:'钻床操作工',phone:'13800000002',hire_date:'2023-06-15',status:'active'},{id:'3',code:'E00000003',name:'赵六',department:'装配车间',position:'装配钳工',phone:'13800000003',hire_date:'2021-09-01',status:'active'},{id:'4',code:'E00000004',name:'孙八',department:'机加工二车间',position:'加工中心操作工',phone:'13800000004',hire_date:'2024-01-10',status:'active'}])
const empCols:TableColumnItem<any>[]=[{prop:'code',label:'工号',width:120},{prop:'name',label:'姓名',width:80},{prop:'department',label:'部门',width:140},{prop:'position',label:'岗位',width:140},{prop:'phone',label:'电话',width:130},{prop:'hire_date',label:'入职日期',width:110},{label:'状态',width:60,slotName:'status',align:'center'}]
const attendances=ref([{id:'1',employee:'李四',date:'2025-01-15',clock_in:'07:50',clock_out:'17:05',result:'normal'},{id:'2',employee:'王五',date:'2025-01-15',clock_in:'08:15',clock_out:'17:00',result:'late'},{id:'3',employee:'赵六',date:'2025-01-15',clock_in:'07:55',clock_out:'17:10',result:'normal'}])
const attCols:TableColumnItem<any>[]=[{prop:'employee',label:'员工',width:80},{prop:'date',label:'日期',width:110},{prop:'clock_in',label:'上班打卡',width:100},{prop:'clock_out',label:'下班打卡',width:100},{label:'结果',width:60,slotName:'result',align:'center'}]
const schedules=ref([{id:'1',team:'甲班',shift:'day',members:'李四,王五,赵六',leader:'李四'},{id:'2',team:'乙班',shift:'night',members:'孙八,周九,吴十',leader:'孙八'}])
const schCols:TableColumnItem<any>[]=[{prop:'team',label:'班组',width:80},{label:'班次',width:60,slotName:'shift',align:'center'},{prop:'members',label:'成员',minWidth:180},{prop:'leader',label:'班组长',width:80}]
</script>
