import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipcCommon', {
    closeWindow: () => {
        ipcRenderer.send('close-window', null);
    },
    minWindow: () => {
        ipcRenderer.send('min-window',null);
    },
    maxWindow: () => {
        ipcRenderer.send('max-window', null);
    }
})

export default {contextBridge}