<template>
  <div class="login-container">
    <!-- 左侧品牌展示区域 -->
    <div class="login-left-panel">
      <div class="brand-header">
        <div class="logo">
          <div class="logo-icon"></div>
          <span class="logo-text">玄工智链 · XIC 平台</span>
        </div>
      </div>

      <div class="hero-content">
        <div class="hero-illustration">
          <!-- 3D等距插图区域 -->
          <div class="isometric-platform">
            <div class="platform-element element-1"></div>
            <div class="platform-element element-2"></div>
            <div class="platform-element element-3"></div>
            <div class="platform-element element-4"></div>
            <div class="floating-element float-1"></div>
            <div class="floating-element float-2"></div>
            <div class="floating-element float-3"></div>
          </div>
        </div>

        <div class="hero-text">
          <h1 class="hero-title">制造业一体化数字平台门户</h1>
          <p class="hero-subtitle">统一身份与门户 · 主数据唯一 · 流程引擎统一</p>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="login-right-panel">
      <div class="login-card">
        <div class="login-header">
          <h2 class="login-title">登录玄工智链门户</h2>
          <p class="login-subtitle">使用邮箱/手机号 + 密码登录，支持单点登录</p>
        </div>

        <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
          <!-- 公司选择器 -->
          <el-form-item prop="company">
            <el-select v-model="loginForm.company" placeholder="请选择租户/组织" class="form-select">
              <el-option label="XXX有限公司" value="company1" />
              <el-option label="YYY科技有限公司" value="company2" />
            </el-select>
          </el-form-item>

          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入邮箱/手机号" prefix-icon="User" class="form-input" />
          </el-form-item>

          <!-- 密码 -->
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

          <!-- 验证码 -->
          <el-form-item prop="captcha" class="captcha-item">
            <div class="captcha-container">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="captcha-input" />
              <div class="captcha-image" @click="refreshCaptcha">
                <span class="captcha-text">{{ captchaText }}</span>
                <el-icon class="refresh-icon"><Refresh /></el-icon>
              </div>
            </div>
          </el-form-item>

          <!-- 记住账号和忘记密码 -->
          <div class="form-options">
            <el-checkbox v-model="loginForm.remember" class="remember-checkbox">记住我</el-checkbox>
            <el-link type="primary" class="forgot-link">找回密码</el-link>
          </div>

          <!-- 登录按钮 -->
          <el-button type="primary" class="login-button" @click="handleLogin"> 登录 </el-button>

          <!-- 其他登录方式 -->
          <div class="alternative-login">
            <el-button class="alt-button">短信验证码登录</el-button>
            <el-button class="alt-button">OIDC 单点登录</el-button>
          </div>

          <!-- 社交登录 -->
          <div class="social-login">
            <p class="social-title">第三方登录（钉钉 / 企业微信 / AD）</p>
            <div class="social-icons">
              <div class="social-icon icon-wechat"></div>
              <div class="social-icon icon-github"></div>
              <div class="social-icon icon-google"></div>
              <div class="social-icon icon-qq"></div>
            </div>
          </div>
        </el-form>

        <div class="login-footer">
          <p class="copyright">© 2025 玄工智链 · XIC Platform｜遵循等保三级，HTTPS+JWT，密码国密 SM4</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock, Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

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

    // 开发模式：Mock 登录，跳过真实 API
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
  } finally {
    loading.value = false
  }
}

// Mock 登录：模拟 0.5 秒延迟后直接成功
function mockLogin(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 简单校验：admin/123456 或任意非空账号
      if (loginForm.username && loginForm.password) {
        // 设置用户信息到 localStorage，模拟登录态
        localStorage.setItem('access_token', 'mock_token_' + Date.now())
        localStorage.setItem('refresh_token', 'mock_refresh_token')
        localStorage.setItem('user_info', JSON.stringify({
          id: '1', username: loginForm.username, real_name: loginForm.username,
          roles: ['super_admin'], permissions: ['*']
        }))
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
.login-container {
  display: flex;
  height: 100vh;
  background: #0a0e1a;
  overflow: hidden;
}

// 左侧品牌展示区域
.login-left-panel {
  flex: 1.2;
  background: linear-gradient(135deg, #1a1f3a 0%, #0f1629 50%, #1a1f3a 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);
    pointer-events: none;
  }
}

.brand-header {
  position: relative;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
  border-radius: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 2px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 6px;
    right: 6px;
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 3px;
  }
}

.logo-text {
  color: white;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
}

.hero-illustration {
  margin-bottom: 48px;
}

.isometric-platform {
  width: 320px;
  height: 240px;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(60deg) rotateZ(-45deg);
}

.platform-element {
  position: absolute;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3);

  &.element-1 {
    width: 120px;
    height: 8px;
    bottom: 0;
    left: 0;
    transform: translateZ(20px);
  }

  &.element-2 {
    width: 80px;
    height: 8px;
    bottom: 20px;
    left: 20px;
    transform: translateZ(40px);
    background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
  }

  &.element-3 {
    width: 60px;
    height: 8px;
    bottom: 40px;
    left: 40px;
    transform: translateZ(60px);
    background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  }

  &.element-4 {
    width: 40px;
    height: 8px;
    bottom: 60px;
    left: 60px;
    transform: translateZ(80px);
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  }
}

.floating-element {
  position: absolute;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;

  &.float-1 {
    width: 16px;
    height: 16px;
    top: 20px;
    right: 40px;
    animation-delay: 0s;
  }

  &.float-2 {
    width: 12px;
    height: 12px;
    top: 60px;
    right: 80px;
    animation-delay: 2s;
  }

  &.float-3 {
    width: 20px;
    height: 20px;
    top: 100px;
    right: 20px;
    animation-delay: 4s;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.hero-text {
  text-align: center;
  max-width: 480px;
}

.hero-title {
  color: white;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
  line-height: 1.3;
}

.hero-subtitle {
  color: #9ca3af;
  font-size: 16px;
  line-height: 1.5;
}

// 右侧登录表单区域
.login-right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: rgba(15, 17, 24, 0.8);
  backdrop-filter: blur(10px);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(20, 22, 28, 0.9);
  border-radius: 16px;
  padding: 40px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.login-header {
  margin-bottom: 32px;
  text-align: center;
}

.login-title {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.login-form {
  margin-bottom: 24px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-input__wrapper) {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 8px;
  padding: 12px 16px;

  &:hover {
    border-color: rgba(59, 130, 246, 0.5);
  }

  &.is-focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
}

:deep(.el-input__inner) {
  color: white;
  font-size: 14px;

  &::placeholder {
    color: #6b7280;
  }
}

:deep(.el-select .el-input__wrapper) {
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 8px;
}

.captcha-item {
  margin-bottom: 16px;
}

.captcha-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 100px;
  height: 40px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    animation: shimmer 2s infinite;
  }
}

.captcha-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.refresh-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  color: #6b7280;
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

:deep(.el-checkbox__label) {
  color: #6b7280;
  font-size: 14px;
}

.forgot-link {
  font-size: 14px;
}

.login-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
}

.alternative-login {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.alt-button {
  flex: 1;
  height: 40px;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 8px;
  color: white;
  font-size: 14px;

  &:hover {
    background: rgba(55, 65, 81, 0.8);
    border-color: rgba(107, 114, 128, 0.5);
  }
}

.social-login {
  text-align: center;
}

.social-title {
  color: #6b7280;
  font-size: 12px;
  margin-bottom: 16px;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 60px;
    height: 1px;
    background: rgba(75, 85, 99, 0.3);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &.icon-wechat {
    background: #07c160;
    position: relative;

    &::before {
      content: 'W';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: 600;
      font-size: 16px;
    }
  }

  &.icon-github {
    background: #333;
    position: relative;

    &::before {
      content: 'G';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: 600;
      font-size: 16px;
    }
  }

  &.icon-google {
    background: #fff;
    border: 1px solid #dadce0;
    position: relative;

    &::before {
      content: 'G';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #4285f4;
      font-weight: 600;
      font-size: 16px;
    }
  }

  &.icon-qq {
    background: #12b7f5;
    position: relative;

    &::before {
      content: 'Q';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-weight: 600;
      font-size: 16px;
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: 32px;
}

.copyright {
  color: #6b7280;
  font-size: 12px;
}

// 响应式设计
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }

  .login-left-panel {
    flex: none;
    height: 40vh;
    padding: 24px;
  }

  .hero-content {
    padding: 0 20px;
  }

  .hero-title {
    font-size: 24px;
  }

  .isometric-platform {
    width: 240px;
    height: 180px;
  }

  .login-right-panel {
    flex: 1;
    padding: 24px;
  }

  .login-card {
    max-width: 100%;
    padding: 24px;
  }
}

@media (max-width: 640px) {
  .login-left-panel {
    height: 30vh;
  }

  .hero-illustration {
    display: none;
  }

  .hero-title {
    font-size: 20px;
  }

  .alternative-login {
    flex-direction: column;
  }

  .social-icons {
    flex-wrap: wrap;
  }
}
</style>
