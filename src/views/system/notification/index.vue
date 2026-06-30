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
      <gi-button type="add" @click="openAdd" />
      <gi-button type="reset" style="margin-left: 8px" @click="refresh" />
    </template>

    <TableSetting title="通知规则" :columns="columns" @refresh="refresh">
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
          <template #channel="{ row }">
            <el-tag :type="channelTagMap[row.channel]">{{ channelLabelMap[row.channel] }}</el-tag>
          </template>

          <template #status="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
          </template>

          <template #actions="{ row }">
            <gi-button type="edit" @click="openEdit(row)" />
            <el-button type="primary" link size="small" @click="handleTest(row)">发送测试</el-button>
            <el-button type="primary" link size="small" @click="handleToggle(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <gi-button type="delete" @click="onDelete(row)" />
          </template>
        </gi-table>
      </template>
    </TableSetting>

    <NotificationRuleFormDialog v-model:visible="dialogVisible" v-model:form="formModel" :mode="dialogMode" @submit="submitDialog" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
import SearchSetting from '@/components/SearchSetting.vue'
import TableSetting from '@/components/TableSetting.vue'
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

const visibleSearchColumns = ref<FormColumnItem[]>([...searchColumns])
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

function onSearchFieldsChange(fields: FormColumnItem[]) {
  visibleSearchColumns.value = fields
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

<style scoped>
:deep(.gi-page-layout__tool) {
  gap: 8px;
}
</style>
