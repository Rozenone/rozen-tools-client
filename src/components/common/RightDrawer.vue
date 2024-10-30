<!-- 右侧栏 -->
<template>
  <q-drawer v-model="topStore.rightDrawerOpen" side="right" overlay>
    <!-- drawer content -->
  </q-drawer>
</template>

<script setup lang='ts'>
import useStore from '@/stores';
const topStore = useStore().top;
</script>




<style scoped></style>