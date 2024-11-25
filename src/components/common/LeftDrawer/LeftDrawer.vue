<!-- 左侧栏 -->
<template>
  <q-drawer v-model="topStore.leftDrawerOpen" side="left" behavior="desktop" elevated>
    <!-- drawer content -->
  </q-drawer>
</template>

<script setup lang='ts'>
import useStore from '@/stores';
import { useRouter } from 'vue-router'
const topStore = useStore().top;
const router = useRouter();

</script>




<style scoped></style>