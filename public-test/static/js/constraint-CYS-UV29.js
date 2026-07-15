import {
  Bn as o,
  Fn as q,
  Mn as f,
  O as ne,
  On as E,
  Xn as g,
  _ as oe,
  an as B,
  dn as i,
  i as A,
  in as re,
  it as ue,
  pn as F,
  rn as c,
  sr as se,
  un as de,
  v as me,
  yn as I
} from './element-plus-CzL7BOKu.js'
import { I as pe } from './index-DqMfCNbk.js'
import { i as z, o as ce, t as V } from './aps-BGoKqO6s.js'
import { t as M } from './useTable-Hzr4fBAy.js'
var fe = F({
    __name: 'ConstraintFormDialog',
    props: I(
      { mode: {}, constraintType: {} },
      { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }
    ),
    emits: I(['submit'], ['update:visible', 'update:form']),
    setup(u, { emit: t }) {
      const v = u,
        s = q(u, 'visible'),
        n = q(u, 'form'),
        _ = t,
        y = [
          { type: 'input', label: '编码', field: 'code', required: !0 },
          { type: 'input', label: '名称', field: 'name', required: !0 },
          { type: 'input', label: '适用对象', field: 'applicable', required: !0 },
          { type: 'input', label: '寿命/数量', field: 'life', required: !0 },
          { type: 'switch', label: '是否可用', field: 'available' },
          { type: 'input-number', label: '利用率', field: 'utilization', props: { min: 0, max: 100 } }
        ],
        h = [
          { type: 'input', label: '工序', field: 'operation', required: !0 },
          { type: 'input', label: '技能要求', field: 'skill', required: !0 },
          { type: 'input-number', label: '最低等级', field: 'min_level', props: { min: 1, max: 5 } },
          { type: 'input-number', label: '具备人数', field: 'workers_count', props: { min: 1 } },
          { type: 'input-number', label: '利用率', field: 'utilization', props: { min: 0, max: 100 } }
        ],
        k = c(() => (v.constraintType === 'skill' ? h : y))
      function C() {
        s.value = !1
      }
      async function D() {
        if (v.constraintType === 'skill') {
          if (!n.value.operation || !n.value.skill) return (A.warning('请填写工序和技能要求'), !1)
        } else if (!n.value.code || !n.value.name || !n.value.applicable) return (A.warning('请填写完整的约束信息'), !1)
        return (_('submit'), !1)
      }
      return (T, r) => {
        const W = f('gi-form'),
          x = f('gi-dialog')
        return (
          E(),
          B(
            x,
            {
              modelValue: s.value,
              'onUpdate:modelValue': r[1] || (r[1] = (d) => (s.value = d)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': D,
              'on-cancel': C,
              title: u.mode === 'add' ? '新增约束' : '编辑约束',
              width: '560px'
            },
            {
              default: o(() => [
                i(
                  W,
                  { modelValue: n.value, 'onUpdate:modelValue': r[0] || (r[0] = (d) => (n.value = d)), columns: k.value, 'label-width': 100 },
                  null,
                  8,
                  ['modelValue', 'columns']
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
  ve = fe,
  be = F({
    __name: 'index',
    setup(u) {
      const t = g('mold'),
        v = [
          { prop: 'code', label: '模具编码', minWidth: 150 },
          { prop: 'name', label: '名称', minWidth: 140 },
          { prop: 'applicable', label: '适用物料', minWidth: 140 },
          { prop: 'life', label: '设计寿命', minWidth: 120 },
          { label: '是否可用', minWidth: 100, align: 'center', slotName: 'available' },
          { label: '利用率', minWidth: 160, slotName: 'utilization' },
          { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
        ],
        s = [
          { prop: 'code', label: '刀具编码', minWidth: 140 },
          { prop: 'name', label: '名称', minWidth: 160 },
          { prop: 'applicable', label: '适用设备', minWidth: 140 },
          { prop: 'life', label: '寿命', minWidth: 100 },
          { label: '是否可用', minWidth: 100, align: 'center', slotName: 'available' },
          { label: '利用率', minWidth: 160, slotName: 'utilization' },
          { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
        ],
        n = [
          { prop: 'operation', label: '工序', minWidth: 120 },
          { prop: 'skill', label: '技能要求', minWidth: 180 },
          { prop: 'min_level', label: '最低等级', minWidth: 90, align: 'center' },
          { prop: 'workers_count', label: '具备人数', minWidth: 90, align: 'center' },
          { label: '利用率', minWidth: 160, slotName: 'utilization' },
          { label: '操作', minWidth: 160, align: 'center', fixed: 'right', slotName: 'actions' }
        ],
        {
          tableData: _,
          pagination: y,
          loading: h,
          refresh: k,
          onDelete: C
        } = M({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) => (await z({ type: 'mold', pageNum: e, pageSize: l })).data,
          deleteAPI: (e) => Promise.all(e.map((l) => V('mold', l)))
        }),
        {
          tableData: D,
          pagination: T,
          loading: r,
          refresh: W,
          onDelete: x
        } = M({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) => (await z({ type: 'tool', pageNum: e, pageSize: l })).data,
          deleteAPI: (e) => Promise.all(e.map((l) => V('tool', l)))
        }),
        {
          tableData: d,
          pagination: L,
          loading: U,
          refresh: K,
          onDelete: O
        } = M({
          rowKey: 'id',
          listAPI: async ({ page: e, size: l }) => (await z({ type: 'skill', pageNum: e, pageSize: l })).data,
          deleteAPI: (e) => Promise.all(e.map((l) => V('skill', l)))
        }),
        $ = c(() => (t.value === 'mold' ? v : t.value === 'tool' ? s : n)),
        X = c(() => (t.value === 'mold' ? _.value : t.value === 'tool' ? D.value : d.value)),
        j = c(() => (t.value === 'mold' ? y : t.value === 'tool' ? T : L)),
        G = c(() => (t.value === 'mold' ? h.value : t.value === 'tool' ? r.value : U.value)),
        m = g(!1),
        P = g('add'),
        p = g(N())
      function N() {
        return {
          id: '',
          code: '',
          name: '',
          applicable: '',
          life: '',
          available: !0,
          utilization: 0,
          operation: '',
          skill: '',
          min_level: 1,
          workers_count: 1
        }
      }
      function H(e) {
        return e >= 80 ? '#f56c6c' : e >= 60 ? '#e6a23c' : '#67c23a'
      }
      function S() {
        return t.value === 'mold' ? k() : t.value === 'tool' ? W() : K()
      }
      function J() {
        ;((P.value = 'add'), (p.value = N()), (m.value = !0))
      }
      function Q(e) {
        ;((P.value = 'edit'), (p.value = { ...N(), ...e }), (m.value = !0))
      }
      async function R() {
        ;(await ce({ ...p.value, type: t.value }), (m.value = !1), await S())
      }
      function Y(e) {
        return t.value === 'mold' ? C(e) : t.value === 'tool' ? x(e) : O(e)
      }
      return (e, l) => {
        const w = oe,
          Z = me,
          b = f('gi-button'),
          ee = ue,
          le = ne,
          te = f('gi-table'),
          ae = f('gi-page-layout')
        return (
          E(),
          B(ae, null, {
            header: o(() => [...(l[3] || (l[3] = [re('div', { class: 'page-title' }, 'APS 约束配置', -1)]))]),
            tool: o(() => [i(b, { type: 'add', onClick: J }), i(b, { type: 'reset', style: { 'margin-left': '8px' }, onClick: S })]),
            default: o(() => [
              i(
                Z,
                { modelValue: t.value, 'onUpdate:modelValue': l[0] || (l[0] = (a) => (t.value = a)) },
                {
                  default: o(() => [
                    i(w, { label: '模具约束', name: 'mold' }),
                    i(w, { label: '刀具约束', name: 'tool' }),
                    i(w, { label: '人员技能约束', name: 'skill' })
                  ]),
                  _: 1
                },
                8,
                ['modelValue']
              ),
              i(
                te,
                { columns: $.value, data: X.value, pagination: j.value, loading: G.value, border: '', stripe: '', style: { height: '100%' } },
                {
                  available: o(({ row: a }) => [
                    i(
                      ee,
                      { type: a.available ? 'success' : 'danger', size: 'small' },
                      { default: o(() => [de(se(a.available ? '是' : '否'), 1)]), _: 2 },
                      1032,
                      ['type']
                    )
                  ]),
                  utilization: o(({ row: a }) => [
                    i(le, { percentage: a.utilization || 0, 'stroke-width': 8, color: H(a.utilization || 0) }, null, 8, ['percentage', 'color'])
                  ]),
                  actions: o(({ row: a }) => [
                    i(b, { type: 'edit', onClick: (ie) => Q(a) }, null, 8, ['onClick']),
                    i(b, { type: 'delete', style: { 'margin-left': '8px' }, onClick: (ie) => Y(a) }, null, 8, ['onClick'])
                  ]),
                  _: 1
                },
                8,
                ['columns', 'data', 'pagination', 'loading']
              ),
              i(
                ve,
                {
                  visible: m.value,
                  'onUpdate:visible': l[1] || (l[1] = (a) => (m.value = a)),
                  form: p.value,
                  'onUpdate:form': l[2] || (l[2] = (a) => (p.value = a)),
                  mode: P.value,
                  'constraint-type': t.value,
                  onSubmit: R
                },
                null,
                8,
                ['visible', 'form', 'mode', 'constraint-type']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  ke = pe(be, [['__scopeId', 'data-v-d95e2a52']])
export { ke as default }
