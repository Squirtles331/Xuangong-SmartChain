<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="purchase-request-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" :columns="sc" search @search="hs" @reset="hr" />
    </template>
    <template #tool>
      <gi-button type="add" @click="openAdd">手动创建</gi-button>
      <el-button style="margin-left: 8px" type="primary" @click="$router.push('/mrp/result')">从MRP生成</el-button>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>
    <gi-table :columns="cols" :data="pd" :pagination="p" border stripe>
      <template #status="{ row }">
        <el-tag
          :type="row.status === 'draft' ? 'info' : row.status === 'approved' ? 'primary' : row.status === 'ordered' ? 'success' : 'warning'"
          size="small"
        >
          {{ row.status === 'draft' ? '草稿' : row.status === 'approved' ? '已审批' : row.status === 'ordered' ? '已转订单' : '已驳回' }}
        </el-tag>
      </template>
      <template #source="{ row }">
        <el-tag :type="row.source === 'mrp' ? 'primary' : 'info'" size="small">{{ row.source === 'mrp' ? 'MRP' : '手动' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitApprove(row)">提交审批</el-button>
        <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="convertToPO(row)">转采购订单</el-button>
        <gi-button type="edit" @click="openEdit(row)" />
        <gi-button v-if="row.status === 'draft'" type="delete" @click="del(row.id)" />
      </template>
    </gi-table>

    <!-- 采购申请弹窗 -->
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新建采购申请' : '编辑采购申请'" width="700px">
      <SearchSetting :columns="allSearchColumns" storage-key="purchase-request-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" v-model="form" :columns="formCols" :label-width="100" />
      <el-divider />
      <div class="lines-header"><strong>申请明细</strong><el-button type="primary" size="small" @click="addLine">+ 添加物料</el-button></div>
      <el-table :data="lines" border size="small" style="margin-top: 8px">
        <el-table-column prop="material" label="物料编码/名称" minWidth="200">
          <template #default="{ row }"><el-input v-model="row.material" size="small" placeholder="搜索选择物料" /></template>
        </el-table-column>
        <el-table-column prop="qty" label="数量" width="100">
          <template #default="{ row }"><el-input-number v-model="row.qty" :min="1" size="small" /></template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" />
        <el-table-column prop="need_date" label="需求日期" width="130">
          <template #default="{ row }"><el-date-picker v-model="row.need_date" size="small" type="date" /></template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template #default="{ $index }"><el-button type="danger" link size="small" @click="lines.splice($index, 1)">删除</el-button></template>
        </el-table-column>
      </el-table>
    </gi-dialog>

    <!-- 转采购订单弹窗 -->
    <el-dialog v-model="poVis" title="生成采购订单" width="600px">
      <el-descriptions :column="2" border
        ><el-descriptions-item label="申请单号">{{ currentPR?.code }}</el-descriptions-item
        ><el-descriptions-item label="申请部门">{{ currentPR?.dept }}</el-descriptions-item></el-descriptions
      >
      <el-form label-width="100px" style="margin-top: 16px">
        <el-form-item label="供应商" required
          ><el-select v-model="poForm.supplier" style="width: 100%"><el-option v-for="s in suppliers" :key="s" :label="s" :value="s" /></el-select
        ></el-form-item>
        <el-form-item label="交货日期" required><el-date-picker v-model="poForm.delivery" style="width: 100%" /></el-form-item>
        <el-form-item label="付款条款"
          ><el-select v-model="poForm.terms" style="width: 100%"
            ><el-option label="月结30天" value="30" /><el-option label="月结60天" value="60" /><el-option label="款到发货" value="0" /></el-select
        ></el-form-item>
      </el-form>
      <template #footer><el-button @click="poVis = false">取消</el-button><el-button type="primary" @click="confirmPO">确认生成</el-button></template>
    </el-dialog>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import SearchSetting from '@/components/SearchSetting.vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface PR {
  id: string
  code: string
  dept: string
  reason: string
  need_date: string
  status: string
  source: string
  created_at: string
}
const prs = ref<PR[]>([
  {
    id: '1',
    code: 'PR202501150001',
    dept: '生产部',
    reason: '生产需求',
    need_date: '2025-01-20',
    status: 'draft',
    source: 'manual',
    created_at: '2025-01-15'
  },
  {
    id: '2',
    code: 'PR202501150002',
    dept: '生产部',
    reason: '安全库存补货',
    need_date: '2025-01-22',
    status: 'approved',
    source: 'mrp',
    created_at: '2025-01-15'
  },
  {
    id: '3',
    code: 'PR202501100003',
    dept: '设备部',
    reason: '设备维修',
    need_date: '2025-01-18',
    status: 'ordered',
    source: 'manual',
    created_at: '2025-01-10'
  }
])
const s = reactive({ code: '', status: '', source: '' })
const sc: FormColumnItem[] = [
  { type: 'input', label: '申请编号', field: 'code' } as any,
  {
    type: 'select-v2',
    label: '状态',
    field: 'status',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: '草稿', value: 'draft' },
        { label: '已审批', value: 'approved' },
        { label: '已转订单', value: 'ordered' },
        { label: '已驳回', value: 'rejected' }
      ]
    }
  } as any,
  {
    type: 'select-v2',
    label: '来源',
    field: 'source',
    props: {
      options: [
        { label: '全部', value: '' },
        { label: 'MRP', value: 'mrp' },
        { label: '手动', value: 'manual' }
      ]
    }
  } as any
]
const cols: TableColumnItem<PR>[] = [
  { prop: 'code', label: '申请编号', width: 160 },
  { prop: 'dept', label: '申请部门', width: 100 },
  { prop: 'reason', label: '申请原因', width: 130 },
  { prop: 'need_date', label: '需求日期', width: 110 },
  { label: '来源', minWidth: 70, slotName: 'source', align: 'center' },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { prop: 'created_at', label: '创建时间', width: 110 },
  { label: '操作', minWidth: 250, fixed: 'right', slotName: 'actions', align: 'center' }
]
const p = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const fd = computed(() =>
  prs.value.filter((r) => (!s.code || r.code.includes(s.code)) && (!s.status || r.status === s.status) && (!s.source || r.source === s.source))
)
const pd = computed(() => fd.value.slice((p.currentPage - 1) * p.pageSize, p.currentPage * p.pageSize))
watch(
  fd,
  (v) => {
    p.total = v.length
  },
  { immediate: true }
)
function hs() {
  p.currentPage = 1
}
function hr() {
  s.code = ''
  s.status = ''
  s.source = ''
  p.currentPage = 1
}
function handleExport() {
  ElMessage.success('导出成功')
}
function refresh() {
  hr()
}

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ dept: '生产部', reason: '生产需求', need_date: '', remark: '' })
const formCols: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '申请部门',
    field: 'dept',
    required: true,
    props: {
      options: [
        { label: '生产部', value: '生产部' },
        { label: '设备部', value: '设备部' },
        { label: '研发部', value: '研发部' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '申请原因',
    field: 'reason',
    required: true,
    props: {
      options: [
        { label: '生产需求', value: '生产需求' },
        { label: '安全库存补货', value: '安全库存补货' },
        { label: '研发试制', value: '研发试制' },
        { label: '设备维修', value: '设备维修' },
        { label: '其他', value: '其他' }
      ]
    } as any
  },
  { type: 'date-picker', label: '需求日期', field: 'need_date', required: true },
  { type: 'input', label: '备注', field: 'remark', props: { type: 'textarea', rows: 2 } as any }
]
const lines = ref([{ material: '', qty: 1, unit: '', need_date: '' }])
function addLine() {
  lines.value.push({ material: '', qty: 1, unit: '', need_date: '' })
}
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { dept: '生产部', reason: '生产需求', need_date: '', remark: '' })
  lines.value = [{ material: '', qty: 1, unit: '', need_date: '' }]
  vis.value = true
}
function openEdit(r: PR) {
  mode.value = 'edit'
  eid.value = r.id
  vis.value = true
}
async function submit() {
  if (!form.need_date) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    prs.value.unshift({
      id: Date.now().toString(),
      code: 'PR' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + String(prs.value.length + 1).padStart(4, '0'),
      ...form,
      status: 'draft',
      source: 'manual',
      created_at: new Date().toISOString().slice(0, 10)
    } as PR)
  }
  return true
}
function del(id: string) {
  ElMessageBox.confirm(\'确定删除？\', \'警告\', { type: \'warning\' }).then(() => {
  prs.value = prs.value.filter((r) => r.id !== id)
}
function submitApprove(r: PR) {
  r.status = 'approved'
  ElMessage.success('已提交审批')
}

const poVis = ref(false)
const currentPR = ref<PR | null>(null)
const poForm = reactive({ supplier: 'XX钢材有限公司', delivery: '', terms: '30' })
const suppliers = ['XX钢材有限公司', 'YY轴承制造厂', 'ZZ标准件有限公司', 'AA铸件有限公司']
function convertToPO(r: PR) {
  currentPR.value = r
  poVis.value = true
}
function confirmPO() {
  if (currentPR.value) currentPR.value.status = 'ordered'
  poVis.value = false
  ElMessage.success('已生成采购订单 PO' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '001')
}
</script>
<style scoped>
.lines-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}
</style>
