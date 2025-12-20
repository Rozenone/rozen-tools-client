<template>
    <div class="folder-tree-page full-height">
        <div class="q-pa-md">
            <q-card class="tool-card q-mb-md">
                <q-card-section>
                    <div class="text-h6 q-mb-md">{{ $t('folderTree.title') }}</div>
                    <div class="row q-col-gutter-md">
                        <div class="col-12 col-md-8">
                            <q-input v-model="selectedFolderPath" :label="$t('folderTree.selectedFolder')" readonly
                                outlined dense>
                                <template v-slot:append>
                                    <q-btn icon="folder" flat dense :label="$t('folderTree.selectFolder')"
                                        @click="selectFolder" />
                                </template>
                            </q-input>
                        </div>
                        <div class="col-12 col-md-4">
                            <q-btn color="primary" :label="$t('folderTree.generateTree')" :disable="!selectedFolderPath"
                                :loading="loading" @click="generateTree" class="full-width" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>

            <q-card class="tool-card result-card">
                <q-card-section>
                    <div class="row items-center q-mb-md">
                        <div class="text-h6">{{ $t('folderTree.result') }}</div>
                        <q-space />
                        <q-btn v-if="treeData" color="primary" icon="content_copy" :label="$t('folderTree.copyAsText')"
                            @click="copyTreeAsText" outline />
                    </div>
                    <div v-if="treeData" class="tree-container">
                        <q-tree :nodes="treeNodes" node-key="path" default-expand-all :filter="treeFilter">
                            <template v-slot:default-header="prop">
                                <div class="row items-center full-width">
                                    <q-icon :name="prop.node.type === 'folder' ? 'folder' : 'description'"
                                        :color="prop.node.type === 'folder' ? 'primary' : 'grey'" size="20px"
                                        class="q-mr-sm" />
                                    <span class="text-weight-medium">{{ prop.node.name }}</span>
                                    <q-space />
                                    <span v-if="prop.node.type === 'file'" class="text-caption text-grey-6 q-mr-sm">
                                        {{ formatFileSize(prop.node.size) }}
                                    </span>
                                    <q-btn flat dense icon="open_in_new" :label="$t('folderTree.open')"
                                        @click.stop="openTarget(prop.node)" />
                                </div>
                            </template>
                        </q-tree>
                    </div>
                    <div v-else-if="!loading" class="text-center text-grey q-pa-xl">
                        {{ $t('folderTree.noTreeData') }}
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

const $q = useQuasar()
const { t } = useI18n()

interface TreeNode {
    name: string
    path: string
    type: 'file' | 'folder'
    children?: TreeNode[]
    size?: number
    modifiedTime?: string
}

const selectedFolderPath = ref('')
const treeData = ref<TreeNode | null>(null)
const loading = ref(false)
const treeFilter = ref('')

// 选择文件夹
const selectFolder = async () => {
    if (window.ipcCommon && window.ipcCommon.selectDirectory) {
        const path = await window.ipcCommon.selectDirectory()
        if (path) {
            selectedFolderPath.value = path
            treeData.value = null
        }
    }
}

// 生成文档树
const generateTree = async () => {
    if (!selectedFolderPath.value) return

    loading.value = true
    treeData.value = null

    try {
        if (window.ipcCommon && window.ipcCommon.generateFolderTree) {
            const result = await window.ipcCommon.generateFolderTree(selectedFolderPath.value)
            if (result.success && result.tree) {
                treeData.value = result.tree
            } else {
                $q.notify({
                    type: 'negative',
                    message: result.message || t('folderTree.generateFailed')
                })
            }
        }
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: error instanceof Error ? error.message : '未知错误'
        })
    } finally {
        loading.value = false
    }
}

// 打开文件或文件夹
const openTarget = async (node: TreeNode) => {
    if (!node || !node.path) return
    try {
        if (window.ipcCommon && window.ipcCommon.openPath) {
            const result = await window.ipcCommon.openPath(node.path)
            if (!result?.success) {
                $q.notify({
                    type: 'negative',
                    message: result?.message || t('folderTree.openFailed'),
                    position: 'top'
                })
            }
        }
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: error instanceof Error ? error.message : t('folderTree.openFailed'),
            position: 'top'
        })
    }
}

// 转换树节点格式供 q-tree 使用
const treeNodes = computed(() => {
    if (!treeData.value) return []

    const convertNode = (node: TreeNode): any => {
        const result: any = {
            label: node.name,
            name: node.name,
            path: node.path,
            type: node.type,
            size: node.size,
            modifiedTime: node.modifiedTime,
            icon: node.type === 'folder' ? 'folder' : 'description'
        }

        if (node.type === 'folder' && node.children && node.children.length > 0) {
            result.children = node.children.map(convertNode)
        } else if (node.type === 'folder') {
            result.children = []
        }

        return result
    }

    return [convertNode(treeData.value)]
})

// 格式化文件大小
const formatFileSize = (bytes?: number): string => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

// 将树形结构转换为文本格式
const treeToText = (node: TreeNode, prefix: string = '', isLast: boolean = true): string => {
    const connector = isLast ? '└── ' : '├── '
    const currentLine = prefix + connector + node.name

    let result = currentLine + '\n'

    if (node.type === 'folder' && node.children && node.children.length > 0) {
        const newPrefix = prefix + (isLast ? '    ' : '│   ')
        node.children.forEach((child, index) => {
            const isLastChild = index === node.children!.length - 1
            result += treeToText(child, newPrefix, isLastChild)
        })
    }

    return result
}

// 复制文档树为文本
const copyTreeAsText = async () => {
    if (!treeData.value) return

    try {
        const text = treeToText(treeData.value, '', true)

        // 使用 Clipboard API 复制文本
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text)
            $q.notify({
                type: 'positive',
                message: t('folderTree.copySuccess'),
                position: 'top'
            })
        } else {
            // 降级方案：使用传统的 execCommand
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)

            $q.notify({
                type: 'positive',
                message: t('folderTree.copySuccess'),
                position: 'top'
            })
        }
    } catch (error) {
        $q.notify({
            type: 'negative',
            message: error instanceof Error ? error.message : t('folderTree.copyFailed'),
            position: 'top'
        })
    }
}
</script>

<style scoped>
.folder-tree-page {
    background: var(--q-grey-1);
}

.tool-card {
    border-radius: 8px;
}

.tree-container {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    padding: 16px;
    background: white;
}

.body--dark .tree-container {
    border-color: rgba(255, 255, 255, 0.12);
    background: #2d2d2d;
}

.result-card {
    min-height: 400px;
}
</style>
