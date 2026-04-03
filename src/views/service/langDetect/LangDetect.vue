<template>
    <div class="q-pa-md">
        <q-card class="lang-detect-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('langDetect.title') }}</div>
                <div class="text-subtitle2">{{ $t('langDetect.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 输入区域 -->
                <div class="row q-col-gutter-md q-mb-lg">
                    <div class="col-12">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row items-center justify-between q-mb-sm">
                                    <div class="text-subtitle2">{{ $t('langDetect.inputCode') }}</div>
                                    <div class="row">
                                        <q-btn flat round dense icon="content_paste" size="sm" @click="pasteInput">
                                            <q-tooltip>{{ $t('langDetect.paste') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn v-if="inputCode" flat round dense icon="clear" size="sm"
                                            @click="clearAll">
                                            <q-tooltip>{{ $t('langDetect.clear') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <q-input v-model="inputCode" type="textarea" outlined rows="8" class="code-input"
                                    :placeholder="$t('langDetect.placeholder.input')" bg-color="grey-1" />
                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <!-- 语言选择 -->
                <div class="row q-col-gutter-md q-mb-lg">
                    <div class="col-12">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="text-subtitle2 q-mb-sm">{{ $t('langDetect.selectLanguages') }}</div>
                                <div class="row q-col-gutter-sm">
                                    <div v-for="lang in languageOptions" :key="lang.value" class="col-auto">
                                        <q-checkbox v-model="selectedLanguages" :val="lang.value" :label="lang.label" />
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="row justify-center q-mb-lg">
                    <q-btn unelevated color="primary" :label="$t('langDetect.detect')" @click="handleDetect"
                        :disable="!inputCode || selectedLanguages.length === 0" icon="search" class="q-px-md" />
                </div>

                <!-- 检测结果 -->
                <div v-if="detectionResults.length > 0" class="row q-col-gutter-md">
                    <div class="col-12">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="text-subtitle2 q-mb-md">{{ $t('langDetect.results') }}</div>
                                <q-list separator>
                                    <q-item v-for="result in detectionResults" :key="result.type">
                                        <q-item-section>
                                            <q-item-label class="text-weight-bold">
                                                {{ getLanguageLabel(result.type) }}
                                                <q-badge color="primary" class="q-ml-sm">{{ result.count }}</q-badge>
                                            </q-item-label>
                                            <q-item-label caption>
                                                {{ $t('langDetect.uniqueChars') }}: {{ result.uniqueChars.join(', ') }}
                                            </q-item-label>
                                            <q-item-label caption>
                                                <div class="text-caption text-grey-7 q-mt-xs">
                                                    {{ $t('langDetect.positions') }}:
                                                </div>
                                                <div class="positions-wrap">
                                                    <q-chip v-for="(pos, idx) in result.positions.slice(0, 10)"
                                                        :key="idx" dense size="sm" color="grey-3" text-color="dark">
                                                        {{ $t('langDetect.line') }}{{ pos.line }},{{
                                                            $t('langDetect.col') }}{{ pos.col }}
                                                    </q-chip>
                                                    <span v-if="result.positions.length > 10"
                                                        class="text-caption text-grey">
                                                        {{ $t('langDetect.andMore', {
                                                            count: result.positions.length -
                                                                10
                                                        }) }}
                                                    </span>
                                                </div>
                                            </q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <!-- 无结果提示 -->
                <div v-if="hasDetected && detectionResults.length === 0" class="row justify-center q-mt-md">
                    <q-banner class="bg-info text-white" rounded>
                        {{ $t('langDetect.noResults') }}
                    </q-banner>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, computed } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// 语言类型定义
interface LanguageOption {
    label: string
    value: string
    pattern: RegExp
}

interface Position {
    line: number
    col: number
}

interface DetectionResult {
    type: string
    count: number
    uniqueChars: string[]
    positions: Position[]
}

// 语言选项配置
const languageOptions = computed<LanguageOption[]>(() => [
    { label: proxy?.$t('langDetect.languages.chinese') || '中文', value: 'chinese', pattern: /[\u4e00-\u9fff\u3400-\u4dbf]/g },
    { label: proxy?.$t('langDetect.languages.japanese') || '日文假名', value: 'japanese', pattern: /[\u3040-\u309f\u30a0-\u30ff]/g },
    { label: proxy?.$t('langDetect.languages.korean') || '韩文', value: 'korean', pattern: /[\uac00-\ud7af\u1100-\u11ff]/g },
    { label: proxy?.$t('langDetect.languages.fullwidth') || '全角字符', value: 'fullwidth', pattern: /[\uff00-\uffef]/g },
    { label: proxy?.$t('langDetect.languages.cyrillic') || '西里尔文/俄文', value: 'cyrillic', pattern: /[\u0400-\u04ff]/g }
])

// 基础数据
const inputCode = ref('')
const selectedLanguages = ref<string[]>(['chinese', 'japanese', 'korean', 'fullwidth', 'cyrillic'])
const detectionResults = ref<DetectionResult[]>([])
const hasDetected = ref(false)

// 获取语言标签
const getLanguageLabel = (type: string): string => {
    const lang = languageOptions.value.find(l => l.value === type)
    return lang?.label || type
}

// 检测函数
const handleDetect = () => {
    if (!inputCode.value || selectedLanguages.value.length === 0) return

    const results: DetectionResult[] = []
    const lines = inputCode.value.split('\n')

    selectedLanguages.value.forEach(langType => {
        const langOption = languageOptions.value.find(l => l.value === langType)
        if (!langOption) return

        const charSet = new Set<string>()
        const positions: Position[] = []
        let count = 0

        lines.forEach((line, lineIndex) => {
            const matches = line.matchAll(langOption.pattern)
            for (const match of matches) {
                if (match.index !== undefined) {
                    const char = match[0]
                    charSet.add(char)
                    positions.push({
                        line: lineIndex + 1,
                        col: match.index + 1
                    })
                    count++
                }
            }
        })

        if (count > 0) {
            results.push({
                type: langType,
                count,
                uniqueChars: Array.from(charSet),
                positions
            })
        }
    })

    detectionResults.value = results
    hasDetected.value = true

    if (results.length > 0) {
        $q.notify({
            type: 'positive',
            message: proxy?.$t('langDetect.notification.detectSuccess', { count: results.length })
        })
    } else {
        $q.notify({
            type: 'info',
            message: proxy?.$t('langDetect.notification.noMatch')
        })
    }
}

// 粘贴输入
const pasteInput = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputCode.value = text
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('langDetect.notification.pasteFailed')
        })
    }
}

// 清空所有
const clearAll = () => {
    inputCode.value = ''
    detectionResults.value = []
    hasDetected.value = false
}
</script>

<style scoped>
.lang-detect-card {
    max-width: 100%;
    margin: 0 auto;
    border-radius: 8px;
}

.code-input {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 14px;
}

/* 限制 autogrow textarea 的最大高度 */
.code-input :deep(.q-field__native) {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.positions-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 4px;
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
