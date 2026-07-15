import {
  Bn as n,
  Mn as d,
  On as k,
  U as z,
  W as B,
  an as C,
  bn as W,
  dn as i,
  in as l,
  it as D,
  ot as E,
  pn as P,
  rr as r,
  sr as s,
  un as a
} from './element-plus-CzL7BOKu.js'
import { t as T } from './useTable-Hzr4fBAy.js'
import { t as h } from './TableSetting-BqN9x3yX.js'
import { a as I } from './mrp-CaR7BBur.js'
var M = { style: { padding: '12px 24px' } },
  S = { style: { 'margin-top': '12px', display: 'flex', gap: '24px', color: '#606266', 'font-size': '13px' } },
  V = P({
    __name: 'index',
    setup($) {
      const u = [
          { type: 'expand', slotName: 'expand' },
          { prop: 'id', label: '运行编号', width: 170 },
          { prop: 'run_time', label: '运行时间', width: 170 },
          { prop: 'operator', label: '操作人', width: 80 },
          { prop: 'scope', label: '范围', width: 100 },
          { prop: 'orders', label: '销售订单数', minWidth: 100, align: 'center' },
          { prop: 'suggestions', label: '建议数', minWidth: 80, align: 'center' },
          { label: '状态', minWidth: 80, slotName: 'status', align: 'center' },
          { label: '操作', minWidth: 100, slotName: 'actions', align: 'center' }
        ],
        {
          tableData: _,
          pagination: g,
          loading: m
        } = T({ rowKey: 'id', listAPI: async ({ page: p, size: t }) => (await I({ pageNum: p, pageSize: t })).data })
      return (p, t) => {
        const b = D,
          c = E,
          o = B,
          f = z,
          y = d('gi-table'),
          x = d('gi-page-layout')
        return (
          k(),
          C(x, null, {
            default: n(() => [
              i(
                h,
                { title: 'MRP 运行历史', columns: u },
                {
                  default: n(({ settingColumns: v, tableProps: N }) => [
                    i(
                      y,
                      W({ columns: v, data: r(_), pagination: r(g), loading: r(m) }, N, { border: '', stripe: '' }),
                      {
                        status: n(({ row: e }) => [
                          i(
                            b,
                            { type: e.status === 'completed' ? 'success' : 'danger', size: 'small' },
                            { default: n(() => [a(s(e.status === 'completed' ? '已完成' : '失败'), 1)]), _: 2 },
                            1032,
                            ['type']
                          )
                        ]),
                        actions: n(({ row: e }) => [
                          i(
                            c,
                            {
                              type: 'primary',
                              link: '',
                              size: 'small',
                              onClick: (R) => p.$router.push(`/engineering-plan/planning/mrp/result?runId=${e.id}`)
                            },
                            { default: n(() => [...(t[0] || (t[0] = [a('查看结果', -1)]))]), _: 1 },
                            8,
                            ['onClick']
                          )
                        ]),
                        expand: n(({ row: e }) => [
                          l('div', M, [
                            i(
                              f,
                              { column: 3, border: '', size: 'small' },
                              {
                                default: n(() => [
                                  i(o, { label: '运算范围' }, { default: n(() => [a(s(e.scope), 1)]), _: 2 }, 1024),
                                  i(o, { label: '需求日期范围' }, { default: n(() => [a(s(e.date_range), 1)]), _: 2 }, 1024),
                                  i(o, { label: '考虑安全库存' }, { default: n(() => [a(s(e.include_safety_stock ? '是' : '否'), 1)]), _: 2 }, 1024),
                                  i(o, { label: '考虑在途库存' }, { default: n(() => [a(s(e.include_in_transit ? '是' : '否'), 1)]), _: 2 }, 1024),
                                  i(o, { label: '提前期模式' }, { default: n(() => [a(s(e.lead_time_mode), 1)]), _: 2 }, 1024),
                                  i(o, { label: '运算策略' }, { default: n(() => [a(s(e.strategy), 1)]), _: 2 }, 1024)
                                ]),
                                _: 2
                              },
                              1024
                            ),
                            l('div', S, [
                              l('span', null, [t[1] || (t[1] = a('销售订单 ', -1)), l('b', null, s(e.orders), 1)]),
                              l('span', null, [t[2] || (t[2] = a('采购建议 ', -1)), l('b', null, s(e.purchase_suggestions), 1)]),
                              l('span', null, [t[3] || (t[3] = a('调拨建议 ', -1)), l('b', null, s(e.transfer_suggestions), 1)]),
                              l('span', null, [t[4] || (t[4] = a('生产建议 ', -1)), l('b', null, s(e.production_suggestions), 1)]),
                              l('span', null, [t[5] || (t[5] = a('总建议数 ', -1)), l('b', null, s(e.suggestions), 1)])
                            ])
                          ])
                        ]),
                        _: 1
                      },
                      16,
                      ['columns', 'data', 'pagination', 'loading']
                    )
                  ]),
                  _: 1
                }
              )
            ]),
            _: 1
          })
        )
      }
    }
  }),
  U = V
export { U as default }
