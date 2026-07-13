<template>
  <CrudPage
    v-model:search-model="queryParams"
    title="通知规则"
    :search-columns="searchColumns"
    :search-grid-item-props="searchGridItemProps"
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @search="search"
    @reset="handleReset"
    @refresh="refresh"
    @add="openAdd"
  >
    <template #channel="{ row }">
      <el-tag :type="channelTagMap[row.channel]">{{ channelLabelMap[row.channel] }}</el-tag>
    </template>

    <template #status="{ row }">
      <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
    </template>

    <template #actions="{ row }">
      <CrudRowActions :actions="getRowActions(row)" @action="handleRowAction($event, row)" />
    </template>

    <template #dialog>
      <NotificationRuleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
    </template>
  </CrudPage>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import CrudPage from '@/components/crud/CrudPage/index.vue'
import CrudRowActions from '@/components/crud/CrudRowActions/index.vue'
import type { CrudRowActionItem } from '@/components/crud/types'
import {
  createNotificationRule,
  deleteNotificationRule,
  getNotificationRules,
  testNotificationRule,
  toggleNotificationRule,
  updateNotificationRule,
  type NotificationRule,
  type NotificationRuleQuery
} from '@/api/system'
import { useTable } from '@/hooks/useTable'
import NotificationRuleFormDialog, { type NotificationRuleFormModel } from './NotificationRuleFormDialog.vue'

const channelOptions = [
  { label: '企业微信', value: 'wecom' },
  { label: '钉钉', value: 'dingtalk' },
  { label: '站内信', value: 'internal' }
]

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '停用', value: 'disabled' }
]

const channelLabelMap: Record<NotificationRule['channel'], string> = {
  wecom: '企业微信',
  dingtalk: '钉钉',
  internal: '站内信'
}

const channelTagMap: Record<NotificationRule['channel'], 'success' | 'primary' | 'warning'> = {
  wecom: 'success',
  dingtalk: 'primary',
  internal: 'warning'
}

const searchColumns: FormColumnItem[] = [
  { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '业务类型/Webhook 地址' } as any },
  { type: 'select-v2', label: '通知渠道', field: 'channel', props: { options: channelOptions, clearable: true } as any },
  { type: 'select-v2', label: '状态', field: 'status', props: { options: statusOptions, clearable: true } as any }
]

const searchGridItemProps = {
  span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 8 }
}

const columns: TableColumnItem<NotificationRule>[] = [
  { prop: 'bizType', label: '业务类型', minWidth: 160 },
  { label: '通知渠道', minWidth: 100, slotName: 'channel', align: 'center' },
  { prop: 'webhookUrl', label: 'Webhook 地址', minWidth: 320 },
  { label: '状态', minWidth: 90, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 240, fixed: 'right', slotName: 'actions', align: 'center' }
]

const queryParams = reactive<{
  keyword: string
  channel: '' | NotificationRule['channel']
  status: '' | NotificationRule['status']
}>({
  keyword: '',
  channel: '',
  status: ''
})

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formModel = ref<NotificationRuleFormModel>(createDefaultFormModel())

const { tableData, pagination, loading, search, refresh, onDelete } = useTable<NotificationRule>({
  rowKey: 'id',
  listAPI: async ({ page, size }) => {
    const params: NotificationRuleQuery = {
      pageNum: page,
      pageSize: size,
      keyword: queryParams.keyword || undefined,
      channel: queryParams.channel || undefined,
      status: queryParams.status || undefined
    }

    const response = await getNotificationRules(params)
    return response.data
  },
  deleteAPI: (ids) => Promise.all(ids.map((id) => deleteNotificationRule(id)))
})

function createDefaultFormModel(): NotificationRuleFormModel {
  return {
    id: '',
    bizType: '工单审批',
    channel: 'wecom',
    webhookUrl: '',
    status: 'active'
  }
}

function handleReset() {
  Object.assign(queryParams, {
    keyword: '',
    channel: '',
    status: ''
  })
  search()
}

function openAdd() {
  dialogMode.value = 'add'
  formModel.value = createDefaultFormModel()
  dialogVisible.value = true
}

function openEdit(row: NotificationRule) {
  dialogMode.value = 'edit'
  formModel.value = {
    id: row.id,
    bizType: row.bizType,
    channel: row.channel,
    webhookUrl: row.webhookUrl,
    status: row.status
  }
  dialogVisible.value = true
}

function getRowActions(row: NotificationRule): CrudRowActionItem[] {
  return [
    { key: 'edit', label: '编辑', tone: 'primary' },
    { key: 'test', label: '发送测试', tone: 'secondary' },
    { key: 'toggle', label: row.status === 'active' ? '停用' : '启用', tone: row.status === 'active' ? 'warning' : 'success' },
    { key: 'delete', label: '删除', tone: 'danger' }
  ]
}

function handleRowAction(action: string, row: NotificationRule) {
  if (action === 'edit') {
    openEdit(row)
    return
  }

  if (action === 'test') {
    handleTest(row)
    return
  }

  if (action === 'toggle') {
    handleToggle(row)
    return
  }

  if (action === 'delete') {
    onDelete(row)
  }
}

async function submitDialog() {
  if (!formModel.value.bizType) {
    ElMessage.warning('请填写业务类型')
    return
  }

  const payload = {
    bizType: formModel.value.bizType,
    channel: formModel.value.channel,
    webhookUrl: formModel.value.webhookUrl,
    status: formModel.value.status
  }

  if (dialogMode.value === 'add') {
    await createNotificationRule(payload)
  } else {
    await updateNotificationRule(formModel.value.id, payload)
  }

  dialogVisible.value = false
  await refresh()
  ElMessage.success(dialogMode.value === 'add' ? '新增成功' : '保存成功')
}

async function handleTest(row: NotificationRule) {
  await testNotificationRule(row.id)
  ElMessage.success(`已发送测试消息：${row.bizType}`)
}

async function handleToggle(row: NotificationRule) {
  await toggleNotificationRule(row.id)
  ElMessage.success(row.status === 'active' ? '规则已停用' : '规则已启用')
  await refresh()
}
</script>
