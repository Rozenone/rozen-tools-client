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
      toggleLeftDrawer: () => void
      toggleRightDrawer: () => void
      setTheme: (theme: 'light' | 'dark') => void
    }
  }
  export default useStore
} 