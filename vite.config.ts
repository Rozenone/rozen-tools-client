import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import electron from "vite-plugin-electron"
import electronRenderer from "vite-plugin-electron-renderer"
import polyfillExports from "vite-plugin-electron-renderer"
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig(({ mode }) => ({
  base: mode == 'development' ? '' : './',
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    electron([{
      entry: "src-electron/index.ts", // 主进程文件
    },
      {
        entry: 'src-preload/preload.ts'
      }
    ]),
    quasar(),
    electronRenderer(),
    polyfillExports(),
  ],
  build: {
    emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
    outDir: "dist-electron"
  },
}))
