<template>
  <gi-page-layout :bordered="true">
    <template #header>
      <gi-form ref="searchFormRef" v-model="searchForm" :columns="searchColumns" search @search="handleSearch" @reset="handleReset" />
    </template>
    <template #tool>
      <gi-button type="add" @click="$router.push('/ecn/create')">新建变更单</gi-button>
    </template>

    <gi-table :columns="columns" :data="pagedEcns" :pagination="pagination" border stripe style="height: 100%">
      <template #urgency="{ row }">
        <el-tag v-if="row.urgency === 'urgent'" type="danger" size="small">紧急</el-tag>
        <el-tag v-else-if="row.urgency === 'normal'" type="warning" size="small">普通</el-tag>
        <el-tag v-else size="small">计划性</el-tag>
      </template>
      <template #status="{ row }">
        <el-tag v-if="row.status === 'draft'" type="info" size="small">草稿</el-tag>
        <el-tag v-else-if="row.status === 'approved'" type="primary" size="small">已审批</el-tag>
        <el-tag v-else-if="row.status === 'executed'" type="success" size="small">已执行</el-tag>
        <el-tag v-else-if="row.status === 'verified'" type="success" size="small">已验证</el-tag>
        <el-tag v-else type="info" size="small">已关闭</el-tag>
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="viewImpact(row)">影响分析</el-button>
        <el-button v-if="row.status === 'draft'" type="primary" link size="small" @click="submitEcn(row)">提交审批</el-button>
        <el-button v-if="row.status === 'approved'" type="success" link size="small" @click="executeEcn(row)">执行</el-button>
      </template>
    </gi-table>

    <!-- 影响分析弹窗 -->
    <el-dialog v-model="impactVisible" title="ECN 影响分析报告" width="800px">
      <el-descriptions :column="2" border style="margin-bottom: 16px">
        <el-descriptions-item label="变更单号">{{ impactData.code }}</el-descriptions-item>
        <el-descriptions-item label="变更对象">{{ impactData.material }}</el-descriptions-item>
        <el-descriptions-item label="变更类型">{{ impactData.change_type }}</el-descriptions-item>
        <el-descriptions-item label="当前版本">{{ impactData.current_version }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="impactData.items" border>
        <el-table-column prop="dimension" label="影响维度" width="120" />
        <el-table-column prop="detail" label="详情" />
        <el-table-column prop="count" label="数量" width="80" align="center" />
      </el-table>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'

interface ECN {
  id: string; code: string; change_type: string; material: string; current_version: string
  status: string; urgency: string; applicant: string; created_at: string
}

const ecns = ref<ECN[]>([
  { id: '1', code: 'ECN202501150001', change_type: 'BOM变更', material: '离心泵 XJP-100', current_version: 'MBOM V1.2', status: 'draft', urgency: 'urgent', applicant: '张工', created_at: '2025-01-15' },
  { id: '2', code: 'ECN202501120002', change_type: '工艺变更', material: '齿轮箱 GBX-200', current_version: '标准工艺 V1.0', status: 'approved', urgency: 'normal', applicant: '李工', created_at: '2025-01-12' },
  { id: '3', code: 'ECN202501080003', change_type: 'BOM+工艺变更', material: '传动轴 DS-50', current_version: 'MBOM V1.1', status: 'executed', urgency: 'planned', applicant: '王工', created_at: '2025-01-08' },
  { id: '4', code: 'ECN202501020004', change_type: 'BOM变更', material: '离心泵 XJP-200', current_version: 'MBOM V1.0', status: 'verified', urgency: 'normal', applicant: '张工', created_at: '2025-01-02' }
])

const searchForm = reactive({ keyword: '', status: '' })
const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword' } as any,
  { type: 'select-v2', label: '状态', field: 'status', props: { options: [{ label: '全部', value: '' }, { label: '草稿', value: 'draft' }, { label: '已审批', value: 'approved' }, { label: '已执行', value: 'executed' }, { label: '已验证', value: 'verified' }] } } as any
]

const columns: TableColumnItem<ECN>[] = [
  { prop: 'code', label: '变更单号', width: 170 },
  { prop: 'change_type', label: '变更类型', width: 130 },
  { prop: 'material', label: '变更对象', minWidth: 160 },
  { prop: 'current_version', label: '当前版本', width: 120 },
  { label: '紧急程度', width: 80, slotName: 'urgency', align: 'center' },
  { label: '状态', width: 80, slotName: 'status', align: 'center' },
  { prop: 'applicant', label: '申请人', width: 80 },
  { prop: 'created_at', label: '日期', width: 110 },
  { label: '操作', width: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const filteredEcns = computed(() => ecns.value.filter(e => {
  if (searchForm.keyword && !e.material.includes(searchForm.keyword) && !e.code.includes(searchForm.keyword)) return false
  if (searchForm.status && e.status !== searchForm.status) return false
  return true
}))
const pagedEcns = computed(() => { pagination.total = filteredEcns.value.length; return filteredEcns.value.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize) })

function handleSearch() { pagination.currentPage = 1 }
function handleReset() { searchForm.keyword = ''; searchForm.status = ''; pagination.currentPage = 1 }

const impactVisible = ref(false)
const impactData = reactive({ code: '', material: '', change_type: '', current_version: '', items: [] as any[] })

function viewImpact(row: ECN) {
  impactData.code = row.code; impactData.material = row.material; impactData.change_type = row.change_type; impactData.current_version = row.current_version
  impactData.items = [
    { dimension: '在制工单', detail: 'WO202501150001 离心泵 XJP-100 (生产中, 在制45台)', count: 1 },
    { dimension: '库存', detail: '旧版物料"泵体铸件(旧)"库存 120件', count: 120 },
    { dimension: '在途采购', detail: 'PO202501100008 泵体铸件 200件 (预计1月20日到货)', count: 200 },
    { dimension: '下游产品', detail: '被"供水系统 XJ-SYS"引用', count: 1 }
  ]
  impactVisible.value = true
}

function submitEcn(row: ECN) { row.status = 'approved'; ElMessage.success('已提交审批') }
function executeEcn(row: ECN) { row.status = 'executed'; ElMessage.success('变更已执行') }
</script>
