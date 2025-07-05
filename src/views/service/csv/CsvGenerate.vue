<template>
  <div class="csv-generate-page q-pa-md">
    <div class="text-h4 q-mb-lg">{{$t('csvGenerate.title')}}</div>
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">{{$t('csvGenerate.templateInput')}}</div>
        <q-input v-model="templateText" type="textarea" :rows="6" outlined :placeholder="$t('csvGenerate.templatePlaceholder')" />
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-6">
            <q-input v-model.number="startValue" type="number" :label="$t('csvGenerate.startValue')" outlined dense />
          </div>
          <div class="col-6">
            <q-input v-model.number="endValue" type="number" :label="$t('csvGenerate.endValue')" outlined dense />
          </div>
        </div>
        <div class="q-mt-md">
          <q-btn color="primary" :label="$t('csvGenerate.generate')" @click="generateCsv" :disable="!templateText" />
        </div>
      </q-card-section>
    </q-card>
    <q-card v-if="csvResult" class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">{{$t('csvGenerate.result')}}</div>
        <q-input v-model="csvResult" type="textarea" :rows="8" readonly />
        <div class="q-mt-md row q-gutter-sm">
          <q-btn color="secondary" :label="$t('csvGenerate.copy')" @click="copyResult" />
          <q-btn color="primary" :label="$t('csvGenerate.download')" @click="downloadCsv" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const { t } = useI18n()
const templateText = ref('测试头1,测试头2,测试头3\n测试{i},测试{i},测试{i}')
const startValue = ref(1)
const endValue = ref(3)
const csvResult = ref('')
const allRows = ref<string[]>([])

// 格式化csv
function generateCsv() {
  if (!templateText.value) return
  const lines = templateText.value.split(/\r?\n/)
  if (lines.length < 2) {
    $q.notify({ type: 'warning', message: t('csvGenerate.needTemplate') })
    return
  }
  const header = lines[0]
  const rowTemplate = lines.slice(1).join('\n')
  let result = [header]
  let all = [header]
  for (let i = startValue.value; i <= endValue.value; i++) {
    let row = rowTemplate.replace(/\{i\}/g, String(i))
    all.push(row)
    if (result.length < 51) {
      result.push(row)
    }
  }
  csvResult.value = result.join('\n')
  allRows.value = all
}

// 复制到剪切板
function copyResult() {
  if (!csvResult.value) return
  navigator.clipboard.writeText(csvResult.value)
  $q.notify({ type: 'positive', message: t('csvGenerate.copied') })
}

// 下载csv
function downloadCsv() {
  if (!allRows.value.length) return
  const blob = new Blob([allRows.value.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'result.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
</style> 