<!-- 主要top画面 -->
<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <draggable v-model="sortedToolItems" item-key="title" class="row q-col-gutter-md w-full" @end="onDragEnd">
        <template #item="{ element }">
          <div class="col-12 col-sm-6 col-md-4">
            <q-card class="tool-card" @click="router.push(element.url)">
              <q-card-section class="row items-center">
                <div class="col-auto">
                  <q-img :src="getImageUrl(element.img)" spinner-color="primary" style="height: 40px; width: 40px" />
                </div>
                <div class="col q-ml-md">
                  <div class="text-h6">{{ $t(`homePage.${element.title}`) }}</div>
                  <div class="text-subtitle2 text-grey-7">
                    {{ $t(`homePage.${element.title}Description`) }}
                  </div>
                </div>
                <div class="col-auto">
                  <q-btn flat round dense :icon="toolStore.isFavorite(element.title) ? 'star' : 'star_border'"
                    :color="toolStore.isFavorite(element.title) ? 'amber' : 'grey'"
                    @click.stop="toolStore.toggleFavorite(element.title)">
                    <q-tooltip>{{ toolStore.isFavorite(element.title) ? $t('homePage.unfavorite') :
                      $t('homePage.favorite') }}</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import draggable from 'vuedraggable'
import { getImageUrl } from "@/utils/CommUtils"
import useToolStore from "@/stores/toolStore"

const router = useRouter()
const toolStore = useToolStore()

interface ToolItem {
  title: string
  img: string
  url: string
}

const defaultToolItems: ToolItem[] = [
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

// 根据 store 中的排序和收藏状态计算排序后的工具列表
const sortedToolItems = ref<ToolItem[]>([])

const computeSortedItems = () => {
  // 按 toolOrder 排序
  const orderedItems = [...defaultToolItems].sort((a, b) => {
    const indexA = toolStore.toolOrder.indexOf(a.title)
    const indexB = toolStore.toolOrder.indexOf(b.title)
    // 如果不在 order 中，放到最后
    const orderA = indexA === -1 ? Infinity : indexA
    const orderB = indexB === -1 ? Infinity : indexB
    return orderA - orderB
  })

  // 收藏的排在前面
  const favorites = orderedItems.filter(item => toolStore.isFavorite(item.title))
  const nonFavorites = orderedItems.filter(item => !toolStore.isFavorite(item.title))

  return [...favorites, ...nonFavorites]
}

// 初始化
onMounted(() => {
  const defaultTitles = defaultToolItems.map(item => item.title)
  toolStore.initOrder(defaultTitles)
  sortedToolItems.value = computeSortedItems()
})

// 监听收藏变化，重新排序
watch(() => toolStore.favorites, () => {
  sortedToolItems.value = computeSortedItems()
}, { deep: true })

// 拖拽结束保存新排序
const onDragEnd = () => {
  const newOrder = sortedToolItems.value.map(item => item.title)
  toolStore.updateOrder(newOrder)
}
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