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
</script>