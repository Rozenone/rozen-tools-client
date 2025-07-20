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
    searchCommonFilesInFolders?: (folderPath: string, fileName: string) => Promise<any[]>;
  }
  electron?: {
    ipcRenderer: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  };
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
      fontSize: number
      proxy: {
        enabled: boolean
        host: string
        port: string
        username: string
        password: string
      }
      aiConfig: {
        enabled: boolean
        apiKey: string
        baseUrl: string
        model: string
        temperature: number
        maxTokens: number
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
      setAIConfig: (config: {
        enabled: boolean
        apiKey: string
        baseUrl: string
        model: string
        temperature: number
        maxTokens: number
      }) => void
    }
  }
  export default useStore
} 