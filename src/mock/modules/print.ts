import type { PrintTemplate } from '@/api/print'

/**
 * 打印模板种子数据
 * 含 3 个示例：采购订单（document）、物料标签（label）、质检报告（report）
 */

const purchaseOrder: PrintTemplate = {
  id: 'pt-purchase-order',
  templateKey: 'scm.purchase.order',
  name: '采购订单',
  module: 'scm',
  category: 'document',
  version: 1,
  status: 'published',
  editScope: 'admin',
  createdAt: '2026-06-01 09:00:00',
  updatedAt: '2026-06-20 14:30:00',
  page: {
    paper: 'A4',
    width: 210,
    height: 297,
    orientation: 'portrait',
    margin: { top: 15, right: 15, bottom: 15, left: 15 },
    header: { height: 30, repeat: 'every' },
    footer: { height: 12, repeat: 'every' },
    continuous: false,
    grid: 1,
    snapToGrid: true
  },
  elements: [
    {
      id: 't1',
      type: 'text',
      region: 'header',
      rect: { x: 0, y: 0, w: 180, h: 12 },
      content: '采购订单',
      zIndex: 1,
      style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' }
    },
    {
      id: 'f1',
      type: 'field',
      region: 'header',
      rect: { x: 0, y: 16, w: 90, h: 6 },
      expression: '供应商：{{ data.supplierName }}',
      zIndex: 1,
      style: { fontSize: 10 }
    },
    {
      id: 'f2',
      type: 'field',
      region: 'header',
      rect: { x: 0, y: 23, w: 90, h: 6 },
      expression: '单号：{{ data.orderNo }}',
      zIndex: 1,
      style: { fontSize: 10 }
    },
    {
      id: 'f3',
      type: 'field',
      region: 'header',
      rect: { x: 110, y: 23, w: 70, h: 6 },
      expression: '日期：{{ data.orderDate }}',
      zIndex: 1,
      style: { fontSize: 10, textAlign: 'right' }
    },
    {
      id: 'tb1',
      type: 'table',
      region: 'body',
      rect: { x: 0, y: 0, w: 180, h: 100 },
      dataKey: '{{ data.items }}',
      repeatHeader: true,
      rowHeight: 8,
      stripe: true,
      columns: [
        { id: 'c1', title: '物料名称', expression: '{{ row.materialName }}', width: 70 },
        { id: 'c2', title: '数量', expression: '{{ row.qty }}', width: 30, align: 'right' },
        { id: 'c3', title: '单价', expression: '{{ row.price }}', width: 40, align: 'right', format: { kind: 'currency', decimals: 2 } },
        { id: 'c4', title: '金额', expression: '{{ row.amount }}', width: 40, align: 'right', format: { kind: 'currency', decimals: 2 } }
      ],
      summary: { label: '合计', labelColumnId: 'c1', items: [{ columnId: 'c4', agg: 'sum' }] },
      zIndex: 1,
      style: {}
    },
    {
      id: 'pg',
      type: 'field',
      region: 'footer',
      rect: { x: 0, y: 0, w: 180, h: 6 },
      expression: '第 {{ page.current }} / {{ page.total }} 页',
      zIndex: 1,
      style: { fontSize: 9, textAlign: 'center', color: '#888888' }
    }
  ],
  dataSource: {
    fields: [
      { key: 'supplierName', label: '供应商', type: 'string', sample: '宁波金属材料有限公司' },
      { key: 'orderNo', label: '单号', type: 'string', sample: 'PO-2026063000001' },
      { key: 'orderDate', label: '日期', type: 'date', sample: '2026-06-30' }
    ],
    datasets: [
      {
        key: 'items',
        label: '明细',
        fields: [
          { key: 'materialName', label: '物料', type: 'string', sample: '45#圆钢 D50' },
          { key: 'qty', label: '数量', type: 'number', sample: 100 },
          { key: 'price', label: '单价', type: 'number', sample: 12.5 },
          { key: 'amount', label: '金额', type: 'number', sample: 1250 }
        ]
      }
    ]
  }
}

/* PLACEHOLDER_LABEL */

const materialLabel: PrintTemplate = {
  id: 'pt-material-label',
  templateKey: 'wms.material.label',
  name: '物料标签',
  module: 'wms',
  category: 'label',
  version: 1,
  status: 'published',
  editScope: 'admin',
  createdAt: '2026-06-05 10:00:00',
  updatedAt: '2026-06-18 11:00:00',
  page: {
    paper: 'custom',
    width: 60,
    height: 40,
    orientation: 'landscape',
    margin: { top: 2, right: 2, bottom: 2, left: 2 },
    header: { height: 0, repeat: 'every' },
    footer: { height: 0, repeat: 'every' },
    continuous: false,
    grid: 1,
    snapToGrid: true
  },
  elements: [
    {
      id: 'l-name',
      type: 'field',
      region: 'body',
      rect: { x: 0, y: 0, w: 56, h: 6 },
      expression: '{{ data.materialName }}',
      zIndex: 1,
      style: { fontSize: 11, fontWeight: 'bold' }
    },
    {
      id: 'l-code',
      type: 'field',
      region: 'body',
      rect: { x: 0, y: 7, w: 36, h: 5 },
      expression: '编码：{{ data.materialCode }}',
      zIndex: 1,
      style: { fontSize: 8 }
    },
    {
      id: 'l-qr',
      type: 'qrcode',
      region: 'body',
      rect: { x: 38, y: 7, w: 18, h: 18 },
      expression: '{{ data.materialCode }}',
      level: 'M',
      zIndex: 1,
      style: {}
    },
    {
      id: 'l-bar',
      type: 'barcode',
      region: 'body',
      rect: { x: 0, y: 22, w: 36, h: 12 },
      expression: '{{ data.batchNo }}',
      symbology: 'CODE128',
      showText: true,
      zIndex: 1,
      style: {}
    }
  ],
  dataSource: {
    fields: [
      { key: 'materialName', label: '物料名称', type: 'string', sample: '轴承 6308' },
      { key: 'materialCode', label: '物料编码', type: 'string', sample: 'M-6308-001' },
      { key: 'batchNo', label: '批次号', type: 'string', sample: 'L20260630001' }
    ],
    datasets: []
  }
}

/* PLACEHOLDER_REPORT */

const qcReport: PrintTemplate = {
  id: 'pt-qc-report',
  templateKey: 'qms.inspection.report',
  name: '质检报告',
  module: 'qms',
  category: 'report',
  version: 1,
  status: 'published',
  editScope: 'admin',
  createdAt: '2026-06-08 09:30:00',
  updatedAt: '2026-06-22 16:00:00',
  page: {
    paper: 'A4',
    width: 210,
    height: 297,
    orientation: 'portrait',
    margin: { top: 18, right: 18, bottom: 18, left: 18 },
    header: { height: 24, repeat: 'every' },
    footer: { height: 16, repeat: 'last' },
    continuous: false,
    grid: 1,
    snapToGrid: true
  },
  elements: [
    {
      id: 'r-title',
      type: 'text',
      region: 'header',
      rect: { x: 0, y: 0, w: 174, h: 12 },
      content: '产品质量检验报告',
      zIndex: 1,
      style: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' }
    },
    {
      id: 'r-no',
      type: 'field',
      region: 'header',
      rect: { x: 0, y: 14, w: 174, h: 6 },
      expression: '报告编号：{{ data.reportNo }}　检验日期：{{ data.inspectDate }}',
      zIndex: 1,
      style: { fontSize: 10, textAlign: 'center' }
    },
    {
      id: 'r-table',
      type: 'table',
      region: 'body',
      rect: { x: 0, y: 0, w: 174, h: 120 },
      dataKey: '{{ data.items }}',
      repeatHeader: true,
      rowHeight: 'auto',
      columns: [
        { id: 'rc1', title: '检验项目', expression: '{{ row.name }}', width: 50 },
        { id: 'rc2', title: '标准值', expression: '{{ row.standard }}', width: 44 },
        { id: 'rc3', title: '实测值', expression: '{{ row.actual }}', width: 44, align: 'center' },
        { id: 'rc4', title: '判定', expression: '{{ row.verdict }}', width: 36, align: 'center' }
      ],
      zIndex: 1,
      style: {}
    },
    {
      id: 'r-sign',
      type: 'field',
      region: 'footer',
      rect: { x: 0, y: 4, w: 174, h: 8 },
      expression: '检验员：{{ data.inspector }}　　　审核：{{ data.reviewer }}',
      zIndex: 1,
      style: { fontSize: 10, textAlign: 'right' }
    }
  ],
  dataSource: {
    fields: [
      { key: 'reportNo', label: '报告编号', type: 'string', sample: 'QC-2026063000001' },
      { key: 'inspectDate', label: '检验日期', type: 'date', sample: '2026-06-30' },
      { key: 'inspector', label: '检验员', type: 'string', sample: '张三' },
      { key: 'reviewer', label: '审核', type: 'string', sample: '李四' }
    ],
    datasets: [
      {
        key: 'items',
        label: '检验项',
        fields: [
          { key: 'name', label: '项目', type: 'string', sample: '外观' },
          { key: 'standard', label: '标准值', type: 'string', sample: '无锈蚀、无裂纹' },
          { key: 'actual', label: '实测值', type: 'string', sample: '合格' },
          { key: 'verdict', label: '判定', type: 'string', sample: '√' }
        ]
      }
    ]
  }
}

export const printTemplates: PrintTemplate[] = [purchaseOrder, materialLabel, qcReport]
