---
name: frontend-baseline
description: Apply the Xuangong Zhilian frontend baseline before starting UI, layout, static page, or CRUD development. Use when working on themes, layout, system platform pages, workbench pages, or any static-first frontend refactor in this project.
license: MIT
compatibility: Project-local skill for Xuangong Zhilian frontend work.
metadata:
  author: codex
  version: '1.0'
  generatedBy: 'codex'
---

Use this skill before starting frontend implementation in this project.

This skill defines the **product-facing frontend baseline** for:

- theme direction
- layout decisions
- page shell rules
- CRUD page conventions
- workbench positioning
- static-page-first delivery order

This is not a one-off task note. Treat it as a reusable project rule set.

---

## Quick Use

Reach for this skill first when the task involves any of these:

- theme or color changes
- layout or navigation changes
- workbench homepage changes
- CRUD page refactors
- toolbar / row-action / status-tag decisions
- static page planning before mock

Short trigger sentence:

> Before changing frontend pages in this project, align with `frontend-baseline` first.

---

## When To Use

Use this skill when working on:

- `src/layout/**`
- `src/router/**`
- `src/views/**`
- `src/components/crud/**`
- workbench homepage redesign
- system platform pages
- any new static page
- any page refactor that touches titles, layout, toolbar, actions, or page structure

Especially use it before:

- building a new static page
- refactoring a CRUD page
- changing theme or layout
- introducing new page-level containers
- starting mock integration for a page

---

## Core Position

The frontend is not currently optimizing for "ship many pages quickly".

The current priority is:

```text
stabilize the reusable baseline first
then scale page implementation
```

That baseline includes:

1. theme direction
2. layout structure
3. page shell conventions
4. system platform sample pages
5. workbench homepage baseline

---

## Theme Baseline

### Official Theme Direction

Use:

- `industrial blue-gray` as the official primary theme
- `night-shift dark blue` only as an optional secondary theme

Do not continue using theme logic as a template showcase.

Avoid:

- many dark themes in parallel
- free-form primary color switching as a formal product capability
- flashy bright-template blue
- colorful demo-style presets

### Theme Keywords

All UI decisions should align with:

- professional
- stable
- industrial
- restrained
- comfortable for long-duration use

### Visual Layering

Think in three layers:

```text
Layout defines the product shell
Workbench defines the entry rhythm
CRUD pages define operation efficiency
```

Visual intensity should roughly decrease like this:

```text
sidebar > key workbench modules > normal pages > table content
```

---

## Layout Baseline

### Supported Modes

Use:

- `classic` as the only formal main layout
- `embedded` only for special pages

Do not continue expanding these as formal main product modes:

- `vertical`
- `horizontal`
- `mixed`
- `columns`

### Navigation Structure

Navigation must stay structurally aligned with the current route split.

Use:

- first level = business domain
- second/third level = domain-internal menus

Do not fall back to mixed umbrella groupings.

### Header Scope

Keep only high-frequency global capabilities:

- breadcrumb
- user dropdown
- notifications
- fullscreen
- global search
- lightweight settings entry

Avoid turning the header into a capability showroom.

### Tabs Strategy

Keep:

- lightweight tabs

Allowed capabilities:

- fixed home tab
- active tab highlight
- closable tabs
- recent-page switching

Do not prioritize:

- drag sorting
- multi-workspace tabs
- complex cache management
- advanced tab platform features

### Scroll And Padding

Use this responsibility model:

```text
layout controls height
main content controls scrolling
page-layout controls shared page padding
pages should not recreate full-page scroll shells
```

This rule exists to prevent:

- inconsistent page padding
- workbench scroll breakage
- repeated container shells
- different scroll behavior per page

---

## Page Shell Baseline

All pages should map into one of four page shell types:

1. workbench page
2. CRUD list page
3. detail page
4. planned placeholder page

### Shared Page Header Pattern

Use a consistent page header structure:

```text
left: title + optional subtitle / ownership hint
right: primary action + secondary actions
below: search area or summary area depending on page type
```

The page header should feel like part of one product, not a new page system every time.

---

## CRUD Baseline

### First Sample Pages

Use these system platform pages as the baseline order:

1. user
2. params
3. role
4. menu
5. dict
6. approval

Recommended grouping:

```text
light samples:
user -> params -> role

complex samples:
menu -> dict -> approval
```

### What Each Sample Validates

`user`

- standard CRUD shell
- search area
- toolbar rules
- row action rules
- status tag rules
- dialog form rules

`params`

- configuration-style CRUD
- value / category / description density
- action hierarchy on configuration pages

`role`

- authorization-type page conventions
- complexity boundary vs normal CRUD

`menu`

- tree + table + structure page conventions
- structural page scroll and height strategy

`dict`

- main list + sub-item management
- multi-dialog page organization

`approval`

- complex configuration page expression
- step / node presentation rules

### CRUD Action Rules

#### Toolbar

Use:

- one clear primary action
- a small number of secondary text or light actions

Default pattern:

```text
[primary create action]   refresh
```

#### Row Actions

Default exposed actions:

- `edit`
- `delete`

When actions grow, prefer:

```text
edit   more
```

Move low-frequency or risk-heavy actions into `more`.

#### Color Hierarchy

Use only a restrained action color model:

- primary
- default
- danger

Do not assign many colors to many action types.

### Status Tags

Status tags should be:

- small
- low saturation
- semantically clear
- not visually loud

Use semantic colors only for real state meaning.

---

## Subtitle And Ownership Hint Rules

Page subtitles are encouraged.

Ownership hints are selective.

### Always Keep A Short Subtitle

Every key system-platform sample page should have a short one-line subtitle that explains page purpose in product language.

### Only Use Ownership Hints On Abstract Or Boundary-Sensitive Pages

Recommended:

- menu
- params
- approval

Usually subtitle only is enough for:

- user
- role
- dict

Do not turn page headers into documentation panels.

---

## Workbench Baseline

Workbench is not a BI cockpit and not a domain sub-home.

It is:

> the post-login cross-domain action workbench

### Fixed Module Order

Use this order:

1. my tasks
2. today exceptions and alerts
3. execution overview
4. collaboration summary
5. quick entry
6. business summary

### First Screen Priority

The first screen should prioritize:

- my tasks
- today exceptions and alerts
- execution overview

### Boundary With BI

Workbench answers:

> what should I do now?

BI dashboard answers:

> how has the business been performing recently?

Do not let the workbench drift into a large business cockpit.

---

## Static-First Delivery Rule

The project currently follows this sequence:

```text
menu and naming baseline
-> static page structure
-> static data structure
-> page routing and jumps
-> mock
-> api
```

Do not reverse that order.

### A Page Must Not Enter Mock Before These Are Stable

1. final Chinese page/menu naming is aligned
2. page domain ownership is confirmed
3. primary system / collaborator system / core object are clear
4. static data fields are stable
5. default jumps and active-menu behavior are stable

If those are not stable, do not move the page into mock integration.

---

## Recommended Implementation Sequence

Use this project-level order:

```text
theme baseline
-> layout baseline
-> system platform light samples
-> workbench
-> system platform complex samples
-> MES / QMS / WMS main execution chain
-> PLM / APS / ERP precondition chain
-> remaining collaboration and analysis domains
```

### Next Main Business Chain After Baseline

After the UI baseline is stable, move into:

1. work order list
2. my tasks
3. operation task
4. WIP
5. inspection task
6. exception handling
7. production picking
8. nonconformance handling

---

## Required Behavior Before Starting Frontend Work

Before implementing a frontend task in this repo, check:

1. does this task affect theme or layout baseline?
2. which page shell type does it belong to?
3. is there already a sample page rule it should follow?
4. is this page ready for static implementation or still unclear in ownership/naming?

If the task touches any of the following, explicitly align with this skill first:

- page title
- breadcrumb
- toolbar
- row actions
- status tags
- page header
- page container
- theme color usage
- domain placement

---

## Related References

Use these files together with this skill:

- [docs/ui-foundation-baseline-plan.md](D:/Project/玄工智链/docs/ui-foundation-baseline-plan.md)
- [玄工智链\_系统菜单架构与页面说明\_V1.0.md](D:/Project/玄工智链/玄工智链_系统菜单架构与页面说明_V1.0.md)
- [玄工智链\_一体化平台开发参考总册\_V1.0.md](D:/Project/玄工智链/玄工智链_一体化平台开发参考总册_V1.0.md)
- [玄工智链\_PC端前端开发计划\_V1.0.md](D:/Project/玄工智链/玄工智链_PC端前端开发计划_V1.0.md)

---

## Final Rule

Do not optimize for page count first.

Optimize for:

- reusable baseline stability
- product-facing clarity
- static-first consistency
- reduced rework

If a new frontend change conflicts with this baseline, update the baseline deliberately first rather than silently drifting away from it.
