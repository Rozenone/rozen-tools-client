<!-- 主要top画面 -->
<template>
  <div class="setting_base">
    <q-splitter
      v-model="splitterModel"
    >

      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-teal"
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
        >
          <q-tab-panel name="language">
            {{ $t('settingPage.language') }}
            <q-select color="purple-12"
                      v-model="model"
                      filled
                      :options="options"
                      :label="$t('settingPage.name')"
                      emit-value
                      map-options>
              <template v-slot:prepend>
                <q-icon name="language" />
              </template>
            </q-select>
            <span class="restartTip" v-if="!changeFlg">{{ $t('settingPage.restartTip') }}</span>
          </q-tab-panel>
          <q-tab-panel name="theme">
            {{ $t('settingPage.theme.title') }}
            <q-btn-toggle
              v-model="currentTheme"
              :options="[
                { label: $t('settingPage.theme.light'), value: 'light' },
                { label: $t('settingPage.theme.dark'), value: 'dark' }
              ]"
              spread
              color="primary"
              @update:model-value="changeTheme"
            />
          </q-tab-panel>
          <q-tab-panel name="font">
            <div class="text-h6 q-mb-md">{{ $t('settingPage.font.title') }}</div>
            <div class="row q-col-gutter-md">
              <!-- 字体大小滑块 -->
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
                />
              </div>
              
              <!-- 预览区域 -->
              <div class="col-12 preview-section q-pa-md">
                <div class="text-subtitle2 q-mb-md">{{ $t('settingPage.font.preview') }}</div>
                <div class="preview-text">
                  <div>{{ $t('settingPage.font.previewTitle') }}</div>
                  <div>{{ $t('settingPage.font.previewText') }}</div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted } from 'vue'
import useStore from '@/stores'
import { useQuasar } from 'quasar'

const tab = ref('language')
const splitterModel = ref(20)
const $q = useQuasar()
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

// 定义标签页配置
const tabItems = [
  { name: 'language', icon: 'language', label: 'language' },
  { name: 'theme', icon: 'palette', label: 'theme.title' },
  { name: 'font', icon: 'format_size', label: 'font.title' }
]

</script>

<style scoped>
.restartTip {
  color: red;
}

.active-tab {
  color: var(--q-primary);
  background: rgba(var(--q-primary-rgb), 0.1);
}

.q-tab {
  transition: all 0.3s ease;
}

.q-tab:hover {
  background: rgba(var(--q-primary-rgb), 0.05);
}

.preview-section {
  border: 1px solid var(--q-separator-color);
  border-radius: 8px;
  background: var(--q-card-color);
}

.preview-text {
  line-height: 1.5;
}

/* 深色模式适配 */
.body--dark .preview-section {
  background: #1d1d1d;
}
</style>