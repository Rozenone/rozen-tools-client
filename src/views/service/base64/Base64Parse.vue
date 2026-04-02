<template>
    <div class="q-pa-md">
        <q-card class="base64-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('base64Parse.title') }}</div>
                <div class="text-subtitle2">{{ $t('base64Parse.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 模式切换 -->
                <div class="mode-switch q-mb-lg">
                    <q-btn-toggle v-model="mode" :options="[
                        { label: $t('base64Parse.mode.encode'), value: 'encode' },
                        { label: $t('base64Parse.mode.decode'), value: 'decode' }
                    ]" color="primary" spread no-caps />
                </div>

                <!-- 输入输出区域 -->
                <div class="row q-col-gutter-md">
                    <!-- 输入区域 -->
                    <div class="col-12 col-md-6">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row items-center justify-between q-mb-sm">
                                    <div class="text-subtitle2">{{ mode === 'encode' ? $t('base64Parse.inputText') :
                                        $t('base64Parse.inputBase64') }}</div>
                                    <div class="row">
                                        <q-btn flat round dense icon="content_paste" size="sm" @click="pasteInput">
                                            <q-tooltip>{{ $t('base64Parse.paste') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn v-if="inputText" flat round dense icon="clear" size="sm"
                                            @click="clearInput">
                                            <q-tooltip>{{ $t('base64Parse.clear') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <q-input v-model="inputText" type="textarea" outlined rows="10" class="base64-input"
                                    :placeholder="mode === 'encode' ? $t('base64Parse.placeholder.encode') : $t('base64Parse.placeholder.decode')"
                                    bg-color="grey-1" :error="hasError" :error-message="errorMessage" />
                            </q-card-section>
                        </q-card>
                    </div>

                    <!-- 输出区域 -->
                    <div class="col-12 col-md-6">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row items-center justify-between q-mb-sm">
                                    <div class="text-subtitle2">{{ mode === 'encode' ? $t('base64Parse.outputBase64') :
                                        $t('base64Parse.outputText') }}</div>
                                    <div class="row">
                                        <q-btn flat round dense icon="content_copy" size="sm" @click="copyOutput"
                                            :disable="!outputText">
                                            <q-tooltip>{{ $t('base64Parse.copy') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn v-if="outputText" flat round dense icon="clear" size="sm"
                                            @click="clearOutput">
                                            <q-tooltip>{{ $t('base64Parse.clearOutput') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <q-input v-model="outputText" type="textarea" outlined rows="10" readonly
                                    class="base64-input" :placeholder="$t('base64Parse.placeholder.output')"
                                    bg-color="grey-1" />
                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="row justify-center q-mt-lg">
                    <q-btn unelevated color="primary"
                        :label="mode === 'encode' ? $t('base64Parse.encode') : $t('base64Parse.decode')"
                        @click="handleConvert" :disable="!inputText" icon="swap_horiz" class="q-px-md" />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, watch } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// 基础数据
const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const outputText = ref('')
const hasError = ref(false)
const errorMessage = ref('')

// 编码函数 - 支持 Unicode
const encodeBase64 = (text: string): string => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const binaryString = Array.from(data, byte => String.fromCharCode(byte)).join('')
    return btoa(binaryString)
}

// 解码函数 - 支持 Unicode
const decodeBase64 = (base64: string): string => {
    try {
        const binaryString = atob(base64)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        const decoder = new TextDecoder('utf-8')
        return decoder.decode(bytes)
    } catch {
        throw new Error('Invalid Base64')
    }
}

// 处理转换
const handleConvert = () => {
    hasError.value = false
    errorMessage.value = ''

    if (!inputText.value) return

    try {
        if (mode.value === 'encode') {
            outputText.value = encodeBase64(inputText.value)
            $q.notify({
                type: 'positive',
                message: proxy?.$t('base64Parse.notification.encodeSuccess')
            })
        } else {
            outputText.value = decodeBase64(inputText.value.trim())
            $q.notify({
                type: 'positive',
                message: proxy?.$t('base64Parse.notification.decodeSuccess')
            })
        }
    } catch {
        hasError.value = true
        errorMessage.value = proxy?.$t('base64Parse.notification.invalidInput') || ''
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.notification.invalidInput')
        })
    }
}

// 粘贴输入
const pasteInput = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
        hasError.value = false
        errorMessage.value = ''
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.notification.pasteFailed')
        })
    }
}

// 复制输出
const copyOutput = async () => {
    if (!outputText.value) return
    try {
        await navigator.clipboard.writeText(outputText.value)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('base64Parse.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.notification.copyFailed')
        })
    }
}

// 清除输入
const clearInput = () => {
    inputText.value = ''
    outputText.value = ''
    hasError.value = false
    errorMessage.value = ''
}

// 清除输出
const clearOutput = () => {
    outputText.value = ''
}

// 监听模式切换，清空输入输出
watch(mode, () => {
    clearInput()
})
</script>

<style scoped>
.base64-card {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 8px;
}

.base64-input {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 14px;
}

/* 限制 autogrow textarea 的最大高度 */
.base64-input :deep(.q-field__native) {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.mode-switch {
    display: flex;
    justify-content: center;
}

:deep(.q-field__control) {
    background: var(--q-grey-1);
}

/* 深色模式适配 */
.body--dark {
    :deep(.q-field__control) {
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
