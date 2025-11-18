<template>
  <div class="config-view">
    <div class="page-header">
      <h2>系统配置</h2>
      <el-button type="primary">
        <el-icon><Check /></el-icon>
        保存配置
      </el-button>
    </div>

    <div class="page-content">
      <el-card title="基础设置">
        <el-form :model="configForm" label-width="120px">
          <el-form-item label="系统名称">
            <el-input v-model="configForm.systemName" />
          </el-form-item>
          <el-form-item label="系统Logo">
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false">
              <img v-if="configForm.logo" :src="configForm.logo" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="系统描述">
            <el-input v-model="configForm.description" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item label="登录页背景">
            <el-radio-group v-model="configForm.loginBg">
              <el-radio label="default"> 默认 </el-radio>
              <el-radio label="custom"> 自定义 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card title="邮件设置" style="margin-top: 16px">
        <el-form :model="configForm" label-width="120px">
          <el-form-item label="SMTP服务器">
            <el-input v-model="configForm.smtpServer" />
          </el-form-item>
          <el-form-item label="SMTP端口">
            <el-input v-model="configForm.smtpPort" />
          </el-form-item>
          <el-form-item label="发件人邮箱">
            <el-input v-model="configForm.senderEmail" />
          </el-form-item>
          <el-form-item label="发件人密码">
            <el-input v-model="configForm.senderPassword" type="password" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, Plus } from '@element-plus/icons-vue'
import { reactive } from 'vue'

const configForm = reactive({
  systemName: '玄工智链管理系统',
  logo: '',
  description: '一个现代化的企业级管理系统',
  loginBg: 'default',
  smtpServer: 'smtp.example.com',
  smtpPort: '587',
  senderEmail: 'noreply@example.com',
  senderPassword: ''
})
</script>

<style scoped>
.config-view {
  height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.page-content {
  background-color: #fff;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
