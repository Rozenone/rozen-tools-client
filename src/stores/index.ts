import { defineStore } from 'pinia'

const useStore = defineStore('main', {
  state: () => ({
    top: {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      theme: 'light' as 'light' | 'dark',
      fontSize: 14,
      proxy: {
        enabled: false,
        host: '',
        port: '',
        username: '',
        password: ''
      },
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
      },
      setProxy(proxyConfig: {
        enabled: boolean,
        host: string,
        port: string,
        username: string,
        password: string
      }) {
        this.proxy = proxyConfig
      }
    }
  }),
  persist: true
})

export default useStore