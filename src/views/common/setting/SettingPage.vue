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

onMounted(() => {
  const lan = localStorage.getItem('lan')
  model.value = lan
  initLan.value = lan
  $q.dark.set(currentTheme.value === 'dark')
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

// 定义标签页配置
const tabItems = [
  { name: 'language', icon: 'language', label: 'language' },
  { name: 'theme', icon: 'palette', label: 'theme.title' }
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
</style>