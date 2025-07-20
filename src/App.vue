<template>
  <q-layout view="hHh lpR fFf">
      <HeaderBar />
      <RighDrawer />
      <LeftDrawer />
      <q-page-container>
        <router-view />
      </q-page-container>
  </q-layout>
</template>

<script setup lang='ts'>
import HeaderBar from '@/components/common/HeaderBar/HeaderBar.vue'
import RighDrawer from '@/components/common/RightDrawer/RightDrawer.vue'
import LeftDrawer from '@/components/common/LeftDrawer/LeftDrawer.vue'
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'
import useStore from '@/stores'

const $q = useQuasar()
const store = useStore()

onMounted(() => {
  // 初始化主题
  $q.dark.set(store.top.theme === 'dark')
})
</script>

<style>
body {
  overflow: hidden;
}

.q-page-container {
  height: 100vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #bbb #f5f5f5;
}

.q-page-container::-webkit-scrollbar {
  width: 8px;
  background: #f5f5f5;
}
.q-page-container::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 4px;
}
.q-page-container::-webkit-scrollbar-thumb:hover {
  background: #888;
}

/* 深色模式适配 */
.body--dark .q-page-container {
  scrollbar-color: #444 #222;
}
.body--dark .q-page-container::-webkit-scrollbar {
  background: #222;
}
.body--dark .q-page-container::-webkit-scrollbar-thumb {
  background: #444;
}
.body--dark .q-page-container::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>