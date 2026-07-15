import {
  Bn as c,
  D as I,
  Fn as D,
  Mn as b,
  On as E,
  Tn as Y,
  Xn as r,
  an as S,
  d as O,
  dn as u,
  i as M,
  in as T,
  pn as B,
  r as $,
  sr as j,
  yn as C
} from './element-plus-CzL7BOKu.js'
import { p as A } from './hr-Bw34TP1R.js'
var R = B({
    __name: 'SkillMatrixFormDialog',
    props: C({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: C(['submit'], ['update:visible', 'update:form']),
    setup(y, { emit: f }) {
      const t = D(y, 'visible'),
        s = D(y, 'form'),
        a = f,
        d = [
          { type: 'input', label: '技能名称', field: 'skill_name', required: !0 },
          { type: 'input-number', label: '技能等级', field: 'level', required: !0, props: { min: 1, max: 5 } },
          { type: 'input', label: '证书编号', field: 'cert_number' },
          { type: 'date-picker', label: '到期日期', field: 'expire_date', props: { valueFormat: 'YYYY-MM-DD' } }
        ]
      function p() {
        t.value = !1
      }
      async function _() {
        return (a('submit'), !1)
      }
      return (o, v) => {
        const h = b('gi-form'),
          k = b('gi-dialog')
        return (
          E(),
          S(
            k,
            {
              modelValue: t.value,
              'onUpdate:modelValue': v[1] || (v[1] = (g) => (t.value = g)),
              footer: !0,
              'lock-scroll': !1,
              'on-before-ok': _,
              'on-cancel': p,
              title: y.mode === 'add' ? '新增技能' : '编辑技能',
              width: '500px'
            },
            {
              default: c(() => [
                u(h, { modelValue: s.value, 'onUpdate:modelValue': v[0] || (v[0] = (g) => (s.value = g)), columns: d, 'label-width': 100 }, null, 8, [
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
  X = R,
  G = { style: { margin: '0' } },
  H = B({
    __name: 'index',
    setup(y) {
      const f = r([]),
        t = r(null),
        s = r([]),
        a = r({}),
        d = r(!1),
        p = r('add'),
        _ = r(''),
        o = r(h()),
        v = [
          { prop: 'skill_name', label: '技能名称', minWidth: 180 },
          { label: '技能等级', minWidth: 160, slotName: 'level' },
          { prop: 'cert_number', label: '证书编号', minWidth: 150 },
          { prop: 'expire_date', label: '到期日期', minWidth: 120, align: 'center' },
          { label: '操作', minWidth: 180, fixed: 'right', slotName: 'actions', align: 'center' }
        ]
      function h() {
        return { id: '', skill_name: '', level: 1, cert_number: '', expire_date: '' }
      }
      function k(l) {
        for (const e of l)
          if (e.children?.length) {
            const n = k(e.children)
            if (n) return n
          } else if (e.id) return e
        return null
      }
      async function g() {
        const l = await A()
        ;((f.value = l.data.employees || []), (a.value = l.data.skillsByEmployee || {}))
        const e = k(f.value)
        e && V(e)
      }
      function V(l) {
        l.children?.length || ((t.value = l), (s.value = [...(a.value[l.id] || [])]))
      }
      function F() {
        if (!t.value) {
          M.warning('请先选择员工')
          return
        }
        ;((p.value = 'add'), (_.value = ''), (o.value = h()), (d.value = !0))
      }
      function w(l) {
        ;((p.value = 'edit'), (_.value = l.id), (o.value = { ...l }), (d.value = !0))
      }
      async function U() {
        if (!o.value.skill_name) return (M.warning('请填写技能名称'), !1)
        const l = t.value?.id
        if (!l) return !1
        const e = a.value[l] || []
        if (p.value === 'add') e.unshift({ ...o.value, id: Date.now().toString() })
        else {
          const n = e.findIndex((m) => m.id === _.value)
          n > -1 && Object.assign(e[n], o.value)
        }
        return ((a.value[l] = e), (s.value = [...e]), (d.value = !1), !0)
      }
      function z(l) {
        const e = t.value?.id
        e &&
          $.confirm('确认删除该技能记录吗？', '提示', { type: 'warning' })
            .then(() => {
              const n = a.value[e] || []
              ;((a.value[e] = n.filter((m) => m.id !== l)), (s.value = [...a.value[e]]), M.success('删除成功'))
            })
            .catch(() => {})
      }
      return (
        Y(() => {
          g()
        }),
        (l, e) => {
          const n = O,
            m = b('gi-button'),
            N = I,
            W = b('gi-table'),
            q = b('gi-page-layout')
          return (
            E(),
            S(
              q,
              { size: 240, style: { height: 'calc(100vh - 120px)' } },
              {
                left: c(() => [
                  u(
                    n,
                    {
                      data: f.value,
                      props: { children: 'children', label: 'name' },
                      'node-key': 'id',
                      'default-expand-all': '',
                      'highlight-current': '',
                      onNodeClick: V
                    },
                    null,
                    8,
                    ['data']
                  )
                ]),
                header: c(() => [T('h3', G, j(t.value?.name || '请选择员工') + ' 技能矩阵', 1)]),
                tool: c(() => [u(m, { type: 'add', onClick: F })]),
                default: c(() => [
                  u(
                    W,
                    { columns: v, data: s.value, border: '', stripe: '', size: 'small' },
                    {
                      level: c(({ row: i }) => [
                        u(N, { modelValue: i.level, 'onUpdate:modelValue': (x) => (i.level = x), max: 5, disabled: '', size: 'small' }, null, 8, [
                          'modelValue',
                          'onUpdate:modelValue'
                        ])
                      ]),
                      actions: c(({ row: i }) => [
                        u(m, { type: 'edit', size: 'small', onClick: (x) => w(i) }, null, 8, ['onClick']),
                        u(m, { type: 'delete', size: 'small', onClick: (x) => z(i.id) }, null, 8, ['onClick'])
                      ]),
                      _: 1
                    },
                    8,
                    ['data']
                  ),
                  u(
                    X,
                    {
                      visible: d.value,
                      'onUpdate:visible': e[0] || (e[0] = (i) => (d.value = i)),
                      form: o.value,
                      'onUpdate:form': e[1] || (e[1] = (i) => (o.value = i)),
                      mode: p.value,
                      onSubmit: U
                    },
                    null,
                    8,
                    ['visible', 'form', 'mode']
                  )
                ]),
                _: 1
              }
            )
          )
        }
      )
    }
  }),
  L = H
export { L as default }
