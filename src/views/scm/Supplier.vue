<template>
  <gi-page-layout :bordered="true">
    <template #tool><gi-button type="add" @click="openAdd" /></template>
    <gi-table :columns="columns" :data="suppliers" border stripe style="height: 100%">
      <template #status="{ row }"
        ><el-tag :type="row.status === 'active' ? 'success' : row.status === 'frozen' ? 'warning' : 'danger'" size="small">{{
          row.status === 'active' ? '正常' : row.status === 'frozen' ? '冻结' : '淘汰'
        }}</el-tag></template
      >
      <template #qualified="{ row }"
        ><el-tag :type="row.qualified ? 'success' : 'info'" size="small">{{ row.qualified ? '合格' : '待审核' }}</el-tag></template
      >
      <template #actions="{ row }"><gi-button type="edit" @click="openEdit(row)" /><gi-button type="delete" @click="del(row.id)" /></template>
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增供应商' : '编辑供应商'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="120" />
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { suppliers as mockSuppliers } from '@/mock'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface S {
  id: string
  code: string
  name: string
  contact: string
  phone: string
  terms: string
  status: string
  qualified: boolean
}
const suppliers = ref<S[]>([
  {
    id: '1',
    code: 'SUP00000001',
    name: 'XX钢材有限公司',
    contact: '周经理',
    phone: '13900000001',
    terms: '月结30天',
    status: 'active',
    qualified: true
  },
  { id: '2', code: 'SUP00000002', name: 'YY轴承制造厂', contact: '吴工', phone: '13900000002', terms: '月结60天', status: 'active', qualified: true },
  {
    id: '3',
    code: 'SUP00000003',
    name: 'ZZ标准件有限公司',
    contact: '郑经理',
    phone: '13900000003',
    terms: '款到发货',
    status: 'active',
    qualified: true
  }
])
const columns: TableColumnItem<S>[] = [
  { prop: 'code', label: '编码', width: 150 },
  { prop: 'name', label: '名称', minWidth: 180 },
  { prop: 'contact', label: '联系人', width: 100 },
  { prop: 'phone', label: '电话', width: 130 },
  { prop: 'terms', label: '付款条款', width: 110 },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { label: '资质', width: 80, slotName: 'qualified', align: 'center' },
  { label: '操作', width: 160, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ code: '', name: '', contact: '', phone: '', terms: '月结30天' })
const formCols: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input', label: '联系人', field: 'contact' },
  { type: 'input', label: '电话', field: 'phone' },
  { type: 'input', label: '付款条款', field: 'terms' }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { code: '', name: '', contact: '', phone: '', terms: '月结30天' })
  vis.value = true
}
function openEdit(r: S) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  ElMessage.success('保存成功')
  return true
}
function del(id: string) {
  ElMessageBox.confirm('确定删除？', '警告', { type: 'warning' })
    .then(() => {
      suppliers.value = suppliers.value.filter((s) => s.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
