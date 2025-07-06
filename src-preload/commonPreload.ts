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
    },
    selectDirectory: () => {
        return ipcRenderer.invoke('select-directory', null);
    },
    convertEncoding: (filePaths: string[], sourceEncoding: string, targetEncoding: string, outputPath: string) => {
        return ipcRenderer.invoke('convert-encoding', filePaths, sourceEncoding, targetEncoding, outputPath);
    },
    searchCommonFilesInFolders: (folderPath: string, fileName: string) => {
        return ipcRenderer.invoke('search-common-files-in-folders', folderPath, fileName);
    }
})

export default {contextBridge}