<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openCreate" /></template>
    <gi-table :columns="cols" :data="plans" border stripe>
      <template #type="{ row }"><el-tag :type="row.type==='full'?'danger':'warning'" size="small">{{ row.type==='full'?'全面盘点':'循环盘点' }}</el-tag></template>
      <template #status="{ row }"><el-tag :type="row.status==='pending'?'warning':row.status==='running'?'primary':'success'" size="small">{{ row.status==='pending'?'待执行':row.status==='running'?'执行中':'已完成' }}</el-tag></template>
      <template #actions="{ row }">
        <el-button v-if="row.status==='pending'" type="primary" link size="small" @click="startCount(row)">开始盘点</el-button>
        <el-button v-if="row.status==='running'" type="success" link size="small" @click="viewDiff(row)">查看差异</el-button>
      </template>
    </gi-table>
    <el-dialog v-model="execVis" title="盘点执行" width="700px">
      <el-table :data="execItems" border size="small">
        <el-table-column prop="location" label="库位" width="100" />
        <el-table-column prop="material" label="物料" minWidth="140" />
        <el-table-column prop="book_qty" label="账面数" width="80" align="center" />
        <el-table-column label="实盘数" width="120"><template #default="{row}"><el-input-number v-model="row.actual" :min="0" size="small" /></template></el-table-column>
      </el-table>
      <template #footer><el-button @click="execVis=false">保存草稿</el-button><el-button type="primary" @click="submitCount">提交盘点结果</el-button></template>
    </el-dialog>
    <el-dialog v-model="diffVis" title="盘点差异" width="700px">
      <el-table :data="diffItems" border size="small">
        <el-table-column prop="location" label="库位" width="100" />
        <el-table-column prop="material" label="物料" minWidth="140" />
        <el-table-column prop="book_qty" label="账面数" width="80" align="center" />
        <el-table-column prop="actual" label="实盘数" width="80" align="center" />
        <el-table-column label="差异" width="80" align="center"><template #default="{row}"><span :style="{color:row.diff>0?'#f56c6c':row.diff<0?'#67c23a':''}">{{ row.diff>0?'+':'' }}{{ row.diff }}</span></template></el-table-column>
        <el-table-column label="处理方式" width="120"><template #default="{row}"><el-select v-model="row.disposition" size="small"><el-option label="盘盈入库" value="profit" /><el-option label="盘亏出库" value="loss" /><el-option label="不处理" value="ignore" /></el-select></template></el-table-column>
      </el-table>
      <template #footer><el-button @click="diffVis=false">取消</el-button><el-button type="primary" @click="confirmDiff">确认调整</el-button></template>
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';import { ElMessage } from 'element-plus';import type { TableColumnItem } from 'gi-component'
interface Plan { id:string;code:string;warehouse:string;type:string;plan_date:string;executor:string;status:string }
const plans=ref<Plan[]>([{id:'1',code:'PD20250115001',warehouse:'原材料仓',type:'full',plan_date:'2025-01-15',executor:'李四',status:'pending'},{id:'2',code:'PD20250110002',warehouse:'成品仓',type:'cycle',plan_date:'2025-01-10',executor:'王五',status:'completed'}])
const cols:TableColumnItem<Plan>[]=[{prop:'code',label:'计划编号',width:160},{prop:'warehouse',label:'盘点仓库',width:120},{label:'类型',width:80,slotName:'type',align:'center'},{prop:'plan_date',label:'计划日期',width:110},{prop:'executor',label:'执行人',width:80},{label:'状态',width:80,slotName:'status',align:'center'},{label:'操作',width:160,slotName:'actions',align:'center'}]
function openCreate(){}
const execVis=ref(false);const execItems=ref([{location:'A-01-01',material:'45#圆钢 φ50',book_qty:350,actual:350},{location:'A-02-01',material:'泵体铸件',book_qty:120,actual:115},{location:'B-02-03',material:'轴承 6308',book_qty:80,actual:82},{location:'C-01-01',material:'离心泵 XJP-100',book_qty:45,actual:45}])
function startCount(r:Plan){r.status='running';execVis.value=true}
function submitCount(){const p=plans.value.find(p=>p.status==='running');if(p)p.status='completed';execVis.value=false;ElMessage.success('盘点提交成功')}
const diffVis=ref(false);const diffItems=ref([{location:'A-02-01',material:'泵体铸件',book_qty:120,actual:115,diff:-5,disposition:'loss'},{location:'B-02-03',material:'轴承 6308',book_qty:80,actual:82,diff:2,disposition:'profit'}])
function viewDiff(_r:Plan){diffVis.value=true}
function confirmDiff(){diffVis.value=false;ElMessage.success('差异已调整')}
</script>
