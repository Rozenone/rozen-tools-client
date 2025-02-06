<template>
  <q-layout view="hHh lpR fFf" :class="{ 'body--dark': themeStore.isDark }">
    <HeaderBar />
    <RighDrawer />
    <LeftDrawer />
    <q-page-container class="page-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/common/HeaderBar/HeaderBar.vue'
import RighDrawer from '@/components/common/RightDrawer/RightDrawer.vue'
import LeftDrawer from '@/components/common/LeftDrawer/LeftDrawer.vue'
import { useThemeStore } from '@/stores/theme/themeStore'
import { onMounted } from 'vue'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.updateTheme()
})
</script>