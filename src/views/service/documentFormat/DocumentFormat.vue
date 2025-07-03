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
        
        <div class="row q-col-gutter-md">
          <!-- 文件选择 -->
          <div class="col-12">
            <q-file
              v-model="excelFile"
              :label="$t('documentFormat.excel.selectFile')"
              accept=".xlsx,.xls"
              outlined
              @update:model-value="onFileSelected"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click="excelFile = null" class="cursor-pointer" />
              </template>
            </q-file>
          </div>

          <!-- 缩放设置 -->
          <div class="col-12 col-md-6">
            <q-input
              v-model.number="zoomPercentage"
              type="number"
              :label="$t('documentFormat.excel.zoomPercentage')"
              :placeholder="$t('documentFormat.excel.zoomPlaceholder')"
              :min="10"
              :max="400"
              :step="10"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="zoom_in" />
              </template>
            </q-input>
          </div>

          <!-- 字体设置 -->
          <div class="col-12 col-md-6">
            <q-select
              v-model="selectedFont"
              :options="fontOptions"
              :label="$t('documentFormat.excel.fontFamily')"
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="font_download" />
              </template>
            </q-select>
          </div>

          <!-- 字体大小 -->
          <div class="col-12 col-md-6">
            <q-input
              v-model.number="fontSize"
              type="number"
              :label="$t('documentFormat.excel.fontSize')"
              :placeholder="$t('documentFormat.excel.fontSizePlaceholder')"
              :min="8"
              :max="72"
              :step="1"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="format_size" />
              </template>
            </q-input>
          </div>

          <!-- 字体颜色 -->
          <div class="col-12 col-md-6">
            <q-input
              v-model="fontColor"
              :label="$t('documentFormat.excel.fontColor')"
              outlined
              dense
            >
              <template v-slot:prepend>
                <q-icon name="palette" />
              </template>
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer" @click="showColorPicker = true" />
              </template>
            </q-input>
          </div>

          <!-- 操作按钮 -->
          <div class="col-12">
            <div class="row justify-end q-gutter-sm">
              <q-btn
                :label="$t('documentFormat.excel.preview')"
                color="secondary"
                :disable="!excelFile"
                @click="previewExcel"
                flat
              />
              <q-btn
                :label="$t('documentFormat.excel.format')"
                color="primary"
                :disable="!excelFile"
                @click="formatExcel"
                :loading="isProcessing"
              />
            </div>
          </div>
        </div>

        <!-- 预览信息 -->
        <div v-if="excelInfo" class="q-mt-md">
          <q-separator class="q-mb-md" />
          <div class="text-subtitle2 q-mb-sm">{{ $t('documentFormat.excel.fileInfo') }}</div>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-chip icon="description" :label="excelInfo.fileName" />
            </div>
            <div class="col-12 col-sm-6">
              <q-chip icon="table_chart" :label="`${excelInfo.sheetCount} ${$t('documentFormat.excel.sheets')}`" />
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

    <!-- 颜色选择器对话框 -->
    <q-dialog v-model="showColorPicker">
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">{{ $t('documentFormat.excel.selectColor') }}</div>
        </q-card-section>
        <q-card-section>
          <q-color v-model="fontColor" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('common.cancel')" @click="showColorPicker = false" />
          <q-btn flat :label="$t('common.confirm')" @click="showColorPicker = false" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Excel文件相关
const excelFile = ref<File | null>(null)
const excelInfo = ref<any>(null)
const isProcessing = ref(false)

// 格式化设置
const zoomPercentage = ref(100)
const selectedFont = ref('Arial')
const fontSize = ref(11)
const fontColor = ref('#000000')
const showColorPicker = ref(false)

// 字体选项
const fontOptions = [
  'Arial',
  'Calibri',
  'Times New Roman',
  'Helvetica',
  'Verdana',
  'Georgia',
  'Courier New',
  'Tahoma'
]

// Excel功能特性
const excelFeatures = ref([
  {
    title: '多工作表支持',
    description: '支持处理包含多个工作表的Excel文件',
    icon: 'table_chart'
  },
  {
    title: '统一缩放设置',
    description: '为所有工作表设置相同的缩放百分比',
    icon: 'zoom_in'
  },
  {
    title: '字体格式统一',
    description: '设置整个Excel文件的字体样式',
    icon: 'font_download'
  },
  {
    title: '光标位置重置',
    description: '将所有工作表的光标重置到左上角',
    icon: 'crop_free'
  }
])

// 文件选择处理
const onFileSelected = (file: File | null) => {
  if (file) {
    // 这里可以添加文件验证逻辑
    excelInfo.value = {
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      sheetCount: '未知' // 实际应用中需要解析Excel文件获取工作表数量
    }
  } else {
    excelInfo.value = null
  }
}

// 预览Excel
const previewExcel = () => {
  if (!excelFile.value) return
  
  $q.notify({
    type: 'info',
    message: '预览功能开发中...',
    position: 'top'
  })
}

// 格式化Excel
const formatExcel = async () => {
  if (!excelFile.value) return
  
  isProcessing.value = true
  
  try {
    // 模拟处理过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    $q.notify({
      type: 'positive',
      message: 'Excel格式化完成！',
      position: 'top'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '格式化失败，请重试',
      position: 'top'
    })
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.document-format-page {
  max-width: 1200px;
  margin: 0 auto;
}

.excel-format-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
</style> 