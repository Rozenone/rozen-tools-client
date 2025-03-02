/// <reference types="vite/client" />

declare module '@/utils/CommUtils' {
  export function getImageUrl(url: string): string
}

declare module '@/utils/api' {
  export function testProxy(): Promise<{ ip: string }>
}

declare module '@/stores' {
  const useStore: () => {
    top: {
      leftDrawerOpen: boolean
      rightDrawerOpen: boolean
      theme: 'light' | 'dark'
      fontSize: number
      proxy: {
        enabled: boolean
        host: string
        port: string
        username: string
        password: string
      }
      toggleLeftDrawer: () => void
      toggleRightDrawer: () => void
      setTheme: (theme: 'light' | 'dark') => void
      setFontSize: (size: number) => void
      setProxy: (config: {
        enabled: boolean
        host: string
        port: string
        username: string
        password: string
      }) => void
    }
  }
  export default useStore
} 