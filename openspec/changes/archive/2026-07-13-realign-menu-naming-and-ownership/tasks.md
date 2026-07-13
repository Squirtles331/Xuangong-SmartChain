## 1. Baseline Alignment

- [x] 1.1 Build a current-vs-target menu matrix from `src/router/index.ts` and the architecture documents.
- [x] 1.2 Resolve naming conflicts for all first-level and second-level menu groups using user-facing product language.
- [x] 1.3 Resolve ownership conflicts for `MDM`, `版本切换`, `返工`, `异常中心`, `投料/消耗`, and `WMS/MES/QMS` boundary pages.

## 2. Documentation Source Of Truth

- [x] 2.1 Create the canonical menu catalog with fields for visible label, path, level, parent group, primary owner, collaborator systems, core object, and status.
- [x] 2.2 Update the menu architecture document so that menu names and grouping match the canonical menu catalog.
- [x] 2.3 Update the development reference and front-end planning documents so that page ownership language matches the canonical menu catalog.

## 3. Frontend Navigation Refactor

- [x] 3.1 Update router metadata for visible titles, group labels, ordering, and `activeMenu` mappings based on the canonical menu catalog.
- [x] 3.2 Add or align route-level metadata needed to express primary owner, collaborator systems, and boundary notes.
- [x] 3.3 Update layout navigation, breadcrumbs, and placeholder page copy to use the revised product-facing menu labels.

## 4. Follow-on Delivery Readiness

- [x] 4.1 Redefine the homepage workbench information architecture so it serves as an action-oriented cross-domain workbench rather than a duplicate of the business dashboard.
- [x] 4.2 Split homepage workbench content from `管理分析 / 经营驾驶舱`, keeping only lightweight business summary on the homepage and moving deep analysis expectations to the management analysis domain.
- [x] 4.3 Re-sequence the static-page development plan using the new menu baseline, homepage workbench baseline, and ownership mapping.
- [x] 4.4 Define the handoff rule that static pages MUST follow the canonical menu catalog before any mock integration begins.
- [x] 4.5 Produce a homepage workbench module blueprint covering wireframe, module order, static data fields, and default route mapping for static-page implementation.
