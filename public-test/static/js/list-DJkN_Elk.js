import {
  Bn as s,
  Fn as x,
  H,
  Kn as X,
  Mn as R,
  On as B,
  U as Y,
  W as J,
  Xn as g,
  Yn as Q,
  an as N,
  b as Z,
  dn as i,
  i as _,
  pn as V,
  rn as z,
  rr as b,
  sr as C,
  un as E,
  y as ee,
  yn as A
} from './element-plus-CzL7BOKu.js'
import { t as ae } from './useTable-Hzr4fBAy.js'
import { t as q } from './StatusTag-DWd3m1xj.js'
import { t as te } from './CrudPage-7Q0FEhS_.js'
import { t as le } from './CrudRowActions-Dmc4i_Io.js'
var ne = V({
    __name: 'ECNFormDialog',
    props: A({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: A(['submit'], ['update:visible', 'update:form']),
    setup(p, { emit: v }) {
      const r = x(p, 'visible'),
        u = x(p, 'form'),
        f = v,
        c = [
          { type: 'input', label: '变更单号', field: 'code', required: !0 },
          {
            type: 'select-v2',
            label: '变更类型',
            field: 'change_type',
            required: !0,
            props: {
              options: [
                { label: 'BOM变更', value: 'BOM变更' },
                { label: '工艺变更', value: '工艺变更' },
                { label: 'BOM+工艺变更', value: 'BOM+工艺变更' }
              ]
            }
          },
          { type: 'input', label: '变更对象', field: 'material', required: !0 },
          { type: 'input', label: '当前版本', field: 'current_version' },
          { type: 'input', label: '目标版本', field: 'target_version', required: !0 },
          {
            type: 'select-v2',
            label: '紧急程度',
            field: 'urgency',
            required: !0,
            props: {
              options: [
                { label: '紧急', value: 'urgent' },
                { label: '普通', value: 'normal' },
                { label: '计划', value: 'planned' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            required: !0,
            props: {
              options: [
                { label: '草稿', value: 'draft' },
                { label: '待审批', value: 'pending_approval' },
                { label: '已批准', value: 'approved' },
                { label: '执行中', value: 'executing' },
                { label: '已验证', value: 'verified' },
                { label: '已关闭', value: 'closed' }
              ]
            }
          },
          { type: 'input', label: '申请人', field: 'applicant' },
          { type: 'input', label: '计划切换日期', field: 'plan_effective_date' },
          { type: 'textarea', label: '变更原因', field: 'reason', props: { rows: 4, placeholder: '请说明版本切换原因与预期收益' } }
        ]
      function y() {
        r.value = !1
      }
      async function n() {
        return (f('submit'), !1)
      }
      return (d, o) => {
        const a = R('gi-form'),
          h = R('gi-dialog')
        return (
          B(),
          N(
            h,
            {
              modelValue: r.value,
              'onUpdate:modelValue': o[1] || (o[1] = (m) => (r.value = m)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': n,
              'on-cancel': y,
              title: p.mode === 'add' ? '新建工程变更单' : '编辑工程变更单',
              width: '720px'
            },
            {
              default: s(() => [
                i(a, { modelValue: u.value, 'onUpdate:modelValue': o[0] || (o[0] = (m) => (u.value = m)), columns: c, 'label-width': 110 }, null, 8, [
                  'modelValue'
                ])
              ]),
              _: 1
            },
            8,
            ['modelValue', 'title']
          )
        )
      }
    }
  }),
  ie = ne,
  re = V({
    __name: 'ECNImpactDialog',
    props: { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, data: { required: !0 }, dataModifiers: {} },
    emits: ['update:visible', 'update:data'],
    setup(p) {
      const v = x(p, 'visible'),
        r = x(p, 'data')
      return (u, f) => {
        const c = J,
          y = Y,
          n = Z,
          d = ee,
          o = H
        return (
          B(),
          N(
            o,
            {
              modelValue: v.value,
              'onUpdate:modelValue': f[0] || (f[0] = (a) => (v.value = a)),
              title: 'ECN 影响分析报告',
              width: '800px',
              'lock-scroll': !1
            },
            {
              default: s(() => [
                i(
                  y,
                  { column: 2, border: '', style: { 'margin-bottom': '16px' } },
                  {
                    default: s(() => [
                      i(c, { label: '变更单号' }, { default: s(() => [E(C(r.value.code), 1)]), _: 1 }),
                      i(c, { label: '变更对象' }, { default: s(() => [E(C(r.value.material), 1)]), _: 1 }),
                      i(c, { label: '变更类型' }, { default: s(() => [E(C(r.value.change_type), 1)]), _: 1 }),
                      i(c, { label: '当前版本' }, { default: s(() => [E(C(r.value.current_version), 1)]), _: 1 })
                    ]),
                    _: 1
                  }
                ),
                i(
                  d,
                  { data: r.value.items, border: '' },
                  {
                    default: s(() => [
                      i(n, { prop: 'dimension', label: '影响维度', width: '120' }),
                      i(n, { prop: 'detail', label: '详情' }),
                      i(n, { prop: 'count', label: '数量', width: '80', align: 'center' })
                    ]),
                    _: 1
                  },
                  8,
                  ['data']
                )
              ]),
              _: 1
            },
            8,
            ['modelValue']
          )
        )
      }
    }
  }),
  se = re,
  oe = V({
    __name: 'index',
    setup(p) {
      const v = [
          { value: 'urgent', label: '紧急', type: 'danger' },
          { value: 'normal', label: '普通', type: 'warning' },
          { value: 'planned', label: '计划', type: 'info' }
        ],
        r = [
          { value: 'draft', label: '草稿', type: 'info' },
          { value: 'pending_approval', label: '待审批', type: 'warning' },
          { value: 'approved', label: '已批准', type: 'primary' },
          { value: 'executing', label: '执行中', type: 'warning' },
          { value: 'verified', label: '已验证', type: 'success' },
          { value: 'closed', label: '已关闭', type: 'info' }
        ],
        u = g([
          {
            id: 'ECN-001',
            code: 'ECN-202607-001',
            change_type: 'BOM+工艺变更',
            material: '供液控制总成',
            current_version: 'EBOM V2.3 / RT V2.0',
            target_version: 'EBOM V2.4 / RT V2.1',
            status: 'pending_approval',
            urgency: 'urgent',
            applicant: '李工艺',
            plan_effective_date: '2026-07-18',
            impact_scope: '在制工单 / 原材料库存 / 工艺路线',
            reason: '新增密封结构，解决现场渗漏问题',
            createdAt: '2026-07-12 15:36'
          },
          {
            id: 'ECN-002',
            code: 'ECN-202607-002',
            change_type: '工艺变更',
            material: '壳体粗加工件',
            current_version: 'RT V1.0',
            target_version: 'RT V1.1',
            status: 'approved',
            urgency: 'normal',
            applicant: '周制造',
            plan_effective_date: '2026-07-16',
            impact_scope: '工时参数 / 工序顺序 / 质检关卡',
            reason: '缩短排队工时并新增中间检验点',
            createdAt: '2026-07-11 10:22'
          },
          {
            id: 'ECN-003',
            code: 'ECN-202607-003',
            change_type: 'BOM变更',
            material: '真空模组总成',
            current_version: 'EBOM V3.1',
            target_version: 'EBOM V3.2',
            status: 'executing',
            urgency: 'planned',
            applicant: '陈设计',
            plan_effective_date: '2026-07-20',
            impact_scope: '采购替代料 / 装配辅料 / 现场切换',
            reason: '替换老版本密封辅料，收敛供应风险',
            createdAt: '2026-07-10 18:08'
          },
          {
            id: 'ECN-004',
            code: 'ECN-202607-004',
            change_type: 'BOM变更',
            material: '供液控制总成',
            current_version: 'MBOM V1.1',
            target_version: 'MBOM V1.2',
            status: 'verified',
            urgency: 'normal',
            applicant: '周制造',
            plan_effective_date: '2026-07-14',
            impact_scope: '领料口径 / 制造版本切换',
            reason: '制造口径结构与现场投料同步修正',
            createdAt: '2026-07-09 14:30'
          }
        ]),
        f = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '变更单号 / 对象 / 申请人' } },
          {
            type: 'select-v2',
            label: '变更类型',
            field: 'changeType',
            props: {
              options: [
                { label: '全部', value: '' },
                { label: 'BOM变更', value: 'BOM变更' },
                { label: '工艺变更', value: '工艺变更' },
                { label: 'BOM+工艺变更', value: 'BOM+工艺变更' }
              ]
            }
          },
          {
            type: 'select-v2',
            label: '状态',
            field: 'status',
            props: { options: [{ label: '全部', value: '' }, ...r.map((e) => ({ label: e.label, value: e.value }))] }
          },
          {
            type: 'select-v2',
            label: '紧急程度',
            field: 'urgency',
            props: { options: [{ label: '全部', value: '' }, ...v.map((e) => ({ label: e.label, value: e.value }))] }
          }
        ],
        c = { span: { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 } },
        y = [
          { prop: 'code', label: '变更单号', minWidth: 160 },
          { prop: 'change_type', label: '变更类型', minWidth: 120 },
          { prop: 'material', label: '变更对象', minWidth: 170 },
          { prop: 'current_version', label: '当前版本', minWidth: 160 },
          { prop: 'target_version', label: '目标版本', minWidth: 160 },
          { label: '紧急程度', minWidth: 100, slotName: 'urgency', align: 'center' },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { prop: 'plan_effective_date', label: '计划切换日期', minWidth: 130 },
          { prop: 'applicant', label: '申请人', minWidth: 100 },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      let n = Q({ keyword: '', changeType: '', status: '', urgency: '' })
      const d = g(!1),
        o = g('add'),
        a = g(T()),
        h = g(!1),
        m = g({ code: '', material: '', change_type: '', current_version: '', items: [] }),
        O = z(() =>
          u.value.filter((e) => {
            const t = n.keyword.trim().toLowerCase(),
              l = !t || e.code.toLowerCase().includes(t) || e.material.toLowerCase().includes(t) || e.applicant.toLowerCase().includes(t),
              M = !n.changeType || e.change_type === n.changeType,
              j = !n.status || e.status === n.status,
              G = !n.urgency || e.urgency === n.urgency
            return l && M && j && G
          })
        ),
        {
          tableData: U,
          pagination: W,
          loading: S,
          search: k,
          refresh: D
        } = ae({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const l = (e - 1) * t,
              M = l + t
            return { list: O.value.slice(l, M), total: O.value.length }
          }
        })
      function T() {
        return {
          id: '',
          code: '',
          change_type: 'BOM变更',
          material: '',
          current_version: '',
          target_version: '',
          status: 'draft',
          urgency: 'normal',
          applicant: '',
          plan_effective_date: '',
          reason: ''
        }
      }
      function I(e) {
        return [
          { key: 'impact', label: '影响分析', tone: 'primary' },
          { key: 'edit', label: '编辑', tone: 'secondary', hidden: e.status !== 'draft' },
          { key: 'submit', label: '提交审批', tone: 'warning', hidden: e.status !== 'draft' },
          { key: 'execute', label: '执行', tone: 'success', hidden: e.status !== 'approved' },
          { key: 'verify', label: '验证', tone: 'success', hidden: e.status !== 'executing' },
          { key: 'close', label: '关闭', tone: 'danger', hidden: e.status !== 'verified' }
        ]
      }
      function F() {
        ;(Object.assign(n, { keyword: '', changeType: '', status: '', urgency: '' }), k())
      }
      function w() {
        ;((o.value = 'add'), (a.value = T()), (d.value = !0))
      }
      function L(e) {
        ;((o.value = 'edit'),
          (a.value = {
            id: e.id,
            code: e.code,
            change_type: e.change_type,
            material: e.material,
            current_version: e.current_version,
            target_version: e.target_version,
            status: e.status,
            urgency: e.urgency,
            applicant: e.applicant,
            plan_effective_date: e.plan_effective_date,
            reason: e.reason
          }),
          (d.value = !0))
      }
      async function P() {
        if (!a.value.code || !a.value.material || !a.value.target_version) {
          _.warning('请完整填写变更单号、变更对象和目标版本')
          return
        }
        ;(o.value === 'add'
          ? (u.value.unshift({
              id: `ECN-${Date.now()}`,
              code: a.value.code,
              change_type: a.value.change_type,
              material: a.value.material,
              current_version: a.value.current_version,
              target_version: a.value.target_version,
              status: a.value.status,
              urgency: a.value.urgency,
              applicant: a.value.applicant || '待填写',
              plan_effective_date: a.value.plan_effective_date || '待排期',
              impact_scope: '待补充影响分析',
              reason: a.value.reason || '待补充变更原因',
              createdAt: '2026-07-13 23:58'
            }),
            _.success('已新增静态 ECN 数据'))
          : ((u.value = u.value.map((e) =>
              e.id === a.value.id
                ? {
                    ...e,
                    code: a.value.code,
                    change_type: a.value.change_type,
                    material: a.value.material,
                    current_version: a.value.current_version,
                    target_version: a.value.target_version,
                    status: a.value.status,
                    urgency: a.value.urgency,
                    applicant: a.value.applicant || '待填写',
                    plan_effective_date: a.value.plan_effective_date || '待排期',
                    reason: a.value.reason || '待补充变更原因'
                  }
                : e
            )),
            _.success('已更新静态 ECN 数据')),
          (d.value = !1),
          await D())
      }
      function K(e) {
        ;((m.value = {
          code: e.code,
          material: e.material,
          change_type: e.change_type,
          current_version: e.current_version,
          items: [
            { dimension: '在制工单', detail: `${e.material} 关联 2 张在制工单，需确认切换批次`, count: 2 },
            { dimension: '库存与在途', detail: '旧版本库存 86 件，在途采购 120 件', count: 206 },
            { dimension: '工艺路线', detail: `目标版本 ${e.target_version} 需要同步切换工艺路线`, count: 1 },
            { dimension: '质量验证', detail: '需补充首件确认与切换后验证记录', count: 1 }
          ]
        }),
          (h.value = !0))
      }
      function $(e, t) {
        if (e === 'impact') {
          K(t)
          return
        }
        if (e === 'edit') {
          L(t)
          return
        }
        if (e === 'submit') {
          ;((t.status = 'pending_approval'), _.success('已提交变更审批'))
          return
        }
        if (e === 'execute') {
          ;((t.status = 'executing'), _.success('已进入现场切换执行'))
          return
        }
        if (e === 'verify') {
          ;((t.status = 'verified'), _.success('已完成切换验证'))
          return
        }
        e === 'close' && ((t.status = 'closed'), _.success('已关闭变更单'))
      }
      return (e, t) => (
        B(),
        N(
          te,
          {
            'search-model': b(n),
            'onUpdate:searchModel': t[4] || (t[4] = (l) => (X(n) ? (n.value = l) : (n = l))),
            title: '工程变更',
            'search-columns': f,
            'search-grid-item-props': c,
            columns: y,
            data: b(U),
            pagination: b(W),
            loading: b(S),
            'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
            'add-text': '新建变更单',
            onSearch: b(k),
            onReset: F,
            onRefresh: b(D),
            onAdd: w
          },
          {
            urgency: s(({ row: l }) => [i(q, { value: l.urgency, options: v }, null, 8, ['value'])]),
            status: s(({ row: l }) => [i(q, { value: l.status, options: r }, null, 8, ['value'])]),
            actions: s(({ row: l }) => [i(le, { actions: I(l), onAction: (M) => $(M, l) }, null, 8, ['actions', 'onAction'])]),
            dialog: s(() => [
              i(
                ie,
                {
                  visible: d.value,
                  'onUpdate:visible': t[0] || (t[0] = (l) => (d.value = l)),
                  form: a.value,
                  'onUpdate:form': t[1] || (t[1] = (l) => (a.value = l)),
                  mode: o.value,
                  onSubmit: P
                },
                null,
                8,
                ['visible', 'form', 'mode']
              ),
              i(
                se,
                {
                  visible: h.value,
                  'onUpdate:visible': t[2] || (t[2] = (l) => (h.value = l)),
                  data: m.value,
                  'onUpdate:data': t[3] || (t[3] = (l) => (m.value = l))
                },
                null,
                8,
                ['visible', 'data']
              )
            ]),
            _: 1
          },
          8,
          ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
        )
      )
    }
  }),
  me = oe
export { me as default }
