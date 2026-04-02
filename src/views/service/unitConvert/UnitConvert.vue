<template>
    <div class="q-pa-md">
        <q-card class="unit-convert-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ proxy?.$t('unitConvert.title') }}</div>
                <div class="text-subtitle2">{{ proxy?.$t('unitConvert.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 模式切换 -->
                <div class="mode-switch q-mb-lg">
                    <q-btn-toggle v-model="mode" :options="[
                        { label: proxy?.$t('unitConvert.mode.storage'), value: 'storage' },
                        { label: proxy?.$t('unitConvert.mode.network'), value: 'network' }
                    ]" color="primary" spread no-caps />
                </div>

                <!-- 储存单位模式 -->
                <div v-if="mode === 'storage'" class="q-mb-md">
                    <!-- 进制切换 -->
                    <div class="row items-center justify-center q-mb-md">
                        <q-btn-toggle v-model="storageBase" :options="[
                            { label: proxy?.$t('unitConvert.base.binary'), value: 1024 },
                            { label: proxy?.$t('unitConvert.base.decimal'), value: 1000 }
                        ]" color="secondary" size="sm" no-caps />
                    </div>
                </div>

                <!-- 输入区域 -->
                <div class="row q-col-gutter-md q-mb-lg">
                    <div class="col-12 col-md-6">
                        <q-input v-model.number="inputValue" type="number" outlined
                            :label="proxy?.$t('unitConvert.inputValue')" class="input-field"
                            bg-color="grey-1" step="any" @update:model-value="calculateResults">
                            <template v-if="inputValue" v-slot:append>
                                <q-icon name="close" class="cursor-pointer" @click="clearInput" />
                            </template>
                        </q-input>
                    </div>
                    <div class="col-12 col-md-6">
                        <q-select v-model="inputUnit" :options="currentUnitOptions" outlined
                            :label="proxy?.$t('unitConvert.selectUnit')" class="input-field"
                            bg-color="grey-1" emit-value map-options @update:model-value="calculateResults" />
                    </div>
                </div>

                <!-- 结果展示 -->
                <div class="result-section">
                    <div class="text-subtitle2 q-mb-md">{{ proxy?.$t('unitConvert.results') }}</div>
                    <div class="row q-col-gutter-sm">
                        <div v-for="result in conversionResults" :key="result.unit" class="col-6 col-md-4 col-lg-2">
                            <q-card flat bordered class="result-card" @click="copyResult(result)">
                                <q-card-section class="q-pa-sm">
                                    <div class="text-caption text-grey">{{ result.label }}</div>
                                    <div class="text-body2 text-weight-medium result-value">{{ result.value }}</div>
                                    <q-tooltip>{{ proxy?.$t('unitConvert.clickToCopy') }}</q-tooltip>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, watch } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// 基础数据
const mode = ref<'storage' | 'network'>('storage')
const storageBase = ref<1024 | 1000>(1024)
const inputValue = ref<number | null>(null)
const inputUnit = ref<string>('MB')

// 储存单位配置
const storageUnitsBinary = [
    { value: 'B', label: 'B (Byte)', factor: 0 },
    { value: 'KiB', label: 'KiB', factor: 1 },
    { value: 'MiB', label: 'MiB', factor: 2 },
    { value: 'GiB', label: 'GiB', factor: 3 },
    { value: 'TiB', label: 'TiB', factor: 4 },
    { value: 'PiB', label: 'PiB', factor: 5 }
]

const storageUnitsDecimal = [
    { value: 'B', label: 'B (Byte)', factor: 0 },
    { value: 'KB', label: 'KB', factor: 1 },
    { value: 'MB', label: 'MB', factor: 2 },
    { value: 'GB', label: 'GB', factor: 3 },
    { value: 'TB', label: 'TB', factor: 4 },
    { value: 'PB', label: 'PB', factor: 5 }
]

// 网络速率单位配置
const networkUnits = [
    { value: 'bps', label: 'bps', factor: 0 },
    { value: 'Kbps', label: 'Kbps', factor: 1 },
    { value: 'Mbps', label: 'Mbps', factor: 2 },
    { value: 'Gbps', label: 'Gbps', factor: 3 },
    { value: 'Tbps', label: 'Tbps', factor: 4 }
]

// 当前单位选项
const currentUnitOptions = computed(() => {
    if (mode.value === 'storage') {
        return storageBase.value === 1024 ? storageUnitsBinary : storageUnitsDecimal
    }
    return networkUnits
})

// 转换结果
interface ConversionResult {
    unit: string
    label: string
    value: string
}

const conversionResults = computed<ConversionResult[]>(() => {
    if (inputValue.value === null || inputValue.value === 0 || isNaN(inputValue.value)) {
        return currentUnitOptions.value.map(unit => ({
            unit: unit.value,
            label: unit.label,
            value: '-'
        }))
    }

    const base = mode.value === 'storage' ? storageBase.value : 1000
    const units = currentUnitOptions.value
    const currentUnit = units.find(u => u.value === inputUnit.value) || units[0]
    
    // 转换为最小单位
    const baseValue = inputValue.value * Math.pow(base, currentUnit.factor)

    return units.map(unit => {
        const convertedValue = baseValue / Math.pow(base, unit.factor)
        return {
            unit: unit.value,
            label: unit.label,
            value: formatNumber(convertedValue)
        }
    })
})

// 格式化数字
const formatNumber = (num: number): string => {
    if (num === 0) return '0'
    
    // 根据数值大小选择显示精度
    if (Math.abs(num) >= 1000000) {
        return num.toExponential(4)
    } else if (Math.abs(num) >= 1000) {
        return num.toFixed(2)
    } else if (Math.abs(num) >= 1) {
        return num.toFixed(4)
    } else if (Math.abs(num) >= 0.0001) {
        return num.toFixed(6)
    } else {
        return num.toExponential(4)
    }
}

// 计算结果（用于响应输入变化）
const calculateResults = () => {
    // 触发computed重新计算
}

// 复制结果
const copyResult = async (result: ConversionResult) => {
    if (result.value === '-') return
    
    try {
        await navigator.clipboard.writeText(result.value)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('unitConvert.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('unitConvert.notification.copyFailed')
        })
    }
}

// 清除输入
const clearInput = () => {
    inputValue.value = null
}

// 监听模式切换
watch(mode, () => {
    inputValue.value = null
    if (mode.value === 'storage') {
        inputUnit.value = 'MB'
    } else {
        inputUnit.value = 'Mbps'
    }
})

// 监听进制切换
watch(storageBase, () => {
    inputUnit.value = storageBase.value === 1024 ? 'MiB' : 'MB'
})
</script>

<style scoped>
.unit-convert-card {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 8px;
}

.mode-switch {
    display: flex;
    justify-content: center;
}

.input-field {
    font-size: 16px;
}

:deep(.q-field__control) {
    background: var(--q-grey-1);
}

.result-section {
    margin-top: 16px;
}

.result-card {
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 80px;
}

.result-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.result-value {
    word-break: break-all;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 13px;
}

/* 深色模式适配 */
.body--dark {
    :deep(.q-field__control) {
        background: #2d2d2d;
    }

    .result-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
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
