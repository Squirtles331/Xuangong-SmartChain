import {
  An as P,
  Bn as a,
  Fn as K,
  H as fe,
  Mn as me,
  O as ce,
  On as d,
  Tn as ye,
  U as be,
  W as ve,
  Xn as f,
  Yn as ge,
  _ as we,
  an as m,
  b as ke,
  dn as e,
  ft as he,
  ht as qe,
  i as E,
  in as O,
  it as G,
  m as Te,
  mt as Oe,
  on as Ee,
  ot as J,
  p as Se,
  pn as Q,
  r as Y,
  rn as A,
  rr as U,
  sn as $,
  sr as p,
  tn as W,
  un as s,
  v as $e,
  y as Ce,
  yn as j
} from './element-plus-CzL7BOKu.js'
import { r as De } from './vue-chunks-CWn_TkJU.js'
import { I as Ve } from './index-DqMfCNbk.js'
import { t as L } from './StatusTag-DWd3m1xj.js'
import { i as H, r as X } from './status-maps-BEsjyiP9.js'
import { d as Ie, f as Me, l as Ne, n as Be, t as Le } from './work-order-Clsu8Szn.js'
import { n as Re } from './bom-BNit2RjS.js'
var Ae = Q({
    __name: 'ApprovalDialog',
    props: j(
      { title: {}, currentStatusLabel: {}, currentStatusTagType: {}, targetStatusLabel: {}, targetStatusTagType: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: j(['confirm'], ['update:visible', 'update:form']),
    setup(b, { emit: R }) {
      const h = K(b, 'visible'),
        w = K(b, 'form'),
        C = R
      function l() {
        if (!w.value.opinion.trim()) {
          E.warning('请填写审批意见')
          return
        }
        ;(C('confirm'), (h.value = !1))
      }
      return (D, _) => {
        const q = G,
          v = qe,
          V = he,
          I = Oe,
          S = J,
          M = fe
        return (
          d(),
          m(
            M,
            {
              modelValue: h.value,
              'onUpdate:modelValue': _[2] || (_[2] = (k) => (h.value = k)),
              title: b.title,
              width: '480px',
              'close-on-click-modal': !1,
              'lock-scroll': !1
            },
            {
              footer: a(() => [
                e(S, { onClick: _[1] || (_[1] = (k) => (h.value = !1)) }, { default: a(() => [...(_[3] || (_[3] = [s('取消', -1)]))]), _: 1 }),
                e(S, { type: 'primary', onClick: l }, { default: a(() => [...(_[4] || (_[4] = [s('确认', -1)]))]), _: 1 })
              ]),
              default: a(() => [
                e(
                  I,
                  { model: w.value, 'label-width': '100px' },
                  {
                    default: a(() => [
                      e(
                        v,
                        { label: '当前状态' },
                        {
                          default: a(() => [
                            e(q, { type: b.currentStatusTagType }, { default: a(() => [s(p(b.currentStatusLabel), 1)]), _: 1 }, 8, ['type'])
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        v,
                        { label: '目标状态' },
                        {
                          default: a(() => [
                            e(q, { type: b.targetStatusTagType }, { default: a(() => [s(p(b.targetStatusLabel), 1)]), _: 1 }, 8, ['type'])
                          ]),
                          _: 1
                        }
                      ),
                      e(
                        v,
                        { label: '审批意见', required: '' },
                        {
                          default: a(() => [
                            e(
                              V,
                              {
                                modelValue: w.value.opinion,
                                'onUpdate:modelValue': _[0] || (_[0] = (k) => (w.value.opinion = k)),
                                type: 'textarea',
                                rows: 3,
                                placeholder: '请输入审批意见'
                              },
                              null,
                              8,
                              ['modelValue']
                            )
                          ]),
                          _: 1
                        }
                      )
                    ]),
                    _: 1
                  },
                  8,
                  ['model']
                )
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
  Ue = Ae,
  We = { class: 'detail-header' },
  xe = { class: 'header-left' },
  ze = { class: 'header-right' },
  Fe = { key: 1 },
  Pe = { key: 1 },
  Ke = { class: 'log-user' },
  Ye = Q({
    __name: 'index',
    setup(b) {
      const R = De(),
        h = [
          { value: 'pending', label: '待开工', type: 'info' },
          { value: 'assigned', label: '已派工', type: 'primary' },
          { value: 'running', label: '生产中', type: 'warning' },
          { value: 'completed', label: '已完工', type: 'success' },
          { value: 'inspected', label: '已质检', type: 'primary' }
        ],
        w = [
          { from: 'draft', to: 'approved', label: '提交审核', type: 'primary', needOpinion: !1 },
          { from: 'approved', to: 'released', label: '下发到车间', type: 'warning', needOpinion: !1 },
          { from: 'released', to: 'in_progress', label: '开始生产', type: 'primary', needOpinion: !1 },
          { from: 'in_progress', to: 'completed', label: '完工确认', type: 'success', needOpinion: !1 },
          { from: 'completed', to: 'closed', label: '确认关闭', type: 'info', needOpinion: !0 },
          { from: 'draft', to: 'closed', label: '取消工单', type: 'danger', needOpinion: !0 },
          { from: 'approved', to: 'draft', label: '驳回', type: 'danger', needOpinion: !0 }
        ],
        C = f('info'),
        l = ge({}),
        D = f([]),
        _ = f([]),
        q = f([]),
        v = f(!1),
        V = f(''),
        I = f(''),
        S = f('info'),
        M = f(''),
        k = f('info'),
        T = f({ opinion: '', targetStatus: '' }),
        Z = A(() => (l.planned_qty ? Math.round(((l.completed_qty || 0) / l.planned_qty) * 100) : 0)),
        ee = A(() => (l.wo_type === 'production' ? '生产工单' : l.wo_type === 'rework' ? '返工工单' : l.wo_type === 'sample' ? '样品工单' : '-')),
        te = A(() =>
          l.status
            ? w.filter((n) => n.from === l.status).map((n) => ({ key: n.to === 'in_progress' ? 'report' : n.to, label: n.label, type: n.type }))
            : []
        )
      ye(() => {
        ae()
      })
      async function ae() {
        const n = R.params.id
        try {
          const t = await Ne(n)
          t.data && Object.assign(l, t.data)
        } catch {}
        try {
          D.value = ((await Ie(n)).data || []).map((t) => ({ ...t, actual_hours: typeof t.actual_hours == 'number' ? t.actual_hours : 0 }))
        } catch {
          D.value = []
        }
        try {
          const t = await Re(l.material_code || '')
          _.value = (Array.isArray(t.data) ? t.data : t.data?.list || []).map((i, r) => ({
            material_code: i.material_code || `${l.material_code || ''}-${r + 1}`,
            material_name: i.material || i.material_name || '',
            spec: i.spec || '-',
            unit: i.unit || '件',
            planned_qty: Number(i.total ?? i.qty ?? 0),
            issued_qty: r === 0 ? Number(i.total ?? i.qty ?? 0) : 0,
            available_qty: Number(i.available ?? 50 + r * 10)
          }))
        } catch {
          _.value = []
        }
        q.value = le()
      }
      function le() {
        return [
          l.created_at
            ? { id: 'log-create', time: l.created_at, type: 'primary', content: `工单 ${l.code || ''} 已创建`, user: l.created_by || '系统管理员' }
            : null,
          l.status
            ? {
                id: 'log-status',
                time: l.created_at || new Date().toLocaleString('zh-CN'),
                type: 'info',
                content: `当前状态为“${N(l.status).label}”`,
                user: '系统'
              }
            : null
        ].filter(Boolean)
      }
      function ne(n) {
        const t = [],
          { columns: i, data: r } = n
        return (
          i.forEach((y, g) => {
            if (g === 0) {
              t[g] = '合计'
              return
            }
            if (y.property === 'qualified_qty') {
              t[g] = String(r.reduce((c, u) => c + (Number(u.qualified_qty) || 0), 0))
              return
            }
            if (y.property === 'defective_qty') {
              t[g] = String(r.reduce((c, u) => c + (Number(u.defective_qty) || 0), 0))
              return
            }
            if (y.property === 'actual_hours') {
              t[g] = `${r.reduce((c, u) => c + (Number(u.actual_hours) || 0), 0).toFixed(1)}`
              return
            }
            t[g] = ''
          }),
          t
        )
      }
      function re(n) {
        Y.confirm(`确认领用物料“${n.material_name}”吗？`, '物料领用', { type: 'warning' })
          .then(() => {
            ;((n.issued_qty = n.planned_qty), E.success(`物料“${n.material_name}”已领用`))
          })
          .catch(() => {})
      }
      function N(n) {
        const t = H.find((i) => i.value === n)
        return { label: t?.label || n, type: t?.type || 'info' }
      }
      function oe(n, t) {
        return w.find((i) => i.from === n && i.to === t) || null
      }
      function se(n) {
        const t = n === 'report' ? 'in_progress' : n,
          i = oe(l.status, t)
        if (!i) {
          E.error('当前状态不允许执行该操作')
          return
        }
        const r = N(l.status),
          y = N(t)
        if (i.needOpinion) {
          ;((I.value = r.label),
            (S.value = r.type),
            (M.value = y.label),
            (k.value = y.type),
            (V.value = i.label),
            (T.value = { opinion: '', targetStatus: t }),
            (v.value = !0))
          return
        }
        Y.confirm(`确认将工单从“${r.label}”变更为“${y.label}”吗？`, i.label, { type: 'warning' })
          .then(() => x(t, ''))
          .catch(() => {})
      }
      function ie() {
        if (!T.value.opinion.trim()) {
          E.warning('请填写审批意见')
          return
        }
        ;(x(T.value.targetStatus, T.value.opinion.trim()), (v.value = !1))
      }
      async function x(n, t) {
        try {
          ;(n === 'approved'
            ? (await Le(l.id, !0, t), (l.status = 'approved'))
            : n === 'released'
              ? (await Me(l.id), (l.status = 'released'))
              : n === 'closed'
                ? (await Be(l.id, { close_type: 'normal', reason: t }), (l.status = 'closed'))
                : (l.status = n),
            t && (l.approval_opinion = t))
          const i = N(n)
          ;(q.value.unshift({
            id: String(Date.now()),
            time: new Date().toLocaleString('zh-CN'),
            type: n === 'closed' ? 'info' : 'primary',
            content: `工单状态已变更为“${i.label}”${t ? `，审批意见：${t}` : ''}`,
            user: '当前用户'
          }),
            E.success(`状态已更新为“${i.label}”`))
        } catch {
          E.error('状态流转失败')
        }
      }
      return (n, t) => {
        const i = J,
          r = ve,
          y = ce,
          g = be,
          c = we,
          u = ke,
          B = G,
          z = Ce,
          ue = Te,
          pe = Se,
          de = $e,
          _e = me('gi-page-layout')
        return (
          d(),
          m(_e, null, {
            header: a(() => [
              O('div', We, [
                O('div', xe, [
                  O('h2', null, '工单 ' + p(l.code || '-'), 1),
                  e(L, { value: l.priority, options: U(X), style: { 'margin-left': '12px' } }, null, 8, ['value', 'options'])
                ]),
                O('div', ze, [
                  (d(!0),
                  $(
                    W,
                    null,
                    P(
                      te.value,
                      (o) => (
                        d(),
                        $(
                          W,
                          { key: o.key },
                          [
                            o.key === 'report'
                              ? (d(),
                                m(
                                  i,
                                  { key: 0, type: 'primary', onClick: t[0] || (t[0] = (F) => n.$router.push(`/mes/execution/report/${l.id}`)) },
                                  { default: a(() => [...(t[5] || (t[5] = [s('报工', -1)]))]), _: 1 }
                                ))
                              : (d(),
                                m(i, { key: 1, type: o.type, onClick: (F) => se(o.key) }, { default: a(() => [s(p(o.label), 1)]), _: 2 }, 1032, [
                                  'type',
                                  'onClick'
                                ]))
                          ],
                          64
                        )
                      )
                    ),
                    128
                  )),
                  e(i, { onClick: t[1] || (t[1] = (o) => n.$router.back()) }, { default: a(() => [...(t[6] || (t[6] = [s('返回', -1)]))]), _: 1 })
                ])
              ])
            ]),
            default: a(() => [
              e(
                de,
                { modelValue: C.value, 'onUpdate:modelValue': t[2] || (t[2] = (o) => (C.value = o)) },
                {
                  default: a(() => [
                    e(
                      c,
                      { label: '基本信息', name: 'info' },
                      {
                        default: a(() => [
                          e(
                            g,
                            { column: 3, border: '' },
                            {
                              default: a(() => [
                                e(r, { label: '工单编号' }, { default: a(() => [s(p(l.code || '-'), 1)]), _: 1 }),
                                e(r, { label: '工单类型' }, { default: a(() => [s(p(ee.value), 1)]), _: 1 }),
                                e(
                                  r,
                                  { label: '状态' },
                                  { default: a(() => [e(L, { value: l.status, options: U(H) }, null, 8, ['value', 'options'])]), _: 1 }
                                ),
                                e(r, { label: '产品编码' }, { default: a(() => [s(p(l.material_code || '-'), 1)]), _: 1 }),
                                e(r, { label: '产品名称' }, { default: a(() => [s(p(l.material_name || '-'), 1)]), _: 1 }),
                                e(r, { label: '规格型号' }, { default: a(() => [s(p(l.material_spec || '-'), 1)]), _: 1 }),
                                e(r, { label: '计划数量' }, { default: a(() => [s(p(l.planned_qty || 0) + ' 件', 1)]), _: 1 }),
                                e(r, { label: '已完成数量' }, { default: a(() => [s(p(l.completed_qty || 0) + ' 件', 1)]), _: 1 }),
                                e(
                                  r,
                                  { label: '进度' },
                                  {
                                    default: a(() => [
                                      e(y, { percentage: Z.value, 'stroke-width': 8, style: { width: '200px' } }, null, 8, ['percentage'])
                                    ]),
                                    _: 1
                                  }
                                ),
                                e(r, { label: '生产车间' }, { default: a(() => [s(p(l.workshop_name || '-'), 1)]), _: 1 }),
                                e(r, { label: '生产产线' }, { default: a(() => [s(p(l.line_name || '-'), 1)]), _: 1 }),
                                e(
                                  r,
                                  { label: '优先级' },
                                  { default: a(() => [e(L, { value: l.priority, options: U(X) }, null, 8, ['value', 'options'])]), _: 1 }
                                ),
                                e(r, { label: '计划开工' }, { default: a(() => [s(p(l.planned_start_date || '-'), 1)]), _: 1 }),
                                e(r, { label: '计划完工' }, { default: a(() => [s(p(l.planned_end_date || '-'), 1)]), _: 1 }),
                                e(r, { label: '实际开工' }, { default: a(() => [s(p(l.actual_start_date || '-'), 1)]), _: 1 }),
                                e(r, { label: 'BOM版本' }, { default: a(() => [s(p(l.bom_version || '-'), 1)]), _: 1 }),
                                e(r, { label: '工艺版本' }, { default: a(() => [s(p(l.routing_version || '-'), 1)]), _: 1 }),
                                e(r, { label: '客户订单号' }, { default: a(() => [s(p(l.customer_po || '-'), 1)]), _: 1 }),
                                e(r, { label: '备注', span: 2 }, { default: a(() => [s(p(l.remark || '-'), 1)]), _: 1 }),
                                e(r, { label: '创建人' }, { default: a(() => [s(p(l.created_by || '-'), 1)]), _: 1 }),
                                e(r, { label: '创建时间' }, { default: a(() => [s(p(l.created_at || '-'), 1)]), _: 1 }),
                                l.approval_opinion
                                  ? (d(), m(r, { key: 0, label: '审批意见', span: 3 }, { default: a(() => [s(p(l.approval_opinion), 1)]), _: 1 }))
                                  : Ee('', !0)
                              ]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      }
                    ),
                    e(
                      c,
                      { label: '工序列表', name: 'operations' },
                      {
                        default: a(() => [
                          e(
                            z,
                            { data: D.value, border: '', stripe: '', 'show-summary': '', 'summary-method': ne },
                            {
                              default: a(() => [
                                e(u, { prop: 'operation_no', label: '工序号', width: '80' }),
                                e(u, { prop: 'name', label: '工序名称', width: '120' }),
                                e(u, { prop: 'work_center', label: '工作中心', width: '120' }),
                                e(
                                  u,
                                  { label: '状态', width: '100' },
                                  { default: a(({ row: o }) => [e(L, { value: o.status, options: h }, null, 8, ['value'])]), _: 1 }
                                ),
                                e(u, { prop: 'worker', label: '操作工', width: '100' }),
                                e(u, { prop: 'qualified_qty', label: '合格数', width: '80', align: 'center' }),
                                e(u, { prop: 'defective_qty', label: '不良数', width: '80', align: 'center' }),
                                e(u, { prop: 'actual_hours', label: '实际工时(小时)', width: '120', align: 'center' }),
                                e(u, { prop: 'planned_start', label: '计划开工', width: '140' }),
                                e(u, { prop: 'planned_end', label: '计划完工', width: '140' }),
                                e(
                                  u,
                                  { label: '质检关口', width: '80', align: 'center' },
                                  {
                                    default: a(({ row: o }) => [
                                      o.is_qc_gate
                                        ? (d(),
                                          m(
                                            B,
                                            { key: 0, type: 'warning', size: 'small' },
                                            { default: a(() => [...(t[7] || (t[7] = [s('是', -1)]))]), _: 1 }
                                          ))
                                        : (d(), $('span', Fe, '-'))
                                    ]),
                                    _: 1
                                  }
                                )
                              ]),
                              _: 1
                            },
                            8,
                            ['data']
                          )
                        ]),
                        _: 1
                      }
                    ),
                    e(
                      c,
                      { label: '物料领用', name: 'material' },
                      {
                        default: a(() => [
                          e(
                            z,
                            { data: _.value, border: '', stripe: '' },
                            {
                              default: a(() => [
                                e(u, { prop: 'material_code', label: '物料编码', width: '160' }),
                                e(u, { prop: 'material_name', label: '物料名称', 'min-width': '140' }),
                                e(u, { prop: 'spec', label: '规格', width: '120' }),
                                e(u, { prop: 'unit', label: '单位', width: '60', align: 'center' }),
                                e(u, { prop: 'planned_qty', label: '计划用量', width: '100', align: 'center' }),
                                e(u, { prop: 'issued_qty', label: '已领数量', width: '100', align: 'center' }),
                                e(u, { prop: 'available_qty', label: '可用库存', width: '100', align: 'center' }),
                                e(
                                  u,
                                  { label: '领用状态', width: '100', align: 'center' },
                                  {
                                    default: a(({ row: o }) => [
                                      o.issued_qty >= o.planned_qty
                                        ? (d(),
                                          m(
                                            B,
                                            { key: 0, type: 'success', size: 'small' },
                                            { default: a(() => [...(t[8] || (t[8] = [s('已领齐', -1)]))]), _: 1 }
                                          ))
                                        : o.issued_qty > 0
                                          ? (d(),
                                            m(
                                              B,
                                              { key: 1, type: 'warning', size: 'small' },
                                              { default: a(() => [...(t[9] || (t[9] = [s('部分领用', -1)]))]), _: 1 }
                                            ))
                                          : (d(),
                                            m(
                                              B,
                                              { key: 2, type: 'info', size: 'small' },
                                              { default: a(() => [...(t[10] || (t[10] = [s('未领用', -1)]))]), _: 1 }
                                            ))
                                    ]),
                                    _: 1
                                  }
                                ),
                                e(
                                  u,
                                  { label: '操作', width: '100', align: 'center' },
                                  {
                                    default: a(({ row: o }) => [
                                      o.issued_qty < o.planned_qty && o.available_qty > 0
                                        ? (d(),
                                          m(
                                            i,
                                            { key: 0, type: 'primary', size: 'small', link: '', onClick: (F) => re(o) },
                                            { default: a(() => [...(t[11] || (t[11] = [s(' 领用 ', -1)]))]), _: 1 },
                                            8,
                                            ['onClick']
                                          ))
                                        : (d(), $('span', Pe, '-'))
                                    ]),
                                    _: 1
                                  }
                                )
                              ]),
                              _: 1
                            },
                            8,
                            ['data']
                          )
                        ]),
                        _: 1
                      }
                    ),
                    e(
                      c,
                      { label: '操作日志', name: 'log' },
                      {
                        default: a(() => [
                          e(pe, null, {
                            default: a(() => [
                              (d(!0),
                              $(
                                W,
                                null,
                                P(
                                  q.value,
                                  (o) => (
                                    d(),
                                    m(
                                      ue,
                                      { key: o.id, timestamp: o.time, type: o.type, placement: 'top' },
                                      { default: a(() => [O('p', null, p(o.content), 1), O('p', Ke, p(o.user), 1)]), _: 2 },
                                      1032,
                                      ['timestamp', 'type']
                                    )
                                  )
                                ),
                                128
                              ))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                },
                8,
                ['modelValue']
              ),
              e(
                Ue,
                {
                  visible: v.value,
                  'onUpdate:visible': t[3] || (t[3] = (o) => (v.value = o)),
                  form: T.value,
                  'onUpdate:form': t[4] || (t[4] = (o) => (T.value = o)),
                  title: V.value,
                  'current-status-label': I.value,
                  'current-status-tag-type': S.value,
                  'target-status-label': M.value,
                  'target-status-tag-type': k.value,
                  onConfirm: ie
                },
                null,
                8,
                ['visible', 'form', 'title', 'current-status-label', 'current-status-tag-type', 'target-status-label', 'target-status-tag-type']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  et = Ve(Ye, [['__scopeId', 'data-v-404fa51e']])
export { et as default }
