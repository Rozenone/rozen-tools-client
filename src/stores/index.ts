import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => ({
    top: {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      theme: 'light' as 'light' | 'dark',
      toggleLeftDrawer() {
        this.leftDrawerOpen = !this.leftDrawerOpen
      },
      toggleRightDrawer() {
        this.rightDrawerOpen = !this.rightDrawerOpen
      },
      setTheme(theme: 'light' | 'dark') {
        this.theme = theme
      }
    }
  }),
  persist: true
})

export default useStore