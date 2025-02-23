<!-- 右侧栏 -->
<template>
  <q-drawer v-model="topStore.rightDrawerOpen" side="right" overlay>
    <q-list bordered padding>
      <q-item-label header>{{ $t('rightDrawer.clientSetting') }}</q-item-label>
      <q-item clickable v-ripple v-for="item in settingData" :key="item.title">
        <q-item-section @click="router.push(item.url)">
          <q-item-label>{{ $t(`rightDrawer.${item.title}`) }}</q-item-label>
          <q-item-label caption>
            {{ $t(`rightDrawer.${item.caption}`) }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang='ts'>
import useStore from '@/stores'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const topStore = useStore().top
const router = useRouter()

const settingData = reactive([
    {
      title: 'control',
      caption: 'personalOption',
      url: '/common/settings',
    },
])


</script>


<style scoped></style>