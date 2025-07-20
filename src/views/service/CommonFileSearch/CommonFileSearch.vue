<template>
    <div class="common-file-search-page full-height">
        <div class="q-pa-md">
            <q-card class="tool-card q-mb-xl">
                <q-card-section>
                    <div class="text-h6 q-mb-md">{{ $t('commonFileSearch.setting') }}</div>
                    <q-btn color="primary"
                        :label="folderPath ? $t('commonFileSearch.selected') + folderPath : $t('commonFileSearch.selectFolder')"
                        @click="selectFolder" class="q-mb-md" />
                    <q-input v-model="targetFileName" :label="$t('commonFileSearch.inputFile')" outlined dense
                        class="q-mb-md" />
                    <q-btn color="primary" :label="$t('commonFileSearch.search')"
                        :disable="!folderPath || !targetFileName" @click="searchFiles" class="q-mt-md q-mb-md" />
                    <q-input v-model="searchText" :label="$t('commonFileSearch.findInput')" outlined dense
                        class="q-mb-md" />
                    <q-btn color="secondary" :label="$t('commonFileSearch.findBtn')" :disable="!searchText"
                        @click="filterResults" />
                </q-card-section>
            </q-card>
            <q-card class="tool-card result-card">
                <q-card-section>
                    <div class="text-h6 q-mb-md">{{ $t('commonFileSearch.result') }}</div>
                    <div v-if="filteredResults.length" class="result-list">
                        <q-list separator>
                            <q-item v-for="item in filteredResults" :key="item.folder" class="result-item">
                                <q-item-section>
                                    <div class="text-bold" v-html="highlightFolder(item.folder)"></div>
                                    <pre class="result-content" v-html="highlight(item.content)"></pre>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                    <div v-else-if="searched" class="text-grey">{{ $t('commonFileSearch.notFound') }}</div>
                    <div v-else class="text-grey">{{ $t('commonFileSearch.pleaseSet') }}</div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const folderPath = ref('')
const targetFileName = ref('')
const searchResults = ref<{ folder: string, content: string }[]>([])
const filteredResults = ref<{ folder: string, content: string }[]>([])
const searched = ref(false)
const searchText = ref('')

const selectFolder = async () => {
    if (window.ipcCommon && window.ipcCommon.selectDirectory) {
        const path = await window.ipcCommon.selectDirectory()
        if (path) folderPath.value = path
    }
}

const searchFiles = async () => {
    searchResults.value = []
    filteredResults.value = []
    searched.value = false
    if (!folderPath.value || !targetFileName.value) return
    if (window.ipcCommon && window.ipcCommon.searchCommonFilesInFolders) {
        const results = await window.ipcCommon.searchCommonFilesInFolders(folderPath.value, targetFileName.value)
        if (Array.isArray(results)) {
            searchResults.value = results
            filteredResults.value = results
        }
    }
    searched.value = true
}

const filterResults = () => {
    if (!searchText.value) {
        filteredResults.value = searchResults.value
        return
    }
    const keyword = searchText.value.toLowerCase()
    filteredResults.value = searchResults.value.filter(item =>
        item.content.toLowerCase().includes(keyword) ||
        item.folder.toLowerCase().includes(keyword)
    )
}

const highlight = (content: string) => {
    if (!searchText.value) return escapeHtml(content)
    const keyword = escapeRegExp(searchText.value)
    const reg = new RegExp(`(${keyword})`, 'gi')
    return escapeHtml(content).replace(reg, '<mark class="highlight">$1</mark>')
}

const highlightFolder = (folder: string) => {
    if (!searchText.value) return escapeHtml(folder)
    const keyword = escapeRegExp(searchText.value)
    const reg = new RegExp(`(${keyword})`, 'gi')
    return escapeHtml(folder).replace(reg, '<mark class="highlight">$1</mark>')
}

function escapeHtml(str: string) {
    return str.replace(/[&<>"]|'/g, function (tag) {
        const chars: any = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }
        return chars[tag] || tag
    })
}
function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
</script>

<style scoped>
.common-file-search-page {
    background: var(--q-grey-1);
    min-height: 100vh;
}

.tool-card {
    transition: all 0.3s ease;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}

.result-card {
    min-height: 260px;
}

.result-item {
    margin-bottom: 12px;
}

.result-content {
    background: #f4f4f4;
    border-radius: 4px;
    padding: 8px;
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-all;
    user-select: text;
    cursor: text;
}

.highlight,
mark.highlight {
    background: #ffe066 !important;
    color: #d35400 !important;
    font-weight: bold;
    padding: 0 2px;
    border-radius: 2px;
}

.body--dark .common-file-search-page {
    background: #1d1d1d;
}

.body--dark .tool-card {
    background: #2d2d2d;
    border: 1px solid #333;
}
</style>