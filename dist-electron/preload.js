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
  }
});
