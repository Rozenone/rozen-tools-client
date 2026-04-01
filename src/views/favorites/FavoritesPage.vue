<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">{{ $t('favoritesPage.title') }}</div>

    <!-- 有收藏时显示卡片列表 -->
    <div v-if="favoriteTools.length > 0" class="row q-col-gutter-md">
      <div v-for="tool in favoriteTools" :key="tool.title" class="col-12 col-sm-6 col-md-4">
        <q-card class="tool-card" @click="router.push(tool.url)">
          <q-card-section class="row items-center">
            <div class="col-auto">
              <q-img :src="getImageUrl(tool.img)" spinner-color="primary" style="height: 40px; width: 40px" />
            </div>
            <div class="col q-ml-md">
              <div class="text-h6">{{ $t(`homePage.${tool.title}`) }}</div>
              <div class="text-subtitle2 text-grey-7">
                {{ $t(`homePage.${tool.title}Description`) }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn flat round dense icon="star" color="amber" @click.stop="removeFavorite(tool.title)">
                <q-tooltip>{{ $t('favoritesPage.unfavorite') }}</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 无收藏时显示空状态 -->
    <div v-else class="empty-state flex flex-center column q-pa-xl">
      <q-icon name="star_border" size="80px" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">{{ $t('favoritesPage.emptyTitle') }}</div>
      <div class="text-body2 text-grey-5 q-mt-sm">{{ $t('favoritesPage.emptyDescription') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getImageUrl } from '@/utils/CommUtils'
import useToolStore from '@/stores/toolStore'

const router = useRouter()
const toolStore = useToolStore()

interface ToolItem {
  title: string
  img: string
  url: string
}

// 完整的工具定义映射（与 HomePage 中的 defaultToolItems 相同）
const allTools: ToolItem[] = [
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
    title: 'folder_tree',
    img: 'restart.svg',
    url: '/service/folder-tree'
  },
  {
    title: 'base64',
    img: 'encoding.svg',
    url: '/service/base64-parse'
  }
]

// 根据收藏列表获取对应的工具信息
const favoriteTools = computed(() => {
  return toolStore.favorites
    .map(title => allTools.find(tool => tool.title === title))
    .filter((tool): tool is ToolItem => tool !== undefined)
})

// 取消收藏
const removeFavorite = (title: string) => {
  toolStore.toggleFavorite(title)
}
</script>

<style scoped>
.tool-card {
  transition: all 0.3s;
  height: 100%;
  cursor: pointer;
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

.empty-state {
  min-height: 400px;
}

/* 深色主题适配 */
.body--dark .text-grey-7 {
  color: #9e9e9e !important;
}

.body--dark .text-grey-6 {
  color: #bdbdbd !important;
}

.body--dark .text-grey-5 {
  color: #e0e0e0 !important;
}
</style>
