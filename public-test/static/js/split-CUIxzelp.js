import {
  Bn as l,
  F as N,
  Mn as U,
  On as r,
  U as A,
  W as I,
  Xn as g,
  an as h,
  b as O,
  dn as e,
  i as T,
  in as c,
  nt as D,
  on as y,
  or as M,
  ot as W,
  pn as R,
  rn as X,
  rt as F,
  sn as b,
  sr as a,
  un as s,
  y as J
} from './element-plus-CzL7BOKu.js'
import { i as P } from './vue-chunks-CWn_TkJU.js'
import { I as $ } from './index-DqMfCNbk.js'
import { t as j } from './TableSetting-BqN9x3yX.js'
var G = { style: { 'margin-top': '12px' } },
  H = { class: 'split-footer' },
  K = { key: 0 },
  L = { key: 1 },
  Q = { key: 0, class: 'split-tip' },
  Y = R({
    __name: 'index',
    setup(Z) {
      const k = P(),
        u = g({ code: 'WO202501150001', material: '离心泵 XJP-100', qty: 100, status: '草稿' }),
        i = g([
          { line: '产线A', qty: 50 },
          { line: '产线B', qty: 50 }
        ]),
        q = [
          { prop: 'line', label: '产线', width: 160 },
          { prop: 'qty', label: '分配数量', width: 180 }
        ],
        t = X(() => u.value.qty - i.value.reduce((d, o) => d + o.qty, 0))
      function x() {
        i.value.push({ line: '产线A', qty: 1 })
      }
      function V(d) {
        i.value.splice(d, 1)
      }
      function C() {
        ;(T.success('拆分成功，已生成子工单'), k.push('/mes/work-order/list'))
      }
      return (d, o) => {
        const p = I,
          E = A,
          m = D,
          B = F,
          v = O,
          S = N,
          f = W,
          w = J,
          z = U('gi-page-layout')
        return (
          r(),
          h(z, null, {
            header: l(() => [c('h3', null, '工单拆分 - ' + a(u.value.code), 1)]),
            default: l(() => [
              e(
                E,
                { column: 2, border: '', style: { 'margin-bottom': '16px' } },
                {
                  default: l(() => [
                    e(p, { label: '工单编号' }, { default: l(() => [s(a(u.value.code), 1)]), _: 1 }),
                    e(p, { label: '产品' }, { default: l(() => [s(a(u.value.material), 1)]), _: 1 }),
                    e(p, { label: '计划数量' }, { default: l(() => [s(a(u.value.qty), 1)]), _: 1 }),
                    e(p, { label: '状态' }, { default: l(() => [s(a(u.value.status), 1)]), _: 1 })
                  ]),
                  _: 1
                }
              ),
              e(
                j,
                { title: '拆分明细', columns: q },
                {
                  default: l(() => [
                    e(
                      w,
                      { data: i.value, border: '', stripe: '' },
                      {
                        default: l(() => [
                          e(
                            v,
                            { prop: 'line', label: '产线', width: '160' },
                            {
                              default: l(({ row: n }) => [
                                e(
                                  B,
                                  { modelValue: n.line, 'onUpdate:modelValue': (_) => (n.line = _), size: 'small' },
                                  {
                                    default: l(() => [
                                      e(m, { label: '产线A', value: '产线A' }),
                                      e(m, { label: '产线B', value: '产线B' }),
                                      e(m, { label: '产线C', value: '产线C' })
                                    ]),
                                    _: 1
                                  },
                                  8,
                                  ['modelValue', 'onUpdate:modelValue']
                                )
                              ]),
                              _: 1
                            }
                          ),
                          e(
                            v,
                            { prop: 'qty', label: '分配数量', width: '180' },
                            {
                              default: l(({ row: n }) => [
                                e(
                                  S,
                                  { modelValue: n.qty, 'onUpdate:modelValue': (_) => (n.qty = _), min: 1, max: n.qty + t.value, size: 'small' },
                                  null,
                                  8,
                                  ['modelValue', 'onUpdate:modelValue', 'max']
                                )
                              ]),
                              _: 1
                            }
                          ),
                          e(
                            v,
                            { label: '操作', width: '100', align: 'center' },
                            {
                              default: l(({ $index: n }) => [
                                i.value.length > 1
                                  ? (r(),
                                    h(
                                      f,
                                      { key: 0, type: 'danger', link: '', size: 'small', onClick: (_) => V(n) },
                                      { default: l(() => [...(o[0] || (o[0] = [s('删除', -1)]))]), _: 1 },
                                      8,
                                      ['onClick']
                                    ))
                                  : y('', !0)
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
              c('div', G, [e(f, { size: 'small', onClick: x }, { default: l(() => [...(o[1] || (o[1] = [s('新增产线', -1)]))]), _: 1 })]),
              c('div', H, [
                c(
                  'span',
                  {
                    style: M({
                      color: t.value > 0 ? '#e6a23c' : t.value < 0 ? '#f56c6c' : '#67c23a',
                      marginRight: '12px',
                      fontWeight: t.value !== 0 ? 600 : 400
                    })
                  },
                  [
                    s(' 剩余未分配：' + a(t.value) + ' ', 1),
                    t.value > 0
                      ? (r(), b('span', K, '（还需分配 ' + a(t.value) + '）', 1))
                      : t.value < 0
                        ? (r(), b('span', L, '（超出 ' + a(Math.abs(t.value)) + '，请调整）', 1))
                        : y('', !0)
                  ],
                  4
                ),
                e(
                  f,
                  { type: 'primary', disabled: t.value !== 0, onClick: C },
                  { default: l(() => [...(o[2] || (o[2] = [s('确认拆分', -1)]))]), _: 1 },
                  8,
                  ['disabled']
                ),
                t.value !== 0 ? (r(), b('div', Q, '子工单数量总和需等于总数量 ' + a(u.value.qty), 1)) : y('', !0)
              ])
            ]),
            _: 1
          })
        )
      }
    }
  }),
  oe = $(Y, [['__scopeId', 'data-v-289c2135']])
export { oe as default }
