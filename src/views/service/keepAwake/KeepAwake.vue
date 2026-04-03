<template>
    <div class="q-pa-md">
        <q-card class="keepawake-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('keepAwake.title') }}</div>
                <div class="text-subtitle2">{{ $t('keepAwake.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
                <!-- 大开关 -->
                <div class="row justify-center q-mb-xl">
                    <div class="toggle-container">
                        <q-btn :color="isActive ? 'positive' : 'grey-5'" :icon="isActive ? 'coffee' : 'bedtime'"
                            :label="isActive ? $t('keepAwake.active') : $t('keepAwake.inactive')" size="xl" unelevated
                            class="main-toggle-btn" @click="toggleKeepAwake">
                            <q-badge v-if="isActive" color="orange" floating>
                                <q-icon name="schedule" size="xs" />
                            </q-badge>
                        </q-btn>
                    </div>
                </div>

                <!-- 状态显示 -->
                <div class="row justify-center q-mb-lg">
                    <q-chip :color="isActive ? 'positive' : 'grey-5'" text-color="white" size="lg"
                        :icon="isActive ? 'check_circle' : 'cancel'">
                        {{ isActive ? $t('keepAwake.status.on') : $t('keepAwake.status.off') }}
                    </q-chip>
                </div>

                <!-- 持续时间 -->
                <div v-if="isActive" class="row justify-center q-mb-xl">
                    <q-card flat bordered class="duration-card">
                        <q-card-section class="text-center">
                            <div class="text-caption text-grey-7 q-mb-sm">{{ $t('keepAwake.duration') }}</div>
                            <div class="duration-display text-h4 text-primary font-monospace">
                                {{ formattedDuration }}
                            </div>
                        </q-card-section>
                    </q-card>
                </div>

                <!-- 说明文字 -->
                <div class="row justify-center">
                    <q-card flat bordered class="info-card">
                        <q-card-section>
                            <div class="row items-center q-mb-sm">
                                <q-icon name="info" color="info" size="sm" class="q-mr-sm" />
                                <span class="text-subtitle2">{{ $t('keepAwake.info.title') }}</span>
                            </div>
                            <div class="text-body2 text-grey-7">
                                {{ $t('keepAwake.info.content') }}
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance, onBeforeUnmount, onUnmounted } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// 状态
const isActive = ref(false)
const startTime = ref<number | null>(null)
const duration = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

// 格式化持续时间 HH:MM:SS
const formattedDuration = computed(() => {
    const hours = Math.floor(duration.value / 3600)
    const minutes = Math.floor((duration.value % 3600) / 60)
    const seconds = duration.value % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 开始计时
const startTimer = () => {
    startTime.value = Date.now()
    duration.value = 0
    timerInterval = setInterval(() => {
        if (startTime.value) {
            duration.value = Math.floor((Date.now() - startTime.value) / 1000)
        }
    }, 1000)
}

// 停止计时
const stopTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval)
        timerInterval = null
    }
    startTime.value = null
    duration.value = 0
}

// 切换防睡眠状态
const toggleKeepAwake = async () => {
    try {
        if (isActive.value) {
            // 关闭防睡眠
            const result = await window.ipcCommon.stopKeepAwake()
            if (result.success) {
                isActive.value = false
                stopTimer()
                $q.notify({
                    type: 'positive',
                    message: proxy?.$t('keepAwake.notification.stopped')
                })
            }
        } else {
            // 开启防睡眠
            const result = await window.ipcCommon.startKeepAwake()
            if (result.success) {
                isActive.value = true
                startTimer()
                $q.notify({
                    type: 'positive',
                    message: proxy?.$t('keepAwake.notification.started')
                })
            }
        }
    } catch {
        $q.notify({
            type: 'negative',
            message: proxy?.$t('keepAwake.notification.error')
        })
    }
}

// 页面离开时自动停止防睡眠
onBeforeUnmount(async () => {
    if (isActive.value) {
        try {
            await window.ipcCommon.stopKeepAwake()
            stopTimer()
        } catch {
            // 忽略错误
        }
    }
})

// 确保清理定时器
onUnmounted(() => {
    stopTimer()
})
</script>

<style scoped>
.keepawake-card {
    max-width: 100%;
    margin: 0 auto;
    border-radius: 8px;
}

.toggle-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-toggle-btn {
    min-width: 200px;
    min-height: 80px;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: 500;
}

.duration-card {
    min-width: 200px;
    background: var(--q-grey-1);
}

.duration-display {
    letter-spacing: 2px;
}

.info-card {
    max-width: 100%;
    width: 100%;
    background: var(--q-grey-1);
}

.font-monospace {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
}

/* 深色模式适配 */
.body--dark .duration-card,
.body--dark .info-card {
    background: #2d2d2d;
}

.body--dark .info-card .text-grey-7 {
    color: #aaa !important;
}

/* 允许选择文本 */
* {
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
}
</style>
