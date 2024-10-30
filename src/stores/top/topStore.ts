import { defineStore } from 'pinia'

const topStore = defineStore('top', {
    state: () => {
        return {
            leftDrawerOpen: false,
            rightDrawerOpen: true
        }
    },
    getters: {

    },
    actions: {
        toggleLeftDrawer() {
            this.leftDrawerOpen = !this.leftDrawerOpen
        },
        toggleRightDrawer ()  {
            this.rightDrawerOpen = !this.rightDrawerOpen
        }
    },
    persist: true
});

export default topStore;