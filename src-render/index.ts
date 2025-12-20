import { app, BrowserWindow, Menu, ipcMain, dialog, IpcMainInvokeEvent, shell } from "electron";
import fs from "fs";
import iconv from "iconv-lite";
import path from "path";
import axios from 'axios'
import ExcelJS from 'exceljs';

const createWindow = () => {
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '蔷薇tools',
    frame: false,
    icon: path.join(__dirname, "../src/assets/img/avatar/profile.jpg"),
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
          let fileContent = iconv.decode(fileBuffer, sourceEncoding);

          // 确保文件内容使用CRLF换行符
          // 先将所有CRLF转换为LF，再统一转换为CRLF
          fileContent = fileContent.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

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
  ipcMain.handle('batch-format-excel', async (event, { filePaths, zoom, font, fontSize, fontColor, overwrite, savePath }) => {
    try {
      for (const filePath of filePaths) {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);
        // 先统一设置所有sheet的视图和字体
        workbook.worksheets.forEach((ws, idx) => {
          // 缩放、光标重置
          ws.views = [{ state: 'normal', zoomScale: zoom, activeCell: 'A1' }];
          // 字体、字号、颜色，确保所有单元格都设置
          const maxRow = ws.rowCount;
          const maxCol = ws.columnCount;
          for (let r = 1; r <= maxRow; r++) {
            for (let c = 1; c <= maxCol; c++) {
              const cell = ws.getCell(r, c);
              cell.font = {
                name: font,
                size: fontSize,
                color: { argb: fontColor.replace('#', '').toUpperCase() }
              };
            }
          }
        });
        // 设置第一个sheet为活动sheet
        if (workbook.worksheets.length > 0) {
          workbook.views = [{
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            firstSheet: 0,
            activeTab: 0,
            visibility: 'visible'
          }];
        }
        // 设置ExcelJS使用CRLF换行符
        workbook.creator = workbook.creator || 'rozen-tools';
        workbook.lastModifiedBy = workbook.lastModifiedBy || 'rozen-tools';
        workbook.created = workbook.created || new Date();
        workbook.modified = new Date();

        // ExcelJS在写入时，单元格中的换行符会被自动处理
        if (overwrite) {
          await workbook.xlsx.writeFile(filePath);
        } else {
          if (savePath) {
            await workbook.xlsx.writeFile(savePath);
          } else {
            const dir = path.dirname(filePath);
            const base = path.basename(filePath, path.extname(filePath));
            const newPath = path.join(dir, `${base}_formatted.xlsx`);
            await workbook.xlsx.writeFile(newPath);
          }
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
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      return workbook.worksheets.length;
    } catch (e) {
      return '未知';
    }
  });

  // 共通文件检索：遍历所有一级子文件夹并读取指定文件内容
  ipcMain.handle('search-common-files-in-folders', async (event, folderPath, fileName) => {
    try {
      const result: any[] = [];
      // 获取所有一级子文件夹
      const subFolders = fs.readdirSync(folderPath, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => path.join(folderPath, d.name));
      for (const subFolder of subFolders) {
        const targetFile = path.join(subFolder, fileName);
        if (fs.existsSync(targetFile)) {
          try {
            const content = fs.readFileSync(targetFile, 'utf-8');
            result.push({
              folder: path.basename(subFolder),
              content
            });
          } catch (e) {
            result.push({
              folder: path.basename(subFolder),
              content: '[读取失败]'
            });
          }
        }
      }
      return result;
    } catch (err) {
      return [];
    }
  });

  // 在外部浏览器中打开链接
  ipcMain.handle('open-external-url', async (event, url: string) => {
    try {
      await shell.openExternal(url);
      return { success: true };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'unknown error' };
    }
  });

  // 打开本地文件或文件夹
  ipcMain.handle('open-path', async (event, targetPath: string) => {
    try {
      if (!fs.existsSync(targetPath)) {
        return { success: false, message: '路径不存在' };
      }
      const result = await shell.openPath(targetPath);
      if (result) {
        // openPath 返回非空字符串表示错误
        return { success: false, message: result };
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'unknown error'
      };
    }
  });

  // 生成文件夹文档树
  ipcMain.handle('generate-folder-tree', async (event, folderPath: string) => {
    try {
      // 定义树节点类型
      interface TreeNode {
        name: string;
        path: string;
        type: 'file' | 'folder';
        children?: TreeNode[];
        size?: number;
        modifiedTime?: string;
      }

      // 递归遍历文件夹生成树形结构
      const buildTree = (dirPath: string, relativePath: string = ''): TreeNode | null => {
        try {
          const stats = fs.statSync(dirPath);

          if (stats.isDirectory()) {
            const node: TreeNode = {
              name: path.basename(dirPath),
              path: relativePath || dirPath,
              type: 'folder',
              children: [],
              modifiedTime: stats.mtime.toISOString()
            };

            // 读取目录内容
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });

            // 排序：文件夹在前，文件在后，然后按名称排序
            entries.sort((a, b) => {
              if (a.isDirectory() && !b.isDirectory()) return -1;
              if (!a.isDirectory() && b.isDirectory()) return 1;
              return a.name.localeCompare(b.name);
            });

            for (const entry of entries) {
              const fullPath = path.join(dirPath, entry.name);
              const childRelativePath = relativePath
                ? path.join(relativePath, entry.name)
                : fullPath;

              const childNode = buildTree(fullPath, childRelativePath);
              if (childNode) {
                node.children!.push(childNode);
              }
            }

            return node;
          } else if (stats.isFile()) {
            return {
              name: path.basename(dirPath),
              path: relativePath || dirPath,
              type: 'file',
              size: stats.size,
              modifiedTime: stats.mtime.toISOString()
            };
          }

          return null;
        } catch (error) {
          // 忽略无法访问的文件/文件夹
          return null;
        }
      };

      const tree = buildTree(folderPath);

      if (!tree) {
        return { success: false, message: '无法读取文件夹' };
      }

      return { success: true, tree };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'unknown error'
      };
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
