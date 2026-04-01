<template>
    <div class="q-pa-md">
        <q-card class="unicode-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('unicodeTrans.title') }}</div>
                <div class="text-subtitle2">{{ $t('unicodeTrans.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 模式切换 -->
                <div class="mode-switch q-mb-lg">
                    <q-select v-model="mode" :options="modeOptions" outlined dense emit-value map-options
                        style="min-width: 280px" class="bg-white" />
                </div>

                <!-- 输入输出区域 -->
                <div class="row q-col-gutter-md">
                    <!-- 输入区域 -->
                    <div class="col-12 col-md-6">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row items-center justify-between q-mb-sm">
                                    <div class="text-subtitle2">{{ inputLabel }}</div>
                                    <div class="row">
                                        <q-btn flat round dense icon="content_paste" size="sm" @click="pasteInput">
                                            <q-tooltip>{{ $t('unicodeTrans.paste') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn v-if="inputText" flat round dense icon="clear" size="sm"
                                            @click="clearInput">
                                            <q-tooltip>{{ $t('unicodeTrans.clear') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <q-input v-model="inputText" type="textarea" outlined autogrow class="unicode-input"
                                    :placeholder="inputPlaceholder" bg-color="grey-1" :error="hasError"
                                    :error-message="errorMessage" />
                            </q-card-section>
                        </q-card>
                    </div>

                    <!-- 输出区域 -->
                    <div class="col-12 col-md-6">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row items-center justify-between q-mb-sm">
                                    <div class="text-subtitle2">{{ outputLabel }}</div>
                                    <div class="row">
                                        <q-btn flat round dense icon="content_copy" size="sm" @click="copyOutput"
                                            :disable="!outputText">
                                            <q-tooltip>{{ $t('unicodeTrans.copy') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn v-if="outputText" flat round dense icon="clear" size="sm"
                                            @click="clearOutput">
                                            <q-tooltip>{{ $t('unicodeTrans.clearOutput') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <q-input v-model="outputText" type="textarea" outlined autogrow readonly
                                    class="unicode-input" :placeholder="$t('unicodeTrans.placeholder.output')"
                                    bg-color="grey-1" />
                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="row justify-center q-mt-lg">
                    <q-btn unelevated color="primary" :label="$t('unicodeTrans.convert')" @click="handleConvert"
                        :disable="!inputText" icon="swap_horiz" class="q-px-md" />
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, watch } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useQuasar } from 'quasar'

type ConvertMode = 'textToUnicode' | 'unicodeToText' | 'textToAscii' | 'asciiToText'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// 模式选项
const mode = ref<ConvertMode>('textToUnicode')

const modeOptions = computed(() => [
    { label: proxy?.$t('unicodeTrans.mode.textToUnicode'), value: 'textToUnicode' },
    { label: proxy?.$t('unicodeTrans.mode.unicodeToText'), value: 'unicodeToText' },
    { label: proxy?.$t('unicodeTrans.mode.textToAscii'), value: 'textToAscii' },
    { label: proxy?.$t('unicodeTrans.mode.asciiToText'), value: 'asciiToText' }
])

// 基础数据
const inputText = ref('')
const outputText = ref('')
const hasError = ref(false)
const errorMessage = ref('')

// 输入标签
const inputLabel = computed(() => {
    switch (mode.value) {
        case 'textToUnicode':
            return proxy?.$t('unicodeTrans.inputText')
        case 'unicodeToText':
            return proxy?.$t('unicodeTrans.inputUnicode')
        case 'textToAscii':
            return proxy?.$t('unicodeTrans.inputText')
        case 'asciiToText':
            return proxy?.$t('unicodeTrans.inputAscii')
        default:
            return proxy?.$t('unicodeTrans.inputText')
    }
})

// 输出标签
const outputLabel = computed(() => {
    switch (mode.value) {
        case 'textToUnicode':
            return proxy?.$t('unicodeTrans.outputUnicode')
        case 'unicodeToText':
            return proxy?.$t('unicodeTrans.outputText')
        case 'textToAscii':
            return proxy?.$t('unicodeTrans.outputAscii')
        case 'asciiToText':
            return proxy?.$t('unicodeTrans.outputText')
        default:
            return proxy?.$t('unicodeTrans.outputText')
    }
})

// 输入占位符
const inputPlaceholder = computed(() => {
    switch (mode.value) {
        case 'textToUnicode':
            return proxy?.$t('unicodeTrans.placeholder.textToUnicode')
        case 'unicodeToText':
            return proxy?.$t('unicodeTrans.placeholder.unicodeToText')
        case 'textToAscii':
            return proxy?.$t('unicodeTrans.placeholder.textToAscii')
        case 'asciiToText':
            return proxy?.$t('unicodeTrans.placeholder.asciiToText')
        default:
            return ''
    }
})

// 文本转 Unicode 转义
const textToUnicode = (text: string): string => {
    return text.split('').map(char => {
        const code = char.charCodeAt(0)
        return '\\u' + code.toString(16).padStart(4, '0')
    }).join('')
}

// Unicode 转义转文本
const unicodeToText = (unicode: string): string => {
    return unicode.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
    })
}

// 文本转 ASCII 码
const textToAscii = (text: string): string => {
    return text.split('').map(char => char.charCodeAt(0)).join(' ')
}

// ASCII 码转文本
const asciiToText = (ascii: string): string => {
    const codes = ascii.trim().split(/\s+/)
    return codes.map(code => {
        const num = parseInt(code, 10)
        if (isNaN(num) || num < 0 || num > 255) {
            throw new Error('Invalid ASCII code')
        }
        return String.fromCharCode(num)
    }).join('')
}

// 处理转换
const handleConvert = () => {
    hasError.value = false
    errorMessage.value = ''

    if (!inputText.value) return

    try {
        switch (mode.value) {
            case 'textToUnicode':
                outputText.value = textToUnicode(inputText.value)
                break
            case 'unicodeToText':
                outputText.value = unicodeToText(inputText.value)
                break
            case 'textToAscii':
                outputText.value = textToAscii(inputText.value)
                break
            case 'asciiToText':
                outputText.value = asciiToText(inputText.value)
                break
        }
        $q.notify({
            type: 'positive',
            message: proxy?.$t('unicodeTrans.notification.convertSuccess')
        })
    } catch {
        hasError.value = true
        errorMessage.value = proxy?.$t('unicodeTrans.notification.invalidInput') || ''
        $q.notify({
            type: 'negative',
            message: proxy?.$t('unicodeTrans.notification.invalidInput')
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
            message: proxy?.$t('unicodeTrans.notification.pasteFailed')
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
            message: proxy?.$t('unicodeTrans.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('unicodeTrans.notification.copyFailed')
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
.unicode-card {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 8px;
}

.unicode-input {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 14px;
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
