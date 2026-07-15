import {
  Bn as s,
  Fn as x,
  On as O,
  Xn as b,
  an as Q,
  dn as v,
  i as o,
  it as J,
  pn as R,
  rn as K,
  rr as y,
  sr as k,
  un as A,
  yn as z
} from './element-plus-CzL7BOKu.js'
import { t as Y } from './useTable-Hzr4fBAy.js'
import { t as H } from './CrudFormDialog-1OgQthWb.js'
import { t as Z } from './CrudPage-7Q0FEhS_.js'
import { t as ee } from './CrudRowActions-Dmc4i_Io.js'
var ae = R({
    __name: 'BatchQuarantineFormDialog',
    props: z({ mode: {} }, { visible: { type: Boolean, required: !0 }, visibleModifiers: {}, form: { required: !0 }, formModifiers: {} }),
    emits: z(['submit'], ['update:visible', 'update:form']),
    setup(h, { emit: c }) {
      const m = x(h, 'visible'),
        r = x(h, 'form'),
        C = c,
        g = [
          { label: '原材料仓', value: '原材料仓' },
          { label: '标准件仓', value: '标准件仓' },
          { label: '半成品仓', value: '半成品仓' },
          { label: '成品仓', value: '成品仓' }
        ],
        _ = [
          { label: '来料隔离', value: 'incoming' },
          { label: '制程隔离', value: 'process' },
          { label: '成品隔离', value: 'finished' },
          { label: '客户退回隔离', value: 'customer-return' }
        ],
        w = K(() => [
          { type: 'input', label: '隔离单号', field: 'code', required: !0 },
          { type: 'input', label: '批次号', field: 'batchCode', required: !0 },
          { type: 'input', label: '物料编码', field: 'materialCode', required: !0 },
          { type: 'input', label: '物料名称', field: 'materialName', required: !0 },
          { type: 'select-v2', label: '仓库', field: 'warehouse', required: !0, props: { options: g } },
          { type: 'input', label: '库位', field: 'location', required: !0 },
          { type: 'select-v2', label: '隔离类型', field: 'quarantineType', required: !0, props: { options: _ } },
          { type: 'input', label: '来源单据', field: 'sourceDocument', required: !0 }
        ])
      function T() {
        return !r.value.code || !r.value.batchCode || !r.value.materialCode || !r.value.materialName
          ? (o.warning('请填写完整的批次隔离信息'), !1)
          : !0
      }
      return (l, u) => (
        O(),
        Q(
          H,
          {
            visible: m.value,
            'onUpdate:visible': u[0] || (u[0] = (p) => (m.value = p)),
            form: r.value,
            'onUpdate:form': u[1] || (u[1] = (p) => (r.value = p)),
            title: h.mode === 'add' ? '新增批次隔离' : '编辑批次隔离',
            columns: w.value,
            'label-width': 110,
            width: '680px',
            'before-submit': T,
            onSubmit: u[2] || (u[2] = (p) => C('submit'))
          },
          null,
          8,
          ['visible', 'form', 'title', 'columns']
        )
      )
    }
  }),
  te = ae,
  ie = R({
    __name: 'index',
    setup(h) {
      const c = b([
          {
            id: '1',
            code: 'GL20260714001',
            batchCode: 'LOT-20260714-001',
            materialCode: '01.01.001-00001',
            materialName: '45#圆钢',
            warehouse: '原材料仓',
            location: 'A-01-01',
            quarantineType: 'incoming',
            sourceDocument: 'IQC20260714001',
            status: 'quarantined',
            qualityDecision: 'pending',
            createdAt: '2026-07-14 09:20:00'
          },
          {
            id: '2',
            code: 'GL20260713002',
            batchCode: 'LOT-20260713-006',
            materialCode: '02.01.002-00001',
            materialName: '机械密封 M37G-55',
            warehouse: '标准件仓',
            location: 'C-03-02',
            quarantineType: 'process',
            sourceDocument: 'IPQC20260713008',
            status: 'waiting_release',
            qualityDecision: 'allow_release',
            createdAt: '2026-07-13 14:30:00'
          },
          {
            id: '3',
            code: 'GL20260712003',
            batchCode: 'LOT-20260712-011',
            materialCode: '04.01.001-00001',
            materialName: '离心泵 XJP-100',
            warehouse: '成品仓',
            location: 'F-01-03',
            quarantineType: 'finished',
            sourceDocument: 'FQC20260712003',
            status: 'frozen',
            qualityDecision: 'keep_quarantine',
            createdAt: '2026-07-12 16:10:00'
          },
          {
            id: '4',
            code: 'GL20260711004',
            batchCode: 'LOT-20260711-003',
            materialCode: '03.02.001-00008',
            materialName: '阀体铸件',
            warehouse: '原材料仓',
            location: 'B-02-01',
            quarantineType: 'customer-return',
            sourceDocument: 'RTN20260711001',
            status: 'waiting_release',
            qualityDecision: 'scrap',
            createdAt: '2026-07-11 11:40:00'
          },
          {
            id: '5',
            code: 'GL20260710005',
            batchCode: 'LOT-20260710-002',
            materialCode: '01.01.003-00001',
            materialName: '泵轴 45#',
            warehouse: '半成品仓',
            location: 'D-02-01',
            quarantineType: 'process',
            sourceDocument: 'IPQC20260710009',
            status: 'released',
            qualityDecision: 'allow_release',
            createdAt: '2026-07-10 10:15:00'
          }
        ]),
        m = { quarantined: '隔离中', frozen: '冻结中', waiting_release: '待放行', released: '已放行', disposed: '已处置' },
        r = { pending: '待裁决', allow_release: '允收放行', keep_quarantine: '继续隔离', scrap: '报废处置' },
        C = { incoming: '来料隔离', process: '制程隔离', finished: '成品隔离', 'customer-return': '客退隔离' },
        g = ['原材料仓', '标准件仓', '半成品仓', '成品仓'].map((e) => ({ label: e, value: e })),
        _ = [
          { type: 'input', label: '关键字', field: 'keyword', props: { placeholder: '请输入隔离单号 / 批次号 / 物料名称', clearable: !0 } },
          { type: 'select-v2', label: '仓库', field: 'warehouse', props: { options: g, clearable: !0 } },
          {
            type: 'select-v2',
            label: '隔离状态',
            field: 'status',
            props: { options: Object.entries(m).map(([e, a]) => ({ value: e, label: a })), clearable: !0 }
          },
          {
            type: 'select-v2',
            label: '质量裁决',
            field: 'qualityDecision',
            props: { options: Object.entries(r).map(([e, a]) => ({ value: e, label: a })), clearable: !0 }
          }
        ],
        w = [
          { prop: 'code', label: '隔离单号', minWidth: 150 },
          { prop: 'batchCode', label: '批次号', minWidth: 160 },
          { prop: 'materialName', label: '物料名称', minWidth: 160 },
          { prop: 'warehouse', label: '仓库', width: 110 },
          { prop: 'location', label: '库位', width: 100 },
          { label: '隔离类型', minWidth: 110, slotName: 'quarantineType', align: 'center' },
          { label: '状态', minWidth: 100, slotName: 'status', align: 'center' },
          { label: '质量裁决', minWidth: 110, slotName: 'qualityDecision', align: 'center' },
          { prop: 'createdAt', label: '创建时间', minWidth: 160 },
          { label: '操作', minWidth: 220, slotName: 'actions', fixed: 'right', align: 'center' }
        ],
        T = [{ key: 'export', label: '导出' }],
        l = b({ keyword: '', warehouse: '', status: '', qualityDecision: '' }),
        {
          tableData: u,
          pagination: p,
          loading: F,
          search: S,
          refresh: L
        } = Y({
          rowKey: 'id',
          listAPI: async ({ page: e, size: a }) => {
            let n = [...c.value]
            if (l.value.keyword) {
              const d = l.value.keyword.trim()
              n = n.filter((D) => [D.code, D.batchCode, D.materialName, D.materialCode].some((X) => X.includes(d)))
            }
            ;(l.value.warehouse && (n = n.filter((d) => d.warehouse === l.value.warehouse)),
              l.value.status && (n = n.filter((d) => d.status === l.value.status)),
              l.value.qualityDecision && (n = n.filter((d) => d.qualityDecision === l.value.qualityDecision)))
            const t = (e - 1) * a,
              N = t + a
            return { list: n.slice(t, N), total: n.length }
          }
        }),
        f = b(!1),
        q = b('add'),
        i = b(M())
      function M() {
        return {
          id: '',
          code: B(),
          batchCode: '',
          materialCode: '',
          materialName: '',
          warehouse: g[0].value,
          location: '',
          quarantineType: 'incoming',
          sourceDocument: ''
        }
      }
      function B() {
        const e = new Date()
        return `GL${`${e.getFullYear()}${String(e.getMonth() + 1).padStart(2, '0')}${String(e.getDate()).padStart(2, '0')}`}${String(c.value.length + 1).padStart(3, '0')}`
      }
      function W() {
        ;((l.value = { keyword: '', warehouse: '', status: '', qualityDecision: '' }), S())
      }
      function G(e) {
        e === 'export' && o.success('导出成功')
      }
      function P(e) {
        return e === 'quarantined'
          ? 'warning'
          : e === 'frozen'
            ? 'danger'
            : e === 'waiting_release'
              ? 'primary'
              : e === 'released'
                ? 'success'
                : 'info'
      }
      function $(e) {
        return e === 'pending' ? 'info' : e === 'allow_release' ? 'success' : e === 'keep_quarantine' ? 'warning' : 'danger'
      }
      function U(e) {
        return [
          { key: 'edit', label: '编辑', tone: 'primary' },
          { key: 'freeze', label: '冻结确认', tone: 'danger', hidden: e.status !== 'quarantined' },
          { key: 'submitRelease', label: '提交放行申请', tone: 'secondary', hidden: !['quarantined', 'frozen'].includes(e.status) },
          { key: 'release', label: '执行放行', tone: 'success', hidden: !(e.status === 'waiting_release' && e.qualityDecision === 'allow_release') },
          {
            key: 'keepQuarantine',
            label: '继续隔离',
            tone: 'warning',
            hidden: !(e.status === 'waiting_release' && e.qualityDecision === 'keep_quarantine')
          },
          { key: 'dispose', label: '执行处置', tone: 'danger', hidden: !(e.status === 'waiting_release' && e.qualityDecision === 'scrap') }
        ]
      }
      function I() {
        ;((q.value = 'add'), (i.value = M()), (f.value = !0))
      }
      function E(e) {
        ;((q.value = 'edit'),
          (i.value = {
            id: e.id,
            code: e.code,
            batchCode: e.batchCode,
            materialCode: e.materialCode,
            materialName: e.materialName,
            warehouse: e.warehouse,
            location: e.location,
            quarantineType: e.quarantineType,
            sourceDocument: e.sourceDocument
          }),
          (f.value = !0))
      }
      function V(e, a) {
        if (e === 'edit') {
          E(a)
          return
        }
        if (e === 'freeze') {
          ;((a.status = 'frozen'), o.success('批次已冻结，等待质量裁决'))
          return
        }
        if (e === 'submitRelease') {
          ;((a.status = 'waiting_release'), o.success('已提交放行申请，等待 QMS 回写裁决'))
          return
        }
        if (e === 'release') {
          ;((a.status = 'released'), o.success('批次已放行，可恢复库存使用'))
          return
        }
        if (e === 'keepQuarantine') {
          ;((a.status = 'frozen'), o.success('已按质量裁决继续隔离'))
          return
        }
        e === 'dispose' && ((a.status = 'disposed'), o.success('批次已完成处置'))
      }
      async function j() {
        if (q.value === 'add')
          (c.value.unshift({
            id: Date.now().toString(),
            code: i.value.code,
            batchCode: i.value.batchCode,
            materialCode: i.value.materialCode,
            materialName: i.value.materialName,
            warehouse: i.value.warehouse,
            location: i.value.location,
            quarantineType: i.value.quarantineType,
            sourceDocument: i.value.sourceDocument,
            status: 'quarantined',
            qualityDecision: 'pending',
            createdAt: new Date().toLocaleString('zh-CN')
          }),
            o.success('批次隔离记录创建成功'))
        else {
          const e = c.value.find((a) => a.id === i.value.id)
          ;(e &&
            ((e.code = i.value.code),
            (e.batchCode = i.value.batchCode),
            (e.materialCode = i.value.materialCode),
            (e.materialName = i.value.materialName),
            (e.warehouse = i.value.warehouse),
            (e.location = i.value.location),
            (e.quarantineType = i.value.quarantineType),
            (e.sourceDocument = i.value.sourceDocument)),
            o.success('批次隔离记录更新成功'))
        }
        ;((f.value = !1), await L())
      }
      return (e, a) => {
        const n = J
        return (
          O(),
          Q(
            Z,
            {
              'search-model': l.value,
              'onUpdate:searchModel': a[2] || (a[2] = (t) => (l.value = t)),
              title: '批次隔离',
              'search-columns': _,
              columns: w,
              data: y(u),
              pagination: y(p),
              loading: y(F),
              'toolbar-actions': T,
              'table-attrs': { border: !0, stripe: !0, style: 'height: 100%' },
              onSearch: y(S),
              onReset: W,
              onRefresh: y(L),
              onAdd: I,
              onToolbarAction: G
            },
            {
              quarantineType: s(({ row: t }) => [
                v(
                  n,
                  { size: 'small', effect: 'light', type: 'info' },
                  { default: s(() => [A(k(C[t.quarantineType] || t.quarantineType), 1)]), _: 2 },
                  1024
                )
              ]),
              status: s(({ row: t }) => [
                v(n, { size: 'small', type: P(t.status) }, { default: s(() => [A(k(m[t.status] || t.status), 1)]), _: 2 }, 1032, ['type'])
              ]),
              qualityDecision: s(({ row: t }) => [
                v(
                  n,
                  { size: 'small', type: $(t.qualityDecision) },
                  { default: s(() => [A(k(r[t.qualityDecision] || t.qualityDecision), 1)]), _: 2 },
                  1032,
                  ['type']
                )
              ]),
              actions: s(({ row: t }) => [v(ee, { actions: U(t), onAction: (N) => V(N, t) }, null, 8, ['actions', 'onAction'])]),
              dialog: s(() => [
                v(
                  te,
                  {
                    visible: f.value,
                    'onUpdate:visible': a[0] || (a[0] = (t) => (f.value = t)),
                    form: i.value,
                    'onUpdate:form': a[1] || (a[1] = (t) => (i.value = t)),
                    mode: q.value,
                    onSubmit: j
                  },
                  null,
                  8,
                  ['visible', 'form', 'mode']
                )
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
  se = ie
export { se as default }
