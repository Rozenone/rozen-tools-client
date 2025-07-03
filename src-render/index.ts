import { app, BrowserWindow, Menu, ipcMain, dialog, IpcMainInvokeEvent } from "electron";
import fs from "fs";
import iconv from "iconv-lite";
import path from "path";
import axios from 'axios'
import ExcelJS from 'exceljs';

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

      for (const filePath of filePaths) {
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
        } catch {
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
  // 保存文件对话框
  ipcMain.handle('show-save-dialog', async (event, options) => {
    let win = BrowserWindow.getFocusedWindow();
    if (!win) {
      win = BrowserWindow.getAllWindows()[0] || undefined;
    }
    const result = await dialog.showSaveDialog(win, options);
    // 只返回 filePath 字段，避免克隆问题
    return result.filePath || '';
  });

  // 保存Excel文件
  ipcMain.handle('save-excel-file', async (event, { filePath, buffer }) => {
    fs.writeFileSync(filePath, buffer);
    return true;
  });

  // 选择Excel文件
  ipcMain.handle('select-excel-file', async () => {
    let win = BrowserWindow.getFocusedWindow();
    if (!win) {
      win = BrowserWindow.getAllWindows()[0] || undefined;
    }
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile', 'multiSelections'],
      filters: [{ name: 'Excel', extensions: ['xlsx', 'xls'] }]
    });
    if (result.canceled || !result.filePaths.length) return [];
    return result.filePaths;
  });

  // 读取Excel文件
  ipcMain.handle('read-excel-file', async (event, filePath) => {
    try {
      const buf = fs.readFileSync(filePath);
      return buf.toString('base64');
    } catch (e) {
      return '';
    }
  });

  // 批量格式化Excel（缩放、字体、字号、颜色、光标重置）
  ipcMain.handle('batch-format-excel', async (event, { filePaths, zoom, font, fontSize, fontColor, overwrite }) => {
    try {
      for (const filePath of filePaths) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        workbook.worksheets.forEach(ws => {
          // 缩放
          ws.views = [{ state: 'normal', zoomScale: zoom, activeCell: 'A1' }];
          // 字体、字号、颜色
          ws.eachRow({ includeEmpty: true }, (row) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
              cell.font = {
                name: font,
                size: fontSize,
                color: { argb: fontColor.replace('#', '').toUpperCase() }
              };
            });
          });
        });
        if (overwrite) {
          await workbook.xlsx.writeFile(filePath);
        } else {
          const dir = path.dirname(filePath);
          const base = path.basename(filePath, path.extname(filePath));
          const newPath = path.join(dir, `${base}_formatted.xlsx`);
          await workbook.xlsx.writeFile(newPath);
        }
      }
      return true;
    } catch (e) {
      return { success: false, message: e && e.message ? e.message : 'unknown error' };
    }
  });

  // 获取Excel文件的sheet数量
  ipcMain.handle('get-excel-sheet-count', async (event, filePath) => {
    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      return workbook.worksheets.length;
    } catch (e) {
      return '未知';
    }
  });
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
