<!-- 主要top画面 -->
<template>
  <div class="setting_base full-height">
    <q-splitter
      v-model="splitterModel"
      :limits="[20, 30]"
      class="settings-splitter"
      separator-class="bg-grey-4"
    >
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-teal settings-tabs"
          active-color="primary"
          indicator-color="primary"
        >
          <q-tab 
            v-for="item in tabItems" 
            :key="item.name"
            :name="item.name"
            :icon="item.icon"
            :label="$t(`settingPage.${item.label}`)"
            :class="{ 'active-tab': tab === item.name }"
          />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
          class="settings-panels"
        >
          <!-- 语言设置面板 -->
          <q-tab-panel name="language" class="q-pa-md">
            <div class="panel-content">
              <div class="text-h6 q-mb-md">{{ $t('settingPage.language') }}</div>
              <q-select 
                color="purple-12"
                v-model="model"
                filled
                :options="options"
                :label="$t('settingPage.name')"
                emit-value
                map-options
                class="language-select"
              >
                <template v-slot:prepend>
                  <q-icon name="language" />
                </template>
              </q-select>
            </div>
          </q-tab-panel>

          <!-- 主题设置面板 -->
          <q-tab-panel name="theme" class="q-pa-md">
            <div class="panel-content">
              <div class="text-h6 q-mb-md">{{ $t('settingPage.theme.title') }}</div>
              <q-btn-toggle
                v-model="currentTheme"
                :options="[
                  { label: $t('settingPage.theme.light'), value: 'light' },
                  { label: $t('settingPage.theme.dark'), value: 'dark' }
                ]"
                spread
                color="primary"
                @update:model-value="changeTheme"
                class="theme-toggle"
              />
            </div>
          </q-tab-panel>

          <!-- 字体设置面板 -->
          <q-tab-panel name="font" class="q-pa-md">
            <div class="panel-content">
              <div class="text-h6 q-mb-md">{{ $t('settingPage.font.title') }}</div>
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <div class="text-subtitle2 q-mb-sm">{{ $t('settingPage.font.size') }}</div>
                  <q-slider
                    v-model="fontSize"
                    :min="12"
                    :max="20"
                    :step="1"
                    label
                    label-always
                    color="primary"
                    @update:model-value="changeFontSize"
                    class="font-slider"
                  />
                </div>
                
                <div class="col-12">
                  <div class="preview-section q-pa-md">
                    <div class="text-subtitle2 q-mb-md">{{ $t('settingPage.font.preview') }}</div>
                    <div class="preview-text">
                      <div class="preview-title">{{ $t('settingPage.font.previewTitle') }}</div>
                      <div class="preview-body">{{ $t('settingPage.font.previewText') }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <!-- 代理设置面板 -->
          <q-tab-panel name="proxy" class="q-pa-md">
            <div class="panel-content">
              <div class="text-h6 q-mb-md">{{ $t('settingPage.proxy.title') }}</div>
              <div class="text-caption q-mb-lg">{{ $t('settingPage.proxy.description') }}</div>
              
              <q-card flat bordered class="proxy-settings">
                <q-card-section>
                  <div class="row q-col-gutter-md">
                    <!-- 启用代理开关 -->
                    <div class="col-12">
                      <q-toggle
                        v-model="proxyEnabled"
                        :label="$t('settingPage.proxy.enable')"
                        color="primary"
                      />
                    </div>

                    <!-- 代理协议 -->
                    <div class="col-12 col-sm-4">
                      <q-select
                        v-model="proxyProtocol"
                        :options="['http', 'https']"
                        :label="$t('settingPage.proxy.protocol')"
                        :disable="!proxyEnabled"
                        outlined
                        dense
                        class="q-mb-md"
                      />
                    </div>

                    <!-- 代理主机和端口 -->
                    <div class="col-12 col-sm-4">
                      <q-input
                        v-model="proxyHost"
                        :label="$t('settingPage.proxy.host')"
                        :placeholder="$t('settingPage.proxy.placeholder.host')"
                        :disable="!proxyEnabled"
                        outlined
                        dense
                      />
                    </div>
                    <div class="col-12 col-sm-4">
                      <q-input
                        v-model="proxyPort"
                        type="number"
                        :label="$t('settingPage.proxy.port')"
                        :placeholder="$t('settingPage.proxy.placeholder.port')"
                        :disable="!proxyEnabled"
                        outlined
                        dense
                      />
                    </div>

                    <!-- 认证信息 -->
                    <div class="col-12">
                      <q-expansion-item
                        :label="$t('settingPage.proxy.auth')"
                        :disable="!proxyEnabled"
                        dense
                      >
                        <q-card>
                          <q-card-section>
                            <div class="row q-col-gutter-md">
                              <div class="col-12 col-sm-6">
                                <q-input
                                  v-model="proxyUsername"
                                  :label="$t('settingPage.proxy.username')"
                                  :placeholder="$t('settingPage.proxy.placeholder.username')"
                                  outlined
                                  dense
                                />
                              </div>
                              <div class="col-12 col-sm-6">
                                <q-input
                                  v-model="proxyPassword"
                                  type="password"
                                  :label="$t('settingPage.proxy.password')"
                                  :placeholder="$t('settingPage.proxy.placeholder.password')"
                                  outlined
                                  dense
                                />
                              </div>
                            </div>
                          </q-card-section>
                        </q-card>
                      </q-expansion-item>
                    </div>

                    <!-- 操作按钮 -->
                    <div class="col-12">
                      <div class="row justify-end q-gutter-sm">
                        <q-btn
                          :label="$t('settingPage.proxy.testConnection')"
                          color="secondary"
                          :disable="!proxyEnabled || !isValidProxy"
                          @click="testProxyConnection"
                          flat
                        />
                        <q-btn
                          :label="$t('settingPage.proxy.save')"
                          color="primary"
                          :disable="!isValidProxy"
                          @click="saveProxySettings"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>

          <!-- AI 设置面板 -->
          <q-tab-panel name="ai" class="q-pa-md">
            <div class="panel-content">
              <div class="text-h6 q-mb-md">{{ $t('settingPage.ai.title') }}</div>
              <div class="text-caption q-mb-lg">{{ $t('settingPage.ai.description') }}</div>
              
              <q-card flat bordered class="ai-settings">
                <q-card-section>
                  <div class="row q-col-gutter-md">
                    <!-- 启用 AI 开关 -->
                    <div class="col-12">
                      <q-toggle
                        v-model="aiEnabled"
                        :label="$t('settingPage.ai.enable')"
                        color="primary"
                      />
                    </div>

                    <!-- AI 模型选择 -->
                    <div class="col-12">
                      <q-select
                        v-model="aiModel"
                        :options="['gpt-3.5-turbo', 'gpt-4']"
                        :label="$t('settingPage.ai.model')"
                        :disable="!aiEnabled"
                        outlined
                        dense
                      />
                    </div>

                    <!-- API Key -->
                    <div class="col-12">
                      <q-input
                        v-model="apiKey"
                        :label="$t('settingPage.ai.apiKey')"
                        :placeholder="$t('settingPage.ai.placeholder.apiKey')"
                        :disable="!aiEnabled"
                        type="password"
                        outlined
                        dense
                      />
                    </div>

                    <!-- Base URL -->
                    <div class="col-12">
                      <q-input
                        v-model="baseUrl"
                        :label="$t('settingPage.ai.baseUrl')"
                        :placeholder="$t('settingPage.ai.placeholder.baseUrl')"
                        :disable="!aiEnabled"
                        outlined
                        dense
                      />
                    </div>

                    <!-- 参数设置 -->
                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="temperature"
                        type="number"
                        :label="$t('settingPage.ai.temperature')"
                        :placeholder="$t('settingPage.ai.placeholder.temperature')"
                        :disable="!aiEnabled"
                        :min="0"
                        :max="2"
                        :step="0.1"
                        outlined
                        dense
                      />
                    </div>

                    <div class="col-12 col-sm-6">
                      <q-input
                        v-model.number="maxTokens"
                        type="number"
                        :label="$t('settingPage.ai.maxTokens')"
                        :placeholder="$t('settingPage.ai.placeholder.maxTokens')"
                        :disable="!aiEnabled"
                        :min="100"
                        :max="4000"
                        outlined
                        dense
                      />
                    </div>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="row justify-end q-gutter-sm q-mt-md">
                    <q-btn
                      :label="$t('settingPage.ai.testConnection')"
                      color="primary"
                      :disable="!aiEnabled"
                      @click="testAIConnection"
                    />
                    <q-btn
                      :label="$t('settingPage.ai.save')"
                      color="primary"
                      :disable="!aiEnabled"
                      @click="saveAISettings"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted, computed, getCurrentInstance } from 'vue'
import useStore from '@/stores'
import { useQuasar } from 'quasar'
import { chatCompletion } from '@/utils/api'
import i18n from '@/locales/i18config'

const { proxy } = getCurrentInstance() as any
const $q = useQuasar()
const tab = ref('language')
const splitterModel = ref(20)
const store = useStore()
const currentTheme = ref(store.top.theme)
const fontSize = ref(store.top.fontSize || 14)

onMounted(() => {
  let lan = localStorage.getItem('lan') || i18n.global.locale.value || 'cn'
  // 兼容label显示
  if (!['cn', 'jp'].includes(lan)) lan = 'cn'
  model.value = lan
  $q.dark.set(currentTheme.value === 'dark')
  document.documentElement.style.fontSize = `${fontSize.value}px`
})

const model = ref('')
const options = reactive([
  {
    label: '中文',
    value: 'cn',
  },
  {
    label: '日本語',
    value: 'jp',
  },
])

watch(model, async (newLan) => {
  localStorage.setItem('lan', newLan)
  i18n.global.locale.value = newLan as 'cn' | 'jp'
})
// 主题
const changeTheme = (theme: string) => {
  store.top.setTheme(theme as 'light' | 'dark')
  $q.dark.set(theme === 'dark')
}
// 字体大小
const changeFontSize = (size: number | null) => {
  if (size == null) return
  store.top.setFontSize(size)
  document.documentElement.style.fontSize = `${size}px`
}

// 代理设置相关
const proxyEnabled = ref(store.top.proxy.enabled)
const proxyHost = ref(store.top.proxy.host)
const proxyPort = ref(store.top.proxy.port)
const proxyUsername = ref(store.top.proxy.username)
const proxyPassword = ref(store.top.proxy.password)
const proxyProtocol = ref(store.top.proxy.protocol)

// 验证代理配置是否有效
const isValidProxy = computed(() => {
  if (!proxyEnabled.value) return true
  return proxyHost.value && proxyPort.value
})

// 保存代理设置
const saveProxySettings = () => {
  store.top.setProxy({
    enabled: proxyEnabled.value,
    protocol: proxyProtocol.value,
    host: proxyHost.value,
    port: proxyPort.value,
    username: proxyUsername.value,
    password: proxyPassword.value
  })
  
  $q.notify({
    type: 'positive',
    message: proxy.$t('settingPage.proxy.notification.saved')
  })
}

// 定义标签页配置
const tabItems = [
  { name: 'language', icon: 'language', label: 'language' },
  { name: 'theme', icon: 'palette', label: 'theme.title' },
  { name: 'font', icon: 'format_size', label: 'font.title' },
  { name: 'proxy', icon: 'dns', label: 'proxy.title' },
  { name: 'ai', icon: 'smart_toy', label: 'ai.title' }
]

// AI 设置
const aiEnabled = ref(store.top.aiConfig.enabled)
const aiModel = ref(store.top.aiConfig.model)
const apiKey = ref(store.top.aiConfig.apiKey)
const baseUrl = ref(store.top.aiConfig.baseUrl)
const temperature = ref(store.top.aiConfig.temperature)
const maxTokens = ref(store.top.aiConfig.maxTokens)

// 保存 AI 设置
const saveAISettings = () => {
  store.top.setAIConfig({
    enabled: aiEnabled.value,
    apiKey: apiKey.value,
    baseUrl: baseUrl.value,
    model: aiModel.value,
    temperature: temperature.value,
    maxTokens: maxTokens.value
  })
  
  $q.notify({
    type: 'positive',
    message: proxy.$t('settingPage.ai.notification.saved')
  })
}

// 测试 AI 连接
const testAIConnection = async () => {
  try {
    const response = await chatCompletion([
      { role: 'user', content: 'Hello' }
    ])
    if (response.data.choices?.length > 0) {
      $q.notify({
        type: 'positive',
        message: proxy.$t('settingPage.ai.notification.testSuccess')
      })
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('settingPage.ai.notification.testFailed')
    })
  }
}

const testProxyConnection = async () => {
  $q.dialog({
    title: '测试代理',
    message: '请输入要测试的网址（如 https://www.google.com ）',
    prompt: {
      model: '',
      type: 'text'
    },
    cancel: true,
    persistent: true
  }).onOk(async (url) => {
    if (!url) {
      $q.notify({ type: 'warning', message: '请输入网址' })
      return
    }
    try {
      const result = await window.electron?.ipcRenderer.invoke('test-proxy-request', {
        protocol: proxyProtocol.value,
        host: proxyHost.value,
        port: proxyPort.value,
        username: proxyUsername.value,
        password: proxyPassword.value
      }, url)
      if (result.success) {
        $q.notify({ type: 'positive', message: '请求成功，状态码：' + result.status })
      } else {
        $q.notify({ type: 'negative', message: '请求失败: ' + result.message })
      }
    } catch (e) {
      $q.notify({ type: 'negative', message: '请求异常: ' + e })
    }
  })
}
</script>

<style scoped>
.setting_base {
  min-height: 400px;
  background: var(--q-grey-1);
}

.settings-splitter {
  height: 100vh;
  min-width: 800px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

.settings-tabs {
  height: 100%;
  min-width: 200px;
  background: var(--q-grey-2);
  border-right: 1px solid var(--q-separator-color);
  padding-top: 8px;
}

:deep(.q-tabs__content) {
  height: auto;
}

:deep(.q-tab__content) {
  min-width: 100%;
  flex-direction: row;
  justify-content: flex-start;
}

.settings-panels {
  height: 100%;
  min-width: 580px;
  background: white;
}

.panel-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px 24px;
}

.panel-content .text-h6 {
  display: flex;
  align-items: center;
  padding-bottom: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--q-separator-color);
}

.panel-content .text-caption {
  color: var(--q-text-secondary);
  margin-bottom: 24px;
}

.language-select {
  max-width: 300px;
}

.theme-toggle {
  min-width: 200px;
}

.font-slider {
  max-width: 400px;
}

.preview-section {
  border: 1px solid var(--q-separator-color);
  border-radius: 8px;
  background: var(--q-card-color);
  margin-top: 16px;
}

.preview-text {
  line-height: 1.5;
}

.preview-title {
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 8px;
}

.preview-body {
  color: var(--q-text-secondary);
}

.q-tab {
  transition: all 0.3s ease;
  min-height: 48px;
  width: 100%;
  padding-left: 24px;
}

.q-tab__icon {
  margin-right: 12px;
  font-size: 20px;
}

.q-tab__label {
  font-size: 14px;
}

.active-tab {
  color: var(--q-primary);
  background: white;
  font-weight: 500;
}

/* 深色模式适配 */
.body--dark {
  .setting_base {
    background: var(--q-dark);
  }
  
  .settings-splitter {
    background: #1d1d1d;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  }
  
  .settings-panels {
    background: #1d1d1d;
  }
  
  .settings-tabs {
    background: #1d1d1d;
    border-right-color: rgba(255, 255, 255, 0.1);
  }
  
  .active-tab {
    background: #2d2d2d;
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .settings-splitter {
    min-width: 100%;
    border-radius: 0;
    box-shadow: none;
    height: calc(100vh - 50px);
  }

  .panel-content {
    padding: 16px;
  }
}

.proxy-settings {
  max-width: 600px;
}

.proxy-settings .q-expansion-item {
  border: 1px solid var(--q-separator-color);
  border-radius: 4px;
  margin-top: 8px;
}

/* 深色模式适配 */
.body--dark .proxy-settings {
  background: #1d1d1d;
}
</style>