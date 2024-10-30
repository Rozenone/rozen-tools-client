<template>
  <q-layout view="hHh lpR fFf">
    <HeaderBar />
    <RighDrawer />
    <LeftDrawer />
    <q-page-container>
      <router-view />
    </q-page-container>
    <FooterBar />
  </q-layout>
</template>

<script setup lang='ts'>
import HeaderBar from '@/components/common/HeaderBar.vue';
import RighDrawer from '@/components/common/RightDrawer.vue';
import LeftDrawer from '@/components/common/LeftDrawer.vue';
import FooterBar from '@/components/common/FooterBar.vue';
</script>