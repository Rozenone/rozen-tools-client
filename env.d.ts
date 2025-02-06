/// <reference types="vite/client" />
//识别import.meta.env.VITE_XXX的类型

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '@/components/**/*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

interface ImportMetaEnv {
    readonly PRELOAD_VITE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

/**
 * window全局属性
 */
declare interface Window {
    ipcCommon: { closeWindow: string };
}

