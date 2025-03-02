<!-- 主要top画面 -->
<template>
  <div class="setting_base">
    <q-splitter
      v-model="splitterModel"
      :limits="[15, 40]" 
      class="settings-splitter"
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
              <div class="q-mt-sm">
                <span class="restartTip" v-if="!changeFlg">{{ $t('settingPage.restartTip') }}</span>
              </div>
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

                    <!-- 代理主机和端口 -->
                    <div class="col-12 col-sm-8">
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
                          label="保存"
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
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted, computed, getCurrentInstance } from 'vue'
import useStore from '@/stores'
import { useQuasar } from 'quasar'
import { testProxy } from '@/utils/api'
const { proxy } = getCurrentInstance()
const $q = useQuasar()
const tab = ref('language')
const splitterModel = ref(20)
const store = useStore()
const currentTheme = ref(store.top.theme)
const fontSize = ref(store.top.fontSize || 14)

onMounted(() => {
  const lan = localStorage.getItem('lan')
  model.value = lan
  initLan.value = lan
  $q.dark.set(currentTheme.value === 'dark')
  // 应用保存的字体大小
  document.documentElement.style.fontSize = `${fontSize.value}px`
})
const changeFlg = ref(false)
const initLan = ref('')

const model = ref('中文')
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
  changeFlg.value = initLan.value === newLan;
})

const changeTheme = (theme: string) => {
  store.top.setTheme(theme as 'light' | 'dark')
  $q.dark.set(theme === 'dark')
}

const changeFontSize = (size: number) => {
  store.top.setFontSize(size)
  document.documentElement.style.fontSize = `${size}px`
}

// 代理设置相关
const proxyEnabled = ref(store.top.proxy.enabled)
const proxyHost = ref(store.top.proxy.host)
const proxyPort = ref(store.top.proxy.port)
const proxyUsername = ref(store.top.proxy.username)
const proxyPassword = ref(store.top.proxy.password)

// 验证代理配置是否有效
const isValidProxy = computed(() => {
  if (!proxyEnabled.value) return true
  return proxyHost.value && proxyPort.value
})

// 保存代理设置
const saveProxySettings = () => {
  store.top.setProxy({
    enabled: proxyEnabled.value,
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

// 测试代理连接
const testProxyConnection = async () => {
  try {
    const response = await testProxy()
    if (response.ip) {
      $q.notify({
        type: 'positive',
        message: proxy.$t('settingPage.proxy.notification.testSuccess')
      })
    } else {
      throw new Error('Proxy test failed')
    }
  } catch {
    $q.notify({
      type: 'negative',
      message: proxy.$t('settingPage.proxy.notification.testFailed')
    })
  }
}

// 定义标签页配置
const tabItems = [
  { name: 'language', icon: 'language', label: 'language' },
  { name: 'theme', icon: 'palette', label: 'theme.title' },
  { name: 'font', icon: 'format_size', label: 'font.title' },
  { name: 'proxy', icon: 'dns', label: 'proxy.title' }
]

</script>

<style scoped>
.setting_base {
  height: 100%;
  min-height: 400px;
}

.settings-splitter {
  height: 100%;
  min-width: 600px; /* 设置最小宽度 */
}

.settings-tabs {
  height: 100%;
  min-width: 120px; /* 设置标签栏最小宽度 */
}

.settings-panels {
  height: 100%;
  min-width: 400px; /* 设置内容区最小宽度 */
}

.panel-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
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

.restartTip {
  color: var(--q-negative);
  font-size: 0.9em;
}

.active-tab {
  color: var(--q-primary);
  background: rgba(var(--q-primary-rgb), 0.1);
}

.q-tab {
  transition: all 0.3s ease;
  min-height: 48px;
}

.q-tab:hover {
  background: rgba(var(--q-primary-rgb), 0.05);
}

/* 深色模式适配 */
.body--dark {
  .preview-section {
    background: #1d1d1d;
  }
  
  .preview-body {
    color: var(--q-text-dark);
  }
}

/* 响应式布局 */
@media (max-width: 768px) {
  .settings-splitter {
    min-width: 100%;
  }

  .panel-content {
    padding: 0 8px;
  }

  .preview-section {
    margin-top: 8px;
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