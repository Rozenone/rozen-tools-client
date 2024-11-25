import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import path from 'path'

const createWindow = () => {
  Menu.setApplicationMenu(null)
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      contextIsolation: true, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, './preload.js'),// 需要引用js文件
    },
  })

  // 如果打包了，渲染index.html
  if (process.env.NODE_ENV !== 'development') {
    win.loadFile(path.join(__dirname, './index.html'))
      .then(() => win.webContents.openDevTools())

  } else {
    const url: string = import.meta.env.VITE_URL // 本地启动的vue项目路径。注意：vite版本3以上使用的端口5173；版本2用的是3000
    win.loadURL(url).then(() =>
      win.on('ready-to-show', () => { // 窗口准备就绪后，显示窗口
        win.show()
      }),
    )

    win.webContents.openDevTools()
  }

  ipcMain.on('close-window', () => {
    win.destroy()
  })
  ipcMain.on('min-window', () => {
    win.minimize()
  })
  ipcMain.on('max-window', () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })
}

app.whenReady().then(() => {
  createWindow() // 创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 关闭窗口
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

export default createWindow