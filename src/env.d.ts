/// <reference types="vite/client" />

declare module '@/utils/CommUtils' {
  export function getImageUrl(url: string): string
}

declare module '@/stores' {
  const useStore: () => {
    top: {
      leftDrawerOpen: boolean
      rightDrawerOpen: boolean
      theme: 'light' | 'dark'
      fontSize: number
      toggleLeftDrawer: () => void
      toggleRightDrawer: () => void
      setTheme: (theme: 'light' | 'dark') => void
      setFontSize: (size: number) => void
    }
  }
  export default useStore
} 