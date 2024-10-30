<!-- 页头 -->
<template>
    <div>
        <q-header reveal bordered class=" bg-primary text-white" height-hint="98">
            <q-bar class="bg-black text-white drag">
                <div class="cursor-pointer">File</div>
                <div class="cursor-pointer">Edit</div>
                <div class="cursor-pointer gt-xs">View</div>
                <div class="cursor-pointer gt-xs">Window</div>
                <div class="cursor-pointer">Help</div>
                <q-space />
                <q-btn @click="minWindow" class="no-drag" dense flat icon="minimize" />
                <q-btn @click="maxWindow" class="no-drag" dense flat icon="crop_square" />
                <q-btn @click="closeWindow" class="no-drag" dense flat icon="close" />
            </q-bar>
            <q-toolbar>
                <q-btn dense flat round icon="menu_open" @click="toggleLeftDrawer" />
                <q-btn dense flat round icon="brightness_5" @click="toggleRightDrawer" />
            </q-toolbar>

            <q-tabs align="left">
                <q-route-tab to="/" :label=" $t('comm.page1') " />
            </q-tabs>
        </q-header>
    </div>
</template>

<script setup lang='ts'>
import useStore from '@/stores';
const topStore = useStore().top;

/**
 * 控制左侧窗口
 */
const toggleLeftDrawer = () => {
    topStore.toggleLeftDrawer();
};

/**
 * 右侧窗口
 */
const toggleRightDrawer = () => {
    topStore.toggleRightDrawer();
}

/**
 * 关闭窗口
 */
const closeWindow = () => {
    window.ipcCommon.closeWindow();
}

/**
 * 缩小窗口
 */
const minWindow = () => {
    window.ipcCommon.minWindow();
}

/**
 * 窗口最大化
 */
const maxWindow = () => {
    window.ipcCommon.maxWindow();
}
</script>




<style scoped>
.drag {
    /* 可拖拽区域 */
    -webkit-app-region: drag;
}

.no-drag {
    -webkit-app-region: no-drag;
}
</style>