<template>
  <div class="login-container">
    <section class="login-left-panel" aria-label="登录区域">
      <div class="login-card">
        <header class="brand-header">
          <div class="logo">
            <span class="logo-icon" aria-hidden="true"></span>
            <span class="logo-text">玄工智链 · XIC 平台</span>
          </div>
        </header>

        <div class="login-header">
          <h1 class="welcome-title">欢迎来到玄工智链</h1>
          <p class="login-hint">使用邮箱/手机号登录</p>
        </div>

        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
          <el-form-item prop="company">
            <el-select v-model="loginForm.company" placeholder="请选择租户/组织" class="form-select">
              <el-option label="XXX有限公司" value="company1" />
              <el-option label="YYY科技有限公司" value="company2" />
            </el-select>
          </el-form-item>

          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入邮箱/手机号" prefix-icon="User" class="form-input" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码（SM4 加密传输）"
              prefix-icon="Lock"
              show-password
              class="form-input"
            />
          </el-form-item>

          <el-form-item prop="captcha" class="captcha-item">
            <div class="captcha-wrapper">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="captcha-input" />
              <button type="button" class="captcha-box" aria-label="刷新验证码" @click="refreshCaptcha">
                <span class="captcha-text">{{ captchaText }}</span>
                <el-icon class="refresh-icon"><Refresh /></el-icon>
              </button>
            </div>
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="loginForm.remember" class="remember-checkbox">记住我</el-checkbox>
            <el-link type="primary" class="forgot-link">找回密码</el-link>
          </div>

          <el-button type="primary" class="login-button" :loading="loading" @click="handleLogin">登录</el-button>

          <div class="social-login">
            <p class="social-title">第三方登录（钉钉 / 企业微信 / AD）</p>
            <div class="social-icons" aria-label="第三方登录方式">
              <button type="button" class="social-icon icon-wechat" aria-label="企业微信登录">W</button>
              <button type="button" class="social-icon icon-github" aria-label="钉钉登录">D</button>
              <button type="button" class="social-icon icon-google" aria-label="AD 登录">A</button>
            </div>
          </div>
        </el-form>

        <footer class="login-footer">
          <p class="copyright">© 2026 玄工智链 · XIC Platform｜遵循等保三级，HTTPS+JWT，密码国密 SM4</p>
        </footer>
      </div>
    </section>

    <aside class="login-right-panel" aria-label="平台介绍">
      <div class="right-content">
        <div class="promo-header">
          <h2 class="promo-title">面向离散制造的 MES 中枢型一体化平台</h2>
          <p class="promo-subtitle">以事件驱动和状态控制为核心 · 实现多系统协同闭环</p>
        </div>
        <div class="illustration-wrapper">
          <img :src="loginImage" alt="玄工智链一体化平台" class="illustration-image" />
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import loginImage from '@/assets/images/login.png'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
  company: 'company1',
  username: 'admin',
  password: '123456',
  captcha: '',
  remember: false
})

const captchaText = ref('9 7 3')

const loginRules = {
  company: [{ required: true, message: '请选择租户/组织', trigger: 'change' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const refreshCaptcha = () => {
  const captchas = ['9 7 3', '5 2 8', '1 4 6', '7 3 9', '2 8 4']
  captchaText.value = captchas[Math.floor(Math.random() * captchas.length)]
}

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate()
    loading.value = true

    const success = await mockLogin()

    if (success) {
      ElMessage.success('登录成功')
      if (loginForm.remember) {
        localStorage.setItem('remembered_username', loginForm.username)
      }
      localStorage.setItem('mock_login', 'true')
      router.push('/')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查表单填写')
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
      if (loginForm.username && loginForm.password) {
        localStorage.setItem('access_token', 'mock_token_' + Date.now())
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
      } else {
        ElMessage.error('请输入用户名和密码')
        resolve(false)
      }
    }, 500)
  })
}
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

.login-container {
  display: grid;
  grid-template-columns: minmax(420px, 0.9fr) minmax(560px, 1.3fr);
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #ffffff;
}

.login-left-panel {
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 40px 32px;
  scrollbar-gutter: stable;
  background: #ffffff;
}

.login-card {
  width: 100%;
  max-width: 525px;
}

.brand-header {
  margin-bottom: 28px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  position: relative;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3f79f5 0%, #2a63e8 100%);
}

.logo-icon::before,
.logo-icon::after {
  position: absolute;
  content: '';
  background: #ffffff;
  border-radius: 2px;
}

.logo-icon::before {
  top: 10px;
  left: 10px;
  width: 8px;
  height: 8px;
}

.logo-icon::after {
  right: 8px;
  bottom: 8px;
  width: 14px;
  height: 14px;
  opacity: 0.9;
  border-radius: 3px;
}

.logo-text {
  color: #172033;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
}

.login-header {
  margin-bottom: 24px;
}

.welcome-title {
  margin: 0 0 8px;
  color: #172033;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.2;
}

.login-hint {
  margin: 0;
  color: #52617a;
  font-size: 14px;
  line-height: 1.5;
}

.login-form {
  margin-bottom: 16px;
}

:deep(.el-form-item) {
  margin-bottom: 14px;
}

:deep(.el-form-item__error) {
  padding-top: 3px;
}

.form-select,
.form-input,
.captcha-input {
  width: 100%;
}

.form-select :deep(.el-input__wrapper),
.form-input :deep(.el-input__wrapper),
.captcha-input :deep(.el-input__wrapper) {
  min-height: 52px;
  padding: 1px 16px;
  border: 1px solid #d9e0ea;
  border-radius: 10px;
  box-shadow: none;
  background: #ffffff;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-select :deep(.el-input__wrapper:hover),
.form-input :deep(.el-input__wrapper:hover),
.captcha-input :deep(.el-input__wrapper:hover) {
  border-color: #aebbd0;
}

.form-select :deep(.el-input__wrapper.is-focus),
.form-input :deep(.el-input__wrapper.is-focus),
.captcha-input :deep(.el-input__wrapper.is-focus) {
  border-color: #3f79f5;
  box-shadow: 0 0 0 3px rgba(63, 121, 245, 0.1);
}

.form-input :deep(.el-input__inner),
.form-select :deep(.el-input__inner),
.captcha-input :deep(.el-input__inner) {
  color: #26344a;
  font-size: 15px;
}

.captcha-item {
  margin-bottom: 14px;
}

.captcha-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.captcha-input {
  flex: 1 1 auto;
  min-width: 0;
}

.captcha-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 52px;
  flex: 0 0 100px;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #f1f4f8 0%, #e2e7ef 100%);
  cursor: pointer;
}

.captcha-box::before {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.35) 50%, transparent 70%);
  animation: shimmer 2s infinite;
}

.captcha-box:focus-visible {
  outline: 3px solid rgba(63, 121, 245, 0.22);
  outline-offset: 2px;
}

.captcha-text {
  position: relative;
  z-index: 1;
  color: #26344a;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.refresh-icon {
  position: absolute;
  z-index: 1;
  top: 5px;
  right: 5px;
  color: #6d7a8f;
  font-size: 12px;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

:deep(.remember-checkbox .el-checkbox__label) {
  color: #52617a;
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
}

.login-button {
  width: 100%;
  height: 48px;
  margin-bottom: 20px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, #3f79f5 0%, #2a63e8 100%);
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.login-button:hover {
  background: linear-gradient(135deg, #2f6bed 0%, #1d4ed8 100%);
  box-shadow: 0 6px 20px rgba(63, 121, 245, 0.28);
  transform: translateY(-1px);
}

.login-button:active {
  transform: translateY(0);
}

.social-login {
  margin-bottom: 20px;
  text-align: center;
}

.social-title {
  position: relative;
  margin: 0 0 12px;
  color: #7b8798;
  font-size: 12px;
  line-height: 1.5;
}

.social-title::before,
.social-title::after {
  position: absolute;
  top: 50%;
  width: 24%;
  height: 1px;
  content: '';
  background: #e1e6ee;
}

.social-title::before {
  left: 0;
}

.social-title::after {
  right: 0;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.social-icon:hover {
  box-shadow: 0 4px 12px rgba(23, 32, 51, 0.14);
  transform: translateY(-2px);
}

.social-icon:focus-visible {
  outline: 3px solid rgba(63, 121, 245, 0.22);
  outline-offset: 2px;
}

.icon-wechat {
  background: #07c160;
}

.icon-github {
  background: #2f3540;
}

.icon-google {
  border: 1px solid #d7dde7;
  background: #ffffff;
  color: #4285f4;
}

.login-footer {
  text-align: center;
}

.copyright {
  margin: 0;
  color: #a0a9b7;
  font-size: 12px;
  line-height: 1.6;
}

.login-right-panel {
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 48px 56px;
  background: linear-gradient(135deg, #f1f5ff 0%, #e4ecff 52%, #dce8ff 100%);
}

.login-right-panel::before,
.login-right-panel::after {
  position: absolute;
  content: '';
  pointer-events: none;
  border-radius: 50%;
}

.login-right-panel::before {
  top: -180px;
  left: -140px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(63, 121, 245, 0.1) 0%, transparent 70%);
}

.login-right-panel::after {
  right: -180px;
  bottom: -220px;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(94, 126, 194, 0.1) 0%, transparent 70%);
}

.right-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 700px;
  min-height: 0;
  text-align: center;
}

.promo-header {
  margin-bottom: 28px;
}

.promo-title {
  margin: 0 0 10px;
  color: #172033;
  font-size: 30px;
  font-weight: 600;
  line-height: 1.3;
}

.promo-subtitle {
  margin: 0;
  color: #687790;
  font-size: 15px;
  line-height: 1.6;
}

.illustration-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
}

.illustration-image {
  display: block;
  width: min(100%, 640px);
  max-height: calc(100vh - 240px);
  height: auto;
  object-fit: contain;
}

@media (max-height: 820px) {
  .login-left-panel {
    padding-top: 32px;
    padding-bottom: 24px;
  }

  .brand-header {
    margin-bottom: 20px;
  }

  .login-header {
    margin-bottom: 18px;
  }

  .promo-header {
    margin-bottom: 20px;
  }

  .illustration-image {
    max-height: calc(100vh - 190px);
  }
}
</style>
