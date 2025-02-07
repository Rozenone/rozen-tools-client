import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => ({
    top: {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      toggleLeftDrawer() {
        this.leftDrawerOpen = !this.leftDrawerOpen
      },
      toggleRightDrawer() {
        this.rightDrawerOpen = !this.rightDrawerOpen
      }
    }
  })
})

export default useStore