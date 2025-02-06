<!-- 右侧栏 -->
<template>
  <q-drawer v-model="topStore.rightDrawerOpen" side="right" overlay bordered>
    <q-list>
      <q-item-label header>{{ $t('rightDrawer.clientSetting') }}</q-item-label>

      <!-- 主题设置 -->
      <q-expansion-item icon="palette" :label="$t('rightDrawer.themeSettings')" default-opened>
        <q-card>
          <q-card-section>
            <!-- 暗色模式开关 -->
            <q-item>
              <q-item-section>
                <q-item-label>{{ $t('rightDrawer.darkMode') }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle 
                  :model-value="themeStore.isDark"
                  @update:model-value="() => themeStore.toggleDarkMode()"
                />
              </q-item-section>
            </q-item>

            <!-- 主题色选择 -->
            <q-item>
              <q-item-section>
                <q-item-label>{{ $t('rightDrawer.primaryColor') }}</q-item-label>
                <q-color v-model="themeStore.primaryColor" @update:model-value="themeStore.setPrimaryColor" />
              </q-item-section>
            </q-item>

            <!-- 背景图片设置 -->
            <q-item>
              <q-item-section>
                <q-item-label>{{ $t('rightDrawer.backgroundImage') }}</q-item-label>
                <q-file v-model="backgroundFile" accept="image/*" @update:model-value="handleBackgroundImage"
                  :label="$t('rightDrawer.selectImage')">
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <!-- 其他设置 -->
      <q-item v-for="item in settingData" :key="item.title" clickable v-ripple @click="router.push(item.url)">
        <q-item-section>
          <q-item-label>{{ $t(`rightDrawer.${item.title}`) }}</q-item-label>
          <q-item-label caption>{{ $t(`rightDrawer.${item.caption}`) }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang='ts'>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/stores'
import { useThemeStore } from '@/stores/theme/themeStore'

const router = useRouter()
const topStore = useStore().top
const themeStore = useThemeStore()
const backgroundFile = ref(null)

const settingData = reactive([
  {
    title: 'control',
    caption: 'personalOption',
    url: '/common/settings',
  },
])

const handleBackgroundImage = async (file: File) => {
  if (!file) {
    themeStore.setBackgroundImage(null)
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    themeStore.setBackgroundImage(e.target?.result as string)
  }
  reader.readAsDataURL(file)
}

</script>


<style scoped>
.q-item {
  min-height: 48px;
}
</style>