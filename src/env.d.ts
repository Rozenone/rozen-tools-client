/// <reference types="vite/client" />

declare module '@/utils/CommUtils' {
  export function getImageUrl(url: string): string
}

declare module '@/stores' {
  const useStore: () => {
    top: {
      leftDrawerOpen: boolean
      rightDrawerOpen: boolean
      toggleLeftDrawer: () => void
      toggleRightDrawer: () => void
    }
  }
  export default useStore
} 