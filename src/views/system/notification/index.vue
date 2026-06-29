<template>
  <gi-page-layout>
    <template #tool><gi-button type="add" @click="openAdd" /><gi-button style="margin-left: 8px" type="reset" @click="refresh" /></template>
    <gi-table :columns="cols" :data="rules" border stripe>
      <template #channel="{ row }"
        ><el-tag :type="row.channel === 'wecom' ? 'success' : row.channel === 'dingtalk' ? 'primary' : 'warning'" size="small">{{
          row.channel === 'wecom' ? '企业微信' : row.channel === 'dingtalk' ? '钉钉' : '站内信'
        }}</el-tag></template
      >
      <template #status="{ row }"
        ><el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">{{ row.status === 'active' ? '启用' : '停用' }}</el-tag></template
      >
      <template #actions="{ row }"
        ><gi-button type="edit" @click="openEdit(row)" /><el-button type="primary" link size="small" @click="testSend(row)">发送测试</el-button
        ><el-button :type="row.status === 'active' ? 'warning' : 'success'" link size="small" @click="toggle(row)">{{
          row.status === 'active' ? '停用' : '启用'
        }}</el-button></template
      >
    </gi-table>
    <gi-dialog v-model="vis" :footer="true" :on-before-ok="submit" :title="mode === 'add' ? '新增通知规则' : '编辑通知规则'" width="600px">
      <gi-form v-model="form" :columns="formCols" :label-width="100" />
    </gi-dialog>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormColumnItem, TableColumnItem } from 'gi-component'
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
  { prop: 'webhook_url', label: 'Webhook地址', minWidth: 320 },
  { label: '状态', minWidth: 60, slotName: 'status', align: 'center' },
  { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
]
const vis = ref(false)
const mode = ref<'add' | 'edit'>('add')
const eid = ref('')
const form = reactive({ biz_type: '工单审批', channel: 'wecom', webhook_url: '', status: 'active' })
const formCols: FormColumnItem[] = [
  {
    type: 'select-v2',
    label: '业务类型',
    field: 'biz_type',
    required: true,
    props: {
      options: [
        { label: '工单审批', value: '工单审批' },
        { label: '工序派工', value: '工序派工' },
        { label: '质检通知', value: '质检通知' },
        { label: '异常上报', value: '异常上报' },
        { label: 'ECN生效', value: 'ECN生效' },
        { label: '应收逾期', value: '应收逾期' }
      ]
    } as any
  },
  {
    type: 'select-v2',
    label: '通知渠道',
    field: 'channel',
    required: true,
    props: {
      options: [
        { label: '企业微信', value: 'wecom' },
        { label: '钉钉', value: 'dingtalk' },
        { label: '站内信', value: 'internal' }
      ]
    } as any
  },
  { type: 'input', label: 'Webhook地址', field: 'webhook_url', props: { placeholder: '企业微信/钉钉机器人Webhook' } as any }
]
function openAdd() {
  mode.value = 'add'
  Object.assign(form, { biz_type: '工单审批', channel: 'wecom', webhook_url: '', status: 'active' })
  vis.value = true
}
function openEdit(r: NR) {
  mode.value = 'edit'
  eid.value = r.id
  Object.assign(form, r)
  vis.value = true
}
async function submit() {
  if (!form.biz_type) {
    ElMessage.warning('请填写必填项')
    return false
  }
  if (mode.value === 'add') {
    rules.value.unshift({ id: Date.now().toString(), ...form } as NR)
  } else {
    const i = rules.value.findIndex((e) => e.id === eid.value)
    if (i > -1) Object.assign(rules.value[i], form)
  }
  return true
}
function toggle(r: NR) {
  r.status = r.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(r.status === 'active' ? '已启用' : '已停用')
}
function testSend(r: NR) {
  const channelName = r.channel === 'wecom' ? '企业微信' : r.channel === 'dingtalk' ? '钉钉' : '站内信'
  ElMessage.success(`测试消息已通过${channelName}发送至：${r.webhook_url}`)
}
function refresh() {}
</script>
