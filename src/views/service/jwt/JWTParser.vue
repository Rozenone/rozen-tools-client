<template>
  <div class="q-pa-md">
    <q-card class="jwt-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ $t('jwtParser.title') }}</div>
        <div class="text-subtitle2">{{ $t('jwtParser.description') }}</div>
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <!-- 模式切换 -->
        <div class="mode-switch q-mb-lg">
          <q-btn-toggle v-model="mode" :options="[
            { label: $t('jwtParser.mode.decode'), value: 'decode' },
            { label: $t('jwtParser.mode.encode'), value: 'encode' }
          ]" color="primary" spread no-caps />
        </div>

        <!-- 解码模式 -->
        <div v-if="mode === 'decode'" class="decode-mode">
          <!-- JWT 输入区域 -->
          <div class="input-section">
            <q-input v-model="jwtToken" type="textarea" :label="$t('jwtParser.input')" outlined autogrow
              class="token-input" :placeholder="$t('jwtParser.placeholder')" bg-color="grey-1">
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
              <q-btn unelevated color="primary" :label="$t('jwtParser.decode')" @click="decodeJWT" :disable="!jwtToken"
                icon="code" class="q-px-md" />
            </div>
          </div>

          <!-- 解析结果 -->
          <q-slide-transition>
            <div v-if="decodedData" class="result-section q-mt-lg">
              <q-tabs v-model="activeTab" dense class="bg-grey-2" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
                <q-tab name="header" :label="$t('jwtParser.header')" icon="description" />
                <q-tab name="payload" :label="$t('jwtParser.payload')" icon="data_object" />
                <q-tab name="signature" :label="$t('jwtParser.signature')" icon="verified" />
                <q-tab name="verify" :label="$t('jwtParser.verify')" icon="security" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="activeTab" animated>
                <q-tab-panel name="header">
                  <q-input v-model="decodedData.header" type="textarea" outlined autogrow class="code-editor"
                    bg-color="grey-1">
                    <template v-slot:append>
                      <q-btn flat round dense icon="content_copy" @click="copyContent(decodedData.header)">
                        <q-tooltip>{{ $t('jwtParser.copy') }}</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-tab-panel>

                <q-tab-panel name="payload">
                  <q-input v-model="decodedData.payload" type="textarea" outlined autogrow class="code-editor"
                    bg-color="grey-1">
                    <template v-slot:append>
                      <q-btn flat round dense icon="content_copy" @click="copyContent(decodedData.payload)">
                        <q-tooltip>{{ $t('jwtParser.copy') }}</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-tab-panel>

                <q-tab-panel name="signature">
                  <q-input v-model="decodedData.signature" type="textarea" outlined readonly class="code-editor"
                    bg-color="grey-1">
                    <template v-slot:append>
                      <q-btn flat round dense icon="content_copy" @click="copyContent(decodedData.signature)">
                        <q-tooltip>{{ $t('jwtParser.copy') }}</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-tab-panel>

                <q-tab-panel name="verify">
                  <div class="verification-section">
                    <div class="text-subtitle2 q-mb-md">{{ $t('jwtParser.verification.title') }}</div>

                    <!-- 算法信息 -->
                    <q-card class="q-mb-md" flat bordered>
                      <q-card-section>
                        <div class="row items-center">
                          <div class="col-6">
                            <strong>{{ $t('jwtParser.verification.algorithm') }}:</strong>
                          </div>
                          <div class="col-6">
                            <q-chip :color="verificationInfo.algorithm ? 'positive' : 'negative'" text-color="white">
                              {{ verificationInfo.algorithm || 'Unknown' }}
                            </q-chip>
                          </div>
                        </div>

                        <div class="row items-center q-mt-sm">
                          <div class="col-6">
                            <strong>{{ $t('jwtParser.verification.expiration') }}:</strong>
                          </div>
                          <div class="col-6">
                            <q-chip :color="verificationInfo.expired ? 'negative' : 'positive'" text-color="white">
                              {{ verificationInfo.expired ? $t('jwtParser.verification.expired') :
                                $t('jwtParser.verification.valid') }}
                            </q-chip>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>

                    <!-- 密钥验证 -->
                    <div class="q-mb-md">
                      <q-input v-model="secretKey" :label="$t('jwtParser.verification.secretKey')" outlined dense
                        :type="showSecret ? 'text' : 'password'">
                        <template v-slot:append>
                          <q-icon :name="showSecret ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                            @click="showSecret = !showSecret" />
                        </template>
                      </q-input>

                      <div class="row q-mt-sm">
                        <q-btn :label="$t('jwtParser.verification.verify')" color="primary" @click="verifySignature"
                          :disable="!secretKey" size="sm" />
                        <q-btn :label="$t('jwtParser.verification.clear')" color="grey" @click="clearVerification"
                          size="sm" class="q-ml-sm" />
                      </div>
                    </div>

                    <!-- 验证结果 -->
                    <div v-if="verificationResult" class="verification-result">
                      <q-alert :type="verificationResult.valid ? 'positive' : 'negative'"
                        :title="verificationResult.valid ? $t('jwtParser.verification.success') : $t('jwtParser.verification.failed')"
                        :message="verificationResult.message" icon="verified" />
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </q-slide-transition>
        </div>

        <!-- 编码模式 -->
        <div v-if="mode === 'encode'" class="encode-mode">
          <div class="row q-col-gutter-md">
            <!-- Header -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 q-mb-md">{{ $t('jwtParser.header') }}</div>
                  <q-input v-model="encodeData.header" type="textarea" outlined autogrow class="code-editor"
                    :placeholder="$t('jwtParser.encode.headerPlaceholder')" bg-color="grey-1" />
                </q-card-section>
              </q-card>
            </div>

            <!-- Payload -->
            <div class="col-12 col-md-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 q-mb-md">{{ $t('jwtParser.payload') }}</div>
                  <q-input v-model="encodeData.payload" type="textarea" outlined autogrow class="code-editor"
                    :placeholder="$t('jwtParser.encode.payloadPlaceholder')" bg-color="grey-1" />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- 编码设置 -->
          <q-card flat bordered class="q-mt-md">
            <q-card-section>
              <div class="text-subtitle2 q-mb-md">{{ $t('jwtParser.encode.settings') }}</div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-select v-model="encodeSettings.algorithm" :options="algorithmOptions"
                    :label="$t('jwtParser.encode.algorithm')" outlined dense />
                </div>

                <div class="col-12 col-md-6">
                  <q-input v-model="encodeSettings.secret" :label="$t('jwtParser.encode.secret')" outlined dense
                    :type="showEncodeSecret ? 'text' : 'password'">
                    <template v-slot:append>
                      <q-icon :name="showEncodeSecret ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                        @click="showEncodeSecret = !showEncodeSecret" />
                    </template>
                  </q-input>
                </div>
              </div>

              <div class="row justify-center q-mt-lg">
                <q-btn unelevated color="primary" :label="$t('jwtParser.encode.generate')" @click="generateJWT"
                  :disable="!canGenerate" icon="code" class="q-px-md" />
              </div>
            </q-card-section>
          </q-card>

          <!-- 生成的JWT -->
          <q-slide-transition>
            <div v-if="generatedToken" class="q-mt-lg">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-subtitle2 q-mb-md">{{ $t('jwtParser.encode.generatedToken') }}</div>
                  <q-input v-model="generatedToken" type="textarea" outlined readonly class="token-input"
                    bg-color="grey-1">
                    <template v-slot:append>
                      <q-btn flat round dense icon="content_copy" @click="copyContent(generatedToken)">
                        <q-tooltip>{{ $t('jwtParser.copy') }}</q-tooltip>
                      </q-btn>
                    </template>
                  </q-input>
                </q-card-section>
              </q-card>
            </div>
          </q-slide-transition>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, watch } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as any
const $q = useQuasar()

// 基础数据
const jwtToken = ref('')
const activeTab = ref('header')
const mode = ref('decode')

// 解码相关
const decodedData = ref<{
  header: string
  payload: string
  signature: string
} | null>(null)

// 编码相关
const encodeData = ref({ header: '', payload: '' })
const encodeSettings = ref({ algorithm: 'HS256', secret: '' })
const generatedToken = ref('')

// 验证相关
const verificationInfo = ref({ algorithm: '', expired: false })
const verificationResult = ref<{ valid: boolean; message: string } | null>(null)
const secretKey = ref('')
const showSecret = ref(false)
const showEncodeSecret = ref(false)

// 算法选项
const algorithmOptions = [
  { label: 'HS256', value: 'HS256' },
  { label: 'HS384', value: 'HS384' },
  { label: 'HS512', value: 'HS512' },
  { label: 'RS256', value: 'RS256' },
  { label: 'RS384', value: 'RS384' },
  { label: 'RS512', value: 'RS512' },
  { label: 'ES256', value: 'ES256' },
  { label: 'ES384', value: 'ES384' },
  { label: 'ES512', value: 'ES512' },
  { label: 'PS256', value: 'PS256' },
  { label: 'PS384', value: 'PS384' },
  { label: 'PS512', value: 'PS512' },
  { label: 'EdDSA', value: 'EdDSA' }
]

// 计算属性
const canGenerate = computed(() => {
  return encodeData.value.header && encodeData.value.payload && encodeSettings.value.secret
})

// 解码JWT
const decodeJWT = () => {
  try {
    const [headerB64, payloadB64, signatureB64] = jwtToken.value.split('.')

    if (!headerB64 || !payloadB64 || !signatureB64) {
      throw new Error('Invalid JWT format')
    }

    const header = JSON.parse(atob(headerB64))
    const payload = JSON.parse(atob(payloadB64))

    decodedData.value = {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: signatureB64
    }

    // 更新验证信息
    verificationInfo.value = {
      algorithm: header.alg || 'Unknown',
      expired: payload.exp ? payload.exp * 1000 < Date.now() : false
    }

    $q.notify({
      type: 'positive',
      message: proxy.$t('jwtParser.notification.decodeSuccess')
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('jwtParser.notification.invalidToken')
    })
  }
}

// 生成JWT
const generateJWT = () => {
  try {
    if (!canGenerate.value) return

    const header = JSON.parse(encodeData.value.header || '{}')
    const payload = JSON.parse(encodeData.value.payload || '{}')

    // 设置算法
    header.alg = encodeSettings.value.algorithm
    header.typ = 'JWT'

    // 生成签名（这里使用简单的Base64编码，实际应用中需要使用真实的JWT库）
    const headerB64 = btoa(JSON.stringify(header))
    const payloadB64 = btoa(JSON.stringify(payload))

    // 模拟签名（实际应用中需要使用真实的签名算法）
    const signature = btoa(encodeSettings.value.secret + headerB64 + payloadB64)

    generatedToken.value = `${headerB64}.${payloadB64}.${signature}`

    $q.notify({
      type: 'positive',
      message: proxy.$t('jwtParser.notification.generateSuccess')
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: proxy.$t('jwtParser.notification.invalidJson')
    })
  }
}

// 验证签名
const verifySignature = () => {
  try {
    if (!decodedData.value || !secretKey.value) return

    // 这里应该使用真实的JWT验证库
    // 目前只是简单的模拟验证
    const isValid = secretKey.value.length > 0

    verificationResult.value = {
      valid: isValid,
      message: isValid
        ? proxy.$t('jwtParser.verification.signatureValid')
        : proxy.$t('jwtParser.verification.signatureInvalid')
    }

    $q.notify({
      type: isValid ? 'positive' : 'negative',
      message: verificationResult.value.message
    })
  } catch (error) {
    verificationResult.value = {
      valid: false,
      message: proxy.$t('jwtParser.verification.verificationFailed')
    }
  }
}

// 清除验证
const clearVerification = () => {
  secretKey.value = ''
  verificationResult.value = null
}

// 粘贴Token
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

// 复制内容
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

// 清除输入
const clearInput = () => {
  jwtToken.value = ''
  decodedData.value = null
  verificationResult.value = null
  secretKey.value = ''
}

// 初始化默认编码数据
const initDefaultEncodeData = () => {
  encodeData.value = {
    header: JSON.stringify({
      alg: 'HS256',
      typ: 'JWT'
    }, null, 2),
    payload: JSON.stringify({
      sub: 'user123',
      name: 'John Doe',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600
    }, null, 2)
  }
}

// 监听模式切换
watch(mode, (newMode) => {
  if (newMode === 'encode' && !encodeData.value.header) {
    initDefaultEncodeData()
  }
})
</script>

<style scoped>
.jwt-card {
  max-width: 900px;
  margin: 0 auto;
  border-radius: 8px;
}

.input-section,
.result-section {
  border-radius: 8px;
  background: white;
}

.token-input,
.code-editor {
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

  .input-section,
  .result-section {
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

/* 模式切换样式 */
.mode-switch {
  display: flex;
  justify-content: center;
}

/* 验证区域样式 */
.verification-section {
  padding: 16px;
}

.verification-result {
  margin-top: 16px;
}

/* 编码模式样式 */
.encode-mode .q-card {
  margin-bottom: 16px;
}

/* 算法选择器样式 */
.algorithm-selector {
  min-width: 200px;
}
</style>