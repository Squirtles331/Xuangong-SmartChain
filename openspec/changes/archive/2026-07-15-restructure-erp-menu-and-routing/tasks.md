## 1. ERP 路由重构

- [x] 1.1 将 `src/router/modules/erp/index.ts` 重写为 `计划输入 / 物料计划 / 财务承接` 的二级/三级 children 结构
- [x] 1.2 为所有 ERP 页面切换到新的规范化 grouped path，并补齐 group 级与 page 级 `meta` 顺序和标题
- [x] 1.3 清理旧 ERP 路径方案，更新受影响的 `activeMenu`、内部跳转与文档链接，不保留兼容 redirect

## 2. ERP 目录重构

- [x] 2.1 将 `需求池`、`预测需求` 页面迁移到 `src/views/erp/planning-input`
- [x] 2.2 将 `MRP结果`、`净变更计划`、`MRP历史`、`多工厂计划` 页面迁移到 `src/views/erp/material-plan`
- [x] 2.3 将 `总账对账`、`应付管理`、`成本分析`、`财务报表` 页面迁移到 `src/views/erp/finance-carry`，并清理旧目录残留

## 3. 对齐与验证

- [x] 3.1 更新局部组件、静态服务引用及 ERP 菜单到文件映射说明，确保菜单、路由、源码目录一致
- [x] 3.2 验证 ERP 侧边导航在当前布局模式下能正确展开二级/三级菜单并命中页面
- [x] 3.3 运行必要的 lint / 类型检查 / 构建验证，确认重构后无路径与导入错误
