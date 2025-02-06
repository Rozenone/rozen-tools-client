declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
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

interface ImportMetaEnv {
  readonly VITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 