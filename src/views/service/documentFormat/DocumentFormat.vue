<!-- Excel格式化工具 -->
<template>
  <div class="document-format-page q-pa-md">
    <div class="text-h4 q-mb-lg">{{ $t('documentFormat.title') }}</div>

    <!-- Excel格式化功能 -->
    <q-card class="excel-format-card q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="table_chart" class="q-mr-sm" />
          {{ $t('documentFormat.excel.title') }}
        </div>

        <!-- 浏览器端文件选择 -->
        <input
          v-if="isBrowser()"
          type="file"
          ref="browserFileInput"
          accept=".xlsx,.xls"
          multiple
          style="display: none"
          @change="handleBrowserFileSelect"
        />

        <div class="row q-col-gutter-md">
          <!-- 文件选择 -->
          <div class="col-12">
            <q-btn :label="$t('documentFormat.excel.selectFile')" @click="selectExcelFile" color="primary"
              class="q-mb-md" />
          </div>

          <!-- 浏览器端提示 -->
          <div v-if="isBrowser()" class="col-12">
            <q-banner class="bg-info text-white q-mb-md" dense>
              <template v-slot:avatar>
                <q-icon name="info" />
              </template>
              {{ $t('documentFormat.excel.browserHint') || '浏览器版本将下载处理后的文件' }}
            </q-banner>
          </div>

          <!-- 缩放设置 -->
          <div class="col-12">
            <q-input v-model.number="zoomPercentage" type="number" :label="$t('documentFormat.excel.zoomPercentage')"
              :placeholder="$t('documentFormat.excel.zoomPlaceholder')" :min="10" :max="400" :step="10" outlined dense>
              <template v-slot:append>
                <q-icon name="zoom_in" />
              </template>
            </q-input>
          </div>

          <!-- 字体设置 -->
          <div class="col-12">
            <!-- 常用日文字体快捷选择 -->
            <div class="quick-fonts q-mb-sm">
              <div class="text-caption text-grey-6 q-mb-xs">{{ $t('documentFormat.excel.quickJapaneseFonts') }}:</div>
              <div class="row q-gutter-xs">
                <q-btn v-for="font in quickJapaneseFonts" :key="font" :label="font" size="sm" outline
                  :color="selectedFont === font ? 'primary' : 'grey'" @click="selectedFont = font" />
              </div>
            </div>

            <q-select v-model="selectedFont" :options="fontOptions" :label="$t('documentFormat.excel.fontFamily')"
              outlined dense>
              <template v-slot:prepend>
                <q-icon name="font_download" />
              </template>
            </q-select>
            <!-- 字体预览 -->
            <div class="font-preview q-mt-sm">
              <div class="text-caption text-grey-6 q-mb-xs">{{ $t('documentFormat.excel.fontPreview') }}:</div>
              <div class="preview-text japanese-text" :style="{ fontFamily: selectedFont }">
                こんにちは、世界！ Hello, World! 123456
              </div>
            </div>
          </div>

          <!-- 字体大小 -->
          <div class="col-12">
            <q-input v-model.number="fontSize" type="number" :label="$t('documentFormat.excel.fontSize')"
              :placeholder="$t('documentFormat.excel.fontSizePlaceholder')" :min="8" :max="72" :step="1" outlined dense>
              <template v-slot:append>
                <q-icon name="format_size" />
              </template>
            </q-input>
          </div>

          <!-- 操作按钮 -->
          <div class="col-12">
            <div class="row justify-end q-gutter-sm">

              <q-btn :label="$t('documentFormat.excel.format')" color="primary" :disable="!excelFilePaths.length"
                @click="formatExcel" :loading="isProcessing" />
            </div>
          </div>

          <!-- 在操作按钮上方添加勾选框 (仅 Electron 可用) -->
          <div v-if="isElectron()" class="col-12">
            <q-checkbox v-model="overwriteSource" :label="t('documentFormat.excel.overwriteSource')" class="q-mb-md"
              :text-color="$q.dark.isActive ? 'white' : 'black'" />
          </div>
        </div>

        <!-- 预览信息 -->
        <div v-if="excelInfos.length" class="q-mt-md">
          <q-separator class="q-mb-md" />
          <div class="text-subtitle2 q-mb-sm">{{ $t('documentFormat.excel.fileInfo') }}</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6" v-for="info in excelInfos" :key="info.fileName">
              <q-chip icon="description" :label="info.fileName" />
              <q-chip icon="table_chart" :label="`${info.sheetCount} ${$t('documentFormat.excel.sheets')}`" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 功能说明 -->
    <q-card class="feature-info-card">
      <q-card-section>
        <div class="text-h6 q-mb-md">{{ $t('documentFormat.excel.features.title') }}</div>
        <q-list>
          <q-item v-for="feature in excelFeatures" :key="feature.title">
            <q-item-section avatar>
              <q-icon :name="feature.icon" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ feature.title }}</q-item-label>
              <q-item-label caption>{{ feature.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { isElectron, isBrowser } from '@/utils/platformDetect'
import ExcelJS from 'exceljs'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { ipcRenderer } = (window as any).electron || {}

const $q = useQuasar()
const { t } = useI18n()

const excelFilePaths = ref<string[]>([])
const excelInfos = ref<{ fileName: string | undefined; sheetCount: number | string }[]>([])
const isProcessing = ref(false)

// 浏览器端文件引用
const browserFileInput = ref<HTMLInputElement | null>(null)
const browserFiles = ref<File[]>([])

// 格式化设置
const zoomPercentage = ref(100)
const selectedFont = ref('MS Pゴシック')
const fontSize = ref(11)
const fontColor = ref('#000000')
const overwriteSource = ref(false)

// 常用日文字体快捷选择
const quickJapaneseFonts = [
  'MS Pゴシック',
  'MS P明朝',
  'Yu Gothic',
  'Meiryo',
  '游ゴシック'
]

// 字体选项
const fontOptions = [
  // 英文字体
  'Arial',
  'Calibri',
  'Times New Roman',
  'Helvetica',
  'Verdana',
  'Georgia',
  'Courier New',
  'Tahoma',
  // 日文字体
  'MS Pゴシック',
  'MS P明朝',
  'MS ゴシック',
  'MS 明朝',
  'Yu Gothic',
  'Yu Mincho',
  'Meiryo',
  'Hiragino Sans',
  'Hiragino Mincho',
  'Noto Sans CJK JP',
  'Noto Serif CJK JP',
  'Source Han Sans JP',
  'Source Han Serif JP',
  'Kozuka Gothic Pro',
  'Kozuka Mincho Pro',
  'Yu Gothic UI',
  'Yu Mincho UI',
  'BIZ UDPGothic',
  'BIZ UDPMincho',
  '游ゴシック',
  '游明朝',
  'メイリオ',
  'ヒラギノ角ゴシック',
  'ヒラギノ明朝'
]

// Excel功能特性
const excelFeatures = ref([
  {
    title: t('documentFormat.excel.features.multiSheetTitle'),
    description: t('documentFormat.excel.features.multiSheetDesc'),
    icon: 'table_chart'
  },
  {
    title: t('documentFormat.excel.features.zoomTitle'),
    description: t('documentFormat.excel.features.zoomDesc'),
    icon: 'zoom_in'
  },
  {
    title: t('documentFormat.excel.features.fontTitle'),
    description: t('documentFormat.excel.features.fontDesc'),
    icon: 'font_download'
  },
  {
    title: t('documentFormat.excel.features.cursorTitle'),
    description: t('documentFormat.excel.features.cursorDesc'),
    icon: 'crop_free'
  }
])

// 浏览器端文件选择处理
const handleBrowserFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  browserFiles.value = Array.from(files)
  excelFilePaths.value = browserFiles.value.map(f => f.name)
  excelInfos.value = []

  // 读取每个文件的 sheet 数量
  for (const file of browserFiles.value) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(arrayBuffer)
      const sheetCount = workbook.worksheets.length
      excelInfos.value.push({
        fileName: file.name,
        sheetCount
      })
    } catch {
      excelInfos.value.push({
        fileName: file.name,
        sheetCount: '未知'
      })
    }
  }
}

// 文件选择
const selectExcelFile = async () => {
  if (isElectron()) {
    // Electron 端：使用 IPC 调用主进程
    if (ipcRenderer) {
      const filePaths = await ipcRenderer.invoke('select-excel-file')
      if (Array.isArray(filePaths) && filePaths.length) {
        excelFilePaths.value = filePaths.filter(f => typeof f === 'string' && f)
        // 读取每个文件的sheet数量（用exceljs主进程handler）
        excelInfos.value = []
        for (const filePath of excelFilePaths.value) {
          try {
            const sheetCount = await ipcRenderer.invoke('get-excel-sheet-count', filePath) as number | string
            excelInfos.value.push({
              fileName: filePath.split(/[\\/]/).pop(),
              sheetCount
            })
          } catch {
            excelInfos.value.push({
              fileName: filePath.split(/[\\/]/).pop(),
              sheetCount: '未知'
            })
          }
        }
      }
    }
  } else {
    // 浏览器端：触发隐藏的文件选择器
    browserFileInput.value?.click()
  }
}

// 格式化Excel
const formatExcel = async () => {
  if (!excelFilePaths.value.length) return

  isProcessing.value = true
  try {
    if (isElectron()) {
      // Electron 端：使用 IPC 调用主进程
      if (!ipcRenderer) return
      // 强制所有参数为简单类型
      const filePaths = excelFilePaths.value.map(f => String(f))
      const zoom = Number(zoomPercentage.value)
      const font = String(selectedFont.value)
      const fontSizeVal = Number(fontSize.value)
      const fontColorVal = String(fontColor.value)
      const overwrite = Boolean(overwriteSource.value)
      await ipcRenderer.invoke('batch-format-excel', {
        filePaths,
        zoom,
        font,
        fontSize: fontSizeVal,
        fontColor: fontColorVal,
        overwrite
      })
      $q.notify({ type: 'positive', message: '所有文件已处理完成！', position: 'top' })
    } else {
      // 浏览器端：在前端处理 Excel
      await formatExcelBrowser()
    }
  } catch (error) {
    $q.notify({ type: 'negative', message: '格式化失败，请重试' + error, position: 'top' })
  } finally {
    isProcessing.value = false
  }
}

// 浏览器端 Excel 格式化
const formatExcelBrowser = async () => {
  if (browserFiles.value.length === 0) return

  for (const file of browserFiles.value) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(arrayBuffer)

      // 应用格式化设置到每个工作表
      workbook.worksheets.forEach(worksheet => {
        // 设置缩放比例
        const zoom = Number(zoomPercentage.value)
        if (zoom && zoom > 0) {
          worksheet.views = [
            { zoomScale: zoom, activeCell: 'A1' }
          ]
        }

        // 设置字体样式到所有单元格
        const font = String(selectedFont.value)
        const fontSizeVal = Number(fontSize.value)
        const fontColorVal = String(fontColor.value)

        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            // 设置字体
            if (!cell.font) cell.font = {}
            if (font) cell.font.name = font
            if (fontSizeVal && fontSizeVal > 0) cell.font.size = fontSizeVal
            if (fontColorVal) cell.font.color = { argb: fontColorVal.replace('#', '') }

            // 设置对齐方式
            if (!cell.alignment) cell.alignment = {}
            cell.alignment.vertical = 'middle'
            cell.alignment.horizontal = 'left'
          })
        })
      })

      // 生成处理后的文件
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      // 触发下载
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      // 生成下载文件名：原文件名_格式化.xlsx
      const fileNameWithoutExt = file.name.replace(/\.xlsx?$/i, '')
      link.download = `${fileNameWithoutExt}_formatted.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('处理文件失败:', file.name, error)
      throw new Error(`处理文件 ${file.name} 失败`)
    }
  }

  $q.notify({ type: 'positive', message: '所有文件已处理完成！', position: 'top' })
}
</script>

<style scoped>
.excel-format-card {
  color: white;
}

.feature-info-card {
  transition: transform 0.2s ease;
}

.feature-info-card:hover {
  transform: translateY(-2px);
}

/* 深色模式适配 */
.body--dark .excel-format-card {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.body--dark .feature-info-card {
  background: #1d1d1d;
  border: 1px solid #333;
}

:deep(.q-checkbox__label) {
  color: #222 !important;
}

.font-preview {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  background: #f9f9f9;
}

.preview-text {
  font-size: 14px;
  line-height: 1.4;
  color: #333;
  word-break: break-all;
}

/* 深色模式下的字体预览 */
.body--dark .font-preview {
  border-color: #444;
  background: #2d2d2d;
}

.body--dark .preview-text {
  color: #ccc;
}

.quick-fonts .q-btn {
  font-size: 11px;
  padding: 4px 8px;
  min-height: 28px;
}

.quick-fonts .q-btn--outline {
  border-width: 1px;
}
</style>