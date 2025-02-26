import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => ({
    top: {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      theme: 'light' as 'light' | 'dark',
      fontSize: 14,
      toggleLeftDrawer() {
        this.leftDrawerOpen = !this.leftDrawerOpen
      },
      toggleRightDrawer() {
        this.rightDrawerOpen = !this.rightDrawerOpen
      },
      setTheme(theme: 'light' | 'dark') {
        this.theme = theme
      },
      setFontSize(size: number) {
        this.fontSize = size
      }
    }
  }),
  persist: true
})

export default useStore