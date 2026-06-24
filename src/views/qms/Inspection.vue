<template>
  <gi-page-layout :bordered="true">
    <el-tabs v-model="tab">
      <el-tab-pane label="质检任务" name="task">
        <gi-table :columns="taskCols" :data="tasks" border stripe style="height: 100%">
          <template #status="{ row }"
            ><el-tag v-if="row.status === 'pending'" type="warning" size="small">待检</el-tag
            ><el-tag v-else-if="row.status === 'done'" type="success" size="small">已完成</el-tag></template
          >
          <template #actions="{ row }"
            ><el-button v-if="row.status === 'pending'" type="primary" link size="small" @click="inspect(row)">检验</el-button></template
          >
        </gi-table>
      </el-tab-pane>
      <el-tab-pane label="质检模板" name="template">
        <gi-table :columns="tplCols" :data="templates" border stripe size="small">
          <template #actions="{ row }"><gi-button type="edit" size="small" @click="editTpl(row)" /></template>
        </gi-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="iv" title="执行检验" width="700px">
      <el-descriptions :column="2" border
        ><el-descriptions-item label="任务编号">{{ ic?.code }}</el-descriptions-item
        ><el-descriptions-item label="物料">{{ ic?.material }}</el-descriptions-item
        ><el-descriptions-item label="批号">{{ ic?.lot }}</el-descriptions-item
        ><el-descriptions-item label="数量">{{ ic?.qty }}</el-descriptions-item></el-descriptions
      >
      <el-table :data="items" border style="margin-top: 16px"
        ><el-table-column prop="name" label="检验项目" width="140" /><el-table-column prop="standard" label="标准值" width="140" /><el-table-column
          label="实测值"
          width="140"
          ><template #default="{ row }"><el-input v-model="row.value" size="small" /></template></el-table-column
        ><el-table-column label="判定" width="100"
          ><template #default="{ row }"
            ><el-tag :type="row.value ? (Math.abs(Number(row.value) - Number(row.standard)) < 0.5 ? 'success' : 'danger') : 'info'" size="small">{{
              row.value ? (Math.abs(Number(row.value) - Number(row.standard)) < 0.5 ? '合格' : '不合格') : '-'
            }}</el-tag></template
          ></el-table-column
        ></el-table
      >
      <div style="margin-top: 16px">
        <el-radio-group v-model="ir"
          ><el-radio value="qualified">合格</el-radio><el-radio value="concession">让步接收</el-radio><el-radio value="sorting">挑选使用</el-radio
          ><el-radio value="return">退货</el-radio><el-radio value="scrap">报废</el-radio></el-radio-group
        >
      </div>
      <template #footer><el-button @click="iv = false">取消</el-button><el-button type="primary" @click="submitInspect">提交</el-button></template>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'

interface T {
  id: string
  code: string
  type: string
  material: string
  lot: string
  qty: number
  status: string
}
const tasks = ref<T[]>([
  { id: '1', code: 'IQC-20250115001', type: '来料检验', material: '45#圆钢 φ50', lot: 'L20250101', qty: 500, status: 'pending' },
  { id: '2', code: 'IPQC-20250115002', type: '过程检验', material: '离心泵 XJP-100', lot: 'WO202501150001', qty: 45, status: 'pending' },
  { id: '3', code: 'IQC-20250114003', type: '来料检验', material: '轴承 6308', lot: 'L20241215', qty: 200, status: 'done' }
])
const taskCols: TableColumnItem<T>[] = [
  { prop: 'code', label: '任务编号', width: 170 },
  { prop: 'type', label: '类型', width: 100 },
  { prop: 'material', label: '物料', minWidth: 140 },
  { prop: 'lot', label: '批号', width: 160 },
  { prop: 'qty', label: '数量', width: 80, align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { label: '操作', width: 80, slotName: 'actions', align: 'center' }
]

const templates = ref([
  { id: '1', name: '钢材来料检验标准', category: '原材料', items: 8 },
  { id: '2', name: '泵类成品检验标准', category: '成品', items: 12 }
])
const tplCols: TableColumnItem<any>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'name', label: '模板名称', minWidth: 200 },
  { prop: 'category', label: '适用分类', width: 120 },
  { prop: 'items', label: '检验项目数', width: 110, align: 'center' },
  { label: '操作', width: 100, slotName: 'actions', align: 'center' }
]

const tab = ref('task')
const iv = ref(false)
const ic = ref<T | null>(null)
const ir = ref('qualified')
const items = ref([
  { name: '外径', standard: '50', value: '' },
  { name: '硬度', standard: '45', value: '' },
  { name: '外观', standard: '无裂纹', value: '' }
])

function inspect(row: T) {
  ic.value = row
  iv.value = true
}
function submitInspect() {
  if (ic.value) ic.value.status = 'done'
  iv.value = false
  ElMessage.success(`检验完成: ${ir.value}`)
}
function editTpl(_r: any) {
  ElMessage.info('编辑模板(功能待完善)')
}
</script>
