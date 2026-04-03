<template>
    <div class="q-pa-md">
        <q-card class="timestamp-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('timestampConvert.title') }}</div>
                <div class="text-subtitle2">{{ $t('timestampConvert.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 实时当前时间戳 -->
                <div class="current-timestamp q-mb-lg">
                    <div class="text-subtitle2 q-mb-sm">{{ $t('timestampConvert.currentTimestamp') }}</div>
                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-6">
                            <q-card flat bordered class="timestamp-display">
                                <q-card-section class="row items-center justify-between">
                                    <div>
                                        <div class="text-caption text-grey">{{ $t('timestampConvert.seconds') }}</div>
                                        <div class="text-h5 text-primary">{{ currentSecondTimestamp }}</div>
                                    </div>
                                    <q-btn flat round dense icon="content_copy" size="sm"
                                        @click="copyTimestamp('second')">
                                        <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                    </q-btn>
                                </q-card-section>
                            </q-card>
                        </div>
                        <div class="col-12 col-md-6">
                            <q-card flat bordered class="timestamp-display">
                                <q-card-section class="row items-center justify-between">
                                    <div>
                                        <div class="text-caption text-grey">{{ $t('timestampConvert.milliseconds') }}
                                        </div>
                                        <div class="text-h5 text-primary">{{ currentMillisecondTimestamp }}</div>
                                    </div>
                                    <q-btn flat round dense icon="content_copy" size="sm"
                                        @click="copyTimestamp('millisecond')">
                                        <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                    </q-btn>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </div>

                <!-- 模式切换 -->
                <div class="mode-switch q-mb-lg">
                    <q-btn-toggle v-model="mode" :options="[
                        { label: $t('timestampConvert.mode.timestampToDate'), value: 'timestampToDate' },
                        { label: $t('timestampConvert.mode.dateToTimestamp'), value: 'dateToTimestamp' }
                    ]" color="primary" spread no-caps />
                </div>

                <!-- 时间戳转日期 -->
                <div v-if="mode === 'timestampToDate'" class="convert-section">
                    <div class="row q-col-gutter-md">
                        <div class="col-12">
                            <q-card flat bordered>
                                <q-card-section>
                                    <div class="row items-center justify-between q-mb-sm">
                                        <div class="text-subtitle2">{{ $t('timestampConvert.input.timestamp') }}</div>
                                        <div class="row">
                                            <q-btn flat round dense icon="content_paste" size="sm"
                                                @click="pasteTimestamp">
                                                <q-tooltip>{{ $t('timestampConvert.action.paste') }}</q-tooltip>
                                            </q-btn>
                                            <q-btn v-if="inputTimestamp" flat round dense icon="clear" size="sm"
                                                @click="clearInput">
                                                <q-tooltip>{{ $t('timestampConvert.action.clear') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </div>
                                    <q-input v-model="inputTimestamp" type="text" outlined
                                        :placeholder="$t('timestampConvert.input.placeholder')" bg-color="grey-1"
                                        class="timestamp-input" :hint="$t('timestampConvert.input.autoDetect')" />
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>

                    <!-- 转换结果 -->
                    <div v-if="convertResult" class="q-mt-lg">
                        <div class="text-subtitle2 q-mb-sm">{{ $t('timestampConvert.output.title') }}</div>
                        <div class="row q-col-gutter-md">
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="result-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between">
                                            <div>
                                                <div class="text-caption text-grey">{{
                                                    $t('timestampConvert.output.iso8601') }}</div>
                                                <div class="text-body1">{{ convertResult.iso8601 }}</div>
                                            </div>
                                            <q-btn flat round dense icon="content_copy" size="sm"
                                                @click="copyResult(convertResult.iso8601)">
                                                <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="result-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between">
                                            <div>
                                                <div class="text-caption text-grey">{{
                                                    $t('timestampConvert.output.standard') }}</div>
                                                <div class="text-body1">{{ convertResult.standard }}</div>
                                            </div>
                                            <q-btn flat round dense icon="content_copy" size="sm"
                                                @click="copyResult(convertResult.standard)">
                                                <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="result-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between">
                                            <div>
                                                <div class="text-caption text-grey">{{
                                                    $t('timestampConvert.output.slashFormat') }}</div>
                                                <div class="text-body1">{{ convertResult.slashFormat }}</div>
                                            </div>
                                            <q-btn flat round dense icon="content_copy" size="sm"
                                                @click="copyResult(convertResult.slashFormat)">
                                                <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="result-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between">
                                            <div>
                                                <div class="text-caption text-grey">{{
                                                    $t('timestampConvert.output.localFormat') }}</div>
                                                <div class="text-body1">{{ convertResult.localFormat }}</div>
                                            </div>
                                            <q-btn flat round dense icon="content_copy" size="sm"
                                                @click="copyResult(convertResult.localFormat)">
                                                <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-12">
                                <q-card flat bordered class="result-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between">
                                            <div>
                                                <div class="text-caption text-grey">{{
                                                    $t('timestampConvert.output.weekday') }}</div>
                                                <div class="text-body1">{{ convertResult.weekday }}</div>
                                            </div>
                                            <q-btn flat round dense icon="content_copy" size="sm"
                                                @click="copyResult(convertResult.weekday)">
                                                <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-center q-mt-lg">
                        <q-btn unelevated color="primary" :label="$t('timestampConvert.action.convert')"
                            @click="convertTimestampToDate" :disable="!inputTimestamp" icon="schedule"
                            class="q-px-md" />
                    </div>
                </div>

                <!-- 日期转时间戳 -->
                <div v-else class="convert-section">
                    <div class="row q-col-gutter-md">
                        <div class="col-12">
                            <q-card flat bordered>
                                <q-card-section>
                                    <div class="row items-center justify-between q-mb-sm">
                                        <div class="text-subtitle2">{{ $t('timestampConvert.date.selectDate') }}</div>
                                        <q-btn flat dense icon="schedule" :label="$t('timestampConvert.action.now')"
                                            size="sm" @click="setCurrentTime" no-caps />
                                    </div>
                                    <q-input v-model="selectedDate" type="text" outlined readonly>
                                        <template v-slot:prepend>
                                            <q-icon name="event" class="cursor-pointer">
                                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                    <q-date v-model="selectedDate" mask="YYYY-MM-DD HH:mm:ss"
                                                        with-seconds>
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup
                                                                :label="$t('timestampConvert.action.clear')"
                                                                color="primary" flat />
                                                            <q-btn v-close-popup label="OK" color="primary" flat />
                                                        </div>
                                                    </q-date>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                        <template v-slot:append>
                                            <q-icon name="access_time" class="cursor-pointer">
                                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                    <q-time v-model="selectedDate" mask="YYYY-MM-DD HH:mm:ss"
                                                        with-seconds>
                                                        <div class="row items-center justify-end">
                                                            <q-btn v-close-popup
                                                                :label="$t('timestampConvert.action.clear')"
                                                                color="primary" flat />
                                                            <q-btn v-close-popup label="OK" color="primary" flat />
                                                        </div>
                                                    </q-time>
                                                </q-popup-proxy>
                                            </q-icon>
                                        </template>
                                    </q-input>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>

                    <!-- 转换结果 -->
                    <div v-if="dateConvertResult" class="q-mt-lg">
                        <div class="text-subtitle2 q-mb-sm">{{ $t('timestampConvert.output.title') }}</div>
                        <div class="row q-col-gutter-md">
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="result-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between">
                                            <div>
                                                <div class="text-caption text-grey">{{
                                                    $t('timestampConvert.output.secondTimestamp') }}
                                                </div>
                                                <div class="text-h6 text-primary">{{ dateConvertResult.seconds }}</div>
                                            </div>
                                            <q-btn flat round dense icon="content_copy" size="sm"
                                                @click="copyResult(dateConvertResult.seconds.toString())">
                                                <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="result-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between">
                                            <div>
                                                <div class="text-caption text-grey">{{
                                                    $t('timestampConvert.output.millisecondTimestamp') }}
                                                </div>
                                                <div class="text-h6 text-primary">{{ dateConvertResult.milliseconds }}
                                                </div>
                                            </div>
                                            <q-btn flat round dense icon="content_copy" size="sm"
                                                @click="copyResult(dateConvertResult.milliseconds.toString())">
                                                <q-tooltip>{{ $t('timestampConvert.action.copy') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-center q-mt-lg">
                        <q-btn unelevated color="primary" :label="$t('timestampConvert.action.convert')"
                            @click="convertDateToTimestamp" :disable="!selectedDate" icon="schedule" class="q-px-md" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, onUnmounted, watch } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// 当前时间戳
const currentSecondTimestamp = ref(0)
const currentMillisecondTimestamp = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

// 模式切换
const mode = ref<'timestampToDate' | 'dateToTimestamp'>('timestampToDate')

// 时间戳转日期
const inputTimestamp = ref('')
interface ConvertResult {
    iso8601: string
    standard: string
    slashFormat: string
    localFormat: string
    weekday: string
}
const convertResult = ref<ConvertResult | null>(null)

// 日期转时间戳
const selectedDate = ref('')
interface DateConvertResult {
    seconds: number
    milliseconds: number
}
const dateConvertResult = ref<DateConvertResult | null>(null)

// 更新当前时间戳
const updateCurrentTimestamp = () => {
    const now = Date.now()
    currentMillisecondTimestamp.value = now
    currentSecondTimestamp.value = Math.floor(now / 1000)
}

// 获取星期几
const getWeekday = (date: Date): string => {
    const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const day = date.getDay()
    return proxy?.$t(`timestampConvert.weekday.${weekdays[day]}`) || ''
}

// 格式化数字为两位
const padZero = (num: number): string => {
    return num.toString().padStart(2, '0')
}

// 时间戳转日期
const convertTimestampToDate = () => {
    if (!inputTimestamp.value) return

    const timestamp = inputTimestamp.value.trim()
    let ms: number

    // 自动识别精度
    if (/^\d+$/.test(timestamp)) {
        const num = parseInt(timestamp, 10)
        // 判断是秒级还是毫秒级
        // 如果数字长度 <= 10，认为是秒级时间戳
        // 如果数字长度 > 10，认为是毫秒级时间戳
        if (timestamp.length <= 10) {
            ms = num * 1000
        } else {
            ms = num
        }
    } else {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('timestampConvert.notification.invalidTimestamp')
        })
        convertResult.value = null
        return
    }

    try {
        const date = new Date(ms)
        if (isNaN(date.getTime())) {
            throw new Error('Invalid timestamp')
        }

        // ISO 8601 格式
        const iso8601 = date.toISOString()

        // 标准格式 YYYY-MM-DD HH:mm:ss
        const year = date.getFullYear()
        const month = padZero(date.getMonth() + 1)
        const day = padZero(date.getDate())
        const hours = padZero(date.getHours())
        const minutes = padZero(date.getMinutes())
        const seconds = padZero(date.getSeconds())
        const standard = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        const slashFormat = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`

        // 本地格式
        const localFormat = date.toLocaleString()

        // 星期几
        const weekday = getWeekday(date)

        convertResult.value = {
            iso8601,
            standard,
            slashFormat,
            localFormat,
            weekday
        }

        $q.notify({
            type: 'positive',
            message: proxy?.$t('timestampConvert.notification.convertSuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('timestampConvert.notification.invalidTimestamp')
        })
        convertResult.value = null
    }
}

// 日期转时间戳
const convertDateToTimestamp = () => {
    if (!selectedDate.value) return

    try {
        const date = new Date(selectedDate.value)
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date')
        }

        dateConvertResult.value = {
            seconds: Math.floor(date.getTime() / 1000),
            milliseconds: date.getTime()
        }

        $q.notify({
            type: 'positive',
            message: proxy?.$t('timestampConvert.notification.convertSuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('timestampConvert.notification.invalidDate')
        })
        dateConvertResult.value = null
    }
}

// 设置当前时间
const setCurrentTime = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = padZero(now.getMonth() + 1)
    const day = padZero(now.getDate())
    const hours = padZero(now.getHours())
    const minutes = padZero(now.getMinutes())
    const seconds = padZero(now.getSeconds())
    selectedDate.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 粘贴时间戳
const pasteTimestamp = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputTimestamp.value = text.trim()
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('timestampConvert.notification.pasteFailed')
        })
    }
}

// 清除输入
const clearInput = () => {
    inputTimestamp.value = ''
    convertResult.value = null
}

// 复制当前时间戳
const copyTimestamp = async (type: 'second' | 'millisecond') => {
    const value = type === 'second' ? currentSecondTimestamp.value : currentMillisecondTimestamp.value
    try {
        await navigator.clipboard.writeText(value.toString())
        $q.notify({
            type: 'positive',
            message: proxy?.$t('timestampConvert.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('timestampConvert.notification.copyFailed')
        })
    }
}

// 复制结果
const copyResult = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('timestampConvert.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('timestampConvert.notification.copyFailed')
        })
    }
}

// 监听模式切换，清空结果
watch(mode, () => {
    inputTimestamp.value = ''
    convertResult.value = null
    selectedDate.value = ''
    dateConvertResult.value = null
})

onMounted(() => {
    updateCurrentTimestamp()
    timer = setInterval(updateCurrentTimestamp, 1000)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})
</script>

<style scoped>
.timestamp-card {
    max-width: 100%;
    margin: 0 auto;
    border-radius: 8px;
}

.timestamp-input {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 14px;
}

.mode-switch {
    display: flex;
    justify-content: center;
}

.current-timestamp {
    background: transparent;
}

.timestamp-display {
    transition: all 0.3s ease;
}

.timestamp-display:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-card {
    transition: all 0.2s ease;
}

.result-card:hover {
    background-color: rgba(0, 0, 0, 0.02);
}

:deep(.q-field__control) {
    background: var(--q-grey-1);
}

/* 深色模式适配 */
.body--dark {
    :deep(.q-field__control) {
        background: #2d2d2d;
    }

    .result-card:hover {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .timestamp-display:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
