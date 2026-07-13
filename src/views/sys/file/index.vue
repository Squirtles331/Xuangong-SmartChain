<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="系统文件"
    :search-columns="searchColumns"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    :show-add-button="false"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
  >
    <template #tool>
      <el-upload :auto-upload="false" :show-file-list="false" @change="handleUpload">
        <gi-button type="add">上传文件</gi-button>
      </el-upload>
      <gi-button type="reset" @click="refresh">刷新</gi-button>
    </template>

    <template #name="{ row }">
      <span class="file-name">
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
      <CrudRowActions :actions="fileActions" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <FilePreviewDialog v-model:visible="previewVisible" :file="previewFileData" :icon-component="fileIcon" />
    </template>
  </CrudPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Document, Files, Grid, Picture, VideoCamera } from '@element-plus/icons-vue'
import type { SystemFile } from '@/api/system'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import { useTable } from '@/hooks/useTable'
import { sysFileRecords } from '../static-data'
import FilePreviewDialog from './FilePreviewDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '文件名称 / 所属模块 / 关联类型', clearable: true } as any }
]

const columns: TableColumnItem<SystemFile>[] = [
  { label: '文件名称', minWidth: 240, slotName: 'name' },
  { prop: 'module', label: '所属模块', minWidth: 120 },
  { prop: 'objectType', label: '关联类型', minWidth: 120 },
  { label: '文件大小', minWidth: 100, slotName: 'size', align: 'right' },
  { prop: 'uploadedAt', label: '上传时间', minWidth: 170 },
  { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
]

const fileActions = [
  { key: 'preview', label: '预览', tone: 'primary' as const },
  { key: 'download', label: '下载', tone: 'secondary' as const },
  { key: 'delete', label: '删除', tone: 'danger' as const }
]

const queryParams = reactive({
  keyword: ''
})

const previewVisible = ref(false)
const previewFileData = ref<SystemFile | null>(null)

const fileIconMap: Record<SystemFile['type'], any> = {
  pdf: Document,
  word: Document,
  excel: Grid,
  image: Picture,
  video: VideoCamera
}

const fileIconColorMap: Record<SystemFile['type'], string> = {
  pdf: '#f56c6c',
  word: '#409eff',
  excel: '#67c23a',
  image: '#e6a23c',
  video: '#909399'
}

const filteredRecords = computed(() =>
  sysFileRecords.value.filter(
    (item) =>
      !queryParams.keyword ||
      item.name.includes(queryParams.keyword) ||
      item.module.includes(queryParams.keyword) ||
      item.objectType.includes(queryParams.keyword)
  )
)

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SystemFile>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const start = (page - 1) * size
    const end = start + size
    return {
      list: filteredRecords.value.slice(start, end),
      total: filteredRecords.value.length
    }
  },
  deleteAPI: async (ids) => {
    sysFileRecords.value = sysFileRecords.value.filter((item) => !ids.includes(item.id))
  }
})

function handleReset() {
  queryParams.keyword = ''
  search()
}

function fileIcon(type: SystemFile['type']) {
  return fileIconMap[type] || Files
}

function fileIconColor(type: SystemFile['type']) {
  return fileIconColorMap[type] || '#909399'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

async function handleUpload(file: UploadFile) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  const typeMap: Record<string, SystemFile['type']> = {
    pdf: 'pdf',
    doc: 'word',
    docx: 'word',
    xls: 'excel',
    xlsx: 'excel',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    mp4: 'video'
  }

  sysFileRecords.value.unshift({
    id: `FILE-${String(sysFileRecords.value.length + 1).padStart(3, '0')}`,
    name: file.name,
    module: '系统平台',
    objectType: '通用附件',
    size: file.size || 0,
    type: (extension && typeMap[extension]) || 'pdf',
    url: '',
    uploadedAt: '2026-07-13 16:30'
  })

  ElMessage.success('已新增静态文件数据')
  await refresh()
}

function handleRowAction(action: string, row: SystemFile) {
  if (action === 'preview') {
    previewFileData.value = row
    previewVisible.value = true
    return
  }

  if (action === 'download') {
    ElMessage.success(`开始下载：${row.name}`)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}
</script>

<style scoped>
.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
