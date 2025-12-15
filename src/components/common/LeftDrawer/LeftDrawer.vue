<!-- 左侧栏 -->
<template>
  <q-drawer v-model="topStore.leftDrawerOpen" side="left" bordered>
    <!-- 作者信息区域 -->
    <div class="author-section q-pa-md column items-center">
      <q-avatar size="100px" class="q-mb-sm">
        <img :src="defaultAvatar" alt="Author">
      </q-avatar>
      <div class="text-h6 q-mb-xs">Rozenone</div>
      <div class="text-subtitle2 text-grey">{{ $t('leftDrawer.authorDesc') }}</div>

      <!-- 社交链接 -->
      <div class="social-links q-mt-md">
        <q-btn flat round color="primary" icon="fab fa-github" @click="openUrl('https://github.com/Rozenone')">
          <q-tooltip>Github</q-tooltip>
        </q-btn>
        <q-btn flat round color="pink" icon="fab fa-bilibili" @click="openUrl('https://space.bilibili.com/37662911')">
          <q-tooltip>Bilibili</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-separator />

    <!-- 导航菜单 -->
    <q-list padding>
      <q-item clickable v-ripple to="/" exact>
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>
          {{ $t('leftDrawer.home') }}
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple to="/documentation">
        <q-item-section avatar>
          <q-icon name="description" />
        </q-item-section>
        <q-item-section>
          {{ $t('leftDrawer.documentation') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import useStore from '@/stores'
import profile from '@/assets/img/avatar/profile.jpg'
import { useQuasar } from 'quasar'

const topStore = useStore().top
const defaultAvatar = profile
const $q = useQuasar()

// 打开外部链接
const openUrl = async (url: string) => {
  // 如果在 Electron 环境中，使用 shell.openExternal
  if (window.electron?.ipcRenderer) {
    try {
      await window.electron.ipcRenderer.invoke('open-external-url', url)
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: '打开链接失败: ' + (error instanceof Error ? error.message : '未知错误')
      })
    }
  } else {
    // 在浏览器环境中，直接打开
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.author-section {
  background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary) 100%);
  color: white;
  padding: 20px;
}

.social-links {
  display: flex;
  gap: 8px;
}

.social-links .q-btn {
  background: rgba(255, 255, 255, 0.2);
}

.social-links .q-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.q-item {
  border-radius: 8px;
  margin: 4px 8px;
}

.q-item.q-router-link--active {
  background: var(--q-primary);
  color: white;
}
</style>