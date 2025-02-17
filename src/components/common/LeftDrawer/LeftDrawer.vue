<!-- 左侧栏 -->
<template>
  <q-drawer v-model="topStore.leftDrawerOpen" side="left" bordered>
    <q-list>
      <!-- 抽屉内容 -->
      <q-item v-ripple>
        <q-item-section>
          {{ $t('headerBar.page1') }}
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import useStore from '@/stores'

const topStore = useStore().top
</script>

<style scoped></style>