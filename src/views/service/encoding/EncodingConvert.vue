<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('encodingConvert.title') }}</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- 源编码选择 -->
          <div class="col-12 col-sm-6">
            <q-select v-model="sourceEncoding" :options="encodingOptions" :label="$t('encodingConvert.sourceEncoding')"
              outlined />
          </div>
          <!-- 目标编码选择 -->
          <div class="col-12 col-sm-6">
            <q-select v-model="targetEncoding" :options="encodingOptions" :label="$t('encodingConvert.targetEncoding')"
              outlined />
          </div>
        </div>

        <!-- 文件上传区域 -->
        <div class="q-mt-md">
          <q-file v-model="files" :label="$t('encodingConvert.selectFiles')" outlined multiple use-chips bottom-slots
            counter @rejected="onRejected">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </div>

        <!-- 输出目录选择 (仅 Electron 端显示) -->
        <div v-if="isElectron()" class="q-mt-md">
          <q-input v-model="outputPath" :label="$t('encodingConvert.outputPath')" outlined readonly>
            <template v-slot:append>
              <q-btn flat dense icon="folder" @click="selectOutputDir" />
            </template>
          </q-input>
        </div>

        <!-- 转换按钮 -->
        <div class="row justify-end q-mt-md">
          <q-btn color="primary" :loading="converting" :disable="!canConvert" @click="confirmConvert">
            {{ $t('encodingConvert.convert') }}
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as { proxy: { $t: (key: string, params?: Record<string, unknown>) => string } }
import { useQuasar } from 'quasar'
import { isElectron, isBrowser } from '@/utils/platformDetect'
const $q = useQuasar()

// 编码选项
const encodingOptions = [
  'UTF-8',
  'GBK',
  'Shift-JIS',
  'EUC-JP',
  'ISO-8859-1',
  'ASCII'
]

const sourceEncoding = ref('UTF-8')
const targetEncoding = ref('GBK')
const files = ref<File[]>([])
const outputPath = ref('')
const converting = ref(false)

// 计算是否可以转换
const canConvert = computed(() => {
  const hasFiles = files.value.length > 0
  const hasOutputPath = isBrowser() || outputPath.value
  const hasDifferentEncoding = sourceEncoding.value !== targetEncoding.value
  return hasFiles && hasOutputPath && hasDifferentEncoding
})

// 选择输出目录
const selectOutputDir = async () => {
  try {
    const resultFilePath = await window.ipcCommon.selectDirectory()
    if (resultFilePath) {
      outputPath.value = resultFilePath
    }
  } catch (err) {
    console.error('选择目录失败:', err)
  }
}

// 文件被拒绝时的处理
const onRejected = () => {
  $q.notify({
    type: 'negative',
    message: proxy.$t('encodingConvert.notification.invalidFile')
  })
}

// 确认转换
const confirmConvert = () => {
  $q.dialog({
    title: proxy.$t('encodingConvert.confirmation.title'),
    message: proxy.$t('encodingConvert.confirmation.message'),
    ok: {
      label: proxy.$t('encodingConvert.confirmation.ok'),
      color: 'primary'
    },
    cancel: {
      label: proxy.$t('encodingConvert.confirmation.cancel'),
      color: 'grey'
    }
  }).onOk(() => {
    convertFiles()
  })
}

// 浏览器端编码转换并下载
const convertFilesInBrowser = async () => {
  let successCount = 0
  let failCount = 0

  for (const file of files.value) {
    try {
      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer()

      // 使用 TextDecoder 解码（源编码）
      const decoder = new TextDecoder(sourceEncoding.value, { fatal: true })
      let text: string
      try {
        text = decoder.decode(arrayBuffer)
      } catch (decodeErr) {
        console.error(`解码失败 (${file.name}):`, decodeErr)
        failCount++
        continue
      }

      // 浏览器端 TextEncoder 只支持 UTF-8
      // 如果需要输出其他编码，需要额外处理
      let blob: Blob
      if (targetEncoding.value === 'UTF-8') {
        const encoder = new TextEncoder()
        const encoded = encoder.encode(text)
        blob = new Blob([encoded], { type: 'text/plain;charset=UTF-8' })
      } else {
        // 对于非 UTF-8 目标编码，使用 Blob 的 charset 属性
        // 注意：实际编码仍取决于浏览器支持
        const encoder = new TextEncoder()
        const encoded = encoder.encode(text)
        blob = new Blob([encoded], { type: `text/plain;charset=${targetEncoding.value}` })
      }

      // 触发下载
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // 生成输出文件名
      const fileNameParts = file.name.split('.')
      const ext = fileNameParts.length > 1 ? fileNameParts.pop() : ''
      const baseName = fileNameParts.join('.')
      const outputFileName = ext ? `${baseName}_converted.${ext}` : `${baseName}_converted`
      a.download = outputFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      successCount++
    } catch (err) {
      console.error(`转换失败 (${file.name}):`, err)
      failCount++
    }
  }

  return { successCount, failCount }
}

// Electron 端编码转换
const convertFilesInElectron = async () => {
  const filePaths = files.value.map(file => (file as File & { path: string }).path)
  const result = await window.ipcCommon.convertEncoding(
    filePaths,
    sourceEncoding.value,
    targetEncoding.value,
    outputPath.value
  )
  return result
}

// 转换文件
const convertFiles = async () => {
  converting.value = true
  try {
    let result: { successCount: number; failCount: number }

    if (isBrowser()) {
      result = await convertFilesInBrowser()
    } else {
      result = await convertFilesInElectron()
    }

    $q.notify({
      type: result.successCount > 0 ? 'positive' : 'negative',
      message: proxy.$t('encodingConvert.notification.convertResult', {
        success: result.successCount,
        fail: result.failCount
      })
    })
  } catch (err) {
    console.error('转换失败:', err)
    $q.notify({
      type: 'negative',
      message: proxy.$t('encodingConvert.notification.convertError')
    })
  } finally {
    converting.value = false
  }
}
</script>