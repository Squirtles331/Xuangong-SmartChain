import { describe, expect, it } from 'vitest'
import { evaluate, evaluateRaw, interpolate, type EvalContext } from '@/print/renderer/expression'

const ctx: EvalContext = {
  data: {
    supplierName: '宁波金属',
    orderNo: 'PO-001',
    amount: 1250.5,
    status: 'paid',
    items: [
      { name: 'A', qty: 2, price: 10 },
      { name: 'B', qty: 3, price: 20 }
    ]
  },
  row: { name: '钢材', qty: 5, price: 12.5 },
  index: 0,
  page: { current: 1, total: 3 }
}

describe('expression / evaluate', () => {
  it('字面量', () => {
    expect(evaluate('123', ctx)).toBe(123)
    expect(evaluate('1.5', ctx)).toBe(1.5)
    expect(evaluate('"hi"', ctx)).toBe('hi')
    expect(evaluate('true', ctx)).toBe(true)
    expect(evaluate('null', ctx)).toBe(null)
  })

  it('成员访问', () => {
    expect(evaluate('data.supplierName', ctx)).toBe('宁波金属')
    expect(evaluate('row.qty', ctx)).toBe(5)
    expect(evaluate('page.total', ctx)).toBe(3)
  })

  it('下标访问', () => {
    expect(evaluate('data.items[1].name', ctx)).toBe('B')
    expect(evaluate('data.items[0].qty', ctx)).toBe(2)
  })

  it('算术运算', () => {
    expect(evaluate('row.qty * row.price', ctx)).toBe(62.5)
    expect(evaluate('1 + 2 * 3', ctx)).toBe(7)
    expect(evaluate('(1 + 2) * 3', ctx)).toBe(9)
    expect(evaluate('10 % 3', ctx)).toBe(1)
  })

  it('字符串拼接', () => {
    expect(evaluate('"单号:" + data.orderNo', ctx)).toBe('单号:PO-001')
  })

  it('比较与逻辑', () => {
    expect(evaluate('row.qty > 3', ctx)).toBe(true)
    expect(evaluate('data.status === "paid"', ctx)).toBe(true)
    expect(evaluate('row.qty > 10 || row.price > 0', ctx)).toBe(true)
    expect(evaluate('row.qty > 1 && row.qty < 3', ctx)).toBe(false)
  })

  it('三元', () => {
    expect(evaluate('data.status === "paid" ? "已付" : "未付"', ctx)).toBe('已付')
  })

  it('一元', () => {
    expect(evaluate('-row.qty', ctx)).toBe(-5)
    expect(evaluate('!false', ctx)).toBe(true)
  })

  it('白名单函数', () => {
    expect(evaluate('sum(data.items)', { ...ctx, data: { ...ctx.data, items: [1, 2, 3] } })).toBe(6)
    expect(evaluate('round(3.14159, 2)', ctx)).toBe(3.14)
    expect(evaluate('upper("abc")', ctx)).toBe('ABC')
    expect(evaluate('len(data.items)', ctx)).toBe(2)
  })

  it('未知函数抛错并降级为 undefined', () => {
    expect(evaluate('hack()', ctx)).toBeUndefined()
  })

  it('原型污染防护', () => {
    expect(evaluate('data.__proto__', ctx)).toBeUndefined()
    expect(evaluate('data.constructor', ctx)).toBeUndefined()
  })

  it('空值安全', () => {
    expect(evaluate('data.missing.deep', ctx)).toBeUndefined()
  })
})

describe('expression / interpolate', () => {
  it('替换单个表达式', () => {
    expect(interpolate('供应商：{{ data.supplierName }}', ctx)).toBe('供应商：宁波金属')
  })

  it('替换多个表达式', () => {
    expect(interpolate('第 {{ page.current }} / {{ page.total }} 页', ctx)).toBe('第 1 / 3 页')
  })

  it('无表达式原样返回', () => {
    expect(interpolate('纯文本', ctx)).toBe('纯文本')
  })

  it('null/undefined 求值为空串', () => {
    expect(interpolate('值：{{ data.missing }}', ctx)).toBe('值：')
  })
})

describe('expression / evaluateRaw', () => {
  it('纯表达式返回原始类型', () => {
    expect(evaluateRaw('{{ data.items }}', ctx)).toEqual(ctx.data.items)
    expect(evaluateRaw('{{ row.qty > 3 }}', ctx)).toBe(true)
  })

  it('混合文本退化为字符串', () => {
    expect(evaluateRaw('前缀 {{ row.qty }}', ctx)).toBe('前缀 5')
  })
})
