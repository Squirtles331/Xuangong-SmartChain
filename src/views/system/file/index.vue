<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="allSearchColumns" storage-key="file-search" @update:visible-fields="onSearchFieldsChange">
        <gi-form :columns="visibleSearchColumns" ref="sf" v-model="s" search @search="hs" @reset="hr" />
      </SearchSetting>
    </template>
    <template #tool>
      <el-upload :auto-upload="false" :show-file-list="false" @change="handleUpload">
        <gi-button type="add">上传文件</gi-button>
      </el-upload>
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="columns" :data="filteredFiles" border style="height: 100%">
      <template #name="{ row }">
        <span style="display: flex; align-items: center; gap: 8px">
          <el-icon :size="20" :color="fileIconColor(row.type)">
            <component :is="fileIcon(row.type)" />
          </el-icon>
          {{ row.name }}
        </span>
      </template>
      <template #size="{ row }">
        {{ formatSize(row.size) }}
      </template>
      <template #actions="{ row }">
        <el-button type="primary" link size="small" @click="previewFile(row)">预览</el-button>
        <el-button type="primary" link size="small" @click="downloadFile(row)">下载</el-button>
        <gi-button type="delete" size="small" @click="deleteFile(row.id)" />
      </template>
    </gi-table>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="文件预览" width="800px">
      <div v-if="previewFileData?.type === 'image'" style="text-align: center">
        <img :src="previewFileData.url" style="max-width: 100%; max-height: 500px" />
      </div>
      <div v-else style="text-align: center; padding: 40px">
        <el-icon :size="64" color="#909399"><component :is="fileIcon(previewFileData?.type || '')" /></el-icon>
        <p style="margin-top: 16px; color: #909399">{{ previewFileData?.name }}</p>
        <p style="color: #c0c4cc; font-size: 12px">暂不支持在线预览，请下载后查看</p>
      </div>
    </el-dialog>
  </gi-page-layout>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Picture, VideoCamera, Files, Grid } from '@element-plus/icons-vue'
import type { FormColumnItem, FormInstance, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import type { UploadFile } from 'element-plus'

const s = ref({ keyword: '' })
const sc: FormColumnItem[] = [{ type: 'input', label: '关键字', field: 'keyword' } as any]

// SearchSetting: 所有可用字段
const allSearchColumns = computed(() => sc)
// SearchSetting: 当前可见字段
const visibleSearchColumns = ref<FormColumnItem[]>([])
const sf = ref<FormInstance | null>()
function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}
function hs() {}
function hr() {
  s.value.keyword = ''
}
function refresh() {
  hr()
}

interface FileItem {
  id: string
  name: string
  module: string
  object_type: string
  size: number
  type: string
  url: string
  uploaded_at: string
}

const files = ref<FileItem[]>([
  {
    id: '1',
    name: '离心泵装配图.pdf',
    module: 'BOM管理',
    object_type: '物料图纸',
    size: 2.5 * 1024 * 1024,
    type: 'pdf',
    url: '',
    uploaded_at: '2025-01-15 09:00:00'
  },
  {
    id: '2',
    name: '工单异常照片.jpg',
    module: '工单管理',
    object_type: '异常附件',
    size: 1.2 * 1024 * 1024,
    type: 'image',
    url: 'https://via.placeholder.com/800x600',
    uploaded_at: '2025-01-15 10:30:00'
  },
  {
    id: '3',
    name: '来料检验报告.xlsx',
    module: '质检管理',
    object_type: '检验报告',
    size: 0.5 * 1024 * 1024,
    type: 'excel',
    url: '',
    uploaded_at: '2025-01-14 14:00:00'
  },
  {
    id: '4',
    name: '作业指导书_SOP.docx',
    module: '工艺路线',
    object_type: '操作指导',
    size: 3.1 * 1024 * 1024,
    type: 'word',
    url: '',
    uploaded_at: '2025-01-13 11:00:00'
  }
])

// 搜索过滤逻辑
const filteredFiles = computed(() => {
  const kw = s.value.keyword?.toLowerCase() || ''
  if (!kw) return files.value
  return files.value.filter(
    (f) => f.name.toLowerCase().includes(kw) || f.module.toLowerCase().includes(kw) || f.object_type.toLowerCase().includes(kw)
  )
})

const fileIconMap: Record<string, any> = {
  pdf: Document,
  word: Document,
  excel: Grid,
  image: Picture,
  video: VideoCamera
}

const fileIconColorMap: Record<string, string> = {
  pdf: '#f56c6c',
  word: '#409eff',
  excel: '#67c23a',
  image: '#e6a23c',
  video: '#909399'
}

function fileIcon(type: string) {
  return fileIconMap[type] || Files
}

function fileIconColor(type: string) {
  return fileIconColorMap[type] || '#909399'
}

const columns: TableColumnItem<FileItem>[] = [
  { type: 'index', label: '#', width: 60 },
  { label: '文件名', minWidth: 240, slotName: 'name' },
  { prop: 'module', label: '所属模块', width: 120 },
  { prop: 'object_type', label: '关联类型', width: 120 },
  { label: '大小', minWidth: 100, slotName: 'size', align: 'right' },
  { prop: 'uploaded_at', label: '上传时间', width: 170 },
  { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function handleUpload(file: UploadFile) {
  const ext = file.name.split('.').pop() || 'unknown'
  const newFile: FileItem = {
    id: Date.now().toString(),
    name: file.name,
    module: '文件管理',
    object_type: '通用文件',
    size: file.size || 0,
    type: ext,
    url: '',
    uploaded_at: new Date().toLocaleString('zh-CN')
  }
  files.value.unshift(newFile)
  ElMessage.success('上传成功')
}

const previewVisible = ref(false)
const previewFileData = ref<FileItem | null>(null)
function previewFile(row: FileItem) {
  previewFileData.value = row
  previewVisible.value = true
}
function downloadFile(row: FileItem) {
  ElMessage.success(`开始下载: ${row.name}`)
}
function deleteFile(id: string) {
  ElMessageBox.confirm('确定删除该文件？', '提示', { type: 'warning' })
    .then(() => {
      files.value = files.value.filter((f) => f.id !== id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>
