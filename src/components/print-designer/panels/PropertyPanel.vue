<template>
  <div class="panel">
    <!-- 无选中：纸张设置 -->
    <template v-if="!el">
      <div class="panel-title">纸张设置</div>
      <el-form label-width="64px" size="small">
        <el-form-item label="纸张">
          <el-select v-model="paper" @change="onPaperChange">
            <el-option v-for="p in PAPERS" :key="p.value" :label="p.label" :value="p.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="方向">
          <el-radio-group :model-value="page.orientation" @change="onOrientation">
            <el-radio-button value="portrait">纵向</el-radio-button>
            <el-radio-button value="landscape">横向</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="宽(mm)">
          <el-input-number :model-value="page.width" :min="10" size="small" @change="(v) => upPage({ width: Number(v) })" />
        </el-form-item>
        <el-form-item label="高(mm)">
          <el-input-number :model-value="page.height" :min="10" size="small" @change="(v) => upPage({ height: Number(v) })" />
        </el-form-item>
        <el-form-item label="页眉(mm)">
          <el-input-number :model-value="page.header.height" :min="0" size="small" @change="(v) => upBand('header', Number(v))" />
        </el-form-item>
        <el-form-item label="页脚(mm)">
          <el-input-number :model-value="page.footer.height" :min="0" size="small" @change="(v) => upBand('footer', Number(v))" />
        </el-form-item>
        <el-form-item label="网格(mm)">
          <el-input-number :model-value="page.grid" :min="0" :step="0.5" size="small" @change="(v) => upPage({ grid: Number(v) })" />
        </el-form-item>
        <el-form-item label="吸附">
          <el-switch :model-value="page.snapToGrid" @change="(v) => upPage({ snapToGrid: Boolean(v) })" />
        </el-form-item>
        <el-form-item label="连续纸">
          <el-switch :model-value="page.continuous" @change="(v) => upPage({ continuous: Boolean(v) })" />
        </el-form-item>
      </el-form>
    </template>

    <!-- 有选中：元素属性 -->
    <template v-else>
      <div class="panel-title">{{ typeLabel }} 属性</div>
      <el-form label-width="64px" size="small">
        <!-- 位置尺寸 -->
        <el-form-item label="X(mm)">
          <el-input-number :model-value="el.rect.x" :min="0" :step="0.5" size="small" @change="(v) => upRect({ x: Number(v) })" />
        </el-form-item>
        <el-form-item label="Y(mm)">
          <el-input-number :model-value="el.rect.y" :min="0" :step="0.5" size="small" @change="(v) => upRect({ y: Number(v) })" />
        </el-form-item>
        <el-form-item label="宽(mm)">
          <el-input-number :model-value="el.rect.w" :min="1" :step="0.5" size="small" @change="(v) => upRect({ w: Number(v) })" />
        </el-form-item>
        <el-form-item label="高(mm)">
          <el-input-number :model-value="el.rect.h" :min="0.5" :step="0.5" size="small" @change="(v) => upRect({ h: Number(v) })" />
        </el-form-item>
        <el-form-item label="区域">
          <el-select :model-value="el.region" size="small" @change="(v) => up({ region: v })">
            <el-option label="页眉" value="header" />
            <el-option label="正文" value="body" />
            <el-option label="页脚" value="footer" />
          </el-select>
        </el-form-item>

        <!-- 文本内容 -->
        <el-form-item v-if="el.type === 'text'" label="内容">
          <el-input :model-value="el.content" type="textarea" :rows="2" @input="(v) => up({ content: v })" />
        </el-form-item>

        <!-- 字段/条码/二维码 表达式 -->
        <el-form-item v-if="el.type === 'field' || el.type === 'barcode' || el.type === 'qrcode'" label="表达式">
          <el-input :model-value="el.expression" type="textarea" :rows="2" @input="(v) => up({ expression: v })" />
        </el-form-item>

        <!-- 表格数据源 -->
        <el-form-item v-if="el.type === 'table'" label="数据源">
          <el-input :model-value="el.dataKey" @input="(v) => up({ dataKey: v })" />
        </el-form-item>
        <el-form-item v-if="el.type === 'table'" label="行高">
          <el-input-number
            :model-value="typeof el.rowHeight === 'number' ? el.rowHeight : 8"
            :min="4"
            size="small"
            @change="(v) => up({ rowHeight: Number(v) })"
          />
        </el-form-item>
        <el-form-item v-if="el.type === 'table'" label="表头重复">
          <el-switch :model-value="el.repeatHeader" @change="(v) => up({ repeatHeader: Boolean(v) })" />
        </el-form-item>

        <!-- 字体（文本/字段） -->
        <template v-if="el.type === 'text' || el.type === 'field'">
          <el-form-item label="字号(pt)">
            <el-input-number
              :model-value="el.style.fontSize ?? 10"
              :min="6"
              :max="72"
              size="small"
              @change="(v) => upStyle({ fontSize: Number(v) })"
            />
          </el-form-item>
          <el-form-item label="对齐">
            <el-radio-group :model-value="el.style.textAlign ?? 'left'" @change="(v) => upStyle({ textAlign: v as never })">
              <el-radio-button value="left">左</el-radio-button>
              <el-radio-button value="center">中</el-radio-button>
              <el-radio-button value="right">右</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="加粗">
            <el-switch :model-value="el.style.fontWeight === 'bold'" @change="(v) => upStyle({ fontWeight: v ? 'bold' : 'normal' })" />
          </el-form-item>
        </template>

        <el-form-item label="锁定">
          <el-switch :model-value="el.locked ?? false" @change="(v) => up({ locked: Boolean(v) })" />
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import type { PageConfig, PrintElement } from '@/api/print'
import { usePrintDesignerStore } from '@/stores/printDesigner'

const store = usePrintDesignerStore()

const PAPERS = [
  { label: 'A4', value: 'A4', w: 210, h: 297 },
  { label: 'A5', value: 'A5', w: 148, h: 210 },
  { label: 'A6', value: 'A6', w: 105, h: 148 },
  { label: 'B5', value: 'B5', w: 176, h: 250 },
  { label: 'Letter', value: 'letter', w: 216, h: 279 },
  { label: '自定义', value: 'custom', w: 0, h: 0 }
]

const page = computed<PageConfig>(() => store.template!.page)
const el = computed<PrintElement | null>(() => store.primarySelected)
const paper = ref(page.value.paper)

watch(
  () => page.value.paper,
  (v) => (paper.value = v)
)

const typeLabel = computed(() => {
  const map: Record<string, string> = {
    text: '文本',
    field: '字段',
    table: '表格',
    image: '图片',
    barcode: '条码',
    qrcode: '二维码',
    line: '直线',
    rect: '矩形',
    html: 'HTML'
  }
  return el.value ? map[el.value.type] : ''
})

function upPage(patch: Partial<PageConfig>) {
  store.commit()
  store.updatePage(patch)
}

function upBand(which: 'header' | 'footer', height: number) {
  store.commit()
  store.updatePage({ [which]: { ...page.value[which], height } } as Partial<PageConfig>)
}

function onPaperChange(v: string) {
  const p = PAPERS.find((x) => x.value === v)
  if (!p) return
  const orient = page.value.orientation
  const w = v === 'custom' ? page.value.width : orient === 'landscape' ? p.h : p.w
  const h = v === 'custom' ? page.value.height : orient === 'landscape' ? p.w : p.h
  upPage({ paper: v as PageConfig['paper'], width: w, height: h })
}

function onOrientation(v: string | number | boolean) {
  const orientation = v as PageConfig['orientation']
  // 交换宽高
  upPage({ orientation, width: page.value.height, height: page.value.width })
}

/* PLACEHOLDER_SCRIPT */

function up(patch: Partial<PrintElement>) {
  if (!el.value) return
  store.commit()
  store.updateElement(el.value.id, patch)
}

function upRect(patch: Partial<PrintElement['rect']>) {
  if (!el.value) return
  store.commit()
  store.setRect(el.value.id, { ...el.value.rect, ...patch })
}

function upStyle(patch: Partial<PrintElement['style']>) {
  if (!el.value) return
  store.commit()
  store.updateElement(el.value.id, { style: { ...el.value.style, ...patch } } as Partial<PrintElement>)
}
</script>

<style scoped>
.panel {
  width: 240px;
  border-left: 1px solid var(--el-border-color-light);
  overflow-y: auto;
  padding: 8px 12px;
  background: var(--el-bg-color);
}

.panel-title {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 10px;
  color: var(--el-text-color-primary);
}
</style>
