/// <reference types="vite/client" />
//识别import.meta.env.VITE_XXX的类型

declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<object, object, unknown>
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

