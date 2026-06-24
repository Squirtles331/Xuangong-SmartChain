# 玄工智链项目 - Gitee CI/CD 搭建指南

> **项目名称**：玄工智链前端（starlink-mos-frontend）
> **技术栈**：Vue 3 + TypeScript + Vite + Element Plus + Pinia
> **包管理器**：pnpm

---

## 📋 搭建前检查

### ✅ 前置条件

- [ ] 已有 Gitee 账号
- [ ] 项目已推送到 Gitee 仓库
- [ ] 本地已安装 Node.js（建议 20.x 版本）
- [ ] 本地已安装 Git

### 📂 项目结构

你的项目现在应该包含以下 CI/CD 相关文件：

```
玄工智链/
├── .gitee/
│   └── workflows/
│       └── ci.yml          # ✅ CI/CD 配置文件（已创建）
├── .env.example            # ✅ 环境变量示例（已创建）
├── package.json
├── vite.config.ts
├── tsconfig.json
└── ...
```

---

## 🚀 搭建步骤

### 步骤 1：提交 CI/CD 配置到 Gitee

在项目根目录执行以下命令：

```bash
# 添加 CI/CD 配置文件
git add .gitee/
git add .env.example

# 提交
git commit -m "feat: 添加 Gitee CI/CD 自动化配置"

# 推送到 Gitee（假设远程仓库名为 origin）
git push -u origin main
```

**如果还没有推送到 Gitee**，先执行以下操作：

```bash
# 初始化 Git 仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始化项目"

# 添加远程仓库
git remote add origin https://gitee.com/你的用户名/玄工智链.git

# 推送到 Gitee
git push -u origin main
```

---

### 步骤 2：在 Gitee 开启流水线服务

1. 登录 [Gitee](https://gitee.com/)
2. 进入你的仓库（玄工智链）
3. 点击左侧菜单 **「持续集成」** → **「流水线」**
4. 如果是第一次使用，点击 **「开始使用」**
5. 你会看到自动创建的流水线（因为已经提交了 `.gitee/workflows/ci.yml`）

---

### 步骤 3：配置环境变量（可选）

如果你的项目需要部署到服务器，需要配置以下环境变量：

#### 3.1 进入环境变量配置页面

1. 在仓库页面，点击 **「设置」** → **「流水线」** → **「环境变量」**
2. 点击 **「添加变量」**

#### 3.2 添加必要的变量

| 变量名              | 说明             | 是否必填     | 示例值                               |
| ------------------- | ---------------- | ------------ | ------------------------------------ |
| `VITE_BASE_URL`     | 应用基础路径     | 否           | `/starlink-mos-frontend/`            |
| `VITE_DROP_CONSOLE` | 是否移除 console | 否           | `true`                               |
| `SSH_PRIVATE_KEY`   | SSH 私钥         | 仅部署时需要 | `-----BEGIN RSA PRIVATE KEY-----...` |
| `REMOTE_HOST`       | 服务器 IP 地址   | 仅部署时需要 | `192.168.1.100`                      |
| `REMOTE_USER`       | 服务器用户名     | 仅部署时需要 | `root`                               |

#### 3.3 生成 SSH 密钥（如果需要部署到服务器）

**在本地生成 SSH 密钥对：**

```bash
# 生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "gitee-ci"

# 查看公钥
cat ~/.ssh/id_rsa.pub

# 查看私钥
cat ~/.ssh/id_rsa
```

**将公钥添加到服务器：**

```bash
# 方式 1：手动添加
# 登录服务器，编辑 ~/.ssh/authorized_keys，粘贴公钥内容

# 方式 2：使用命令添加
ssh root@your-server-ip "cat >> ~/.ssh/authorized_keys" < ~/.ssh/id_rsa.pub
```

**将私钥添加到 Gitee：**

1. 复制私钥的全部内容（包括 `-----BEGIN RSA PRIVATE KEY-----` 和 `-----END RSA PRIVATE KEY-----`）
2. 在 Gitee 环境变量中添加：
   - 名称：`SSH_PRIVATE_KEY`
   - 值：粘贴私钥内容

---

### 步骤 4：运行流水线

配置完成后，每次推送代码到 `main` 或 `develop` 分支时，流水线会自动触发。

你也可以手动触发流水线：

1. 进入仓库的 **「持续集成」** → **「流水线」** 页面
2. 找到你想要运行的流水线
3. 点击右侧的 **「运行」** 按钮
4. 选择要运行的分支
5. 点击 **「确定」**

---

### 步骤 5：查看流水线运行结果

#### 查看流水线状态

在 **「流水线」** 页面，你会看到：

- 🟢 **成功**：所有任务都执行成功
- 🔴 **失败**：有任务执行失败
- 🟡 **进行中**：流水线正在执行

#### 查看任务日志

1. 点击流水线进入详情页
2. 你会看到 6 个任务：
   - `lint` - 代码检查
   - `test` - 运行测试
   - `build` - 构建项目
   - `deploy-pages` - 部署到 Gitee Pages（仅 main 分支）
   - `deploy-server` - 部署到服务器（仅 main 分支，需要配置 SSH）
   - `notify` - 发送通知
3. 点击任意任务查看详细日志

#### 常见状态说明

| 状态    | 说明         | 处理建议                               |
| ------- | ------------ | -------------------------------------- |
| ✅ 成功 | 任务执行成功 | 无需操作                               |
| ❌ 失败 | 任务执行失败 | 查看日志，根据错误信息修复             |
| ⏭️ 跳过 | 任务被跳过   | 通常是因为条件不满足（如非 main 分支） |
| ⏸️ 取消 | 任务被取消   | 可能是流水线被手动停止                 |

---

## 🔧 常见问题与解决方案

### 问题 1：流水线失败，提示 "找不到 pnpm"

**原因**：Gitee 默认不安装 pnpm

**解决方法**：

在 `.gitee/workflows/ci.yml` 中已经包含了 pnpm 安装步骤：

```yaml
- name: 安装 pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 8
```

如果仍然报错，检查：

1. `package.json` 中是否包含 `pnpm-lock.yaml`
2. 是否正确提交到 Gitee

---

### 问题 2：构建失败，提示 "依赖安装错误"

**原因**：可能是网络问题或依赖版本冲突

**解决方法**：

1. **检查 `pnpm-lock.yaml` 是否提交**：

   ```bash
   git status
   # 确保包含 pnpm-lock.yaml
   ```

2. **增加超时时间**：

   ```yaml
   - name: 安装依赖
     run: pnpm install --timeout=600000
   ```

3. **使用镜像源**：

   ```yaml
   - name: 设置 pnpm 镜像源
     run: pnpm config set registry https://registry.npmmirror.com

   - name: 安装依赖
     run: pnpm install
   ```

---

### 问题 3：ESLint 检查失败

**原因**：代码格式或风格不符合规范

**解决方法**：

1. **本地运行 ESLint**：

   ```bash
   pnpm lint:eslint:fix
   ```

2. **查看具体错误**：
   - 在流水线日志中找到 ESLint 任务
   - 查看输出的错误信息
   - 根据错误修复代码

3. **临时禁用某个规则**（不推荐）：
   在 `eslint.config.js` 中修改规则配置。

---

### 问题 4：TypeScript 类型检查失败

**原因**：代码存在类型错误

**解决方法**：

1. **本地运行类型检查**：

   ```bash
   pnpm type-check
   ```

2. **修复类型错误**：
   - 根据错误提示，添加类型注解
   - 使用 `any` 类型（不推荐）

---

### 问题 5：部署到服务器失败

**原因**：SSH 连接失败或权限不足

**解决方法**：

1. **检查 SSH 配置**：
   - 确认 `SSH_PRIVATE_KEY` 已正确配置
   - 确认公钥已添加到服务器
   - 确认服务器防火墙允许 SSH 连接

2. **测试 SSH 连接**：

   ```bash
   ssh root@your-server-ip
   ```

3. **检查服务器权限**：
   - 确保用户有目标目录的写入权限
   - 确保目录存在或可以创建

---

### 问题 6：构建产物路径错误

**原因**：`VITE_BASE_URL` 配置不正确

**解决方法**：

根据部署方式调整 `VITE_BASE_URL`：

- **部署到根目录**：`VITE_BASE_URL=/`
- **部署到子目录**：`VITE_BASE_URL=/starlink-mos-frontend/`
- **部署到 Gitee Pages**：`VITE_BASE_URL=/仓库名/`

---

## 🎯 流水线说明

### 任务 1：Lint（代码检查）

**执行内容**：

- Prettier 格式检查
- ESLint 代码规范检查
- TypeScript 类型检查

**目的**：确保代码质量和一致性

**耗时**：约 2-5 分钟

---

### 任务 2：Test（运行测试）

**执行内容**：

- 运行 Vitest 单元测试

**目的**：确保功能正常

**注意**：

- 如果没有测试用例，任务会跳过或失败（设置了 `continue-on-error: true`）
- 建议添加测试用例以提高代码质量

**耗时**：约 1-3 分钟

---

### 任务 3：Build（构建项目）

**执行内容**：

- 安装依赖
- 使用 Vite 构建生产环境代码
- 优化代码（移除 console、debugger）
- 拆分资源（按模块拆分 JS、CSS）

**构建产物**：

- `dist/index.html` - 入口文件
- `dist/static/js/` - JavaScript 文件
- `dist/static/css/` - CSS 文件
- `dist/static/assets/` - 静态资源

**耗时**：约 3-10 分钟

---

### 任务 4：Deploy Pages（部署到 Gitee Pages）

**触发条件**：仅 `main` 分支

**执行内容**：

- 下载构建产物
- 准备部署文件

**需要手动操作**：

1. 在 Gitee 仓库设置中开启 Pages 服务
2. 选择 `dist` 目录作为静态网站目录
3. 访问提供的 URL

---

### 任务 5：Deploy Server（部署到服务器）

**触发条件**：仅 `main` 分支，且配置了 SSH

**执行内容**：

- 通过 SSH 上传构建产物到服务器
- 使用 rsync 同步文件

**目标目录**：`/var/www/starlink-mos-frontend`（可修改）

**耗时**：约 1-5 分钟（取决于网络和文件大小）

---

### 任务 6：Notify（发送通知）

**触发条件**：总是执行

**执行内容**：

- 发送构建结果通知（钉钉、企业微信等）
- 目前仅输出到日志

---

## 🔄 工作流程

### 开发流程

```
1. 在本地开发功能
   ↓
2. 推送到 develop 分支
   ↓
3. 自动触发流水线（lint + test + build）
   ↓
4. 查看流水线结果
   ↓
5. 如果失败，修复后重新推送
```

### 发布流程

```
1. 开发完成，测试通过
   ↓
2. 合并到 main 分支
   ↓
3. 自动触发完整流水线（包括部署）
   ↓
4. 构建成功后自动部署到服务器
   ↓
5. 验证线上环境
```

---

## 📊 性能优化建议

### 1. 缓存依赖

CI 配置中已经包含了 pnpm 缓存配置，可以显著减少依赖安装时间。

### 2. 并行执行

`lint` 和 `test` 任务可以并行执行，提高流水线速度。

### 3. 减少构建频率

- 避免频繁推送小改动
- 使用 PR（Pull Request）集中合并
- 在合并前只运行 lint 和 test，不运行 build

### 4. 增量构建

对于大型项目，可以考虑增量构建：

```yaml
- name: 检查是否有代码变更
  id: check-changes
  run: |
    git diff --name-only ${{ github.event.before }} ${{ github.sha }} | grep -E '\.(vue|ts|js|scss|css)$' > /dev/null && echo "changed=true" >> $GITHUB_OUTPUT || echo "changed=false" >> $GITHUB_OUTPUT

- name: 构建项目
  if: steps.check-changes.outputs.changed == 'true'
  run: pnpm build
```

---

## 🔐 安全建议

### 1. 不要在代码中硬编码敏感信息

**❌ 错误**：

```typescript
const apiUrl = 'https://api.example.com/secret-key'
```

**✅ 正确**：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### 2. 使用环境变量管理敏感信息

- API 密钥
- 数据库连接字符串
- 第三方服务凭证

在 Gitee 中配置这些变量，不要提交到代码仓库。

### 3. 定期更新依赖

```bash
# 查看过期的依赖
pnpm outdated

# 更新依赖
pnpm update
```

---

## 📝 后续优化建议

### 1. 添加测试用例

目前项目可能没有测试用例，建议添加：

```typescript
// 示例：组件测试
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('渲染正确', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.text()).toContain('Hello')
  })
})
```

### 2. 添加代码覆盖率报告

```yaml
- name: 运行测试并生成覆盖率
  run: pnpm test -- --coverage

- name: 上传覆盖率报告
  uses: codecov/codecov-action@v3
```

### 3. 添加性能监控

集成 Lighthouse 或类似工具，监控应用性能：

```yaml
- name: 运行 Lighthouse
  uses: treosh/lighthouse-ci-action@v10
  with:
    uploadArtifacts: true
    temporaryPublicStorage: true
```

### 4. 添加通知功能

集成钉钉、企业微信或邮件通知：

```yaml
- name: 发送钉钉通知
  if: always()
  run: |
    curl -X POST ${{ secrets.DINGTALK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d "{\"msgtype\":\"text\",\"text\":{\"content\":\"构建完成：${{ github.repository }} - ${{ needs.build.result }}\"}}"
```

### 5. 添加自动回滚

部署失败时自动回滚到上一个版本：

```yaml
- name: 部署失败时回滚
  if: failure()
  run: |
    # 执行回滚命令
    ssh ${{ secrets.REMOTE_USER }}@${{ secrets.REMOTE_HOST }} \
      "cd /var/www/starlink-mos-frontend && ./rollback.sh"
```

---

## 🆘 获取帮助

### Gitee 官方文档

- [Gitee Go 持续集成](https://help.gitee.com/pipelines/)
- [Gitee Actions](https://help.gitee.com/actions/)

### 项目相关文档

- [Vite 官方文档](https://vitejs.dev/)
- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Element Plus 官方文档](https://element-plus.org/)

### 常用命令速查

```bash
# 本地开发
pnpm dev

# 代码检查
pnpm lint:eslint
pnpm lint:eslint:fix
pnpm type-check

# 运行测试
pnpm test

# 构建
pnpm build

# 预览构建结果
pnpm preview
```

---

## ✅ 检查清单

在部署到生产环境前，确认以下事项：

- [ ] 代码已通过 ESLint 检查
- [ ] 代码已通过 TypeScript 类型检查
- [ ] 单元测试全部通过
- [ ] 本地构建成功
- [ ] 环境变量配置正确
- [ ] API 地址配置正确
- [ ] 生产环境去除了 console.log 和 debugger
- [ ] 测试了所有核心功能
- [ ] 已备份当前线上版本
- [ ] 通知了相关人员部署时间

---

## 🎉 完成！

恭喜你！玄工智链项目的 CI/CD 自动化流程已经搭建完成。

从现在开始，每次推送代码到 `main` 或 `develop` 分支时，流水线会自动运行，完成代码检查、测试、构建和部署。

**祝你开发顺利！🚀**
