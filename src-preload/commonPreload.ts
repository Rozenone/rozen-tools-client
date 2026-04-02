import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('ipcCommon', {
    closeWindow: () => {
        ipcRenderer.send('close-window', null);
    },
    minWindow: () => {
        ipcRenderer.send('min-window', null);
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
    },
    generateFolderTree: (folderPath: string) => {
        return ipcRenderer.invoke('generate-folder-tree', folderPath);
    },
    openPath: (targetPath: string) => {
        return ipcRenderer.invoke('open-path', targetPath);
    },
    startKeepAwake: () => {
        return ipcRenderer.invoke('start-keep-awake');
    },
    stopKeepAwake: () => {
        return ipcRenderer.invoke('stop-keep-awake');
    }
})

export default { contextBridge }