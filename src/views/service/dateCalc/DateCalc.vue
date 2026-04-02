<template>
    <div class="q-pa-md">
        <q-card class="datecalc-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('dateCalc.title') }}</div>
                <div class="text-subtitle2">{{ $t('dateCalc.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 模式切换 -->
                <div class="mode-switch q-mb-lg">
                    <q-btn-toggle v-model="mode" :options="[
                        { label: $t('dateCalc.mode.diff'), value: 'diff' },
                        { label: $t('dateCalc.mode.add'), value: 'add' }
                    ]" color="primary" spread no-caps />
                </div>

                <!-- 日期差值计算模式 -->
                <div v-if="mode === 'diff'" class="diff-section">
                    <div class="row q-col-gutter-md q-mb-lg">
                        <!-- 开始日期 -->
                        <div class="col-12 col-md-6">
                            <q-input v-model="startDate" outlined :label="$t('dateCalc.diff.startDate')" readonly>
                                <template v-slot:prepend>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="startDate" mask="YYYY-MM-DD" :locale="dateLocale">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup :label="$t('dateCalc.diff.selectDate')"
                                                        color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <!-- 结束日期 -->
                        <div class="col-12 col-md-6">
                            <q-input v-model="endDate" outlined :label="$t('dateCalc.diff.endDate')" readonly>
                                <template v-slot:prepend>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="endDate" mask="YYYY-MM-DD" :locale="dateLocale">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup :label="$t('dateCalc.diff.selectDate')"
                                                        color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <!-- 计算按钮 -->
                    <div class="row justify-center q-mb-lg">
                        <q-btn unelevated color="primary" :label="$t('dateCalc.action.calculate')"
                            @click="calculateDiff" :disable="!startDate || !endDate" icon="calculate" class="q-px-xl" />
                    </div>

                    <!-- 差值结果 -->
                    <div v-if="diffResult" class="result-section">
                        <div class="text-subtitle1 q-mb-md text-center">{{ $t('dateCalc.diff.result') }}</div>
                        <div class="row q-col-gutter-sm justify-center">
                            <div class="col-6 col-md-3">
                                <q-card flat bordered class="result-card">
                                    <q-card-section class="text-center">
                                        <div class="text-h4 text-primary">{{ diffResult.days }}</div>
                                        <div class="text-caption text-grey">{{ $t('dateCalc.diff.days') }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-6 col-md-3">
                                <q-card flat bordered class="result-card">
                                    <q-card-section class="text-center">
                                        <div class="text-h4 text-primary">{{ diffResult.hours }}</div>
                                        <div class="text-caption text-grey">{{ $t('dateCalc.diff.hours') }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-6 col-md-3">
                                <q-card flat bordered class="result-card">
                                    <q-card-section class="text-center">
                                        <div class="text-h4 text-primary">{{ diffResult.minutes }}</div>
                                        <div class="text-caption text-grey">{{ $t('dateCalc.diff.minutes') }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                            <div class="col-6 col-md-3">
                                <q-card flat bordered class="result-card">
                                    <q-card-section class="text-center">
                                        <div class="text-h4 text-primary">{{ diffResult.seconds }}</div>
                                        <div class="text-caption text-grey">{{ $t('dateCalc.diff.seconds') }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                        <div class="row justify-center q-mt-md">
                            <q-btn flat color="primary" icon="content_copy" :label="$t('dateCalc.action.copy')"
                                @click="copyDiffResult" />
                        </div>
                    </div>
                    <div v-else class="text-center text-grey q-py-lg">
                        {{ $t('dateCalc.diff.pleaseSelect') }}
                    </div>
                </div>

                <!-- 日期加减运算模式 -->
                <div v-if="mode === 'add'" class="add-section">
                    <div class="row q-col-gutter-md q-mb-lg">
                        <!-- 基准日期 -->
                        <div class="col-12">
                            <q-input v-model="baseDate" outlined :label="$t('dateCalc.add.baseDate')" readonly>
                                <template v-slot:prepend>
                                    <q-icon name="event" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-date v-model="baseDate" mask="YYYY-MM-DD" :locale="dateLocale">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup :label="$t('dateCalc.add.selectDate')"
                                                        color="primary" flat />
                                                </div>
                                            </q-date>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <!-- 运算类型 -->
                        <div class="col-12 col-md-4">
                            <q-select v-model="operation" outlined :label="$t('dateCalc.add.operation')"
                                :options="operationOptions" emit-value map-options />
                        </div>
                        <!-- 数值 -->
                        <div class="col-12 col-md-4">
                            <q-input v-model.number="addValue" type="number" outlined :label="$t('dateCalc.add.value')"
                                min="1" />
                        </div>
                        <!-- 单位 -->
                        <div class="col-12 col-md-4">
                            <q-select v-model="unit" outlined :label="$t('dateCalc.add.unit')" :options="unitOptions"
                                emit-value map-options />
                        </div>
                    </div>

                    <!-- 计算按钮 -->
                    <div class="row justify-center q-mb-lg">
                        <q-btn unelevated color="primary" :label="$t('dateCalc.action.calculate')" @click="calculateAdd"
                            :disable="!baseDate || !addValue" icon="calculate" class="q-px-xl" />
                    </div>

                    <!-- 加减结果 -->
                    <div v-if="addResult" class="result-section">
                        <div class="text-subtitle1 q-mb-md text-center">{{ $t('dateCalc.add.result') }}</div>
                        <q-card flat bordered class="result-card-lg">
                            <q-card-section class="text-center">
                                <div class="text-h5 text-primary q-mb-sm">{{ $t('dateCalc.add.resultDate') }}</div>
                                <div class="text-h4">{{ addResult }}</div>
                            </q-card-section>
                        </q-card>
                        <div class="row justify-center q-mt-md">
                            <q-btn flat color="primary" icon="content_copy" :label="$t('dateCalc.action.copy')"
                                @click="copyAddResult" />
                        </div>
                    </div>
                    <div v-else class="text-center text-grey q-py-lg">
                        {{ $t('dateCalc.add.pleaseInput') }}
                    </div>
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

// 模式
const mode = ref<'diff' | 'add'>('diff')

// 日期差值模式数据
const startDate = ref('')
const endDate = ref('')
interface DiffResult {
    days: number
    hours: number
    minutes: number
    seconds: number
}
const diffResult = ref<DiffResult | null>(null)

// 日期加减模式数据
const baseDate = ref('')
const operation = ref<'add' | 'subtract'>('add')
const addValue = ref<number>(1)
const unit = ref<'day' | 'month' | 'year'>('day')
const addResult = ref('')

// 下拉选项 - 使用计算属性实现国际化
const operationOptions = computed(() => [
    { label: proxy?.$t('dateCalc.add.add'), value: 'add' },
    { label: proxy?.$t('dateCalc.add.subtract'), value: 'subtract' }
])
const unitOptions = computed(() => [
    { label: proxy?.$t('dateCalc.add.day'), value: 'day' },
    { label: proxy?.$t('dateCalc.add.month'), value: 'month' },
    { label: proxy?.$t('dateCalc.add.year'), value: 'year' }
])

// QDate 中文本地化
const dateLocale = {
    days: ['日', '一', '二', '三', '四', '五', '六'],
    daysShort: ['日', '一', '二', '三', '四', '五', '六'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
}

// 计算日期差值
const calculateDiff = () => {
    if (!startDate.value || !endDate.value) {
        $q.notify({
            type: 'warning',
            message: proxy?.$t('dateCalc.notification.pleaseSelectDate')
        })
        return
    }

    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const diffMs = Math.abs(end.getTime() - start.getTime())

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    diffResult.value = {
        days,
        hours,
        minutes,
        seconds
    }
}

// 计算日期加减
const calculateAdd = () => {
    if (!baseDate.value) {
        $q.notify({
            type: 'warning',
            message: proxy?.$t('dateCalc.notification.pleaseSelectDate')
        })
        return
    }
    if (!addValue.value || addValue.value <= 0) {
        $q.notify({
            type: 'warning',
            message: proxy?.$t('dateCalc.notification.pleaseInputValue')
        })
        return
    }

    const date = new Date(baseDate.value)
    const value = operation.value === 'add' ? addValue.value : -addValue.value

    switch (unit.value) {
        case 'day':
            date.setDate(date.getDate() + value)
            break
        case 'month':
            date.setMonth(date.getMonth() + value)
            break
        case 'year':
            date.setFullYear(date.getFullYear() + value)
            break
    }

    addResult.value = formatDate(date)
}

// 格式化日期
const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    return `${year}-${month}-${day} (周${weekDay})`
}

// 复制差值结果
const copyDiffResult = async () => {
    if (!diffResult.value) return
    const text = `${proxy?.$t('dateCalc.diff.totalDifference')}: ${diffResult.value.days}${proxy?.$t('dateCalc.diff.days')} / ${diffResult.value.hours}${proxy?.$t('dateCalc.diff.hours')} / ${diffResult.value.minutes}${proxy?.$t('dateCalc.diff.minutes')} / ${diffResult.value.seconds}${proxy?.$t('dateCalc.diff.seconds')}`
    try {
        await navigator.clipboard.writeText(text)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('dateCalc.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('dateCalc.notification.copyFailed')
        })
    }
}

// 复制加减结果
const copyAddResult = async () => {
    if (!addResult.value) return
    try {
        await navigator.clipboard.writeText(addResult.value)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('dateCalc.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('dateCalc.notification.copyFailed')
        })
    }
}
</script>

<style scoped>
.datecalc-card {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 8px;
}

.mode-switch {
    display: flex;
    justify-content: center;
}

.result-card {
    transition: transform 0.2s ease;
}

.result-card:hover {
    transform: translateY(-2px);
}

.result-card-lg {
    max-width: 400px;
    margin: 0 auto;
}

.result-section {
    margin-top: 16px;
}

/* 深色模式适配 */
.body--dark {

    .result-card,
    .result-card-lg {
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
