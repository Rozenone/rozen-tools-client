import { app, BrowserWindow, Menu, ipcMain, dialog, IpcMainInvokeEvent } from "electron";
import fs from "fs";
import iconv from "iconv-lite";
import path from "path";
import axios from 'axios'

const createWindow = () => {
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    frame: false,
    webPreferences: {
      contextIsolation: true, // 是否开启隔离上下文
      nodeIntegration: true, // 渲染进程使用Node API
      preload: path.join(__dirname, "./preload.js"), // 需要引用js文件
    },
  });

  // 如果打包了，渲染index.html
  if (process.env.NODE_ENV !== "development") {
    win
      .loadFile(path.join(__dirname, "./index.html"))
      .then(() => win.webContents.openDevTools());
  } else {
    const url: string = process.env.VITE_URL || "http://localhost:5173"; // 本地启动的vue项目路径。
    win.loadURL(url).then(() =>
      win.on("ready-to-show", () => {
        // 窗口准备就绪后，显示窗口
        win.show();
      })
    );

    win.webContents.openDevTools();
  }

  // 窗口处理
  ipcMain.on("close-window", () => {
    win.destroy();
  });
  ipcMain.on("min-window", () => {
    win.minimize();
  });
  ipcMain.on("max-window", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });
  // 选择目录
  ipcMain.handle("select-directory", async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
    return result.canceled ? null : result.filePaths[0];
  });
  // 转换编码
  ipcMain.handle(
    "convert-encoding",
    async (
      event: IpcMainInvokeEvent,
      filePaths: string[],
      sourceEncoding: string,
      targetEncoding: string,
      outputPath: string
    ) => {
        let successCount = 0;
        let failCount = 0;

        for(const filePath of filePaths) {
          try {
            const fileName = path.basename(filePath);
            const outputFilePath = path.join(outputPath, fileName);

            // 读取文件内容 写入文件
            const fileBuffer = fs.readFileSync(filePath);
            const fileContent = iconv.decode(fileBuffer, sourceEncoding);

           // 将文件内容转码到目标编码，并写入新文件
          const outputBuffer = iconv.encode(fileContent, targetEncoding);
          fs.writeFileSync(outputFilePath, outputBuffer);
            successCount++;
          }catch {
            failCount++;
            failCount++;
          }
        }
        return {
          successCount,
          failCount
        }
    }
  );
  // 测试代理请求
  ipcMain.handle('test-proxy-request', async (event, proxyConfig, testUrl) => {
    try {
      const { protocol, host, port, username, password } = proxyConfig
      const proxy = {
        protocol,
        host,
        port: Number(port),
        auth: username ? { username, password } : undefined
      }
      const response = await axios.get(testUrl, { proxy })
      return { success: true, status: response.status }
    } catch (e) {
      return { success: false, message: e.message }
    }
  })
};

// 窗口准备事件
app.whenReady().then(() => {
  createWindow(); // 创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭窗口
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

export default createWindow;
