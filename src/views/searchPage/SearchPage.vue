<template>
    <div class="search-page full-height">
        <div class="text-h4 q-mb-lg q-pa-md">{{ $t('searchPage.title') }}</div>
        <div class="tools-grid q-pa-md">
            <div class="row q-col-gutter-lg">
                <div v-for="tool in tools" :key="tool.name" class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <q-card class="tool-card cursor-pointer" @click="navigateToTool(tool.route)">
                        <q-card-section class="text-center">
                            <div class="tool-icon q-mb-md">
                                <q-icon :name="tool.icon" size="4rem" :color="tool.color" />
                            </div>
                            <div class="text-h6 q-mb-sm">{{ tool.name }}</div>
                            <div class="text-caption text-grey-6">{{ tool.description }}</div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance() as any

const tools = ref([
    {
        name: proxy.$t('searchPage.tools.commonFileSearch.name'),
        description: proxy.$t('searchPage.tools.commonFileSearch.description'),
        icon: proxy.$t('searchPage.tools.commonFileSearch.icon'),
        color: proxy.$t('searchPage.tools.commonFileSearch.color'),
        route: proxy.$t('searchPage.tools.commonFileSearch.route')
    }
])

const navigateToTool = (route: string) => {
    router.push(route)
}
</script>

<style scoped>
.search-page {
    background: var(--q-grey-1);
}

.tools-grid {
    width: 100%;
}

.tool-card {
    height: 220px;
    transition: all 0.3s ease;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.tool-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tool-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
}

.text-h6.q-mb-sm {
    word-break: break-all;
    white-space: normal;
    max-width: 100%;
    font-size: 1.1rem;
    line-height: 1.3;
    margin-bottom: 8px;
}

.text-caption.text-grey-6 {
    word-break: break-all;
    white-space: normal;
    max-width: 100%;
    font-size: 0.95rem;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.body--dark .search-page {
    background: #1d1d1d;
}

.body--dark .tool-card {
    background: #2d2d2d;
    border: 1px solid #333;
}
</style>