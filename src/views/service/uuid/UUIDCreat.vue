<!-- 正则表达式 -->
<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('uuidCreat.title') }}</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-auto">
            <q-select
              v-model="uuidVersion"
              :options="[
                { label: $t('uuidCreat.version.v4'), value: 'v4' },
                { label: $t('uuidCreat.version.v1'), value: 'v1' }
              ]"
              style="width: 150px"
              @update:model-value="generateUUID"
            />
          </div>

          <div class="col-auto">
            <q-input
              v-model.number="generateCount"
              type="number"
              :min="1"
              :max="100"
              :label="$t('uuidCreat.generateCount')"
              style="width: 150px"
            />
          </div>

          <div class="col-auto">
            <q-btn color="primary" @click="generateUUID">
              {{ $t('uuidCreat.generateButton') }}
            </q-btn>
          </div>

          <div class="col-auto">
            <q-btn 
              color="secondary" 
              @click="exportToCsv"
              :disable="!uuidList.length"
            >
              {{ $t('uuidCreat.exportCsv') }}
            </q-btn>
          </div>

          <div class="col-auto">
            <q-toggle
              v-model="isUpperCase"
              :label="$t('uuidCreat.upperCase')"
              @update:model-value="toggleCase"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item v-for="(uuid, index) in uuidList" :key="index">
            <q-item-section>{{ uuid }}</q-item-section>
            <q-item-section side>
              <q-btn flat color="primary" icon="content_copy" @click="copyUUID(uuid)">
                <q-tooltip>{{ $t('uuidCreat.copy') }}</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from 'vue'
import { useQuasar } from 'quasar'
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid'

const { proxy } = getCurrentInstance() as any
const $q = useQuasar()

const uuidVersion = ref('v4')
const generateCount = ref(1)
const isUpperCase = ref(false)
const uuidList = ref<string[]>([])

// 生成 UUID
const generateUUID = () => {
  uuidList.value = []
  for (let i = 0; i < generateCount.value; i++) {
    const uuid = uuidVersion.value === 'v4' ? uuidv4() : uuidv1()
    uuidList.value.push(isUpperCase.value ? uuid.toUpperCase() : uuid)
  }
}

// 复制 UUID
const copyUUID = async (uuid: string) => {
  try {
    await navigator.clipboard.writeText(uuid)
    $q.notify({
      type: 'positive',
      message: proxy.$t('uuidCreat.notification.copySuccess')
    })
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('uuidCreat.notification.copyFail')
    })
  }
}

// 切换大小写
const toggleCase = () => {
  uuidList.value = uuidList.value.map(uuid => 
    isUpperCase.value ? uuid.toUpperCase() : uuid.toLowerCase()
  )
}

// 添加导出CSV功能
const exportToCsv = () => {
  const csvContent = uuidList.value.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  const date = new Date().toISOString().slice(0, 10)
  link.setAttribute('href', url)
  link.setAttribute('download', `uuids-${date}.csv`)
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  $q.notify({
    type: 'positive',
    message: proxy.$t('uuidCreat.notification.exportSuccess')
  })
}

// 初始生成一个 UUID
generateUUID()
</script>

<style scoped>
* {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
</style>