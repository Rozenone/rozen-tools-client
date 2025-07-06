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
        <q-btn
          flat
          round
          color="primary"
          icon="fab fa-github"
          type="a"
          href="https://github.com/Rozenone"
          target="_blank"
        >
          <q-tooltip>Github</q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          color="pink"
          icon="fab fa-bilibili"
          type="a"
          href="https://space.bilibili.com/37662911"
          target="_blank"
        >
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

const topStore = useStore().top
const defaultAvatar = profile
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