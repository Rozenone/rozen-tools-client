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
      aiConfig: {
        enabled: false,
        apiKey: '',
        baseUrl: '',
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 2000
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
      },
      setAIConfig(config: {
        enabled: boolean
        apiKey: string
        baseUrl: string
        model: string
        temperature: number
        maxTokens: number
      }) {
        this.aiConfig = config
      }
    }
  }),
  persist: true
})

export default useStore