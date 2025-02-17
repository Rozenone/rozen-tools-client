"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcCommon", {
  closeWindow: () => {
    electron.ipcRenderer.send("close-window", null);
  },
  minWindow: () => {
    electron.ipcRenderer.send("min-window", null);
  },
  maxWindow: () => {
    electron.ipcRenderer.send("max-window", null);
  },
  selectDirectory: () => {
    return electron.ipcRenderer.invoke("select-directory", null);
  },
  convertEncoding: (filePaths, sourceEncoding, targetEncoding, outputPath) => {
    return electron.ipcRenderer.invoke("convert-encoding", filePaths, sourceEncoding, targetEncoding, outputPath);
  }
});
