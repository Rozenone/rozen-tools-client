<template>
    <div class="q-pa-md">
        <q-card class="crypto-hash-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('cryptoHash.title') }}</div>
                <div class="text-subtitle2">{{ $t('cryptoHash.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 算法选择 -->
                <div class="row q-mb-lg">
                    <div class="col-12 col-md-6">
                        <q-select v-model="selectedAlgorithm" :options="algorithmOptions"
                            :label="$t('cryptoHash.algorithm')" outlined emit-value map-options />
                    </div>
                </div>

                <!-- 输入输出区域 -->
                <div class="row q-col-gutter-md">
                    <!-- 输入区域 -->
                    <div class="col-12 col-md-6">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row items-center justify-between q-mb-sm">
                                    <div class="text-subtitle2">{{ $t('cryptoHash.inputText') }}</div>
                                    <div class="row">
                                        <q-btn flat round dense icon="content_paste" size="sm" @click="pasteInput">
                                            <q-tooltip>{{ $t('cryptoHash.paste') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn v-if="inputText" flat round dense icon="clear" size="sm"
                                            @click="clearAll">
                                            <q-tooltip>{{ $t('cryptoHash.clear') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <q-input v-model="inputText" type="textarea" outlined rows="10" class="crypto-input"
                                    :placeholder="$t('cryptoHash.placeholder.input')" bg-color="grey-1" />
                            </q-card-section>
                        </q-card>
                    </div>

                    <!-- 输出区域 -->
                    <div class="col-12 col-md-6">
                        <q-card flat bordered>
                            <q-card-section>
                                <div class="row items-center justify-between q-mb-sm">
                                    <div class="text-subtitle2">{{ $t('cryptoHash.outputHash') }}</div>
                                    <div class="row">
                                        <q-btn flat round dense icon="content_copy" size="sm" @click="copyOutput"
                                            :disable="!outputHash">
                                            <q-tooltip>{{ $t('cryptoHash.copy') }}</q-tooltip>
                                        </q-btn>
                                        <q-btn v-if="outputHash" flat round dense icon="clear" size="sm"
                                            @click="clearOutput">
                                            <q-tooltip>{{ $t('cryptoHash.clearOutput') }}</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                                <q-input v-model="outputHash" type="textarea" outlined rows="10" readonly
                                    class="crypto-input" :placeholder="$t('cryptoHash.placeholder.output')"
                                    bg-color="grey-1" />
                            </q-card-section>
                        </q-card>
                    </div>
                </div>

                <!-- 操作按钮 -->
                <div class="row justify-center q-mt-lg">
                    <q-btn unelevated color="primary" :label="$t('cryptoHash.calculate')" @click="handleCalculate"
                        :disable="!inputText" icon="calculate" class="q-px-md" />
                </div>

                <!-- MD5 警告提示 -->
                <q-banner v-if="selectedAlgorithm === 'MD5'" class="q-mt-md bg-orange-1 text-orange-9" dense>
                    <template v-slot:avatar>
                        <q-icon name="warning" color="orange" />
                    </template>
                    {{ $t('cryptoHash.md5Warning') }}
                </q-banner>
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

// 算法选项
type Algorithm = 'SHA-256' | 'SHA-384' | 'SHA-512' | 'MD5'

const algorithmOptions = [
    { label: 'SHA-256', value: 'SHA-256' },
    { label: 'SHA-384', value: 'SHA-384' },
    { label: 'SHA-512', value: 'SHA-512' },
    { label: 'MD5', value: 'MD5' }
]

const selectedAlgorithm = ref<Algorithm>('SHA-256')
const inputText = ref('')
const outputHash = ref('')

// 将 ArrayBuffer 转换为十六进制字符串
const bufferToHex = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

// MD5 实现（简单的 JavaScript 实现）
const md5 = (text: string): string => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)

    // 辅助函数
    const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n))
    const addUnsigned = (x: number, y: number) => (x + y) >>> 0

    // 初始化 MD5 变量
    let a = 0x67452301
    let b = 0xEFCDAB89
    let c = 0x98BADCFE
    let d = 0x10325476

    // 预计算正弦表
    const k = new Array(64)
    for (let i = 0; i < 64; i++) {
        k[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296)
    }

    // 填充数据
    const bitLen = data.length * 8
    const paddedLen = Math.ceil((data.length + 9) / 64) * 64
    const padded = new Uint8Array(paddedLen)
    padded.set(data)
    padded[data.length] = 0x80

    // 添加长度（小端序）
    const view = new DataView(padded.buffer)
    view.setUint32(paddedLen - 8, bitLen & 0xFFFFFFFF, true)
    view.setUint32(paddedLen - 4, (bitLen >>> 32) & 0xFFFFFFFF, true)

    // 处理每个 64 字节块
    for (let i = 0; i < paddedLen; i += 64) {
        const w = new Uint32Array(16)
        for (let j = 0; j < 16; j++) {
            w[j] = view.getUint32(i + j * 4, true)
        }

        let [aa, bb, cc, dd] = [a, b, c, d]

        for (let j = 0; j < 64; j++) {
            let f: number, g: number
            if (j < 16) {
                f = (bb & cc) | (~bb & dd)
                g = j
            } else if (j < 32) {
                f = (dd & bb) | (~dd & cc)
                g = (5 * j + 1) % 16
            } else if (j < 48) {
                f = bb ^ cc ^ dd
                g = (3 * j + 5) % 16
            } else {
                f = cc ^ (bb | ~dd)
                g = (7 * j) % 16
            }

            const temp = dd
            dd = cc
            cc = bb
            bb = addUnsigned(bb, rotateLeft(addUnsigned(addUnsigned(aa, f), addUnsigned(k[j], w[g])), [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][Math.floor(j / 16) * 4 + j % 4]))
            aa = temp
        }

        a = addUnsigned(a, aa)
        b = addUnsigned(b, bb)
        c = addUnsigned(c, cc)
        d = addUnsigned(d, dd)
    }

    // 转换为十六进制字符串
    const result = new Uint8Array(16)
    const resultView = new DataView(result.buffer)
    resultView.setUint32(0, a, true)
    resultView.setUint32(4, b, true)
    resultView.setUint32(8, c, true)
    resultView.setUint32(12, d, true)

    return Array.from(result)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

// 计算哈希
const calculateHash = async (text: string, algorithm: Algorithm): Promise<string> => {
    if (algorithm === 'MD5') {
        return md5(text)
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    return bufferToHex(hashBuffer)
}

// 处理计算
const handleCalculate = async () => {
    if (!inputText.value) return

    try {
        outputHash.value = await calculateHash(inputText.value, selectedAlgorithm.value)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('cryptoHash.notification.calculateSuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('cryptoHash.notification.calculateFailed')
        })
    }
}

// 粘贴输入
const pasteInput = async () => {
    try {
        const text = await navigator.clipboard.readText()
        inputText.value = text
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('cryptoHash.notification.pasteFailed')
        })
    }
}

// 复制输出
const copyOutput = async () => {
    if (!outputHash.value) return
    try {
        await navigator.clipboard.writeText(outputHash.value)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('cryptoHash.notification.copySuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('cryptoHash.notification.copyFailed')
        })
    }
}

// 清除全部
const clearAll = () => {
    inputText.value = ''
    outputHash.value = ''
}

// 清除输出
const clearOutput = () => {
    outputHash.value = ''
}

// 监听算法切换，清空输出
watch(selectedAlgorithm, () => {
    outputHash.value = ''
})
</script>

<style scoped>
.crypto-hash-card {
    max-width: 100%;
    margin: 0 auto;
    border-radius: 8px;
}

.crypto-input {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 14px;
}

/* 限制 autogrow textarea 的最大高度 */
.crypto-input :deep(.q-field__native) {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
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
