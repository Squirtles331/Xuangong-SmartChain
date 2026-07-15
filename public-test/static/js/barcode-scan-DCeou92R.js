import {
  $t as K,
  Bn as a,
  Mn as C,
  On as x,
  U as L,
  W as A,
  Xn as _,
  an as w,
  bn as O,
  dn as t,
  ft as U,
  ht as X,
  i as N,
  it as J,
  mt as $,
  on as j,
  ot as G,
  pn as H,
  rr as d,
  sr as s,
  tt as Q,
  un as r,
  xn as S
} from './element-plus-CzL7BOKu.js'
import { t as Y } from './useTable-Hzr4fBAy.js'
import { t as Z } from './TableSetting-BqN9x3yX.js'
import { l as ee } from './wms-TgZ5oe41.js'
var ae = H({
    __name: 'index',
    setup(te) {
      const i = _(''),
        m = _(null),
        l = _(null),
        D = [
          { prop: 'barcode', label: '条码', minWidth: 180 },
          { label: '类型', minWidth: 80, slotName: 'type', align: 'center' },
          { prop: 'materialCode', label: '物料编码', minWidth: 160 },
          { prop: 'materialName', label: '物料名称', minWidth: 140 },
          { prop: 'qty', label: '数量', minWidth: 80, align: 'center' },
          { prop: 'location', label: '库位', minWidth: 100 },
          { prop: 'time', label: '操作时间', minWidth: 170 }
        ],
        {
          tableData: f,
          pagination: g,
          loading: E,
          search: W
        } = Y({
          rowKey: 'id',
          listAPI: async ({ page: e, size: n }) => {
            const o = await ee({ pageNum: e, pageSize: n })
            return { list: o.data.list.map(k), total: o.data.total }
          }
        })
      function k(e) {
        return {
          id: String(e.id),
          barcode: e.barcode || '',
          materialCode: e.materialCode || e.material_code || '',
          materialName: e.materialName || e.material_name || '',
          qty: Number(e.qty ?? 0),
          location: e.location || '',
          type: e.type || '',
          time: e.time || ''
        }
      }
      function B(e) {
        if (!e) return null
        const n = [
            { code: '01.01.001-00001', name: '45号圆钢 D50', location: 'A-01-01' },
            { code: '02.04.001-00001', name: '轴承 6308', location: 'B-02-03' },
            { code: '04.01.001-00001', name: '离心泵 XJP-100', location: 'F-01-01' },
            { code: '01.01.002-00001', name: '螺栓 M16x60', location: 'C-02-01' },
            { code: '02.04.001-00002', name: '传动轴 DS-50', location: 'D-01-02' }
          ],
          o = n.find((c) => e.includes(c.code.replace(/\W/g, '').slice(-6))) || n[0]
        return { barcode: e, materialCode: o.code, materialName: o.name, qty: Math.floor(Math.random() * 50) + 1, location: o.location }
      }
      function I() {
        if (!i.value) return
        const e = B(i.value)
        e &&
          ((l.value = e),
          (i.value = ''),
          S(() => {
            m.value?.focus?.()
          }))
      }
      function b(e) {
        if (!l.value) {
          N.warning('请先扫描条码')
          return
        }
        ;(f.value.unshift({ id: Date.now().toString(), ...l.value, type: e, time: new Date().toLocaleString('zh-CN') }),
          (l.value = null),
          (g.currentPage = 1),
          N.success(e === '入库' ? '入库成功' : '出库成功'),
          S(() => {
            m.value?.focus?.()
          }))
      }
      function R() {
        b('入库')
      }
      function V() {
        b('出库')
      }
      return (e, n) => {
        const o = U,
          c = X,
          y = G,
          q = $,
          v = Q,
          u = A,
          M = L,
          T = J,
          P = C('gi-table'),
          z = C('gi-page-layout')
        return (
          x(),
          w(z, null, {
            default: a(() => [
              t(
                v,
                { shadow: 'never', style: { 'margin-bottom': '16px' } },
                {
                  default: a(() => [
                    t(
                      q,
                      { inline: !0 },
                      {
                        default: a(() => [
                          t(
                            c,
                            { label: '扫描条码' },
                            {
                              default: a(() => [
                                t(
                                  o,
                                  {
                                    ref_key: 'scanInputRef',
                                    ref: m,
                                    modelValue: i.value,
                                    'onUpdate:modelValue': n[0] || (n[0] = (p) => (i.value = p)),
                                    placeholder: '扫描或输入条码',
                                    style: { width: '300px' },
                                    clearable: '',
                                    onKeyup: K(I, ['enter'])
                                  },
                                  null,
                                  8,
                                  ['modelValue']
                                )
                              ]),
                              _: 1
                            }
                          ),
                          t(c, null, {
                            default: a(() => [
                              t(y, { type: 'success', onClick: R }, { default: a(() => [...(n[1] || (n[1] = [r('确认入库', -1)]))]), _: 1 }),
                              t(
                                y,
                                { type: 'warning', style: { 'margin-left': '8px' }, onClick: V },
                                { default: a(() => [...(n[2] || (n[2] = [r('确认出库', -1)]))]), _: 1 }
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
              ),
              l.value
                ? (x(),
                  w(
                    v,
                    { key: 0, shadow: 'never', style: { 'margin-bottom': '16px' }, header: '解析结果' },
                    {
                      default: a(() => [
                        t(
                          M,
                          { column: 4, border: '' },
                          {
                            default: a(() => [
                              t(u, { label: '物料编码' }, { default: a(() => [r(s(l.value.materialCode), 1)]), _: 1 }),
                              t(u, { label: '物料名称' }, { default: a(() => [r(s(l.value.materialName), 1)]), _: 1 }),
                              t(u, { label: '数量' }, { default: a(() => [r(s(l.value.qty), 1)]), _: 1 }),
                              t(u, { label: '库位' }, { default: a(() => [r(s(l.value.location), 1)]), _: 1 })
                            ]),
                            _: 1
                          }
                        )
                      ]),
                      _: 1
                    }
                  ))
                : j('', !0),
              t(
                Z,
                { title: '扫码记录', columns: D, onRefresh: d(W) },
                {
                  default: a(({ settingColumns: p, tableProps: F }) => [
                    t(
                      P,
                      O({ columns: p, data: d(f), pagination: d(g), loading: d(E) }, F, { border: '', stripe: '' }),
                      {
                        type: a(({ row: h }) => [
                          t(
                            T,
                            { type: h.type === '入库' ? 'success' : 'warning', size: 'small' },
                            { default: a(() => [r(s(h.type), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        _: 1
                      },
                      16,
                      ['columns', 'data', 'pagination', 'loading']
                    )
                  ]),
                  _: 1
                },
                8,
                ['onRefresh']
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  ie = ae
export { ie as default }
