import {
  Bn as a,
  Bt as Y,
  Dt as O,
  Et as B,
  Fn as X,
  Kn as G,
  Mn as D,
  Nn as M,
  On as d,
  Xn as F,
  Yn as H,
  Yt as J,
  _t as R,
  an as g,
  dn as s,
  i as I,
  in as v,
  jt as Q,
  l as Z,
  pn as z,
  rn as ee,
  rr as i,
  sn as A,
  sr as x,
  un as _,
  yn as te
} from './element-plus-CzL7BOKu.js'
import { I as le } from './index-DqMfCNbk.js'
import { t as oe } from './useTable-Hzr4fBAy.js'
import { t as ae } from './CrudPage-7Q0FEhS_.js'
import { t as ne } from './CrudRowActions-Dmc4i_Io.js'
import { d as p } from './static-data-B3FhK4xc.js'
var ie = { key: 0, style: { 'text-align': 'center' } },
  se = ['src'],
  re = { key: 1, style: { 'text-align': 'center', padding: '40px' } },
  de = { style: { 'margin-top': '16px', color: '#909399' } },
  ue = z({
    __name: 'FilePreviewDialog',
    props: te({ file: {}, iconComponent: { type: Function } }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {} }),
    emits: ['update:visible'],
    setup(n) {
      const f = X(n, 'visible')
      return (w, r) => {
        const o = R,
          u = D('gi-dialog')
        return (
          d(),
          g(
            u,
            {
              modelValue: f.value,
              'onUpdate:modelValue': r[0] || (r[0] = (m) => (f.value = m)),
              title: '文件预览',
              width: '800px',
              footer: !1,
              'lock-scroll': !1
            },
            {
              default: a(() => [
                n.file?.type === 'image'
                  ? (d(), A('div', ie, [v('img', { src: n.file.url, style: { 'max-width': '100%', 'max-height': '500px' } }, null, 8, se)]))
                  : (d(),
                    A('div', re, [
                      s(o, { size: 64, color: '#909399' }, { default: a(() => [(d(), g(M(n.iconComponent(n.file?.type || ''))))]), _: 1 }),
                      v('p', de, x(n.file?.name), 1),
                      r[1] || (r[1] = v('p', { style: { color: '#c0c4cc', 'font-size': '12px' } }, '暂不支持在线预览，请下载后查看', -1))
                    ]))
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
  ce = ue,
  pe = { class: 'file-name' },
  fe = z({
    __name: 'index',
    setup(n) {
      const f = [{ type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '文件名称 / 所属模块 / 关联类型', clearable: !0 } }],
        w = [
          { label: '文件名称', minWidth: 240, slotName: 'name' },
          { prop: 'module', label: '所属模块', minWidth: 120 },
          { prop: 'objectType', label: '关联类型', minWidth: 120 },
          { label: '文件大小', minWidth: 100, slotName: 'size', align: 'right' },
          { prop: 'uploadedAt', label: '上传时间', minWidth: 170 },
          { label: '操作', minWidth: 220, fixed: 'right', slotName: 'actions', align: 'center' }
        ],
        r = [
          { key: 'preview', label: '预览', tone: 'primary' },
          { key: 'download', label: '下载', tone: 'secondary' },
          { key: 'delete', label: '删除', tone: 'danger' }
        ]
      let o = H({ keyword: '' })
      const u = F(!1),
        m = F(null),
        N = { pdf: B, word: B, excel: Q, image: Y, video: J },
        P = { pdf: '#f56c6c', word: '#409eff', excel: '#67c23a', image: '#e6a23c', video: '#909399' },
        b = ee(() =>
          p.value.filter((e) => !o.keyword || e.name.includes(o.keyword) || e.module.includes(o.keyword) || e.objectType.includes(o.keyword))
        ),
        {
          tableData: V,
          pagination: j,
          loading: E,
          search: k,
          refresh: y,
          onDelete: S
        } = oe({
          rowKey: 'id',
          listAPI: async ({ page: e, size: t }) => {
            const c = (e - 1) * t,
              h = c + t
            return { list: b.value.slice(c, h), total: b.value.length }
          },
          deleteAPI: async (e) => {
            p.value = p.value.filter((t) => !e.includes(t.id))
          }
        })
      function W() {
        ;((o.keyword = ''), k())
      }
      function C(e) {
        return N[e] || O
      }
      function T(e) {
        return P[e] || '#909399'
      }
      function U(e) {
        return e < 1024 ? `${e} B` : e < 1024 * 1024 ? `${(e / 1024).toFixed(1)} KB` : `${(e / (1024 * 1024)).toFixed(1)} MB`
      }
      async function $(e) {
        const t = e.name.split('.').pop()?.toLowerCase()
        ;(p.value.unshift({
          id: `FILE-${String(p.value.length + 1).padStart(3, '0')}`,
          name: e.name,
          module: '系统平台',
          objectType: '通用附件',
          size: e.size || 0,
          type:
            (t &&
              { pdf: 'pdf', doc: 'word', docx: 'word', xls: 'excel', xlsx: 'excel', jpg: 'image', jpeg: 'image', png: 'image', mp4: 'video' }[t]) ||
            'pdf',
          url: '',
          uploadedAt: '2026-07-13 16:30'
        }),
          I.success('已新增静态文件数据'),
          await y())
      }
      function K(e, t) {
        if (e === 'preview') {
          ;((m.value = t), (u.value = !0))
          return
        }
        if (e === 'download') {
          I.success(`开始下载：${t.name}`)
          return
        }
        e === 'delete' && S(t)
      }
      return (e, t) => {
        const c = D('gi-button'),
          h = Z,
          q = R
        return (
          d(),
          g(
            ae,
            {
              'search-model': i(o),
              'onUpdate:searchModel': t[1] || (t[1] = (l) => (G(o) ? (o.value = l) : (o = l))),
              title: '系统文件',
              'search-columns': f,
              columns: w,
              data: i(V),
              pagination: i(j),
              loading: i(E),
              'show-add-button': !1,
              onSearch: i(k),
              onReset: W,
              onRefresh: i(y)
            },
            {
              tool: a(() => [
                s(
                  h,
                  { 'auto-upload': !1, 'show-file-list': !1, onChange: $ },
                  { default: a(() => [s(c, { type: 'add' }, { default: a(() => [...(t[2] || (t[2] = [_('上传文件', -1)]))]), _: 1 })]), _: 1 }
                ),
                s(c, { type: 'reset', onClick: i(y) }, { default: a(() => [...(t[3] || (t[3] = [_('刷新', -1)]))]), _: 1 }, 8, ['onClick'])
              ]),
              name: a(({ row: l }) => [
                v('span', pe, [
                  s(q, { size: 20, color: T(l.type) }, { default: a(() => [(d(), g(M(C(l.type))))]), _: 2 }, 1032, ['color']),
                  _(' ' + x(l.name), 1)
                ])
              ]),
              size: a(({ row: l }) => [_(x(U(l.size)), 1)]),
              actions: a(({ row: l }) => [s(ne, { actions: r, onAction: (L) => K(L, l) }, null, 8, ['onAction'])]),
              dialog: a(() => [
                s(ce, { visible: u.value, 'onUpdate:visible': t[0] || (t[0] = (l) => (u.value = l)), file: m.value, 'icon-component': C }, null, 8, [
                  'visible',
                  'file'
                ])
              ]),
              _: 1
            },
            8,
            ['search-model', 'data', 'pagination', 'loading', 'onSearch', 'onRefresh']
          )
        )
      }
    }
  }),
  xe = le(fe, [['__scopeId', 'data-v-74c44162']])
export { xe as default }
