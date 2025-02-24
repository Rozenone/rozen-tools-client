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