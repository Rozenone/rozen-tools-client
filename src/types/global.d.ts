interface Window {
  ipcCommon: {
    closeWindow: () => void
    minWindow: () => void
    maxWindow: () => void
    selectDirectory: () => Promise<string | null>
    convertEncoding: (
      files: string[],
      sourceEnc: string,
      targetEnc: string,
      outputPath: string
    ) => Promise<{ successCount: number; failCount: number }>
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
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