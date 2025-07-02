<template>
  <div class="q-pa-md">
    <q-card class="jwt-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ $t('jwtParser.title') }}</div>
        <div class="text-subtitle2">{{ $t('jwtParser.description') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <!-- JWT 输入区域 -->
        <div class="input-section">
          <q-input
            v-model="jwtToken"
            type="textarea"
            :label="$t('jwtParser.input')"
            outlined
            autogrow
            class="token-input"
            :placeholder="$t('jwtParser.placeholder')"
            bg-color="grey-1"
          >
            <template v-slot:append>
              <q-btn flat round dense icon="content_paste" @click="pasteToken">
                <q-tooltip>{{ $t('jwtParser.paste') }}</q-tooltip>
              </q-btn>
              <q-btn v-if="jwtToken" flat round dense icon="clear" @click="clearInput">
                <q-tooltip>{{ $t('jwtParser.clear') }}</q-tooltip>
              </q-btn>
            </template>
          </q-input>

          <div class="row justify-center q-mt-md">
            <q-btn
              unelevated
              color="primary"
              :label="$t('jwtParser.decode')"
              @click="decodeJWT"
              :disable="!jwtToken"
              icon="code"
              class="q-px-md"
            />
          </div>
        </div>

        <!-- 解析结果 -->
        <q-slide-transition>
          <div v-if="decodedData" class="result-section q-mt-lg">
            <q-tabs
              v-model="activeTab"
              dense
              class="bg-grey-2"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="header" :label="$t('jwtParser.header')" icon="description" />
              <q-tab name="payload" :label="$t('jwtParser.payload')" icon="data_object" />
              <q-tab name="signature" :label="$t('jwtParser.signature')" icon="verified" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="activeTab" animated>
              <q-tab-panel v-for="section in (['header', 'payload', 'signature'] as const)" :key="section" :name="section">
                <q-input
                  v-model="decodedData[section]"
                  type="textarea"
                  outlined
                  autogrow
                  :readonly="section === 'signature'"
                  class="code-editor"
                  bg-color="grey-1"
                >
                  <template v-slot:append v-if="section !== 'signature'">
                    <q-btn flat round dense icon="content_copy" @click="copyContent(decodedData[section])">
                      <q-tooltip>{{ $t('jwtParser.copy') }}</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>
              </q-tab-panel>
            </q-tab-panels>

            <div class="row justify-center q-mt-lg">
              <q-btn
                unelevated
                color="secondary"
                :label="$t('jwtParser.encode')"
                @click="encodeJWT"
                icon="code"
                class="q-px-md"
              />
            </div>
          </div>
        </q-slide-transition>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as any
const $q = useQuasar()
const jwtToken = ref('')
const activeTab = ref('header')
const decodedData = ref<{
  header: string
  payload: string
  signature: string
} | null>(null)

const decodeJWT = () => {
  try {
    const [headerB64, payloadB64, signatureB64] = jwtToken.value.split('.')
    decodedData.value = {
      header: JSON.stringify(JSON.parse(atob(headerB64)), null, 2),
      payload: JSON.stringify(JSON.parse(atob(payloadB64)), null, 2),
      signature: signatureB64
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('jwtParser.notification.invalidToken')
    })
  }
}

const encodeJWT = () => {
  try {
    if (!decodedData.value) return
    const headerB64 = btoa(JSON.stringify(JSON.parse(decodedData.value.header)))
    const payloadB64 = btoa(JSON.stringify(JSON.parse(decodedData.value.payload)))
    jwtToken.value = `${headerB64}.${payloadB64}.${decodedData.value.signature}`
    $q.notify({
      type: 'positive',
      message: proxy.$t('jwtParser.notification.encodeSuccess')
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('jwtParser.notification.invalidJson')
    })
  }
}

const pasteToken = async () => {
  try {
    const text = await navigator.clipboard.readText()
    jwtToken.value = text
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('jwtParser.notification.pasteFailed')
    })
  }
}

const copyContent = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    $q.notify({
      type: 'positive',
      message: proxy.$t('jwtParser.notification.copySuccess')
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('jwtParser.notification.copyFailed')
    })
  }
}

const clearInput = () => {
  jwtToken.value = ''
  decodedData.value = null
}
</script>

<style scoped>
.jwt-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 8px;
}

.input-section, .result-section {
  border-radius: 8px;
  background: white;
}

.token-input, .code-editor {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
}

.code-editor {
  line-height: 1.5;
}

:deep(.q-field__control) {
  background: var(--q-grey-1);
}

:deep(.q-tab-panels) {
  background: transparent;
}

:deep(.q-tab) {
  padding: 12px 16px;
}

/* 深色模式适配 */
.body--dark {
  .input-section, .result-section {
    background: #1d1d1d;
  }
  
  :deep(.q-field__control) {
    background: #2d2d2d;
  }
  
  :deep(.q-tabs) {
    background: #2d2d2d;
  }
}

/* 允许选择文本 */
* {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
</style> 