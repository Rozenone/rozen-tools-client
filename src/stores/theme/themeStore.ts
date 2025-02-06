import { defineStore } from 'pinia'
import { Dark } from 'quasar'

export interface ThemeState {
  isDark: boolean
  primaryColor: string
  backgroundColor: string
  backgroundImage: string | null
  accentColor: string
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false,
    primaryColor: '#1976D2',
    backgroundColor: '#f5f5f5',
    backgroundImage: null,
    accentColor: '#26A69A'
  }),
  
  actions: {
    toggleDarkMode() {
      this.isDark = !this.isDark
      Dark.set(this.isDark)
      this.backgroundColor = this.isDark ? '#121212' : '#f5f5f5'
      this.updateTheme()
    },
    
    setPrimaryColor(color: string | null) {
      if (color) {
        this.primaryColor = color
        this.updateTheme()
      }
    },
    
    setBackgroundImage(imageUrl: string | null) {
      this.backgroundImage = imageUrl
      this.updateTheme()
    },
    
    updateTheme() {
      document.body.classList.toggle('body--dark', this.isDark)
      document.documentElement.style.setProperty('--q-primary', this.primaryColor)
      document.documentElement.style.setProperty('--q-accent', this.accentColor)
      
      if (this.backgroundImage) {
        document.body.style.backgroundImage = `url(${this.backgroundImage})`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
      } else {
        document.body.style.backgroundImage = 'none'
        document.body.style.backgroundColor = this.backgroundColor
      }
    }
  },
  
  persist: true
}) 