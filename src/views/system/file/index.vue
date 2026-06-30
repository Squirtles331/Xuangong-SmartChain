<template>
  <gi-page-layout>
    <template #header>
      <SearchSetting :columns="searchColumns" @update:visible-fields="onSearchFieldsChange">
        <gi-form
          v-model="queryParams"
          :columns="visibleSearchColumns"
          :grid-item-props="searchGridItemProps"
          search
          @search="search"
          @reset="handleReset"
        />
      </SearchSetting>
    </template>

    <template #tool>
      <el-upload :auto-upload="false" :show-file-list="false" @change="handleUpload">
        <gi-button type="add">上传文件</gi-button>
      </el-upload>
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="系统文件列表" :columns="columns" @refresh="refresh">
      <template #default="{ settingColumns, tableProps }">
        <gi-table
          :columns="settingColumns"
          :data="tableData"
          :pagination="pagination"
          :loading="loading"
          v-bind="tableProps"
          border
          style="height: 100%"
        >
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
            <el-button type="primary" link size="small" @click="openPreview(row)">预览</el-button>
            <el-button type="primary" link size="small" @click="downloadFile(row)">下载</el-button>
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <FilePreviewDialog v-model:visible="previewVisible" :file="previewFileData" :icon-component="fileIcon" />
  </gi-page-layout>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Document, Files, Grid, Picture, VideoCamera } from '@element-plus/icons-vue'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
import { deleteSystemFile, getSystemFiles, uploadSystemFile, type SystemFile, type SystemFileQuery } from '@/api/system'
import { useTable } from '@/hooks/useTable'
import FilePreviewDialog from './FilePreviewDialog.vue'

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '文件名称/所属模块/关联类型' } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<SystemFile>[] = [
  { label: '文件名称', minWidth: 240, slotName: 'name' },
  { prop: 'module', label: '所属模块', minWidth: 120 },
  { prop: 'objectType', label: '关联类型', minWidth: 120 },
  { label: '文件大小', minWidth: 100, slotName: 'size', align: 'right' },
  { prop: 'uploadedAt', label: '上传时间', minWidth: 170 },
  { label: '操作', minWidth: 200, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive({
  keyword: ''
})

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
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

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<SystemFile>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: SystemFileQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined
    }

    const response = await getSystemFiles(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteSystemFile(id)))
})

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
}

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

  await uploadSystemFile({
    name: file.name,
    module: '系统管理',
    objectType: '通用附件',
    size: file.size || 0,
    type: (extension && typeMap[extension]) || 'pdf',
    url: ''
  })

  ElMessage.success('上传成功')
  await refresh()
}

function openPreview(row: SystemFile) {
  previewFileData.value = row
  previewVisible.value = true
}

function downloadFile(row: SystemFile) {
  ElMessage.success(`开始下载：${row.name}`)
}
</script>

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}

.file-name {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
