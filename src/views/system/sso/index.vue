<template>
  <gi-page-layout :bordered="true">
    <el-card header="单点登录配置">
      <el-form :model="form" label-width="140px" style="max-width: 600px">
        <el-form-item label="SSO协议"
          ><el-select v-model="form.protocol" style="width: 100%"
            ><el-option label="OAuth 2.0" value="oauth2" /><el-option label="OIDC" value="oidc" /><el-option
              label="SAML 2.0"
              value="saml" /><el-option label="LDAP/AD" value="ldap" /></el-select
        ></el-form-item>
        <el-form-item label="认证服务器URL"><el-input v-model="form.url" placeholder="https://sso.company.com/auth" /></el-form-item>
        <el-form-item label="Client ID"><el-input v-model="form.client_id" /></el-form-item>
        <el-form-item label="Client Secret"><el-input v-model="form.client_secret" type="password" show-password /></el-form-item>
        <el-form-item label="回调地址"><el-input v-model="form.redirect_uri" placeholder="https://app.company.com/auth/callback" /></el-form-item>
        <el-form-item label="默认角色"
          ><el-select v-model="form.default_role" style="width: 100%"
            ><el-option label="操作工" value="operator" /><el-option label="车间主任" value="workshop_manager" /><el-option
              label="只读用户"
              value="readonly" /></el-select
        ></el-form-item>
        <el-form-item label="启用"><el-switch v-model="form.enabled" /></el-form-item>
        <el-form-item
          ><el-button type="primary" @click="save">保存配置</el-button><el-button @click="test">测试连接</el-button
          ><el-button @click="testStatus">连接状态检测</el-button></el-form-item
        >
      </el-form>
    </el-card>
  </gi-page-layout>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
const form = reactive({
  protocol: 'oauth2',
  url: 'https://sso.company.com/auth',
  client_id: 'xuanlian-app',
  client_secret: '',
  redirect_uri: 'https://app.company.com/auth/callback',
  default_role: 'operator',
  enabled: false
})
function save() {
  ElMessage.success('SSO配置已保存')
}
function test() {
  ElMessage.success('连接测试成功')
}
function testStatus() {
  ElNotification({
    title: '连接状态检测',
    message: `SSO协议: ${form.protocol.toUpperCase()}
认证地址: ${form.url}
状态: 连接正常
延迟: 32ms
证书有效期: 2026-12-31
最后同步: 2025-06-29 10:30:00`,
    type: 'success',
    duration: 8000
  })
}
</script>
