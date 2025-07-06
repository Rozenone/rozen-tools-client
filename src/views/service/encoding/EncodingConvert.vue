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

        <!-- 输出目录选择 -->
        <div class="q-mt-md">
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
const { proxy } = getCurrentInstance() as any
import { useQuasar } from 'quasar'
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
  return files.value.length > 0 &&
    outputPath.value &&
    sourceEncoding.value !== targetEncoding.value
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

// 转换文件
const convertFiles = async () => {
  converting.value = true
  try {
    const filePaths = files.value.map(file => (file as any).path)
    const result = await window.ipcCommon.convertEncoding(
      filePaths,
      sourceEncoding.value,
      targetEncoding.value,
      outputPath.value
    )

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