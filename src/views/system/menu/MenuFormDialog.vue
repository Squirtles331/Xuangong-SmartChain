<template>
  <CrudFormDialog
    v-model:visible="visible"
    v-model:form="formData"
    :title="mode === 'add' ? '新增菜单节点' : '编辑菜单节点'"
    :columns="formColumns"
    :label-width="100"
    width="600px"
    @submit="emit('submit')"
  >
    <div class="icon-preview">
      <el-form-item label="图标预览">
        <div class="icon-preview__content">
          <el-icon v-if="formData.icon" :size="28"><component :is="formData.icon" /></el-icon>
          <span v-else class="icon-preview__empty">未选择</span>
          <el-button link type="primary" @click="iconDialogVisible = true">选择图标</el-button>
        </div>
      </el-form-item>
    </div>

    <el-dialog v-model="iconDialogVisible" title="选择图标" width="700px" append-to-body :lock-scroll="false">
      <el-input v-model="iconSearch" placeholder="搜索图标名称..." clearable style="margin-bottom: 12px" />
      <div class="icon-grid">
        <div v-for="name in filteredIcons" :key="name" class="icon-item" :class="{ active: formData.icon === name }" @click="selectIcon(name)">
          <el-icon :size="24"><component :is="name" /></el-icon>
          <span class="icon-name">{{ name }}</span>
        </div>
      </div>
      <el-empty v-if="!filteredIcons.length" description="未找到匹配图标" />
    </el-dialog>
  </CrudFormDialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { FormColumnItem } from 'gi-component'
import CrudFormDialog from '@/components/crud/CrudFormDialog/index.vue'
import type { CrudDialogMode } from '@/components/crud/types'

export interface MenuFormModel {
  id: string
  parentId: string | null
  name: string
  type: 'directory' | 'menu' | 'button'
  path: string
  component: string
  permissionCode: string
  icon: string
  sortOrder: number
  visible: boolean
}

interface Props {
  mode: CrudDialogMode
}

defineProps<Props>()

const visible = defineModel<boolean>('visible', { required: true })
const formData = defineModel<MenuFormModel>('form', { required: true })

const emit = defineEmits<{
  submit: []
}>()

const formColumns: FormColumnItem[] = [
  { type: 'input', label: '名称', field: 'name', required: true },
  {
    type: 'select-v2',
    label: '类型',
    field: 'type',
    required: true,
    props: {
      options: [
        { label: '目录', value: 'directory' },
        { label: '菜单', value: 'menu' },
        { label: '按钮', value: 'button' }
      ]
    } as any
  },
  { type: 'input', label: '路由路径', field: 'path' },
  { type: 'input', label: '组件路径', field: 'component' },
  { type: 'input', label: '权限编码', field: 'permissionCode', required: true },
  { type: 'input', label: '图标', field: 'icon' },
  { type: 'input-number', label: '排序', field: 'sortOrder', props: { min: 0 } as any },
  { type: 'switch', label: '是否可见', field: 'visible' }
]

const iconSearch = ref('')
const iconDialogVisible = ref(false)
const commonIcons = ref([
  'HomeFilled',
  'Setting',
  'User',
  'Lock',
  'Key',
  'List',
  'Grid',
  'Menu',
  'Document',
  'Folder',
  'FolderOpened',
  'Edit',
  'Delete',
  'Plus',
  'Minus',
  'Check',
  'Close',
  'Search',
  'Refresh',
  'Upload',
  'Download',
  'Share',
  'Message',
  'Bell',
  'Warning',
  'InfoFilled',
  'CircleCheck',
  'Clock',
  'Calendar',
  'Picture',
  'VideoCamera',
  'Monitor',
  'DataAnalysis',
  'TrendCharts',
  'Histogram',
  'PieChart',
  'Connection',
  'Link',
  'Switch',
  'Operation',
  'Tools',
  'Platform',
  'Management',
  'Promotion',
  'Collection',
  'Tickets',
  'Postcard',
  'Box',
  'Goods',
  'ShoppingBag',
  'ShoppingCart',
  'PriceTag',
  'Coin',
  'Money',
  'Wallet',
  'CreditCard',
  'BankCard',
  'MapLocation',
  'Position',
  'LocationFilled',
  'Aim',
  'Compass',
  'ChatDotRound',
  'ChatLineRound',
  'ChatLineSquare',
  'ChatRound',
  'Service',
  'Headset',
  'Phone',
  'PhoneFilled',
  'MessageBox',
  'View',
  'Hide',
  'Unlock',
  'Finished',
  'More',
  'MoreFilled',
  'Star',
  'StarFilled',
  'Thumb',
  'Pointer',
  'Flag',
  'Sell',
  'Filter',
  'Sort',
  'Rank',
  'Guide',
  'Opportunity'
])

const filteredIcons = computed(() => {
  if (!iconSearch.value) return commonIcons.value
  const keyword = iconSearch.value.toLowerCase()
  return commonIcons.value.filter((item) => item.toLowerCase().includes(keyword))
})

function selectIcon(name: string) {
  formData.value.icon = name
  iconDialogVisible.value = false
}
</script>

<style scoped>
.icon-preview {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.icon-preview__content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-preview__empty {
  color: #999;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  max-height: 400px;
  overflow: auto;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 4px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.icon-item.active {
  border-color: #409eff;
  background: #d9ecff;
}

.icon-name {
  font-size: 11px;
  margin-top: 6px;
  color: #666;
  text-align: center;
  word-break: break-all;
}
</style>
