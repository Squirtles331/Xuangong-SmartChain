# GitLab Pages 配置说明

这个仓库已经补好 `GitLab Pages` 所需的核心配置：

- 根目录新增 `.gitlab-ci.yml`，默认在 `默认分支` 成功构建后发布 Pages
- 新增 `.env.gitlab-pages`，发布时使用 `mock` 数据模式
- 流水线会根据 `CI_PAGES_URL` 自动推导 `VITE_BASE_URL`
- 构建完成后会把 `index.html` 复制成 `404.html`，用于单页应用在 GitLab Pages 上刷新子路由时兜底

## 你需要在 GitLab 做的事

1. 把当前代码推到 GitLab 仓库。
2. 确认默认分支是你要发布的分支，比如 `main`。
3. 进入 GitLab 项目：
   `Build > Pipelines` 或 `CI/CD > Pipelines`
4. 让默认分支跑一次流水线。
5. 流水线成功后，进入：
   `Deploy > Pages`
6. 在该页面查看站点地址。

## 当前流水线行为

- 使用 `node 24.11.1`
- 执行 `npm ci`
- 以 `gitlab-pages` 模式执行 `vite build`
- 输出目录固定为 `public`
- 仅默认分支触发正式 Pages 发布

## 路径处理说明

这次没有把站点根路径写死成某个仓库名，而是让 GitLab 在流水线里通过 `CI_PAGES_URL` 自动计算：

- 项目 Pages：会自动得到类似 `/仓库名/`
- 自定义域名：会自动得到 `/`
- 后续仓库改名时：通常不需要再手动改 `VITE_BASE_URL`

## 如果你要绑定自定义域名

如果后面要在 GitLab Pages 上绑定自定义域名，当前配置通常可以直接复用，因为自定义域名下的 `CI_PAGES_URL` 路径通常就是根路径 `/`。

绑定后建议检查两件事：

1. `Deploy > Pages` 中的域名状态是否正常
2. 页面刷新任意子路由时是否能正常回到前端应用

## 本地模拟 GitLab Pages 构建

可以在本地用下面的方式模拟子路径发布：

```powershell
$env:VITE_BASE_URL='/your-project/'
$env:VITE_OUT_DIR='public'
npm run build -- --mode gitlab-pages
```

构建完成后重点检查：

- `public/index.html` 里的资源路径是否带上了子路径前缀
- 打开子页面后刷新，线上是否能通过 `404.html` 兜底回到应用
