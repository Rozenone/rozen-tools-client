<!-- 主要top画面 -->
<template>
  <div class="top_menu_base">
    <q-card class="top_card" @click="router.push(item.url)" v-for="item in initData">
      <q-card-section>
        <q-img class="tool_img" :src="getImageUrl(item.img)"/>
        {{ $t(`homePage.${item.title}`) }}
      </q-card-section>
    </q-card>

  </div>
</template>

<script setup lang='ts'>
import { reactive  } from "vue";
import { useRouter } from "vue-router";
import { getImageUrl } from "@/utils/CommUtils";

const router = useRouter();

// 数据初始化
const initData = reactive([
  {
    title: 'json',
    img: 'json.svg',
    url: '/json_format'
  },
  {
    title: 'regx',
    img: 'regx.svg',
    url: '/regx_check'
  }
])
</script>

<style scoped>
.top_menu_base {
  float: left;
  width: 100%;
  min-width: 600px;
}

.top_card {
  width: 31%;
  margin: .5em .5em 0 0;
  display: inline-block;
}

.top_card:hover {
  background-color: #eee;
  cursor: pointer;
}

.top_card .tool_img{
  width: 30px;
  height: 30px;
  margin-right: 10px;
}
</style>