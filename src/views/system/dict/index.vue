<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>
    <template #tool>
      <gi-button type="add" @click="openAddType" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="typeColumns" :data="pagedTypes" :pagination="pagination" border style="height: 100%">
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEditType(row)" />
        <gi-button type="delete" @click="deleteType(row.id)" />
        <el-button type="primary" link size="small" @click="openItems(row)">字典项</el-button>
      </template>
    </gi-table>

    <!-- 字典类型弹窗 -->
    <gi-dialog v-model="typeDialogVisible" :footer="true" :on-before-ok="submitTypeDialog" :title="typeDialogMode === 'add' ? '新增字典类型' : '编辑字典类型'">
      <gi-form v-model="typeForm" :columns="typeFormColumns" :label-width="100" />
    </gi-dialog>

    <!-- 字典项管理弹窗 -->
    <gi-dialog v-model="itemDialogVisible" :footer="false" :title="`字典项管理 — ${currentType?.name || ''}`" width="800px" @close="closeItemDialog">
      <div class="dict-items-header">
        <gi-button type="add" size="small" @click="openAddItem">新增字典项</gi-button>
      </div>
      <gi-table :columns="itemColumns" :data="currentItems" border size="small" style="margin-top: 12px">
        <template #status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '禁用' }}</el-tag>
        </template>
        <template #itemActions="{ row }">
          <gi-button type="edit" size="small" @click="openEditItem(row)" />
          <gi-button type="delete" size="small" @click="deleteItem(row.id)" />
        </template>
      </gi-table>

      <!-- 字典项弹窗 -->
      <gi-dialog v-model="itemFormVisible" :footer="true" :on-before-ok="submitItemDialog" :title="itemDialogMode === 'add' ? '新增字典项' : '编辑字典项'" width="500px">
        <gi-form v-model="itemForm" :columns="itemFormColumns" :label-width="100" />
      </gi-dialog>
    </gi-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import type { DictType, DictItem } from '@/api/system'

// ==================== Mock 数据 ====================
const dictTypes = ref<DictType[]>([
  { id: '1', code: 'work_order_priority', name: '工单优先级', description: '工单的优先级等级', status: 'active' },
  { id: '2', code: 'work_order_status', name: '工单状态', description: '工单生命周期状态', status: 'active' },
  { id: '3', code: 'defect_reason', name: '不良原因', description: '生产报工时的不良原因选项', status: 'active' },
  { id: '4', code: 'material_type', name: '物料类型', description: '物料的制造/采购分类', status: 'active' },
  { id: '5', code: 'warehouse_type', name: '仓库类型', description: '仓库的分类', status: 'active' },
  { id: '6', code: 'equipment_status', name: '设备状态', description: '设备生命周期状态', status: 'active' },
  { id: '7', code: 'customer_type', name: '客户类型', description: '企业/个人', status: 'active' },
  { id: '8', code: 'payment_method', name: '回款方式', description: '回款支付方式', status: 'active' },
  { id: '9', code: 'exception_type', name: '异常类型', description: '生产异常分类', status: 'active' },
  { id: '10', code: 'inspection_result', name: '质检判定', description: '来料/过程/最终检验判定结论', status: 'active' }
])

const dictItemsMap = ref<Record<string, DictItem[]>>({
  '1': [
    { id: '101', dict_type_id: '1', code: 'urgent', name: '紧急', sort_order: 1, css_class: 'danger', status: 'active' },
    { id: '102', dict_type_id: '1', code: 'high', name: '高', sort_order: 2, css_class: 'warning', status: 'active' },
    { id: '103', dict_type_id: '1', code: 'normal', name: '普通', sort_order: 3, css_class: '', status: 'active' },
    { id: '104', dict_type_id: '1', code: 'low', name: '低', sort_order: 4, css_class: 'info', status: 'active' }
  ],
  '2': [
    { id: '201', dict_type_id: '2', code: 'draft', name: '草稿', sort_order: 1, css_class: 'info', status: 'active' },
    { id: '202', dict_type_id: '2', code: 'approved', name: '已审批', sort_order: 2, css_class: '', status: 'active' },
    { id: '203', dict_type_id: '2', code: 'released', name: '已下发', sort_order: 3, css_class: 'warning', status: 'active' },
    { id: '204', dict_type_id: '2', code: 'in_progress', name: '生产中', sort_order: 4, css_class: '', status: 'active' },
    { id: '205', dict_type_id: '2', code: 'completed', name: '已完工', sort_order: 5, css_class: 'success', status: 'active' },
    { id: '206', dict_type_id: '2', code: 'closed', name: '已关闭', sort_order: 6, css_class: 'info', status: 'active' }
  ],
  '3': [
    { id: '301', dict_type_id: '3', code: 'dimension', name: '尺寸超差', sort_order: 1, css_class: '', status: 'active' },
    { id: '302', dict_type_id: '3', code: 'appearance', name: '外观缺陷', sort_order: 2, css_class: '', status: 'active' },
    { id: '303', dict_type_id: '3', code: 'material', name: '材质问题', sort_order: 3, css_class: '', status: 'active' },
    { id: '304', dict_type_id: '3', code: 'equipment', name: '设备精度', sort_order: 4, css_class: '', status: 'active' },
    { id: '305', dict_type_id: '3', code: 'operation', name: '操作失误', sort_order: 5, css_class: '', status: 'active' }
  ]
})

// ==================== 搜索 ====================
const searchForm = reactive({ keyword: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '字典编码/名称', clearable: true } as any }
]

// ==================== 字典类型表格 ====================
const typeColumns: TableColumnItem<DictType>[] = [
  { type: 'index', label: '#', width: 60 },
  { prop: 'code', label: '字典编码', minWidth: 180 },
  { prop: 'name', label: '字典名称', minWidth: 140 },
  { prop: 'description', label: '描述', minWidth: 200 },
  { label: '状态', width: 100, slotName: 'status' },
  { label: '操作', width: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })

const filteredTypes = computed(() => {
  const kw = searchForm.keyword?.toLowerCase() || ''
  return kw ? dictTypes.value.filter(t => t.code.toLowerCase().includes(kw) || t.name.toLowerCase().includes(kw)) : dictTypes.value
})

const pagedTypes = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  pagination.total = filteredTypes.value.length
  return filteredTypes.value.slice(start, start + pagination.pageSize)
})

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { searchForm.keyword = ''; pagination.currentPage = 1 }
function refresh() { handleReset() }

// ==================== 字典类型 CRUD ====================
const typeDialogVisible = ref(false)
const typeDialogMode = ref<'add' | 'edit'>('add')
const editingTypeId = ref('')
const typeForm = reactive({ code: '', name: '', description: '' })
const typeFormColumns: FormColumnItem[] = [
  { type: 'input', label: '字典编码', field: 'code', required: true, props: { placeholder: '如 work_order_priority' } as any },
  { type: 'input', label: '字典名称', field: 'name', required: true, props: { placeholder: '如 工单优先级' } as any },
  { type: 'input', label: '描述', field: 'description', props: { type: 'textarea', rows: 2 } as any }
]

function openAddType() {
  typeDialogMode.value = 'add'
  typeForm.code = ''; typeForm.name = ''; typeForm.description = ''
  typeDialogVisible.value = true
}

function openEditType(row: DictType) {
  typeDialogMode.value = 'edit'
  editingTypeId.value = row.id
  typeForm.code = row.code; typeForm.name = row.name; typeForm.description = row.description
  typeDialogVisible.value = true
}

async function submitTypeDialog() {
  if (!typeForm.code || !typeForm.name) { ElMessage.warning('请填写必填项'); return false }
  if (typeDialogMode.value === 'add') {
    dictTypes.value.unshift({ id: Date.now().toString(), ...typeForm, status: 'active' })
    ElMessage.success('新增成功')
  } else {
    const idx = dictTypes.value.findIndex(t => t.id === editingTypeId.value)
    if (idx > -1) Object.assign(dictTypes.value[idx], typeForm)
    ElMessage.success('编辑成功')
  }
  return true
}

function deleteType(id: string) {
  ElMessageBox.confirm('删除字典类型将同时删除其下所有字典项，确定删除？', '警告', { type: 'warning' }).then(() => {
    dictTypes.value = dictTypes.value.filter(t => t.id !== id)
    delete dictItemsMap.value[id]
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// ==================== 字典项管理 ====================
const itemDialogVisible = ref(false)
const currentType = ref<DictType | null>(null)
const currentItems = ref<DictItem[]>([])
const itemFormVisible = ref(false)
const itemDialogMode = ref<'add' | 'edit'>('add')
const editingItemId = ref('')
const itemForm = reactive({ code: '', name: '', sort_order: 1, css_class: '' })
const itemFormColumns: FormColumnItem[] = [
  { type: 'input', label: '编码', field: 'code', required: true },
  { type: 'input', label: '名称', field: 'name', required: true },
  { type: 'input-number', label: '排序', field: 'sort_order', props: { min: 1 } as any },
  { type: 'select-v2', label: '标签样式', field: 'css_class', props: { options: [{ label: '无', value: '' }, { label: '红色(danger)', value: 'danger' }, { label: '橙色(warning)', value: 'warning' }, { label: '绿色(success)', value: 'success' }, { label: '灰色(info)', value: 'info' }] } as any }
]

// 在 typeColumns 里加点击行事件——这里用操作列方式：加一个"管理字典项"按钮
// 简单实现：双击类型行打开字典项管理
function openItems(row: DictType) {
  currentType.value = row
  currentItems.value = dictItemsMap.value[row.id] || []
  itemDialogVisible.value = true
}

// 覆盖 typeColumns 添加管理入口
typeColumns.splice(4, 0, { label: '字典项', width: 120, slotName: 'itemCount', align: 'center' })

// 在模板里用 #itemCount slot 显示
// 实际上更简单的做法是直接在操作列加按钮
typeColumns[typeColumns.length - 1] = {
  label: '操作', width: 300, fixed: 'right', slotName: 'actions', align: 'center'
} as any

// 需要重新定义 actions slot 逻辑...太绕了，直接换个方案：
// 在 gi-table 上加 row-click 事件不支持。最简单：在操作列加"管理字典项"按钮

// 简化：把 typeColumns 最后一个换成含三个按钮的
// 但 gi-table 的 actions slot 已经写好了，直接在里面加按钮即可
// 我已经在 template 里用了 #actions，让我直接在模板里加上第三个按钮

function openAddItem() { itemDialogMode.value = 'add'; itemForm.code = ''; itemForm.name = ''; itemForm.sort_order = 1; itemForm.css_class = ''; itemFormVisible.value = true }
function openEditItem(row: DictItem) { itemDialogMode.value = 'edit'; editingItemId.value = row.id; itemForm.code = row.code; itemForm.name = row.name; itemForm.sort_order = row.sort_order; itemForm.css_class = row.css_class || ''; itemFormVisible.value = true }

async function submitItemDialog() {
  if (!itemForm.code || !itemForm.name) { ElMessage.warning('请填写必填项'); return false }
  if (itemDialogMode.value === 'add') {
    currentItems.value.push({ id: Date.now().toString(), dict_type_id: currentType.value!.id, ...itemForm, status: 'active' })
    ElMessage.success('新增成功')
  } else {
    const idx = currentItems.value.findIndex(i => i.id === editingItemId.value)
    if (idx > -1) Object.assign(currentItems.value[idx], itemForm)
    ElMessage.success('编辑成功')
  }
  dictItemsMap.value[currentType.value!.id] = currentItems.value
  return true
}

function deleteItem(id: string) {
  ElMessageBox.confirm('确定删除该字典项？', '提示', { type: 'warning' }).then(() => {
    currentItems.value = currentItems.value.filter(i => i.id !== id)
    dictItemsMap.value[currentType.value!.id] = currentItems.value
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function closeItemDialog() { currentType.value = null; currentItems.value = [] }

const itemColumns: TableColumnItem<DictItem>[] = [
  { type: 'index', label: '#', width: 50 },
  { prop: 'code', label: '编码', width: 140 },
  { prop: 'name', label: '名称', width: 140 },
  { prop: 'sort_order', label: '排序', width: 80, align: 'center' },
  { prop: 'css_class', label: '样式', width: 100 },
  { label: '状态', width: 80, slotName: 'status' },
  { label: '操作', width: 160, slotName: 'itemActions', align: 'center' }
]
</script>

<style scoped lang="scss">
.dict-items-header {
  display: flex;
  justify-content: flex-end;
}
</style>
