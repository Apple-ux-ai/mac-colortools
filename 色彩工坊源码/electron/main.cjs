/**
 * 功能：Electron 主进程入口
 * 作者：FullStack-Guardian
 * 更新时间：2026-01-06
 */
const { app, BrowserWindow, ipcMain, shell, nativeImage } = require('electron');
const path = require('path');
const { checkUpdate } = require('./update.cjs');

// 显式设置 AppUserModelId，这是修复 Windows 任务栏图标异常的关键
if (process.platform === 'win32') {
  app.setAppUserModelId('com.kunqiong.color-workshop');
}

ipcMain.on('window-min', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('window-max', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
});

ipcMain.on('window-close', () => {
  app.quit();
});

function createWindow() {
  // 使用 PNG 图片作为窗口图标，避免 ICO 缩放导致的不完整问题
  const iconPath = path.join(__dirname, 'icon.png');
  const image = nativeImage.createFromPath(iconPath);

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    title: '色彩工坊',
    icon: image, // 使用 nativeImage 包装
    frame: true, // 启用系统原生标题栏，彻底解决点击问题
    autoHideMenuBar: true,
    titleBarStyle: 'default', // 使用默认样式
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // 再次显式设置任务栏图标（双重保障）
  if (process.platform === 'win32') {
    win.setIcon(image);
  }

  // 彻底移除菜单栏
  win.setMenu(null);

  // 在开发环境下加载 Vite 预览，生产环境下加载 index.html
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    const port = process.env.VITE_PORT || 5174;
    win.loadURL(`http://localhost:${port}`);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  
  // 启动后检查更新
  checkUpdate();

  // 监听手动检查更新
  ipcMain.on('check-for-update', () => {
    checkUpdate(true);
  });


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// TODO-Guardian: 注册桌面级 IPC 通信 (如屏幕拾色接口)
