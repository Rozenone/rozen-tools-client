<template>
    <div class="q-pa-md">
        <q-card class="stopwatch-card">
            <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ $t('stopwatch.title') }}</div>
                <div class="text-subtitle2">{{ $t('stopwatch.description') }}</div>
            </q-card-section>

            <q-card-section class="q-pa-lg">
                <!-- 计时显示 -->
                <div class="timer-display">
                    <div class="time-text">{{ formattedTime }}</div>
                </div>

                <!-- 控制按钮 -->
                <div class="control-buttons q-mt-lg">
                    <q-btn v-if="!isRunning && elapsedTime === 0" unelevated color="positive"
                        :label="$t('stopwatch.start')" icon="play_arrow" @click="startTimer" class="control-btn" />
                    <q-btn v-if="isRunning" unelevated color="warning" :label="$t('stopwatch.pause')" icon="pause"
                        @click="pauseTimer" class="control-btn" />
                    <q-btn v-if="!isRunning && elapsedTime > 0" unelevated color="primary"
                        :label="$t('stopwatch.resume')" icon="play_arrow" @click="resumeTimer" class="control-btn" />
                    <q-btn v-if="elapsedTime > 0" unelevated color="negative" :label="$t('stopwatch.reset')"
                        icon="replay" @click="resetTimer" class="control-btn" />
                    <q-btn v-if="isRunning" unelevated color="secondary" :label="$t('stopwatch.lap')" icon="flag"
                        @click="recordLap" class="control-btn" />
                </div>

                <!-- Lap记录表格 -->
                <div class="lap-section q-mt-lg" v-if="lapRecords.length > 0">
                    <q-table :rows="lapRecords" :columns="columns" row-key="id" flat bordered
                        :pagination="{ rowsPerPage: 10 }" hide-pagination class="lap-table">
                        <template v-slot:body-cell-no="props">
                            <q-td :props="props" class="text-center">
                                {{ props.row.no }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-lapTime="props">
                            <q-td :props="props" class="text-center lap-time">
                                {{ props.row.lapTime }}
                            </q-td>
                        </template>
                        <template v-slot:body-cell-totalTime="props">
                            <q-td :props="props" class="text-center total-time">
                                {{ props.row.totalTime }}
                            </q-td>
                        </template>
                    </q-table>
                </div>
                <div v-else class="no-lap text-grey q-mt-lg text-center">
                    {{ $t('stopwatch.noLapRecord') }}
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'StopWatchTimer'
})

import { ref, computed, onUnmounted, getCurrentInstance } from 'vue'
import type { ComponentInternalInstance } from 'vue'
import type { QTableColumn } from 'quasar'
import { useQuasar } from 'quasar'

const { proxy } = getCurrentInstance() as ComponentInternalInstance
const $q = useQuasar()

// 计时状态
const isRunning = ref(false)
const elapsedTime = ref(0) // 总经过时间（毫秒）
const lastStartTime = ref(0)
let animationFrameId: number | null = null

// Lap记录
interface LapRecord {
    id: number
    no: number
    lapTime: string
    totalTime: string
    lapMs: number
    totalMs: number
}

const lapRecords = ref<LapRecord[]>([])
const lastLapTime = ref(0)

// 格式化时间显示
const formattedTime = computed(() => {
    return formatTime(elapsedTime.value)
})

// 格式化毫秒为 HH:MM:SS.ms
const formatTime = (ms: number): string => {
    const totalMs = Math.floor(ms)
    const milliseconds = totalMs % 1000
    const totalSeconds = Math.floor(totalMs / 1000)
    const seconds = totalSeconds % 60
    const totalMinutes = Math.floor(totalSeconds / 60)
    const minutes = totalMinutes % 60
    const hours = Math.floor(totalMinutes / 60)

    const pad = (n: number, len: number = 2) => n.toString().padStart(len, '0')

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`
}

// 更新计时
const updateTimer = () => {
    if (isRunning.value) {
        const now = performance.now()
        elapsedTime.value = now - lastStartTime.value
        animationFrameId = requestAnimationFrame(updateTimer)
    }
}

// 开始计时
const startTimer = () => {
    isRunning.value = true
    lastStartTime.value = performance.now()
    elapsedTime.value = 0
    lastLapTime.value = 0
    animationFrameId = requestAnimationFrame(updateTimer)
    $q.notify({
        type: 'positive',
        message: proxy?.$t('stopwatch.notification.started') || ''
    })
}

// 暂停计时
const pauseTimer = () => {
    isRunning.value = false
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
    $q.notify({
        type: 'warning',
        message: proxy?.$t('stopwatch.notification.paused') || ''
    })
}

// 继续计时
const resumeTimer = () => {
    isRunning.value = true
    // 计算新的起始时间：当前时间减去已记录的经过时间
    lastStartTime.value = performance.now() - elapsedTime.value
    animationFrameId = requestAnimationFrame(updateTimer)
    $q.notify({
        type: 'positive',
        message: proxy?.$t('stopwatch.notification.resumed') || ''
    })
}

// 重置计时
const resetTimer = () => {
    isRunning.value = false
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
        animationFrameId = null
    }
    elapsedTime.value = 0
    lastLapTime.value = 0
    lapRecords.value = []
    $q.notify({
        type: 'info',
        message: proxy?.$t('stopwatch.notification.reset') || ''
    })
}

// 记录Lap
const recordLap = () => {
    const currentTotalMs = elapsedTime.value
    const lapMs = currentTotalMs - lastLapTime.value
    lastLapTime.value = currentTotalMs

    const newLap: LapRecord = {
        id: Date.now(),
        no: lapRecords.value.length + 1,
        lapTime: formatTime(lapMs),
        totalTime: formatTime(currentTotalMs),
        lapMs,
        totalMs: currentTotalMs
    }

    // 最新记录在最上面
    lapRecords.value.unshift(newLap)

    $q.notify({
        type: 'info',
        message: proxy?.$t('stopwatch.notification.lapRecorded') || '',
        timeout: 500
    })
}

// 表格列配置
const columns = computed<QTableColumn[]>(() => [
    {
        name: 'no',
        label: proxy?.$t('stopwatch.no') || 'No.',
        field: 'no',
        align: 'center',
        sortable: false
    },
    {
        name: 'lapTime',
        label: proxy?.$t('stopwatch.lapTime') || 'Lap Time',
        field: 'lapTime',
        align: 'center',
        sortable: false
    },
    {
        name: 'totalTime',
        label: proxy?.$t('stopwatch.totalTime') || 'Total Time',
        field: 'totalTime',
        align: 'center',
        sortable: false
    }
])

// 组件卸载时清除定时器
onUnmounted(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
    }
})
</script>

<style scoped>
.stopwatch-card {
    max-width: 100%;
    margin: 0 auto;
    border-radius: 8px;
}

.timer-display {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
    border-radius: 12px;
    margin-bottom: 10px;
}

.time-text {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Courier New', monospace;
    font-size: 3.5rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: #333;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.control-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
}

.control-btn {
    min-width: 120px;
    font-weight: 600;
}

.lap-section {
    margin-top: 20px;
}

.lap-table {
    border-radius: 8px;
    overflow: hidden;
}

.lap-time,
.total-time {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
    font-size: 14px;
}

.no-lap {
    padding: 30px;
    font-size: 14px;
    text-align: center;
}

/* 深色模式适配 */
.body--dark {
    .timer-display {
        background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
    }

    .time-text {
        color: #fff;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .lap-table :deep(.q-table) {
        background: #1d1d1d;
    }
}
</style>
