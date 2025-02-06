<!-- 页头 -->
<template>
  <div>
    <q-header reveal bordered :class="[isWindows ? 'windows-header' : 'mac-header']">
      <!-- Windows 风格标题栏 -->
      <q-bar v-if="isWindows" class="bg-primary text-white window-drag">
        <div class="window-title">{{ $t('comm.appTitle') }}</div>
        <q-space />
        <div class="window-controls">
          <q-btn @click="minWindow" flat dense icon="remove" class="window-button" />
          <q-btn @click="maxWindow" flat dense icon="crop_square" class="window-button" />
          <q-btn @click="closeWindow" flat dense icon="close" class="window-button close" />
        </div>
      </q-bar>

      <!-- macOS 风格标题栏 -->
      <q-bar v-else class="mac-titlebar window-drag">
        <div class="mac-buttons">
          <div @click="closeWindow" class="mac-button close" />
          <div @click="minWindow" class="mac-button minimize" />
          <div @click="maxWindow" class="mac-button maximize" />
        </div>
        <div class="window-title">{{ $t('comm.appTitle') }}</div>
      </q-bar>

      <!-- 通用工具栏 -->
      <q-toolbar>
        <q-btn dense flat round icon="menu_open" @click="toggleLeftDrawer" />
        <q-space />
        <q-btn dense flat round icon="brightness_5" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" :label="$t('comm.page1')" />
      </q-tabs>
    </q-header>
  </div>
</template>

<script setup lang="ts">
import useStore from "@/stores"
import { ref, onMounted } from 'vue'

const topStore = useStore().top
const isWindows = ref(false)

onMounted(() => {
  // 检测操作系统
  isWindows.value = navigator.platform.includes('Win')
})

const toggleLeftDrawer = () => {
  topStore.toggleLeftDrawer()
}

const toggleRightDrawer = () => {
  topStore.toggleRightDrawer()
}

const closeWindow = () => {
  window.ipcCommon.closeWindow()
}

const minWindow = () => {
  window.ipcCommon.minWindow()
}

const maxWindow = () => {
  window.ipcCommon.maxWindow()
}
</script>

<style scoped>
/* 通用样式 */
.window-drag {
  -webkit-app-region: drag;
}

.window-title {
  font-size: 14px;
  margin-left: 12px;
}

/* Windows 风格样式 */
.windows-header .window-controls {
  -webkit-app-region: no-drag;
}

.windows-header .window-button {
  min-width: 46px;
  min-height: 32px;
}

.windows-header .window-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.windows-header .window-button.close:hover {
  background: #e81123;
}

/* macOS 风格样式 */
.mac-header .mac-titlebar {
  height: 28px;
  background: #323233;
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.mac-buttons {
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
}

.mac-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  cursor: pointer;
}

.mac-button.close {
  background: #ff5f56;
}

.mac-button.minimize {
  background: #ffbd2e;
}

.mac-button.maximize {
  background: #27c93f;
}

.mac-button:hover {
  filter: brightness(85%);
}
</style>