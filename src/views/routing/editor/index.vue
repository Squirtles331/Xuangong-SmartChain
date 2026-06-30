<template>
  <gi-page-layout>
    <template #header>
      <div class="editor-header">
        <h2>工艺路线 — {{ routingTitle }}</h2>
        <div>
          <el-button type="primary" @click="saveRouting">💾 保存</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </div>
    </template>

    <div class="routing-container">
      <!-- 工序列表 -->
      <div class="ops-panel">
        <div class="ops-toolbar">
          <el-button type="primary" size="small" @click="addOp">+ 添加工序</el-button>
          <span style="margin-left: 12px; color: #909399; font-size: 13px"
            >总标准工时: {{ totalHours }}min | 总准备工时: {{ totalSetup }}min | 含排队/转移: {{ totalWithQueue }}min</span
          >
        </div>
        <div class="ops-list">
          <div v-for="(op, idx) in operations" :key="op.id" class="op-item" :class="{ active: currentOp?.id === op.id }" @click="selectOp(op)">
            <div class="op-header">
              <span class="op-no">工序{{ op.operation_no }}</span>
              <el-tag v-if="op.is_qc_gate" type="warning" size="small">质检</el-tag>
              <el-tag v-if="op.is_outsourced" type="info" size="small">委外</el-tag>
            </div>
            <div class="op-name">{{ op.name }}</div>
            <div class="op-meta">{{ op.work_center }} | {{ op.setup_hours + op.run_hours }}min</div>
            <div class="op-actions">
              <el-button size="small" @click.stop="moveUp(idx)" :disabled="idx === 0">↑</el-button>
              <el-button size="small" @click.stop="moveDown(idx)" :disabled="idx === operations.length - 1">↓</el-button>
              <el-button size="small" type="danger" @click.stop="removeOp(idx)">×</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 工序详情 -->
      <div class="detail-panel">
        <div v-if="!currentOp" class="empty-tip">
          <el-empty description="选择左侧工序查看/编辑详情" />
        </div>
        <div v-else>
          <h3>工序 {{ currentOp.operation_no }} 详情</h3>
          <el-form :model="currentOp" label-width="120px" style="margin-top: 16px">
            <el-form-item label="工序号"><el-input-number v-model="currentOp.operation_no" :min="10" :step="10" /></el-form-item>
            <el-form-item label="工序名称"><el-input v-model="currentOp.name" /></el-form-item>
            <el-form-item label="工作中心"
              ><el-select v-model="currentOp.work_center" style="width: 100%"
                ><el-option v-for="w in workCenters" :key="w" :label="w" :value="w" /></el-select
            ></el-form-item>
            <el-form-item label="准备工时(分钟)"><el-input-number v-model="currentOp.setup_hours" :min="0" /></el-form-item>
            <el-form-item label="单件工时(分钟)"><el-input-number v-model="currentOp.run_hours" :min="0" :precision="1" /></el-form-item>
            <el-form-item label="排队时间(分钟)"><el-input-number v-model="currentOp.queue_hours" :min="0" /></el-form-item>
            <el-form-item label="转移时间(分钟)"><el-input-number v-model="currentOp.move_hours" :min="0" /></el-form-item>
            <el-form-item label="所需人数"><el-input-number v-model="currentOp.workers" :min="1" /></el-form-item>
            <el-form-item label="技能要求"
              ><el-select v-model="currentOp.skill" style="width: 100%"><el-option v-for="s in skills" :key="s" :label="s" :value="s" /></el-select
            ></el-form-item>
            <el-form-item label="质检关口"><el-switch v-model="currentOp.is_qc_gate" /></el-form-item>
            <el-form-item label="委外工序"><el-switch v-model="currentOp.is_outsourced" /></el-form-item>
            <el-form-item label="操作指导"><el-input v-model="currentOp.instruction" type="textarea" :rows="3" /></el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import { getRoutingList, saveRouting as saveRoutingApi, deleteRouting as deleteRoutingApi, getRoutingDetail } from '@/api/routing'

interface Operation {
  id: string
  operation_no: number
  name: string
  work_center: string
  setup_hours: number
  run_hours: number
  queue_hours: number
  move_hours: number
  workers: number
  skill: string
  is_qc_gate: boolean
  is_outsourced: boolean
  instruction: string
}

const route = useRoute()
const routingTitle = ref('标准工艺 V1.1')
const operations = ref<Operation[]>([])

const workCenters = ['下料组', '数控车组', '钻床组', '热处理组', '磨床组', '装配组', '测试组', '涂装组']
const skills = ['锯床操作', '数控车床操作', '钻床操作', '热处理操作', '磨床操作', '装配钳工', '测试操作', '涂装操作']

const currentOp = ref<Operation | null>(null)

const totalHours = computed(() => operations.value.reduce((s, o) => s + o.setup_hours + o.run_hours, 0))
const totalSetup = computed(() => operations.value.reduce((s, o) => s + o.setup_hours, 0))
const totalWithQueue = computed(() => operations.value.reduce((s, o) => s + o.setup_hours + o.run_hours + o.queue_hours + o.move_hours, 0))

function selectOp(op: Operation) {
  currentOp.value = op
}
function addOp() {
  const no = operations.value.length > 0 ? operations.value[operations.value.length - 1].operation_no + 10 : 10
  const newOp: Operation = {
    id: Date.now().toString(),
    operation_no: no,
    name: '新工序',
    work_center: workCenters[0],
    setup_hours: 0,
    run_hours: 0,
    queue_hours: 0,
    move_hours: 0,
    workers: 1,
    skill: '',
    is_qc_gate: false,
    is_outsourced: false,
    instruction: ''
  }
  operations.value.push(newOp)
  currentOp.value = newOp
}

function moveUp(idx: number) {
  if (idx > 0) {
    ;[operations.value[idx], operations.value[idx - 1]] = [operations.value[idx - 1], operations.value[idx]]
    renumberOps()
  }
}
function moveDown(idx: number) {
  if (idx < operations.value.length - 1) {
    ;[operations.value[idx], operations.value[idx + 1]] = [operations.value[idx + 1], operations.value[idx]]
    renumberOps()
  }
}
function removeOp(idx: number) {
  const op = operations.value[idx]
  if (op.id) {
    deleteRoutingApi(op.id).catch(() => {})
  }
  operations.value.splice(idx, 1)
  currentOp.value = null
  renumberOps()
}

// 移动工序后自动重排工序号（10/20/30...）
function renumberOps() {
  operations.value.forEach((op, i) => {
    op.operation_no = (i + 1) * 10
  })
}

async function saveRouting() {
  try {
    for (const op of operations.value) {
      await saveRoutingApi(op)
    }
    ElMessage.success('工艺路线已保存')
  } catch {
    ElMessage.error('保存失败')
  }
}

async function fetchRouting() {
  const id = route.params.id as string
  if (id) {
    try {
      const res = await getRoutingDetail(id)
      if (res.data) {
        const detail = res.data as any
        routingTitle.value = detail.material_name || '标准工艺'
        operations.value = detail.operations || [detail]
      }
    } catch {
      ElMessage.error('获取工艺路线失败')
    }
  } else {
    try {
      const res = await getRoutingList({ pageNum: 1, pageSize: 100 })
      operations.value = res.data.list as Operation[]
    } catch {
      ElMessage.error('获取工艺路线列表失败')
    }
  }
}

onMounted(() => {
  fetchRouting()
})
</script>

<style scoped>
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.editor-header h2 {
  margin: 0;
  font-size: 18px;
}
.routing-container {
  display: flex;
  gap: 0;
  height: calc(100vh - 180px);
}
.ops-panel {
  width: 360px;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
}
.ops-toolbar {
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
}
.ops-list {
  flex: 1;
  overflow: auto;
}
.op-item {
  padding: 12px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background 0.2s;
}
.op-item:hover {
  background: #fafafa;
}
.op-item.active {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}
.op-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.op-no {
  font-weight: 600;
  font-size: 14px;
}
.op-name {
  font-size: 13px;
  margin-bottom: 4px;
}
.op-meta {
  font-size: 12px;
  color: #909399;
}
.op-actions {
  margin-top: 6px;
}
.detail-panel {
  flex: 1;
  overflow: auto;
  padding: 16px;
}
.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
