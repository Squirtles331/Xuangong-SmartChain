$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$files = @(
  'src/views/mes/work-order/my-tasks/index.vue',
  'src/views/mes/work-order/report/index.vue',
  'src/views/mes/work-order/trace/index.vue',
  'src/views/plm/bom/compare/index.vue',
  'src/views/plm/bom/cost/index.vue',
  'src/views/plm/bom/editor/index.vue',
  'src/views/plm/bom/explode/index.vue',
  'src/views/plm/bom/list/index.vue',
  'src/views/plm/change/cutover/index.vue',
  'src/views/plm/change/ecn/list/index.vue',
  'src/views/plm/process/operation-definition/index.vue',
  'src/views/plm/process/parallel-operation/index.vue',
  'src/views/plm/process/routing-editor/index.vue',
  'src/views/plm/process/routing-list/index.vue',
  'src/views/plm/process/standard-time/index.vue',
  'src/views/wms/batch-quarantine/index.vue',
  'src/views/wms/inventory/index.vue',
  'src/views/wms/return/index.vue',
  'src/views/wms/stock-count/index.vue',
  'src/views/wms/transfer/index.vue'
)

foreach ($rel in $files) {
  $content = (git show "HEAD:$rel" | Out-String)
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to read HEAD:$rel"
  }

  if ($content.Length -gt 0 -and $content[0] -eq [char]0xFEFF) {
    $content = $content.Substring(1)
  }

  $content = [regex]::Replace($content, '(?m)^\s*import PageOwnershipNotice from .*\r?\n', '')
  $content = [regex]::Replace($content, '(?m)^\s*<PageOwnershipNotice[^>]*\/?>\s*\r?\n?', '')
  $content = [regex]::Replace($content, '(?s)\r?\n\s*<template #headerTop>\s*<PageOwnershipNotice[^>]*\/?>\s*</template>\r?\n?', "`r`n")
  $content = [regex]::Replace($content, '(?s)\r?\n\s*<template #beforeTable>\s*<div class="page-overview">.*?</template>\r?\n?', "`r`n")
  $content = [regex]::Replace($content, '(?s)\r?\nconst overviewCards = computed\(\(\) => \{.*?\n\}\)\r?\n', "`r`n")
  $content = [regex]::Replace($content, '(?s)\r?\nconst summaryCards = computed\(\(\) => \{.*?\n\}\)\r?\n', "`r`n")
  $content = [regex]::Replace($content, '(?s)\r?\nconst diffSummary = computed\(\(\) => \{.*?\n\}\)\r?\n', "`r`n")
  $content = [regex]::Replace($content, '(?s)\r?\nconst transitItems = computed\(\(\) => \{.*?\n\}\)\r?\n', "`r`n")

  [System.IO.File]::WriteAllText((Join-Path $PWD $rel), $content, $utf8NoBom)
}
