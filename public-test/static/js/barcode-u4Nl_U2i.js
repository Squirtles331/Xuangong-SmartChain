import {
  $t as O,
  Bn as l,
  F as j,
  J as G,
  Mn as U,
  On as w,
  U as H,
  W as Q,
  Xn as u,
  Yn as Z,
  _ as ee,
  an as le,
  dn as e,
  ft as ae,
  ht as te,
  i as f,
  in as h,
  mt as ne,
  ot as oe,
  pn as se,
  q as de,
  rr as C,
  sn as q,
  sr as b,
  tt as re,
  un as s,
  v as ie
} from './element-plus-CzL7BOKu.js'
import { I as ue } from './index-DqMfCNbk.js'
import { t as pe } from './useTable-Hzr4fBAy.js'
import { f as me } from './wms-TgZ5oe41.js'
var ce = { style: { 'margin-bottom': '12px' } },
  _e = { key: 0, class: 'empty-preview' },
  fe = { key: 1, class: 'barcode-preview' },
  be = { class: 'barcode-img' },
  ve = se({
    __name: 'index',
    setup(ge) {
      const S = u('print'),
        x = u([]),
        v = u(''),
        p = u(''),
        m = u(''),
        E = u([]),
        I = u([]),
        n = Z({ code: '', name: '', lot: '', qty: 1 }),
        N = [
          { type: 'selection', minWidth: 50 },
          { prop: 'barcode', label: '条码', minWidth: 180 },
          { prop: 'code', label: '物料编码', minWidth: 170 },
          { prop: 'name', label: '物料名称', minWidth: 180 },
          { prop: 'lot', label: '批号', minWidth: 120 },
          { prop: 'qty', label: '库存数量', minWidth: 90, align: 'center' }
        ],
        $ = [
          { prop: 'barcode', label: '条码', minWidth: 180 },
          { prop: 'material', label: '物料名称', minWidth: 180 },
          { prop: 'time', label: '入库时间', minWidth: 170 }
        ],
        F = [
          { prop: 'barcode', label: '条码', minWidth: 180 },
          { prop: 'material', label: '物料名称', minWidth: 180 },
          { prop: 'time', label: '出库时间', minWidth: 170 }
        ],
        {
          tableData: W,
          pagination: M,
          loading: R
        } = pe({
          rowKey: 'id',
          listAPI: async ({ page: c, size: a }) => {
            const d = (await me({ pageNum: c, pageSize: a })).data.list.map((o, r) => ({
              id: String(o.id),
              barcode: `BC${String(r + 1).padStart(5, '0')}${String(o.code).replace(/\W/g, '').slice(-6)}`,
              code: o.code,
              name: o.name,
              lot: `LOT-${String(r + 1).padStart(4, '0')}`,
              qty: o.stock ?? o.qty ?? 0
            }))
            return { list: d, total: d.length }
          }
        })
      function T() {
        if (!n.code) {
          f.warning('请填写物料编码')
          return
        }
        ;((v.value = `BC${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(Math.floor(Math.random() * 9e3) + 1e3)}`),
          f.success('条码生成成功'))
      }
      function K(c) {
        x.value = c
      }
      function L() {
        f.success(`已提交打印任务，共 ${x.value.length} 项`)
      }
      function B(c) {
        return W.value.find((a) => a.barcode === c)?.name || '未知物料'
      }
      function k() {
        p.value &&
          (E.value.unshift({ barcode: p.value, material: B(p.value), time: new Date().toLocaleString('zh-CN') }),
          (p.value = ''),
          f.success('入库确认成功'))
      }
      function z() {
        m.value &&
          (I.value.unshift({ barcode: m.value, material: B(m.value), time: new Date().toLocaleString('zh-CN') }),
          (m.value = ''),
          f.success('出库确认成功'))
      }
      return (c, a) => {
        const d = oe,
          o = U('gi-table'),
          r = ee,
          _ = ae,
          i = te,
          P = j,
          V = ne,
          g = re,
          D = de,
          y = Q,
          A = H,
          J = G,
          X = ie,
          Y = U('gi-page-layout')
        return (
          w(),
          le(Y, null, {
            header: l(() => [...(a[7] || (a[7] = [h('h3', null, '条码 / RFID 管理', -1)]))]),
            default: l(() => [
              e(
                X,
                { modelValue: S.value, 'onUpdate:modelValue': a[6] || (a[6] = (t) => (S.value = t)) },
                {
                  default: l(() => [
                    e(
                      r,
                      { label: '批量打印', name: 'print' },
                      {
                        default: l(() => [
                          h('div', ce, [
                            e(d, { type: 'primary', onClick: L }, { default: l(() => [...(a[8] || (a[8] = [s('批量打印', -1)]))]), _: 1 })
                          ]),
                          e(
                            o,
                            { columns: N, data: C(W), pagination: C(M), loading: C(R), border: '', stripe: '', size: 'small', onSelectionChange: K },
                            null,
                            8,
                            ['data', 'pagination', 'loading']
                          )
                        ]),
                        _: 1
                      }
                    ),
                    e(
                      r,
                      { label: '条码生成', name: 'generate' },
                      {
                        default: l(() => [
                          e(
                            J,
                            { gutter: 16 },
                            {
                              default: l(() => [
                                e(
                                  D,
                                  { span: 8 },
                                  {
                                    default: l(() => [
                                      e(
                                        g,
                                        { header: '条码参数', shadow: 'never' },
                                        {
                                          default: l(() => [
                                            e(
                                              V,
                                              { 'label-width': '90px', size: 'small' },
                                              {
                                                default: l(() => [
                                                  e(
                                                    i,
                                                    { label: '物料编码' },
                                                    {
                                                      default: l(() => [
                                                        e(
                                                          _,
                                                          { modelValue: n.code, 'onUpdate:modelValue': a[0] || (a[0] = (t) => (n.code = t)) },
                                                          null,
                                                          8,
                                                          ['modelValue']
                                                        )
                                                      ]),
                                                      _: 1
                                                    }
                                                  ),
                                                  e(
                                                    i,
                                                    { label: '物料名称' },
                                                    {
                                                      default: l(() => [
                                                        e(
                                                          _,
                                                          { modelValue: n.name, 'onUpdate:modelValue': a[1] || (a[1] = (t) => (n.name = t)) },
                                                          null,
                                                          8,
                                                          ['modelValue']
                                                        )
                                                      ]),
                                                      _: 1
                                                    }
                                                  ),
                                                  e(
                                                    i,
                                                    { label: '批号' },
                                                    {
                                                      default: l(() => [
                                                        e(
                                                          _,
                                                          { modelValue: n.lot, 'onUpdate:modelValue': a[2] || (a[2] = (t) => (n.lot = t)) },
                                                          null,
                                                          8,
                                                          ['modelValue']
                                                        )
                                                      ]),
                                                      _: 1
                                                    }
                                                  ),
                                                  e(
                                                    i,
                                                    { label: '数量' },
                                                    {
                                                      default: l(() => [
                                                        e(
                                                          P,
                                                          {
                                                            modelValue: n.qty,
                                                            'onUpdate:modelValue': a[3] || (a[3] = (t) => (n.qty = t)),
                                                            min: 1,
                                                            style: { width: '100%' }
                                                          },
                                                          null,
                                                          8,
                                                          ['modelValue']
                                                        )
                                                      ]),
                                                      _: 1
                                                    }
                                                  ),
                                                  e(i, null, {
                                                    default: l(() => [
                                                      e(
                                                        d,
                                                        { type: 'primary', onClick: T },
                                                        { default: l(() => [...(a[9] || (a[9] = [s('生成条码', -1)]))]), _: 1 }
                                                      )
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }
                                            )
                                          ]),
                                          _: 1
                                        }
                                      )
                                    ]),
                                    _: 1
                                  }
                                ),
                                e(
                                  D,
                                  { span: 16 },
                                  {
                                    default: l(() => [
                                      e(
                                        g,
                                        { header: '预览', shadow: 'never' },
                                        {
                                          default: l(() => [
                                            v.value
                                              ? (w(),
                                                q('div', fe, [
                                                  h('div', be, b(v.value), 1),
                                                  e(
                                                    A,
                                                    { column: 2, border: '', size: 'small', style: { 'margin-top': '12px' } },
                                                    {
                                                      default: l(() => [
                                                        e(y, { label: '条码' }, { default: l(() => [s(b(v.value), 1)]), _: 1 }),
                                                        e(y, { label: '物料编码' }, { default: l(() => [s(b(n.code), 1)]), _: 1 }),
                                                        e(y, { label: '物料名称' }, { default: l(() => [s(b(n.name), 1)]), _: 1 }),
                                                        e(y, { label: '批号' }, { default: l(() => [s(b(n.lot), 1)]), _: 1 })
                                                      ]),
                                                      _: 1
                                                    }
                                                  )
                                                ]))
                                              : (w(), q('div', _e, '生成条码后可在此预览。'))
                                          ]),
                                          _: 1
                                        }
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ]),
                              _: 1
                            }
                          )
                        ]),
                        _: 1
                      }
                    ),
                    e(
                      r,
                      { label: '扫码入库', name: 'scanIn' },
                      {
                        default: l(() => [
                          e(
                            g,
                            { shadow: 'never' },
                            {
                              default: l(() => [
                                e(
                                  V,
                                  { inline: !0 },
                                  {
                                    default: l(() => [
                                      e(
                                        i,
                                        { label: '条码' },
                                        {
                                          default: l(() => [
                                            e(
                                              _,
                                              {
                                                modelValue: p.value,
                                                'onUpdate:modelValue': a[4] || (a[4] = (t) => (p.value = t)),
                                                style: { width: '300px' },
                                                onKeyup: O(k, ['enter'])
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            ),
                                            e(
                                              d,
                                              { type: 'primary', style: { 'margin-left': '8px' }, onClick: k },
                                              { default: l(() => [...(a[10] || (a[10] = [s('确认入库', -1)]))]), _: 1 }
                                            )
                                          ]),
                                          _: 1
                                        }
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ]),
                              _: 1
                            }
                          ),
                          e(o, { columns: $, data: E.value, border: '', stripe: '', size: 'small', style: { 'margin-top': '16px' } }, null, 8, [
                            'data'
                          ])
                        ]),
                        _: 1
                      }
                    ),
                    e(
                      r,
                      { label: '扫码出库', name: 'scanOut' },
                      {
                        default: l(() => [
                          e(
                            g,
                            { shadow: 'never' },
                            {
                              default: l(() => [
                                e(
                                  V,
                                  { inline: !0 },
                                  {
                                    default: l(() => [
                                      e(
                                        i,
                                        { label: '条码' },
                                        {
                                          default: l(() => [
                                            e(
                                              _,
                                              {
                                                modelValue: m.value,
                                                'onUpdate:modelValue': a[5] || (a[5] = (t) => (m.value = t)),
                                                style: { width: '300px' },
                                                onKeyup: O(z, ['enter'])
                                              },
                                              null,
                                              8,
                                              ['modelValue']
                                            ),
                                            e(
                                              d,
                                              { type: 'primary', style: { 'margin-left': '8px' }, onClick: z },
                                              { default: l(() => [...(a[11] || (a[11] = [s('确认出库', -1)]))]), _: 1 }
                                            )
                                          ]),
                                          _: 1
                                        }
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ]),
                              _: 1
                            }
                          ),
                          e(o, { columns: F, data: I.value, border: '', stripe: '', size: 'small', style: { 'margin-top': '16px' } }, null, 8, [
                            'data'
                          ])
                        ]),
                        _: 1
                      }
                    )
                  ]),
                  _: 1
                },
                8,
                ['modelValue']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  Ce = ue(ve, [['__scopeId', 'data-v-6d128357']])
export { Ce as default }
