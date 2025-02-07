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
        >
          <q-tab name="language" icon="language" :label="$t('settingPage.language')" />
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
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted } from 'vue'

const tab = ref('language')
const splitterModel = ref(20)

onMounted(() => {
  const lan = localStorage.getItem('lan')
  model.value = lan
  initLan.value = lan
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

</script>

<style scoped>
.restartTip {
  color: red;
}
</style>