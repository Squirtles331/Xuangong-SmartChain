---
name: xuangong-development-baseline
description: Single entry skill for Xuangong Zhilian development. Use this first for any task in this repo that touches planning, OpenSpec workflow, module order, object ownership, static-page delivery, route or menu structure, frontend CRUD pages, mock/API sequencing, or archive and closeout. This skill should decide which project references and child skills to consult next.
---

Use this skill before starting implementation in this project.

Treat it as the project-level development operating baseline.

This is the preferred single entry skill for the repo.

Do not require the user to manually choose many project skills before work starts.

Use it to answer:

- what to build first
- which module owns the object truth
- whether the page is ready for static implementation
- whether the work should stay static or move into mock/API
- which reference document to open next
- which child skill to use next

## Single Entry Rule

Use this skill as the default first step for normal project work.

Preferred usage:

```text
Use $xuangong-development-baseline first
```

Then let this skill route the work.

Recommended starter commands:

```text
使用 $xuangong-development-baseline，讨论下一步先开发哪个模块
使用 $xuangong-development-baseline，继续开发当前批次页面
使用 $xuangong-development-baseline，先梳理这个需求再决定是否进入 OpenSpec
使用 $xuangong-development-baseline，按项目基线直接实现这个页面
使用 $xuangong-development-baseline，检查这次工作是否可以归档
```

Do not expect the user to manually choose among:

- `frontend-baseline`
- `openspec-explore`
- `openspec-propose`
- `openspec-apply-change`
- `openspec-archive-change`

This skill should decide whether any of those are needed.

## Dispatch Order

When this skill is invoked, follow this order:

1. classify the request
2. confirm the current phase
3. open the minimum necessary references
4. choose the next child skill only if needed
5. continue implementation in project order

### 1. Classify the request

Classify the task into one of these types:

- exploration or requirement clarification
- formal change planning
- formal change implementation
- archive and closeout
- frontend baseline or page refactor
- business page development
- static-to-mock or API transition

### 2. Confirm the current phase

Confirm whether the work is currently in:

- baseline clarification
- static page implementation
- mock design
- API design
- archive or closeout

Default assumption for this project:

```text
stay in static-first mode unless the request clearly moves to mock or api
```

### 3. Open minimum references

Start from:

- [references/development-doc-map.md](references/development-doc-map.md)

Then open only the documents relevant to the current task.

### 4. Choose the next child skill only if needed

Use child skills in this order:

- if the task is exploratory or requirements are unclear, consult [openspec-explore](/D:/Project/玄工智链/.codex/skills/openspec-explore/SKILL.md)
- if the task is a formal new change proposal, consult [openspec-propose](/D:/Project/玄工智链/.codex/skills/openspec-propose/SKILL.md)
- if the task is formal implementation under a change, consult [openspec-apply-change](/D:/Project/玄工智链/.codex/skills/openspec-apply-change/SKILL.md)
- if the task is frontend-heavy, also consult [frontend-baseline](/D:/Project/玄工智链/.codex/skills/frontend-baseline/SKILL.md)
- if the task is archive and closeout, consult [openspec-archive-change](/D:/Project/玄工智链/.codex/skills/openspec-archive-change/SKILL.md)

Do not load all child skills every time.

Only load the one that matches the current phase and task shape.

### 5. Continue in project order

After routing, continue the task using the module order, ownership rules, and static-first rules in this skill.

## Core Position

Do not optimize for page count first.

Optimize for:

- unified object truth
- stable module boundaries
- static-first delivery
- lower rework risk
- Chinese product-facing clarity

## Mandatory Rules

### 1. Follow static-first delivery

Use this sequence:

```text
menu and naming baseline
-> static page structure
-> static data structure
-> routing and jumps
-> mock
-> api
```

Do not reverse it.

### 2. Keep module ownership explicit

Before implementing a page, confirm:

1. the primary object
2. the owning module
3. whether the page maintains the object or consumes it
4. which upstream objects it depends on

One page may reference many objects, but it must have one primary object.

### 3. Use Chinese product naming

Use Chinese page titles, menu titles, and product-facing labels.

Do not expose domain abbreviations such as `PLM`, `MES`, or `ERP` to end users as page titles unless the page is explicitly for expert/internal technical audiences.

### 4. Do not let downstream modules redefine upstream truth

Use this ownership logic:

- `MDM` owns shared master data
- `PLM` owns product and engineering definitions
- `MES` owns production execution truth
- `WMS` owns warehouse transactions and stock movement truth
- `QMS` owns inspection and quality judgment truth
- `APS` owns planning results, not master truth
- `ERP` owns business orders, accounting, and financial carrying objects

If a downstream page needs upstream fields, consume them. Do not quietly redefine them.

### 5. Build by business chain, not by equal module spread

Do not open all modules in parallel just because routes already exist.

Use the formal module order:

```text
PLM -> MES -> WMS -> QMS -> APS -> ERP -> SRM -> CRM -> EAM -> IOT -> BI -> SYS
```

`MDM` is the current completed foundation and should be treated as the upstream base, not the next expansion target.

## Current Recommended Delivery Order

Use this batch order unless the user explicitly overrides it:

### Batch 1

- `PLM`
- goal: stabilize BOM, process routing, process operation, and engineering change pages

### Batch 2

- `MES`
- goal: stabilize work order, dispatch, reporting, and execution relationship pages

### Batch 3

- `WMS`
- goal: stabilize receipt, picking, return, and inventory transaction pages

### Batch 4

- `QMS`
- goal: stabilize incoming, in-process, and finished inspection pages

### Batch 5

- `APS`
- `ERP`
- goal: add planning and business documents on top of the manufacturing chain

### Batch 6

- `SRM`
- `CRM`
- goal: add supplier collaboration and customer collaboration

### Batch 7

- `EAM`
- `IOT`
- `BI`
- `SYS`
- goal: close equipment support, monitoring, analytics, and governance

## Default Workflow Templates

Use these templates so the user can rely on this one skill.

### Template A: Discuss the next development step

1. use this skill
2. load module-order references
3. decide the next module batch
4. output the direct recommended sequence

### Template B: Start implementing a new page or module

1. use this skill
2. confirm module ownership and current batch
3. if frontend-heavy, consult `frontend-baseline`
4. stay in static-first mode unless explicitly moved forward
5. implement

### Template C: Start a formal OpenSpec change

1. use this skill
2. decide whether the work is exploration, proposal, implementation, or archive
3. consult the corresponding OpenSpec child skill
4. continue without asking the user to choose the child skill manually

### Template D: Archive completed work

1. use this skill
2. verify task status honestly
3. verify docs and baseline updates are synchronized
4. consult `openspec-archive-change`
5. archive only after real closeout

## Fixed Prompt Templates

Use these as copy-ready prompts for daily work.

### 1. Discuss next module

```text
使用 $xuangong-development-baseline，结合当前进度，判断下一步先开发哪个菜单模块，并直接给出推荐顺序。
```

### 2. Start current batch

```text
使用 $xuangong-development-baseline，按当前推荐批次继续开发，不做 mock，直接进入静态页与静态数据实现。
```

### 3. Start a specific module

```text
使用 $xuangong-development-baseline，开始开发 {模块名}，先判断它在当前批次中的位置，再按项目基线直接实现。
```

### 4. Start a specific page

```text
使用 $xuangong-development-baseline，开始开发 {页面名}，先确认主对象、模块归属、页面阶段，再按静态优先规则实现。
```

### 5. Frontend refactor

```text
使用 $xuangong-development-baseline，处理这个前端重构任务，必要时自动衔接 frontend-baseline，不需要我手动选择。
```

### 6. OpenSpec decision

```text
使用 $xuangong-development-baseline，先判断这项工作应该走 explore、propose、apply 还是 archive，再继续处理。
```

### 7. Continue an existing change

```text
使用 $xuangong-development-baseline，继续当前变更，自动判断下一步该看哪些文档和是否需要衔接 OpenSpec 子技能。
```

### 8. Archive check

```text
使用 $xuangong-development-baseline，检查当前工作是否满足归档条件，如果还不满足，直接指出缺口。
```

## Page Readiness Check

Before implementing a page, confirm all of the following:

1. final Chinese naming is settled
2. menu ownership is settled
3. primary object is settled
4. static fields are settled
5. state tags are settled
6. toolbar and row-action hierarchy are settled
7. default routing and active-menu behavior are settled

If these are not stable, stay in planning and static refinement. Do not move into mock or API.

## Frontend And CRUD Rules

When the task is frontend-heavy, also use the project skill:

- [frontend-baseline](/D:/Project/玄工智链/.codex/skills/frontend-baseline/SKILL.md)

Keep these baseline rules in mind:

- use the shared page shell rules from the frontend baseline
- keep layout and navigation aligned with route modules
- prefer `CrudPage` as the page-level CRUD container
- keep page-local static data and page-local configuration close to the page unless there is a clear reusable pattern
- do not introduce new demo-style containers, colors, or layout modes casually

## OpenSpec Workflow Rules

Use the project OpenSpec skills deliberately:

- [openspec-explore](/D:/Project/玄工智链/.codex/skills/openspec-explore/SKILL.md) for exploration and requirement clarification
- [openspec-propose](/D:/Project/玄工智链/.codex/skills/openspec-propose/SKILL.md) for formal change proposal
- [openspec-apply-change](/D:/Project/玄工智链/.codex/skills/openspec-apply-change/SKILL.md) for implementation
- [openspec-archive-change](/D:/Project/玄工智链/.codex/skills/openspec-archive-change/SKILL.md) for archive and closeout

Do not archive a change only because code exists.

Before archive, verify:

1. implementation scope matches the change
2. task status is backfilled honestly
3. incomplete mock/API work is explicitly called out
4. supporting docs are synchronized when the baseline changed

## Reference Loading Rule

Do not read every project document every time.

Open the right reference based on the task type.

Start with:

- [references/development-doc-map.md](references/development-doc-map.md)

Then open only the documents relevant to the current task.

## Expected Behavior Before Starting Work

Before changing code in this repo:

1. classify the task by module and primary object
2. confirm whether it is still in static phase
3. check whether the task belongs to the current recommended module batch
4. align page naming, ownership, state flow, and CRUD behavior
5. only then implement

If a request conflicts with this baseline, update the baseline deliberately first rather than drifting silently.

## Final Operating Rule

For normal project use, this skill should behave like the repo dispatcher.

That means:

- the user invokes one skill
- this skill decides what to read next
- this skill decides whether another project skill is needed
- this skill keeps the work aligned with the current project order

Use this to reduce repeated manual skill selection.
