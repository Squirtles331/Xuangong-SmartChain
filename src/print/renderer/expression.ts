/**
 * 受限表达式求值器
 *
 * 模板中的 {{ ... }} 表达式在此安全求值。
 * 不使用 eval / new Function，避免注入风险（尤其后端渲染场景）。
 *
 * 支持：
 *  - 字面量：数字、字符串、true/false/null
 *  - 标识符与成员访问：data.supplierName、row.qty、items[0].name
 *  - 一元：- !
 *  - 二元：+ - * / %  > >= < <= == != === !==  && ||
 *  - 三元：cond ? a : b
 *  - 括号分组
 *  - 白名单函数调用：sum(...)、formatDate(...) 等
 *
 * 实现：手写 tokenizer + 递归下降 parser → AST → 受限求值。
 */

export interface EvalContext {
  data: Record<string, unknown>
  row?: Record<string, unknown>
  index?: number
  page?: { current: number; total: number }
  sys?: { now: Date; user: string }
  [key: string]: unknown
}

/* ----------------------- 白名单函数 ----------------------- */

type FnImpl = (...args: any[]) => unknown

const FUNCTIONS: Record<string, FnImpl> = {
  sum: (arr: unknown) => toNumberArray(arr).reduce((a, b) => a + b, 0),
  avg: (arr: unknown) => {
    const nums = toNumberArray(arr)
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0
  },
  count: (arr: unknown) => (Array.isArray(arr) ? arr.length : 0),
  max: (arr: unknown) => Math.max(...toNumberArray(arr)),
  min: (arr: unknown) => Math.min(...toNumberArray(arr)),
  upper: (s: unknown) => String(s ?? '').toUpperCase(),
  lower: (s: unknown) => String(s ?? '').toLowerCase(),
  trim: (s: unknown) => String(s ?? '').trim(),
  round: (n: unknown, d = 0) => {
    const f = Math.pow(10, Number(d) || 0)
    return Math.round((Number(n) || 0) * f) / f
  },
  abs: (n: unknown) => Math.abs(Number(n) || 0),
  len: (s: unknown) => (Array.isArray(s) ? s.length : String(s ?? '').length),
  defaultTo: (v: unknown, fallback: unknown) => (v == null || v === '' ? fallback : v)
}

function toNumberArray(arr: unknown): number[] {
  if (!Array.isArray(arr)) return []
  return arr.map((v) => Number(v) || 0)
}

/* PLACEHOLDER_TOKENIZER */

/* ----------------------- Tokenizer ----------------------- */

type TokenType = 'num' | 'str' | 'ident' | 'punct' | 'eof'
interface Token {
  type: TokenType
  value: string
}

const PUNCT = ['===', '!==', '==', '!=', '>=', '<=', '&&', '||', '+', '-', '*', '/', '%', '>', '<', '!', '?', ':', '(', ')', '[', ']', '.', ',']

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = input.length

  while (i < n) {
    const ch = input[i]

    // 空白
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i++
      continue
    }

    // 字符串
    if (ch === '"' || ch === "'") {
      const quote = ch
      let str = ''
      i++
      while (i < n && input[i] !== quote) {
        if (input[i] === '\\' && i + 1 < n) {
          str += input[i + 1]
          i += 2
        } else {
          str += input[i++]
        }
      }
      i++ // 跳过结束引号
      tokens.push({ type: 'str', value: str })
      continue
    }

    // 数字
    if (isDigit(ch) || (ch === '.' && isDigit(input[i + 1]))) {
      let num = ''
      while (i < n && (isDigit(input[i]) || input[i] === '.')) num += input[i++]
      tokens.push({ type: 'num', value: num })
      continue
    }

    // 标识符
    if (isIdentStart(ch)) {
      let id = ''
      while (i < n && isIdentPart(input[i])) id += input[i++]
      tokens.push({ type: 'ident', value: id })
      continue
    }

    // 标点（多字符优先）
    const punct = PUNCT.find((p) => input.startsWith(p, i))
    if (punct) {
      tokens.push({ type: 'punct', value: punct })
      i += punct.length
      continue
    }

    throw new Error(`表达式非法字符: "${ch}" @${i}`)
  }

  tokens.push({ type: 'eof', value: '' })
  return tokens
}

function isDigit(c: string) {
  return c >= '0' && c <= '9'
}
function isIdentStart(c: string) {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$'
}
function isIdentPart(c: string) {
  return isIdentStart(c) || isDigit(c)
}

/* PLACEHOLDER_PARSER */

/* ----------------------- AST ----------------------- */

type Node =
  | { kind: 'literal'; value: unknown }
  | { kind: 'ident'; name: string }
  | { kind: 'member'; obj: Node; prop: string }
  | { kind: 'index'; obj: Node; idx: Node }
  | { kind: 'unary'; op: string; arg: Node }
  | { kind: 'binary'; op: string; left: Node; right: Node }
  | { kind: 'logical'; op: string; left: Node; right: Node }
  | { kind: 'ternary'; test: Node; cons: Node; alt: Node }
  | { kind: 'call'; callee: string; args: Node[] }

/**
 * 递归下降 parser。优先级（低 → 高）：
 *  ternary → || → && → 相等 → 比较 → 加减 → 乘除模 → 一元 → 后缀(成员/下标/调用) → 基元
 */
function parse(tokens: Token[]): Node {
  let pos = 0
  const peek = () => tokens[pos]
  const next = () => tokens[pos++]
  const eat = (value: string) => {
    if (peek().value === value) return next()
    throw new Error(`表达式语法错误：期望 "${value}"，实际 "${peek().value}"`)
  }

  function parseTernary(): Node {
    const test = parseLogicalOr()
    if (peek().value === '?') {
      next()
      const cons = parseTernary()
      eat(':')
      const alt = parseTernary()
      return { kind: 'ternary', test, cons, alt }
    }
    return test
  }

  function parseLogicalOr(): Node {
    let left = parseLogicalAnd()
    while (peek().value === '||') {
      next()
      left = { kind: 'logical', op: '||', left, right: parseLogicalAnd() }
    }
    return left
  }

  function parseLogicalAnd(): Node {
    let left = parseEquality()
    while (peek().value === '&&') {
      next()
      left = { kind: 'logical', op: '&&', left, right: parseEquality() }
    }
    return left
  }

  function parseEquality(): Node {
    let left = parseComparison()
    while (['==', '!=', '===', '!=='].includes(peek().value)) {
      const op = next().value
      left = { kind: 'binary', op, left, right: parseComparison() }
    }
    return left
  }

  function parseComparison(): Node {
    let left = parseAdditive()
    while (['>', '>=', '<', '<='].includes(peek().value)) {
      const op = next().value
      left = { kind: 'binary', op, left, right: parseAdditive() }
    }
    return left
  }

  function parseAdditive(): Node {
    let left = parseMultiplicative()
    while (['+', '-'].includes(peek().value)) {
      const op = next().value
      left = { kind: 'binary', op, left, right: parseMultiplicative() }
    }
    return left
  }

  function parseMultiplicative(): Node {
    let left = parseUnary()
    while (['*', '/', '%'].includes(peek().value)) {
      const op = next().value
      left = { kind: 'binary', op, left, right: parseUnary() }
    }
    return left
  }

  function parseUnary(): Node {
    if (['-', '!'].includes(peek().value)) {
      const op = next().value
      return { kind: 'unary', op, arg: parseUnary() }
    }
    return parsePostfix()
  }

  function parsePostfix(): Node {
    let node = parsePrimary()
    for (;;) {
      if (peek().value === '.') {
        next()
        const prop = next()
        node = { kind: 'member', obj: node, prop: prop.value }
      } else if (peek().value === '[') {
        next()
        const idx = parseTernary()
        eat(']')
        node = { kind: 'index', obj: node, idx }
      } else {
        break
      }
    }
    return node
  }

  function parsePrimary(): Node {
    const tk = peek()
    if (tk.type === 'num') {
      next()
      return { kind: 'literal', value: Number(tk.value) }
    }
    if (tk.type === 'str') {
      next()
      return { kind: 'literal', value: tk.value }
    }
    if (tk.value === '(') {
      next()
      const expr = parseTernary()
      eat(')')
      return expr
    }
    if (tk.type === 'ident') {
      next()
      if (tk.value === 'true') return { kind: 'literal', value: true }
      if (tk.value === 'false') return { kind: 'literal', value: false }
      if (tk.value === 'null') return { kind: 'literal', value: null }
      // 函数调用
      if (peek().value === '(') {
        next()
        const args: Node[] = []
        if (peek().value !== ')') {
          args.push(parseTernary())
          while (peek().value === ',') {
            next()
            args.push(parseTernary())
          }
        }
        eat(')')
        return { kind: 'call', callee: tk.value, args }
      }
      return { kind: 'ident', name: tk.value }
    }
    throw new Error(`表达式语法错误：意外的 "${tk.value || 'EOF'}"`)
  }

  const ast = parseTernary()
  if (peek().type !== 'eof') throw new Error(`表达式语法错误：多余的 "${peek().value}"`)
  return ast
}

/* PLACEHOLDER_EVAL */

/* ----------------------- 求值 ----------------------- */

function evalNode(node: Node, ctx: EvalContext): unknown {
  switch (node.kind) {
    case 'literal':
      return node.value
    case 'ident':
      // 顶层标识符只能取 ctx 上的白名单根：data/row/index/page/sys
      return (ctx as Record<string, unknown>)[node.name]
    case 'member': {
      const obj = evalNode(node.obj, ctx) as Record<string, unknown> | null | undefined
      if (obj == null) return undefined
      // 防原型污染
      if (node.prop === '__proto__' || node.prop === 'constructor' || node.prop === 'prototype') return undefined
      return obj[node.prop]
    }
    case 'index': {
      const obj = evalNode(node.obj, ctx) as Record<string, unknown> | unknown[] | null | undefined
      if (obj == null) return undefined
      const idx = evalNode(node.idx, ctx) as string | number
      return (obj as Record<string, unknown>)[idx as string]
    }
    case 'unary': {
      const v = evalNode(node.arg, ctx)
      return node.op === '-' ? -(Number(v) || 0) : !v
    }
    case 'logical': {
      const left = evalNode(node.left, ctx)
      if (node.op === '&&') return left ? evalNode(node.right, ctx) : left
      return left ? left : evalNode(node.right, ctx)
    }
    case 'binary':
      return evalBinary(node.op, evalNode(node.left, ctx), evalNode(node.right, ctx))
    case 'ternary':
      return evalNode(node.test, ctx) ? evalNode(node.cons, ctx) : evalNode(node.alt, ctx)
    case 'call': {
      const fn = FUNCTIONS[node.callee]
      if (!fn) throw new Error(`未知函数：${node.callee}`)
      return fn(...node.args.map((a) => evalNode(a, ctx)))
    }
  }
}

function evalBinary(op: string, l: any, r: any): unknown {
  switch (op) {
    case '+':
      // 任一为字符串则拼接
      return typeof l === 'string' || typeof r === 'string' ? String(l ?? '') + String(r ?? '') : (Number(l) || 0) + (Number(r) || 0)
    case '-':
      return (Number(l) || 0) - (Number(r) || 0)
    case '*':
      return (Number(l) || 0) * (Number(r) || 0)
    case '/':
      return (Number(l) || 0) / (Number(r) || 0)
    case '%':
      return (Number(l) || 0) % (Number(r) || 0)
    case '>':
      return l > r
    case '>=':
      return l >= r
    case '<':
      return l < r
    case '<=':
      return l <= r
    case '==':
      return l == r
    case '!=':
      return l != r
    case '===':
      return l === r
    case '!==':
      return l !== r
    default:
      throw new Error(`未知运算符：${op}`)
  }
}

/* ----------------------- 公共 API ----------------------- */

const astCache = new Map<string, Node>()

function getAst(expr: string): Node {
  let ast = astCache.get(expr)
  if (!ast) {
    ast = parse(tokenize(expr))
    astCache.set(expr, ast)
  }
  return ast
}

/** 求值单个表达式（不含 {{ }}），失败返回 undefined */
export function evaluate(expr: string, ctx: EvalContext): unknown {
  try {
    return evalNode(getAst(expr), ctx)
  } catch (err) {
    if (import.meta.env?.DEV) console.warn('[print expression]', expr, err)
    return undefined
  }
}

const INTERP_RE = /\{\{([\s\S]+?)\}\}/g

/**
 * 插值整段文本，把所有 {{ expr }} 替换为求值结果。
 * 若整段就是单个 {{ }} 且无其他文本，返回原始类型值（供 visibleIf / table dataKey 用）。
 */
export function interpolate(template: string, ctx: EvalContext): string {
  if (template == null) return ''
  return String(template).replace(INTERP_RE, (_m, expr) => {
    const v = evaluate(String(expr).trim(), ctx)
    return v == null ? '' : String(v)
  })
}

/**
 * 求值"纯表达式型"字段：整串形如 "{{ ... }}"，返回原始类型（数组/数字/布尔）。
 * 用于 table.dataKey（需数组）、visibleIf（需布尔）。
 */
export function evaluateRaw(template: string, ctx: EvalContext): unknown {
  if (template == null) return undefined
  const trimmed = String(template).trim()
  const m = trimmed.match(/^\{\{([\s\S]+)\}\}$/)
  if (m) return evaluate(m[1].trim(), ctx)
  return interpolate(trimmed, ctx)
}

/** 仅供测试：清空 AST 缓存 */
export function _clearAstCache(): void {
  astCache.clear()
}
