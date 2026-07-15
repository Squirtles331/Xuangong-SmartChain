import {
  Bn as i,
  F as K,
  I as Q,
  Mn as W,
  On as v,
  Rn as Z,
  Tn as ee,
  Xn as V,
  Yn as F,
  an as y,
  d as le,
  dn as l,
  ft as ae,
  ht as te,
  i as c,
  in as s,
  ir as ie,
  it as oe,
  mt as re,
  nt as ne,
  on as w,
  ot as se,
  pn as de,
  r as ue,
  rn as me,
  rt as _e,
  sn as pe,
  sr as b,
  tt as ce,
  un as _,
  x as fe
} from './element-plus-CzL7BOKu.js'
import { r as ve } from './vue-chunks-CWn_TkJU.js'
import { I as ye } from './index-DqMfCNbk.js'
var be = { class: 'editor-header' },
  Ve = { class: 'header-left' },
  we = { class: 'header-desc' },
  ge = { class: 'header-right' },
  Ce = { class: 'page-shell' },
  Ee = { class: 'editor-container' },
  xe = { class: 'tree-panel' },
  Me = { class: 'tree-toolbar' },
  Oe = { class: 'tree-node' },
  ke = { class: 'form-panel' },
  qe = { key: 0, class: 'empty-tip' },
  Be = { class: 'card-header' },
  he = de({
    __name: 'index',
    setup(Ne) {
      const E = ve(),
        x = V(),
        g = V(''),
        f = V([]),
        d = V(null),
        n = F({ material_code: '', material_name: '', bom_type: 'EBOM', version: 'V1.0', status: 'draft', effective_date: '待评审' }),
        a = F({
          material_code: '',
          material_name: '',
          qty: 1,
          scrap_rate: 0,
          position_no: '',
          material_type: 'normal',
          is_critical: !1,
          substitute_allowed: !1
        }),
        M = {
          'BOM-EB-1001': {
            meta: {
              material_code: 'FG-ASSY-2101',
              material_name: '供液控制总成',
              bom_type: 'EBOM',
              version: 'V2.3',
              status: 'active',
              effective_date: '2026-07-01'
            },
            tree: [
              {
                id: 'n-100',
                label: '供液控制总成 ×1',
                material_code: 'FG-ASSY-2101',
                material_name: '供液控制总成',
                qty: 1,
                scrap_rate: 0,
                position_no: 'ROOT',
                material_type: 'normal',
                is_critical: !0,
                substitute_allowed: !1,
                children: [
                  {
                    id: 'n-110',
                    label: '壳体粗加工件 ×1',
                    material_code: 'SM-CNC-1001',
                    material_name: '壳体粗加工件',
                    qty: 1,
                    scrap_rate: 2,
                    position_no: 'A1',
                    material_type: 'normal',
                    is_critical: !0,
                    substitute_allowed: !1
                  },
                  {
                    id: 'n-120',
                    label: '流量调节组件 ×1',
                    material_code: 'SM-VAL-9001',
                    material_name: '流量调节组件',
                    qty: 1,
                    scrap_rate: 0,
                    position_no: 'A2',
                    material_type: 'phantom',
                    is_critical: !1,
                    substitute_allowed: !0,
                    children: [
                      {
                        id: 'n-121',
                        label: 'O 型圈 ×2',
                        material_code: 'PS-OR-011',
                        material_name: 'O 型圈',
                        qty: 2,
                        scrap_rate: 3,
                        position_no: 'A2-1',
                        material_type: 'auxiliary',
                        is_critical: !1,
                        substitute_allowed: !0
                      }
                    ]
                  }
                ]
              }
            ]
          },
          'BOM-MB-2101': {
            meta: {
              material_code: 'FG-ASSY-2101',
              material_name: '供液控制总成',
              bom_type: 'MBOM',
              version: 'V1.2',
              status: 'active',
              effective_date: '2026-07-05'
            },
            tree: [
              {
                id: 'n-200',
                label: '供液控制总成 ×1',
                material_code: 'FG-ASSY-2101',
                material_name: '供液控制总成',
                qty: 1,
                scrap_rate: 0,
                position_no: 'ROOT',
                material_type: 'normal',
                is_critical: !0,
                substitute_allowed: !1,
                children: [
                  {
                    id: 'n-210',
                    label: '壳体粗加工件 ×1',
                    material_code: 'SM-CNC-1001',
                    material_name: '壳体粗加工件',
                    qty: 1,
                    scrap_rate: 1,
                    position_no: 'A1',
                    material_type: 'normal',
                    is_critical: !0,
                    substitute_allowed: !1
                  },
                  {
                    id: 'n-220',
                    label: '导热脂 ×1',
                    material_code: 'AUX-GR-001',
                    material_name: '导热脂',
                    qty: 1,
                    scrap_rate: 5,
                    position_no: 'A3',
                    material_type: 'auxiliary',
                    is_critical: !1,
                    substitute_allowed: !0
                  }
                ]
              }
            ]
          }
        },
        O = me(() => E.name === 'bomCreate')
      Z(g, (o) => {
        x.value?.filter(o)
      })
      function I() {
        Object.assign(n, { material_code: '', material_name: '', bom_type: 'EBOM', version: 'V1.0', status: 'draft', effective_date: '待评审' })
      }
      function k(o) {
        return o.map((e) => ({ ...e, children: e.children ? k(e.children) : [] }))
      }
      function T() {
        Object.assign(a, {
          material_code: '',
          material_name: '',
          qty: 1,
          scrap_rate: 0,
          position_no: '',
          material_type: 'normal',
          is_critical: !1,
          substitute_allowed: !1
        })
      }
      function R(o, e) {
        return o ? e.label.toLowerCase().includes(o.toLowerCase()) || e.material_code.toLowerCase().includes(o.toLowerCase()) : !0
      }
      function j(o) {
        ;((d.value = o),
          Object.assign(a, {
            material_code: o.material_code,
            material_name: o.material_name,
            qty: o.qty,
            scrap_rate: o.scrap_rate,
            position_no: o.position_no,
            material_type: o.material_type,
            is_critical: o.is_critical,
            substitute_allowed: o.substitute_allowed
          }))
      }
      function q(o) {
        ;((d.value = {
          id: '',
          label: '',
          material_code: '',
          material_name: '',
          qty: 1,
          scrap_rate: 0,
          position_no: '',
          material_type: 'normal',
          is_critical: !1,
          substitute_allowed: !1,
          _parentId: o
        }),
          T())
      }
      function G() {
        if (!a.material_code || !a.material_name) {
          c.warning('请填写物料编码和物料名称')
          return
        }
        if (d.value?.id)
          (Object.assign(d.value, {
            material_code: a.material_code,
            material_name: a.material_name,
            qty: a.qty,
            scrap_rate: a.scrap_rate,
            position_no: a.position_no,
            material_type: a.material_type,
            is_critical: a.is_critical,
            substitute_allowed: a.substitute_allowed,
            label: `${a.material_name} ×${a.qty}`
          }),
            c.success('已更新静态结构节点'))
        else {
          const o = {
              id: `node-${Date.now()}`,
              label: `${a.material_name} ×${a.qty}`,
              material_code: a.material_code,
              material_name: a.material_name,
              qty: a.qty,
              scrap_rate: a.scrap_rate,
              position_no: a.position_no,
              material_type: a.material_type,
              is_critical: a.is_critical,
              substitute_allowed: a.substitute_allowed,
              children: []
            },
            e = d.value?._parentId
          if (e) {
            const r = h(f.value, e)
            r && (r.children || (r.children = []), r.children.push(o))
          } else f.value.push(o)
          c.success('已新增静态结构节点')
        }
        d.value = null
      }
      function L() {
        ue.confirm('确认删除该节点及其所有子节点吗？', '删除确认', { type: 'warning' })
          .then(() => {
            ;(d.value?.id && B(f.value, d.value.id), (d.value = null), c.success('已删除静态结构节点'))
          })
          .catch(() => {})
      }
      function B(o, e) {
        for (let r = 0; r < o.length; r += 1) {
          if (o[r].id === e) return (o.splice(r, 1), !0)
          if (o[r].children && B(o[r].children, e)) return !0
        }
        return !1
      }
      function h(o, e) {
        for (const r of o) {
          if (r.id === e) return r
          if (r.children) {
            const m = h(r.children, e)
            if (m) return m
          }
        }
        return null
      }
      function Y() {
        c.success('已完成静态导入演示')
      }
      function z() {
        c.success('已完成静态导出演示')
      }
      function D() {
        if (!n.material_code || !n.material_name) {
          c.warning('请先维护版本头信息')
          return
        }
        if (!f.value.length) {
          c.warning('请至少维护一个结构根节点')
          return
        }
        c.success('静态产品结构已保存，可作为下一阶段 mock 基线')
      }
      function X() {
        const o = String(E.params.id || '')
        if (O.value) {
          ;(I(), (f.value = []))
          return
        }
        const e = M[o] || M['BOM-EB-1001']
        ;(Object.assign(n, e.meta), (f.value = k(e.tree)))
      }
      return (
        ee(() => {
          X()
        }),
        (o, e) => {
          const r = se,
            m = ae,
            N = oe,
            P = le,
            u = te,
            p = ne,
            C = _e,
            S = re,
            U = ce,
            H = Q,
            A = K,
            $ = fe,
            J = W('gi-page-layout')
          return (
            v(),
            y(J, null, {
              header: i(() => [
                s('div', be, [
                  s('div', Ve, [
                    s('h2', null, b(O.value ? '新建产品结构' : `产品结构编辑 - ${n.material_name}`), 1),
                    s('p', we, b(n.material_code || '待定义产品编码') + ' ｜ ' + b(n.bom_type) + ' ｜ ' + b(n.version), 1)
                  ]),
                  s('div', ge, [
                    l(r, { onClick: Y }, { default: i(() => [...(e[19] || (e[19] = [_('导入 Excel', -1)]))]), _: 1 }),
                    l(r, { onClick: z }, { default: i(() => [...(e[20] || (e[20] = [_('导出 Excel', -1)]))]), _: 1 }),
                    l(r, { type: 'primary', onClick: D }, { default: i(() => [...(e[21] || (e[21] = [_('保存', -1)]))]), _: 1 }),
                    l(r, { onClick: e[0] || (e[0] = (t) => o.$router.back()) }, { default: i(() => [...(e[22] || (e[22] = [_('返回', -1)]))]), _: 1 })
                  ])
                ])
              ]),
              default: i(() => [
                s('div', Ce, [
                  s('div', Ee, [
                    s('div', xe, [
                      s('div', Me, [
                        l(
                          r,
                          { type: 'primary', size: 'small', onClick: e[1] || (e[1] = (t) => q(null)) },
                          { default: i(() => [...(e[23] || (e[23] = [_('新增根节点', -1)]))]), _: 1 }
                        )
                      ]),
                      l(
                        m,
                        {
                          modelValue: g.value,
                          'onUpdate:modelValue': e[2] || (e[2] = (t) => (g.value = t)),
                          placeholder: '搜索节点名称或物料编码',
                          clearable: '',
                          style: { 'margin-top': '8px' }
                        },
                        null,
                        8,
                        ['modelValue']
                      ),
                      l(
                        P,
                        {
                          ref_key: 'treeRef',
                          ref: x,
                          data: f.value,
                          props: { children: 'children', label: 'label' },
                          'filter-node-method': R,
                          'node-key': 'id',
                          'default-expand-all': '',
                          'highlight-current': '',
                          onNodeClick: j,
                          style: { 'margin-top': '8px' }
                        },
                        {
                          default: i(({ data: t }) => [
                            s('span', Oe, [
                              s('span', { class: ie({ 'tree-node--phantom': t.material_type === 'phantom' }) }, b(t.label), 3),
                              t.material_type === 'phantom'
                                ? (v(),
                                  y(
                                    N,
                                    { key: 0, size: 'small', type: 'warning', effect: 'light' },
                                    { default: i(() => [...(e[24] || (e[24] = [_('虚拟件', -1)]))]), _: 1 }
                                  ))
                                : w('', !0),
                              t.material_type === 'auxiliary'
                                ? (v(),
                                  y(
                                    N,
                                    { key: 1, size: 'small', type: 'info', effect: 'light' },
                                    { default: i(() => [...(e[25] || (e[25] = [_('辅料', -1)]))]), _: 1 }
                                  ))
                                : w('', !0)
                            ])
                          ]),
                          _: 1
                        },
                        8,
                        ['data']
                      )
                    ]),
                    s('div', ke, [
                      l(
                        U,
                        { shadow: 'never', class: 'meta-card' },
                        {
                          header: i(() => [...(e[26] || (e[26] = [s('div', { class: 'card-header' }, [s('span', null, '版本头信息')], -1)]))]),
                          default: i(() => [
                            l(
                              S,
                              { model: n, 'label-width': '92px' },
                              {
                                default: i(() => [
                                  l(
                                    u,
                                    { label: '产品编码' },
                                    {
                                      default: i(() => [
                                        l(
                                          m,
                                          { modelValue: n.material_code, 'onUpdate:modelValue': e[3] || (e[3] = (t) => (n.material_code = t)) },
                                          null,
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    u,
                                    { label: '产品名称' },
                                    {
                                      default: i(() => [
                                        l(
                                          m,
                                          { modelValue: n.material_name, 'onUpdate:modelValue': e[4] || (e[4] = (t) => (n.material_name = t)) },
                                          null,
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    u,
                                    { label: 'BOM 类型' },
                                    {
                                      default: i(() => [
                                        l(
                                          C,
                                          {
                                            modelValue: n.bom_type,
                                            'onUpdate:modelValue': e[5] || (e[5] = (t) => (n.bom_type = t)),
                                            style: { width: '100%' }
                                          },
                                          {
                                            default: i(() => [l(p, { label: 'EBOM', value: 'EBOM' }), l(p, { label: 'MBOM', value: 'MBOM' })]),
                                            _: 1
                                          },
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    u,
                                    { label: '版本' },
                                    {
                                      default: i(() => [
                                        l(m, { modelValue: n.version, 'onUpdate:modelValue': e[6] || (e[6] = (t) => (n.version = t)) }, null, 8, [
                                          'modelValue'
                                        ])
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    u,
                                    { label: '状态' },
                                    {
                                      default: i(() => [
                                        l(
                                          C,
                                          {
                                            modelValue: n.status,
                                            'onUpdate:modelValue': e[7] || (e[7] = (t) => (n.status = t)),
                                            style: { width: '100%' }
                                          },
                                          {
                                            default: i(() => [
                                              l(p, { label: '草稿', value: 'draft' }),
                                              l(p, { label: '待评审', value: 'pending_approval' }),
                                              l(p, { label: '已生效', value: 'active' }),
                                              l(p, { label: '已停用', value: 'disabled' }),
                                              l(p, { label: '已归档', value: 'archived' })
                                            ]),
                                            _: 1
                                          },
                                          8,
                                          ['modelValue']
                                        )
                                      ]),
                                      _: 1
                                    }
                                  ),
                                  l(
                                    u,
                                    { label: '生效日期' },
                                    {
                                      default: i(() => [
                                        l(
                                          m,
                                          { modelValue: n.effective_date, 'onUpdate:modelValue': e[8] || (e[8] = (t) => (n.effective_date = t)) },
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
                        }
                      ),
                      d.value
                        ? (v(),
                          y(
                            U,
                            { key: 1, shadow: 'never', class: 'node-card' },
                            {
                              header: i(() => [
                                s('div', Be, [
                                  s('span', null, b(d.value.id ? '节点维护' : '新增子件'), 1),
                                  d.value.id
                                    ? (v(),
                                      y(
                                        r,
                                        { key: 0, type: 'success', link: '', onClick: e[9] || (e[9] = (t) => q(d.value.id)) },
                                        { default: i(() => [...(e[27] || (e[27] = [_('新增子件', -1)]))]), _: 1 }
                                      ))
                                    : w('', !0)
                                ])
                              ]),
                              default: i(() => [
                                l(
                                  S,
                                  { model: a, 'label-width': '100px' },
                                  {
                                    default: i(() => [
                                      l(
                                        u,
                                        { label: '物料编码', required: '' },
                                        {
                                          default: i(() => [
                                            l(
                                              m,
                                              {
                                                modelValue: a.material_code,
                                                'onUpdate:modelValue': e[10] || (e[10] = (t) => (a.material_code = t)),
                                                placeholder: '请输入物料编码'
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(
                                        u,
                                        { label: '物料名称', required: '' },
                                        {
                                          default: i(() => [
                                            l(
                                              m,
                                              {
                                                modelValue: a.material_name,
                                                'onUpdate:modelValue': e[11] || (e[11] = (t) => (a.material_name = t)),
                                                placeholder: '请输入物料名称'
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(
                                        u,
                                        { label: '单位用量', required: '' },
                                        {
                                          default: i(() => [
                                            l(
                                              A,
                                              {
                                                modelValue: a.qty,
                                                'onUpdate:modelValue': e[12] || (e[12] = (t) => (a.qty = t)),
                                                min: 0,
                                                precision: 4,
                                                style: { width: '220px' }
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(
                                        u,
                                        { label: '损耗率(%)' },
                                        {
                                          default: i(() => [
                                            l(
                                              A,
                                              {
                                                modelValue: a.scrap_rate,
                                                'onUpdate:modelValue': e[13] || (e[13] = (t) => (a.scrap_rate = t)),
                                                min: 0,
                                                max: 100,
                                                precision: 1,
                                                style: { width: '220px' }
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(
                                        u,
                                        { label: '位号' },
                                        {
                                          default: i(() => [
                                            l(
                                              m,
                                              {
                                                modelValue: a.position_no,
                                                'onUpdate:modelValue': e[14] || (e[14] = (t) => (a.position_no = t)),
                                                placeholder: '例如 A1-2'
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(
                                        u,
                                        { label: '物料类型' },
                                        {
                                          default: i(() => [
                                            l(
                                              C,
                                              {
                                                modelValue: a.material_type,
                                                'onUpdate:modelValue': e[15] || (e[15] = (t) => (a.material_type = t)),
                                                style: { width: '220px' }
                                              },
                                              {
                                                default: i(() => [
                                                  l(p, { label: '普通件', value: 'normal' }),
                                                  l(p, { label: '虚拟件', value: 'phantom' }),
                                                  l(p, { label: '辅料', value: 'auxiliary' })
                                                ]),
                                                _: 1
                                              },
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(
                                        u,
                                        { label: '关键件' },
                                        {
                                          default: i(() => [
                                            l(
                                              $,
                                              { modelValue: a.is_critical, 'onUpdate:modelValue': e[16] || (e[16] = (t) => (a.is_critical = t)) },
                                              null,
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(
                                        u,
                                        { label: '允许替代' },
                                        {
                                          default: i(() => [
                                            l(
                                              $,
                                              {
                                                modelValue: a.substitute_allowed,
                                                'onUpdate:modelValue': e[17] || (e[17] = (t) => (a.substitute_allowed = t))
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            )
                                          ]),
                                          _: 1
                                        }
                                      ),
                                      l(u, null, {
                                        default: i(() => [
                                          l(
                                            r,
                                            { type: 'primary', onClick: G },
                                            { default: i(() => [...(e[28] || (e[28] = [_('保存节点', -1)]))]), _: 1 }
                                          ),
                                          d.value.id
                                            ? (v(),
                                              y(
                                                r,
                                                { key: 0, type: 'danger', onClick: L },
                                                { default: i(() => [...(e[29] || (e[29] = [_('删除节点', -1)]))]), _: 1 }
                                              ))
                                            : w('', !0),
                                          l(
                                            r,
                                            { onClick: e[18] || (e[18] = (t) => (d.value = null)) },
                                            { default: i(() => [...(e[30] || (e[30] = [_('取消', -1)]))]), _: 1 }
                                          )
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  },
                                  8,
                                  ['model']
                                )
                              ]),
                              _: 1
                            }
                          ))
                        : (v(), pe('div', qe, [l(H, { description: '点击左侧节点进行编辑，或新增子件节点。' })]))
                    ])
                  ])
                ])
              ]),
              _: 1
            })
          )
        }
      )
    }
  }),
  $e = ye(he, [['__scopeId', 'data-v-eedb928e']])
export { $e as default }
