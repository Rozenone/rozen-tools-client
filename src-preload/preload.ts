import './commonPreload.ts';
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (...args: unknown[]) => ipcRenderer.invoke.apply(ipcRenderer, args),
    on: (channel: string, listener: (...args: any[]) => void) => ipcRenderer.on(channel, listener),
    // 可根据需要扩展更多方法
  }
})