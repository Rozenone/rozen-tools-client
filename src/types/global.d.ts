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
  const component: DefineComponent<{}, {}, any>
  export default component
} 