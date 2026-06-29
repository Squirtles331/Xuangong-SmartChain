<template>
  <gi-page-layout>
    <template #tool>
      <gi-button type="add" @click="openAdd" />
      <gi-button style="margin-left: 8px" type="reset" @click="refresh" />
    </template>

    <gi-table :columns="cols" :data="rules" border stripe>
      <template #channel="{ row }">
        <el-tag :type="row.channel === 'wecom' ? 'success' : row.channel === 'dingtalk' ? 'primary' : 'warning'" size="small">
          {{ row.channel === 'wecom' ? '企业微信' : row.channel === 'dingtalk' ? '钉钉' : '站内信' }}
        </el-tag>
      </template>
      <template #status="{ row }">
        <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag>
      </template>
      <template #actions="{ row }">
        <gi-button type="edit" @click="openEdit(row)" />
        <el-button type="primary" link size="small" @click="testSend(row)">发送测试</el-button>
        <el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggle(row)">
          {{ row.status === 'active' ? '停用' : '启用' }}
        </el-button>
      </template>
    </gi-table>

    <NotificationRuleFormDialog v-model:visible="vis" v-model:form="formModel" :mode="mode" @submit="submit" />
  </gi-page-layout>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { TableColumnItem } from 'gi-component'
import NotificationRuleFormDialog, { type NotificationRuleFormModel } from './NotificationRuleFormDialog.vue'

interface NR {
  id: string
  biz_type: string
  channel: string
  webhook_url: string
  status: string
}

const rules = ref<NR[]>([
  { id: '1', biz_type: '工单审批', channel: 'wecom', webhook_url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxx', status: 'active' },
  { id: '2', biz_type: '工序派工', channel: 'dingtalk', webhook_url: 'https://oapi.dingtalk.com/robot/send?access_token=xxx', status: 'active' },
  { id: '3', biz_type: '质检通知', channel: 'internal', webhook_url: '-', status: 'active' },
  { id: '4', biz_type: '异常上报', channel: 'wecom', webhook_url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=yyy', status: 'disabled' }
])

const cols: TableColumnItem<NR>[] = [
  { prop: 'biz_type', label: '业务类型', minWidth: 140 },
  { label: '通知渠道', minWidth: 100, slotName: 'channel', align: 'center' },
  { prop: 'webhook_url', label: 'Webhook 地址', minWidth: 320 },
  { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]

const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const editingId = ref('')
const formModel = reactive<NotificationRuleFormModel>({
  biz_type: '工单审批',
  channel: 'wecom',
  webhook_url: '',
  status: 'active'
})

function createDefaultFormModel(): NotificationRuleFormModel {
  return {
    biz_type: '工单审批',
    channel: 'wecom',
    webhook_url: '',
    status: 'active'
  }
}

function openAdd() {
  mode.value = 'add'
  editingId.value = ''
  Object.assign(formModel, createDefaultFormModel())
  vis.value = true
}

function openEdit(row: NR) {
  mode.value = 'edit'
  editingId.value = row.id
  Object.assign(formModel, row)
  vis.value = true
}

async function submit() {
  if (!formModel.biz_type) {
    ElMessage.warning('请填写必填项')
    return false
  }

  if (mode.value === 'add') {
    rules.value.unshift({ id: Date.now().toString(), ...formModel })
  } else {
    const index = rules.value.findIndex((item) => item.id === editingId.value)
    if (index > -1) Object.assign(rules.value[index], formModel)
  }

  vis.value = false
  return true
}

function toggle(row: NR) {
  row.status = row.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(row.status === 'active' ? '已启用' : '已停用')
}

function testSend(row: NR) {
  const channelName = row.channel === 'wecom' ? '企业微信' : row.channel === 'dingtalk' ? '钉钉' : '站内信'
  ElMessage.success(`测试消息已通过 ${channelName} 发送到 ${row.webhook_url}`)
}

function refresh() {}
</script>
