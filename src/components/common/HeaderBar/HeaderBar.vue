<!-- 页头 -->
<template>
  <div>
    <q-header reveal bordered :class="[
      isWindows ? 'windows-header' : 'mac-header',
      store.top.theme === 'dark' ? 'bg-dark' : 'bg-primary'
    ]">
      <!-- Windows 风格标题栏 -->
      <q-bar v-if="isWindows" :class="store.top.theme === 'dark' ? 'bg-dark' : 'bg-primary'" class="text-white window-drag">
        <div class="app-title">
          <span class="brand-name">Rozen</span>
          <span class="tool-name">Tools</span>
          <q-badge color="secondary" class="version-badge">v1.0</q-badge>
        </div>
        <q-space />
        <div class="window-controls">
          <q-btn @click="minWindow" flat dense icon="remove" class="window-button" />
          <q-btn @click="maxWindow" flat dense icon="crop_square" class="window-button" />
          <q-btn @click="closeWindow" flat dense icon="close" class="window-button close" />
        </div>
      </q-bar>

      <!-- macOS 风格标题栏 -->
      <q-bar v-else class="mac-titlebar window-drag" :class="store.top.theme === 'dark' ? 'bg-dark' : 'bg-primary'">
        <div class="mac-buttons">
          <div @click="closeWindow" class="mac-button close" />
          <div @click="minWindow" class="mac-button minimize" />
          <div @click="maxWindow" class="mac-button maximize" />
        </div>
        <div class="app-title">
          <span class="brand-name">Rozen</span>
          <span class="tool-name">Tools</span>
          <q-badge color="secondary" class="version-badge">v1.0</q-badge>
        </div>
      </q-bar>

      <!-- 通用工具栏 -->
      <q-toolbar>
        <q-btn dense flat round icon="menu_open" @click="toggleLeftDrawer" />
        <q-space />
        <q-btn 
          dense 
          flat 
          round 
          icon="smart_toy" 
          class="q-mr-sm"
          @click="openAIChat"
        >
          <q-tooltip>{{ $t('headerBar.aiChat') }}</q-tooltip>
        </q-btn>
        <q-btn dense flat round icon="brightness_5" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" :label="$t('headerBar.page1')" />
        <q-route-tab to="/documentation" :label="$t('headerBar.documentation')" />
        <q-route-tab to="/search" :label="$t('headerBar.search')" />
      </q-tabs>
    </q-header>
  </div>
</template>

<script setup lang="ts">
import useStore from "@/stores"
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const store = useStore()
const router = useRouter()
const isWindows = ref(false)

onMounted(() => {
  // 检测操作系统
  isWindows.value = navigator.platform.includes('Win')
})

const toggleLeftDrawer = () => {
  store.top.toggleLeftDrawer()
}

const toggleRightDrawer = () => {
  store.top.toggleRightDrawer()
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

const openAIChat = () => {
  router.push('/service/ai-chat')
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

.bg-dark {
  background: #1d1d1d !important;
}

.bg-dark .window-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bg-dark .window-button.close:hover {
  background: #e81123;
}

.app-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  padding: 0 12px;
}

.brand-name {
  font-weight: 700;
  font-size: 1.2em;
  background: linear-gradient(45deg, #00ff88, #00b4ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.tool-name {
  font-weight: 500;
  opacity: 0.9;
  font-size: 1.1em;
}

.version-badge {
  font-size: 0.7em;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 8px;
}

/* 深色主题适配 */
.bg-dark .brand-name {
  background: linear-gradient(45deg, #00ffaa, #00ffff);
  background-clip: text;
  -webkit-background-clip: text;
  text-shadow: 0 0 20px rgba(0, 255, 170, 0.4);
}

.bg-dark .tool-name {
  color: #e0e0e0;
}
</style>