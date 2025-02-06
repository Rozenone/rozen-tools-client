"use strict";
const electron = require("electron");
const path = require("path");
const createWindow = () => {
  electron.Menu.setApplicationMenu(null);
  electron.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' 'unsafe-inline'; img-src 'self' data: blob: 'unsafe-inline'"
        ]
      }
    });
  });
  const win = new electron.BrowserWindow({
    frame: false,
    webPreferences: {
      contextIsolation: true,
      // 是否开启隔离上下文
      nodeIntegration: true,
      // 渲染进程使用Node API
      preload: path.join(__dirname, "./preload.js"),
      // 需要引用js文件
      webSecurity: false
      // 添加这行来禁用 CSP
    }
  });
  if (process.env.NODE_ENV !== "development") {
    win.loadFile(path.join(__dirname, "./index.html")).then(() => win.webContents.openDevTools());
  } else {
    const url = "http://localhost:5173";
    win.loadURL(url).then(
      () => win.on("ready-to-show", () => {
        win.show();
      })
    );
    win.webContents.openDevTools();
  }
  electron.ipcMain.on("close-window", () => {
    win.destroy();
  });
  electron.ipcMain.on("min-window", () => {
    win.minimize();
  });
  electron.ipcMain.on("max-window", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
};
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
module.exports = createWindow;
