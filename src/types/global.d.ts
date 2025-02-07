interface Window {
  ipcCommon: {
    closeWindow: () => void
    minWindow: () => void
    maxWindow: () => void
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
} 