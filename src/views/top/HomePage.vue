<!-- 主要top画面 -->
<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4" v-for="item in toolItems" :key="item.title">
        <q-card class="tool-card" @click="router.push(item.url)">
          <q-card-section class="row items-center">
            <div class="col-auto">
              <q-img
                :src="getImageUrl(item.img)"
                spinner-color="primary"
                style="height: 40px; width: 40px"
              />
            </div>
            <div class="col q-ml-md">
              <div class="text-h6">{{ $t(`homePage.${item.title}`) }}</div>
              <div class="text-subtitle2 text-grey-7">
                {{ $t(`homePage.${item.title}Description`) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { useRouter } from "vue-router"
import { getImageUrl } from "@/utils/CommUtils"

const router = useRouter()

interface ToolItem {
  title: string
  img: string
  url: string
}

const toolItems: ToolItem[] = reactive([
  {
    title: 'json',
    img: 'json.svg',
    url: '/service/json_format'
  },
  {
    title: 'regx',
    img: 'regx.svg',
    url: '/service/regex_format'
  },
  {
    title: 'uuid',
    img: 'restart.svg',
    url: '/service/uuid'
  },
  {
    title: 'encoding',
    img: 'encoding.svg',
    url: '/service/encoding'
  },
  {
    title: 'jwt',
    img: 'jwt.svg',
    url: '/service/jwt'
  },
  {
    title: 'csv_generate',
    img: 'csv.svg',
    url: '/service/csv/generate'
  },
  {
    title: 'plsql_plantuml',
    img: 'description',
    url: '/service/plsql/to-plantuml'
  }
])
</script>

<style scoped>
.tool-card {
  transition: all 0.3s;
  height: 100%;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.text-h6 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.text-subtitle2 {
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>