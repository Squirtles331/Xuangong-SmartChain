<template>
  <gi-page-layout>
    <template #tool>
      <el-button type="primary" @click="printBarcode">打印</el-button>
    </template>

    <el-card shadow="never" style="margin-bottom: 16px">
      <el-form :inline="true">
        <el-form-item label="选择物料">
          <el-select v-model="selectedMaterial" placeholder="请选择物料" filterable style="width: 280px">
            <el-option v-for="m in materialList" :key="m.id" :label="`${m.code} - ${m.name}`" :value="m.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="打印数量">
          <el-input-number v-model="printQty" :min="1" :max="100" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="generatePreview">生成预览</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="previewList.length" shadow="never" header="条码预览">
      <div class="barcode-grid">
        <div v-for="(item, idx) in previewList" :key="idx" class="barcode-item">
          <div class="barcode-lines">
            <div v-for="n in 20" :key="n" class="barcode-bar" :style="{ width: barWidth(n) + 'px' }" />
          </div>
          <div class="barcode-text">{{ item.barcode }}</div>
          <div class="barcode-info">{{ item.name }}</div>
        </div>
      </div>
    </el-card>
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMaterialListForBarcode } from '@/api/wms'

interface Material {
  id: string
  code: string
  name: string
  spec: string
  unit: string
}

const materialList = ref<Material[]>([])
const selectedMaterial = ref('')
const printQty = ref(1)
const previewList = ref<{ barcode: string; name: string }[]>([])

function generatePreview() {
  if (!selectedMaterial.value) {
    ElMessage.warning('请先选择物料')
    return
  }
  const material = materialList.value.find((m) => m.id === selectedMaterial.value)
  if (!material) return
  previewList.value = Array.from({ length: printQty.value }, () => ({
    barcode: `BC${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`,
    name: material.name
  }))
}

function barWidth(n: number): number {
  const widths = [2, 3, 1, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2, 3, 2, 1, 3, 1, 2, 3]
  return widths[n - 1] || 2
}

function printBarcode() {
  if (!previewList.value.length) {
    ElMessage.warning('请先生成条码预览')
    return
  }
  window.print()
  ElMessage.success('条码打印任务已发送')
}

async function fetchMaterials() {
  try {
    const res = await getMaterialListForBarcode({ pageNum: 1, pageSize: 200 })
    materialList.value = res.data.list as Material[]
  } catch {
    ElMessage.error('获取物料列表失败')
  }
}

onMounted(() => {
  fetchMaterials()
})
</script>

<style scoped>
.barcode-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
}

.barcode-item {
  border: 1px solid #e0e0e0;
  padding: 16px 24px;
  border-radius: 4px;
  text-align: center;
  min-width: 200px;
  background: #fff;
}

.barcode-lines {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1px;
  height: 60px;
  margin-bottom: 8px;
}

.barcode-bar {
  background: #000;
  height: 100%;
}

.barcode-text {
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 2px;
  margin-bottom: 4px;
}

.barcode-info {
  font-size: 12px;
  color: #666;
}
</style>
