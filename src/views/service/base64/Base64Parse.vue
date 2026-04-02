<template>
    <div class="q-pa-md">
        <q-card class="base64-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('base64Parse.title') }}</div>
                <div class="text-subtitle2">{{ $t('base64Parse.description') }}</div>
            </q-card-section>

            <!-- Tab 切换 -->
            <q-tabs v-model="activeTab" class="text-primary" active-color="primary" indicator-color="primary"
                align="justify" narrow-indicator>
                <q-tab name="text" :label="$t('base64Parse.tab.text')" icon="text_fields" />
                <q-tab name="image" :label="$t('base64Parse.tab.image')" icon="image" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="activeTab" animated>
                <!-- 文本模式 Tab -->
                <q-tab-panel name="text">
                    <q-card-section>
                        <!-- 模式切换 -->
                        <div class="mode-switch q-mb-lg">
                            <q-btn-toggle v-model="textMode" :options="[
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
                                            <div class="text-subtitle2">{{ textMode === 'encode' ? $t('base64Parse.inputText') :
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
                                            :placeholder="textMode === 'encode' ? $t('base64Parse.placeholder.encode') : $t('base64Parse.placeholder.decode')"
                                            bg-color="grey-1" :error="hasError" :error-message="errorMessage" />
                                    </q-card-section>
                                </q-card>
                            </div>

                            <!-- 输出区域 -->
                            <div class="col-12 col-md-6">
                                <q-card flat bordered>
                                    <q-card-section>
                                        <div class="row items-center justify-between q-mb-sm">
                                            <div class="text-subtitle2">{{ textMode === 'encode' ? $t('base64Parse.outputBase64') :
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
                                :label="textMode === 'encode' ? $t('base64Parse.encode') : $t('base64Parse.decode')"
                                @click="handleConvert" :disable="!inputText" icon="swap_horiz" class="q-px-md" />
                        </div>
                    </q-card-section>
                </q-tab-panel>

                <!-- 图片模式 Tab -->
                <q-tab-panel name="image">
                    <q-card-section>
                        <!-- 图片模式切换 -->
                        <div class="mode-switch q-mb-lg">
                            <q-btn-toggle v-model="imageMode" :options="[
                                { label: $t('base64Parse.image.base64ToImage'), value: 'base64ToImage' },
                                { label: $t('base64Parse.image.imageToBase64'), value: 'imageToBase64' }
                            ]" color="primary" spread no-caps />
                        </div>

                        <!-- Base64 转图片 -->
                        <div v-if="imageMode === 'base64ToImage'" class="row q-col-gutter-md">
                            <!-- 输入区域 -->
                            <div class="col-12 col-md-6">
                                <q-card flat bordered>
                                    <q-card-section>
                                        <div class="row items-center justify-between q-mb-sm">
                                            <div class="text-subtitle2">{{ $t('base64Parse.image.inputBase64') }}</div>
                                            <div class="row">
                                                <q-btn flat round dense icon="content_paste" size="sm" @click="pasteBase64Image">
                                                    <q-tooltip>{{ $t('base64Parse.paste') }}</q-tooltip>
                                                </q-btn>
                                                <q-btn v-if="base64ImageInput" flat round dense icon="clear" size="sm"
                                                    @click="clearBase64ImageInput">
                                                    <q-tooltip>{{ $t('base64Parse.clear') }}</q-tooltip>
                                                </q-btn>
                                            </div>
                                        </div>
                                        <q-input v-model="base64ImageInput" type="textarea" outlined rows="8"
                                            class="base64-input" :placeholder="$t('base64Parse.image.base64Placeholder')"
                                            bg-color="grey-1" @update:model-value="onBase64ImageInputChange" />

                                        <!-- 格式选择 -->
                                        <div class="q-mt-md">
                                            <q-select v-model="imageFormat" :options="formatOptions"
                                                :label="$t('base64Parse.image.selectFormat')" outlined dense emit-value
                                                map-options>
                                                <template v-slot:prepend>
                                                    <q-icon name="image" />
                                                </template>
                                            </q-select>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>

                            <!-- 预览区域 -->
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="image-preview-card">
                                    <q-card-section>
                                        <div class="row items-center justify-between q-mb-sm">
                                            <div class="text-subtitle2">{{ $t('base64Parse.image.preview') }}</div>
                                            <q-btn v-if="imagePreviewUrl" flat round dense icon="download" size="sm"
                                                @click="downloadImage">
                                                <q-tooltip>{{ $t('base64Parse.image.download') }}</q-tooltip>
                                            </q-btn>
                                        </div>
                                        <div class="image-preview-container">
                                            <img v-if="imagePreviewUrl" :src="imagePreviewUrl" class="image-preview"
                                                @error="onImageError" />
                                            <div v-else class="no-preview">
                                                <q-icon name="image" size="48px" color="grey-5" />
                                                <div class="text-grey-6 q-mt-sm">{{ $t('base64Parse.image.noPreview') }}</div>
                                            </div>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>

                        <!-- 图片转 Base64 -->
                        <div v-else class="row q-col-gutter-md">
                            <!-- 上传区域 -->
                            <div class="col-12 col-md-6">
                                <q-card flat bordered class="upload-card">
                                    <q-card-section>
                                        <div class="text-subtitle2 q-mb-md">{{ $t('base64Parse.image.uploadArea') }}</div>
                                        <div class="upload-area" @click="triggerFileInput"
                                            @dragover.prevent="isDragging = true"
                                            @dragleave.prevent="isDragging = false"
                                            @drop.prevent="handleFileDrop"
                                            :class="{ 'dragging': isDragging }">
                                            <input ref="fileInput" type="file" accept="image/*" class="hidden-input"
                                                @change="handleFileSelect" />
                                            <q-icon name="cloud_upload" size="48px" color="primary" />
                                            <div class="text-grey-7 q-mt-sm text-center">
                                                {{ $t('base64Parse.image.uploadArea') }}
                                            </div>
                                            <div class="text-grey-6 text-caption q-mt-xs">
                                                {{ $t('base64Parse.image.uploadHint') }}
                                            </div>
                                        </div>

                                        <!-- 文件信息 -->
                                        <div v-if="uploadedFile" class="file-info q-mt-md">
                                            <div class="text-subtitle2 q-mb-sm">{{ $t('base64Parse.image.fileInfo') }}</div>
                                            <q-list dense bordered>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label caption>{{ $t('base64Parse.image.fileName') }}</q-item-label>
                                                        <q-item-label>{{ uploadedFile.name }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label caption>{{ $t('base64Parse.image.fileSize') }}</q-item-label>
                                                        <q-item-label>{{ formatFileSize(uploadedFile.size) }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                                <q-item>
                                                    <q-item-section>
                                                        <q-item-label caption>{{ $t('base64Parse.image.fileType') }}</q-item-label>
                                                        <q-item-label>{{ uploadedFile.type || 'Unknown' }}</q-item-label>
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>

                            <!-- 输出区域 -->
                            <div class="col-12 col-md-6">
                                <q-card flat bordered>
                                    <q-card-section>
                                        <div class="row items-center justify-between q-mb-sm">
                                            <div class="text-subtitle2">{{ $t('base64Parse.image.base64Output') }}</div>
                                            <div class="row">
                                                <q-btn flat round dense icon="content_copy" size="sm"
                                                    @click="copyImageBase64" :disable="!imageBase64Output">
                                                    <q-tooltip>{{ $t('base64Parse.copy') }}</q-tooltip>
                                                </q-btn>
                                                <q-btn v-if="imageBase64Output" flat round dense icon="clear" size="sm"
                                                    @click="clearImageBase64Output">
                                                    <q-tooltip>{{ $t('base64Parse.clear') }}</q-tooltip>
                                                </q-btn>
                                            </div>
                                        </div>
                                        <q-input v-model="imageBase64Output" type="textarea" outlined rows="8"
                                            readonly class="base64-input"
                                            :placeholder="$t('base64Parse.placeholder.output')" bg-color="grey-1" />
                                    </q-card-section>
                                </q-card>

                                <!-- 图片预览 -->
                                <q-card v-if="imageBase64Output" flat bordered class="q-mt-md">
                                    <q-card-section>
                                        <div class="text-subtitle2 q-mb-sm">{{ $t('base64Parse.image.preview') }}</div>
                                        <div class="image-preview-container">
                                            <img :src="imageBase64Output" class="image-preview" />
                                        </div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </div>
                    </q-card-section>
                </q-tab-panel>
            </q-tab-panels>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, watch } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// ========== Tab 切换 ==========
const activeTab = ref<'text' | 'image'>('text')

// ========== 文本模式 ==========
const textMode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const outputText = ref('')
const hasError = ref(false)
const errorMessage = ref('')

// ========== 图片模式 ==========
const imageMode = ref<'base64ToImage' | 'imageToBase64'>('base64ToImage')

// Base64 转图片
const base64ImageInput = ref('')
const imagePreviewUrl = ref('')
const imageFormat = ref('auto')
const formatOptions = [
    { label: proxy?.$t('base64Parse.image.autoDetect') || '自动检测', value: 'auto' },
    { label: 'PNG', value: 'png' },
    { label: 'JPEG', value: 'jpeg' },
    { label: 'GIF', value: 'gif' },
    { label: 'WebP', value: 'webp' },
    { label: 'SVG', value: 'svg+xml' }
]

// 图片转 Base64
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploadedFile = ref<File | null>(null)
const imageBase64Output = ref('')

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
        if (textMode.value === 'encode') {
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

// 监听文本模式切换，清空输入输出
watch(textMode, () => {
    clearInput()
})

// ========== 图片模式函数 ==========

// Base64 转图片相关函数
const pasteBase64Image = async () => {
    try {
        const text = await navigator.clipboard.readText()
        base64ImageInput.value = text
        onBase64ImageInputChange(text)
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.notification.pasteFailed')
        })
    }
}

const clearBase64ImageInput = () => {
    base64ImageInput.value = ''
    imagePreviewUrl.value = ''
}

const onBase64ImageInputChange = (value: string | number | null) => {
    const strValue = String(value || '')
    if (!strValue.trim()) {
        imagePreviewUrl.value = ''
        return
    }

    // 清理 Base64 字符串（移除 data URI 前缀）
    let base64String = strValue.trim()
    const dataUriMatch = base64String.match(/^data:image\/(\w+);base64,/)
    if (dataUriMatch) {
        // 如果输入包含 data URI 前缀，提取格式和纯 Base64
        if (imageFormat.value === 'auto') {
            const detectedFormat = dataUriMatch[1]
            if (['png', 'jpeg', 'jpg', 'gif', 'webp', 'svg+xml'].includes(detectedFormat)) {
                imageFormat.value = detectedFormat === 'jpg' ? 'jpeg' : detectedFormat
            }
        }
        base64String = base64String.replace(/^data:image\/\w+;base64,/, '')
    }

    // 确定图片格式
    let format = imageFormat.value
    if (format === 'auto') {
        // 尝试从 Base64 内容检测格式
        format = detectImageFormat(base64String)
    }

    // 构建 data URI
    imagePreviewUrl.value = `data:image/${format};base64,${base64String}`
}

const detectImageFormat = (base64: string): string => {
    // 通过 magic bytes 检测图片格式
    const signatures: Record<string, string> = {
        '/9j/': 'jpeg',
        'iVBORw0KGgo': 'png',
        'R0lGOD': 'gif',
        'UklGR': 'webp',
        'PHN2Zy': 'svg+xml',
        'PD94bWwg': 'svg+xml'
    }

    for (const [sig, format] of Object.entries(signatures)) {
        if (base64.startsWith(sig)) {
            return format
        }
    }

    return 'png' // 默认返回 PNG
}

const onImageError = () => {
    imagePreviewUrl.value = ''
    $q.notify({
        type: 'negative',
        message: proxy?.$t('base64Parse.image.invalidBase64')
    })
}

const downloadImage = () => {
    if (!imagePreviewUrl.value) return

    try {
        const link = document.createElement('a')
        link.href = imagePreviewUrl.value
        const format = imageFormat.value === 'auto' ? 'png' : imageFormat.value
        link.download = `image.${format.replace('+xml', '')}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        $q.notify({
            type: 'positive',
            message: proxy?.$t('base64Parse.image.downloadSuccess')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.image.downloadFailed')
        })
    }
}

// 图片转 Base64 相关函数
const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        processImageFile(file)
    }
}

const handleFileDrop = (event: DragEvent) => {
    isDragging.value = false
    const file = event.dataTransfer?.files[0]
    if (file && file.type.startsWith('image/')) {
        processImageFile(file)
    } else {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.image.noImage')
        })
    }
}

const processImageFile = (file: File) => {
    // 检查文件大小（警告超过 5MB 的图片）
    if (file.size > 5 * 1024 * 1024) {
        $q.notify({
            type: 'warning',
            message: proxy?.$t('base64Parse.image.imageTooLarge')
        })
    }

    uploadedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
            imageBase64Output.value = result
            $q.notify({
                type: 'positive',
                message: proxy?.$t('base64Parse.image.convertSuccess')
            })
        }
    }
    reader.onerror = () => {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.image.convertFailed')
        })
    }
    reader.readAsDataURL(file)
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const copyImageBase64 = async () => {
    if (!imageBase64Output.value) return
    try {
        await navigator.clipboard.writeText(imageBase64Output.value)
        $q.notify({
            type: 'positive',
            message: proxy?.$t('base64Parse.image.copyBase64Success')
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('base64Parse.notification.copyFailed')
        })
    }
}

const clearImageBase64Output = () => {
    imageBase64Output.value = ''
    uploadedFile.value = null
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

// 监听图片模式切换，清空相关数据
watch(imageMode, () => {
    clearBase64ImageInput()
    clearImageBase64Output()
})

// 监听格式变化，重新生成预览
watch(imageFormat, () => {
    if (base64ImageInput.value) {
        onBase64ImageInputChange(base64ImageInput.value)
    }
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

/* ========== 图片模式样式 ========== */
.image-preview-card {
    min-height: 300px;
}

.image-preview-container {
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 4px;
    overflow: hidden;
}

.image-preview {
    max-width: 100%;
    max-height: 400px;
    object-fit: contain;
}

.no-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.upload-card {
    min-height: 300px;
}

.upload-area {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 200px;
}

.upload-area:hover {
    border-color: var(--q-primary);
    background-color: rgba(var(--q-primary-rgb), 0.05);
}

.upload-area.dragging {
    border-color: var(--q-primary);
    background-color: rgba(var(--q-primary-rgb), 0.1);
}

.hidden-input {
    display: none;
}

.file-info {
    margin-top: 16px;
}

/* 深色模式适配 - 图片模式 */
.body--dark .image-preview-container {
    background-color: #2d2d2d;
}

.body--dark .upload-area {
    border-color: #555;
}

.body--dark .upload-area:hover {
    border-color: var(--q-primary);
    background-color: rgba(var(--q-primary-rgb), 0.1);
}
</style>
