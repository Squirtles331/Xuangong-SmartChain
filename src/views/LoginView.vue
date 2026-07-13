<template>
  <div class="login-page">
    <section class="login-page__brand">
      <div class="brand-panel">
        <div class="brand-panel__top">
          <div class="brand-mark">
            <img :src="brandLogo" alt="玄工智链" class="brand-mark__image" />
            <div>
              <div class="brand-mark__title">玄工智链</div>
              <div class="brand-mark__subtitle">制造业一体化数字平台</div>
            </div>
          </div>
          <span class="brand-badge">统一门户</span>
        </div>

        <div class="brand-panel__hero">
          <h1>面向 PLM、MES、WMS、QMS、ERP 协同的一体化工作入口</h1>
          <p>先统一身份、导航、工作台和系统平台样板页，再逐步进入业务静态页面、静态数据、mock 与接口联调。</p>
        </div>

        <div class="brand-panel__points">
          <div class="brand-point">
            <strong>统一身份与权限</strong>
            <span>账号、角色、菜单与审批基线统一收口</span>
          </div>
          <div class="brand-point">
            <strong>跨域执行协同</strong>
            <span>围绕计划、执行、质量、仓储与设备建立同一入口节奏</span>
          </div>
          <div class="brand-point">
            <strong>静态页先行</strong>
            <span>先稳定产品结构和字段表达，再进入 mock 与 API</span>
          </div>
        </div>

        <div class="brand-panel__metrics">
          <div class="brand-metric">
            <span>主布局</span>
            <strong>Classic</strong>
          </div>
          <div class="brand-metric">
            <span>工作模式</span>
            <strong>静态优先</strong>
          </div>
          <div class="brand-metric">
            <span>当前主题</span>
            <strong>工业蓝灰</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="login-page__form">
      <div class="login-card">
        <div class="login-card__header">
          <h2>登录平台</h2>
          <p>使用租户、账号与密码进入系统，当前阶段支持静态登录演示。</p>
        </div>

        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" label-position="top">
          <el-form-item prop="company" label="租户 / 组织">
            <el-select v-model="loginForm.company" placeholder="请选择租户或组织">
              <el-option label="玄工智链示范工厂" value="demo-factory" />
              <el-option label="玄工智链集团总部" value="group-center" />
            </el-select>
          </el-form-item>

          <el-form-item prop="username" label="账号">
            <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="请输入邮箱、手机号或账号" />
          </el-form-item>

          <el-form-item prop="password" label="密码">
            <el-input v-model="loginForm.password" :prefix-icon="Lock" type="password" show-password placeholder="请输入登录密码" />
          </el-form-item>

          <el-form-item prop="captcha" label="验证码">
            <div class="captcha-row">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" />
              <button type="button" class="captcha-box" @click="refreshCaptcha">
                <span>{{ captchaText }}</span>
                <el-icon><Refresh /></el-icon>
              </button>
            </div>
          </el-form-item>

          <div class="login-form__options">
            <el-checkbox v-model="loginForm.remember">记住账号</el-checkbox>
            <el-link type="primary">找回密码</el-link>
          </div>

          <el-button type="primary" class="login-form__submit" :loading="loading" @click="handleLogin"> 登录玄工智链 </el-button>

          <div class="login-form__extra">
            <el-button>短信验证码登录</el-button>
            <el-button>单点登录</el-button>
          </div>
        </el-form>

        <div class="login-card__footer">
          <span>建议先完成静态页面与静态数据基线，再进入 mock 与接口联调。</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, Refresh, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

import brandLogo from '@/assets/images/logo.png'

const router = useRouter()
const loginFormRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  company: 'demo-factory',
  username: localStorage.getItem('remembered_username') || 'admin',
  password: '123456',
  captcha: '',
  remember: Boolean(localStorage.getItem('remembered_username'))
})

const captchaText = ref('9 7 3')

const loginRules: FormRules = {
  company: [{ required: true, message: '请选择租户或组织', trigger: 'change' }],
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

function refreshCaptcha() {
  const captchas = ['9 7 3', '5 2 8', '1 4 6', '7 3 9', '2 8 4']
  captchaText.value = captchas[Math.floor(Math.random() * captchas.length)]
}

async function handleLogin() {
  try {
    await loginFormRef.value?.validate()
    loading.value = true

    const success = await mockLogin()

    if (!success) {
      return
    }

    ElMessage.success('登录成功')

    if (loginForm.remember) {
      localStorage.setItem('remembered_username', loginForm.username)
    } else {
      localStorage.removeItem('remembered_username')
    }

    localStorage.setItem('mock_login', 'true')
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查表单填写是否完整')
  } finally {
    loading.value = false
  }
}

function mockLogin(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inputCaptcha = loginForm.captcha.replace(/\s/g, '')
      const expectedCaptcha = captchaText.value.replace(/\s/g, '')

      if (inputCaptcha !== expectedCaptcha) {
        ElMessage.error('验证码错误')
        resolve(false)
        return
      }

      if (!loginForm.username || !loginForm.password) {
        ElMessage.error('请输入账号和密码')
        resolve(false)
        return
      }

      localStorage.setItem('access_token', `mock_token_${Date.now()}`)
      localStorage.setItem('refresh_token', 'mock_refresh_token')
      localStorage.setItem(
        'user_info',
        JSON.stringify({
          id: '1',
          username: loginForm.username,
          real_name: loginForm.username,
          roles: ['super_admin'],
          permissions: ['*']
        })
      )

      resolve(true)
    }, 500)
  })
}
</script>

<style scoped lang="scss">
.login-page {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(420px, 520px);
  min-height: 100vh;
  padding: 24px;
  gap: 24px;
  background: var(--login-page-bg);
}

.login-page__brand,
.login-page__form {
  min-height: 0;
}

.brand-panel {
  position: relative;
  height: 100%;
  padding: 36px;
  border: 1px solid var(--login-brand-border);
  border-radius: 28px;
  overflow: hidden;
  background: var(--login-brand-bg);
  box-shadow: var(--login-card-shadow);
}

.brand-panel::before,
.brand-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.brand-panel::before {
  background: linear-gradient(var(--login-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--login-grid-line) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.08) 100%);
}

.brand-panel::after {
  background:
    radial-gradient(circle at 18% 24%, rgba(75, 138, 168, 0.18), transparent 24%),
    radial-gradient(circle at 78% 82%, rgba(210, 154, 58, 0.14), transparent 20%);
}

.brand-panel__top,
.brand-panel__hero,
.brand-panel__points,
.brand-panel__metrics {
  position: relative;
  z-index: 1;
}

.brand-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-mark__image {
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.92);
  padding: 6px;
}

.brand-mark__title {
  color: var(--login-brand-title);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.brand-mark__subtitle {
  margin-top: 4px;
  color: var(--login-brand-muted);
  font-size: 13px;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: var(--login-brand-badge-bg);
  color: var(--login-brand-badge-text);
  font-size: 12px;
  font-weight: 700;
}

.brand-panel__hero {
  margin-top: 72px;
  max-width: 680px;
}

.brand-panel__hero h1 {
  margin: 0;
  color: var(--login-brand-title);
  font-size: 42px;
  line-height: 1.22;
}

.brand-panel__hero p {
  margin: 18px 0 0;
  color: var(--login-brand-text);
  font-size: 16px;
  line-height: 1.8;
}

.brand-panel__points {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 40px;
}

.brand-point {
  padding: 18px 18px 20px;
  border: 1px solid var(--login-brand-point-border);
  border-radius: 20px;
  background: var(--login-brand-point-bg);
  backdrop-filter: blur(6px);
}

.brand-point strong {
  display: block;
  color: var(--login-brand-title);
  font-size: 15px;
}

.brand-point span {
  display: block;
  margin-top: 10px;
  color: var(--login-brand-text);
  font-size: 13px;
  line-height: 1.7;
}

.brand-panel__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 28px;
}

.brand-metric {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--login-brand-point-border);
}

.brand-metric span {
  color: var(--login-brand-muted);
  font-size: 12px;
}

.brand-metric strong {
  display: block;
  margin-top: 8px;
  color: var(--login-brand-title);
  font-size: 20px;
  font-weight: 700;
}

.login-page__form {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  padding: 32px;
  border: 1px solid var(--login-card-border);
  border-radius: 28px;
  background: var(--login-card-bg);
  box-shadow: var(--login-card-shadow);
  backdrop-filter: blur(12px);
}

.login-card__header h2 {
  margin: 0;
  color: var(--login-card-title);
  font-size: 28px;
}

.login-card__header p {
  margin: 10px 0 0;
  color: var(--login-card-text);
  line-height: 1.7;
}

.login-form {
  margin-top: 28px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-form-item__label) {
  color: var(--login-card-title);
  font-weight: 600;
}

.login-form :deep(.el-input__wrapper),
.login-form :deep(.el-select__wrapper) {
  border-radius: 14px;
  background: var(--login-field-bg);
  box-shadow: 0 0 0 1px var(--login-field-border) inset;
}

.login-form :deep(.el-input__wrapper.is-focus),
.login-form :deep(.el-select__wrapper.is-focused) {
  box-shadow:
    0 0 0 1px var(--el-color-primary) inset,
    0 0 0 4px color-mix(in srgb, var(--el-color-primary) 12%, transparent);
}

.login-form :deep(.el-input__inner)::placeholder {
  color: var(--login-field-placeholder);
}

.captcha-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 120px;
  gap: 12px;
  width: 100%;
}

.captcha-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  border: 1px solid var(--login-field-border);
  border-radius: 14px;
  background: var(--login-captcha-bg);
  color: var(--login-captcha-text);
  font: inherit;
  font-weight: 700;
  letter-spacing: 0.28em;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.captcha-box:hover {
  transform: translateY(-1px);
  border-color: var(--el-color-primary-light-5);
  box-shadow: var(--el-box-shadow-lighter);
}

.captcha-box span {
  margin-left: 0.28em;
}

.login-form__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}

.login-form__submit {
  width: 100%;
  height: 46px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
}

.login-form__extra {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.login-form__extra .el-button {
  margin-left: 0;
  border-radius: 14px;
  border-color: var(--login-secondary-border);
  background: var(--login-secondary-bg);
  color: var(--login-card-title);
}

.login-card__footer {
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid var(--login-card-border);
  color: var(--login-card-text);
  font-size: 13px;
  line-height: 1.7;
}

@media (max-width: 1280px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .brand-panel__hero {
    margin-top: 48px;
  }

  .brand-panel__points,
  .brand-panel__metrics {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .login-page {
    padding: 16px;
    gap: 16px;
  }

  .brand-panel,
  .login-card {
    padding: 24px;
    border-radius: 22px;
  }

  .brand-panel__top,
  .login-form__options {
    flex-direction: column;
    align-items: flex-start;
  }

  .brand-panel__hero h1 {
    font-size: 30px;
  }

  .captcha-row,
  .login-form__extra {
    grid-template-columns: 1fr;
  }
}
</style>
