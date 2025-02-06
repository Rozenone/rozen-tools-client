/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/components/*/*/*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@/stores' {
  const createStore: () => {
    top: any
  }
  export default createStore
}

declare global {
  interface Window {
    ipcCommon: {
      closeWindow: () => void
      minWindow: () => void
      maxWindow: () => void
    }
  }
}

export {} 