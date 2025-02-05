// main.js

const { app, BrowserWindow, Tray, Menu, screen, contextBridge,ipcMain  } = require('electron')
const NODE_ENV = process.env.env
const path = require('path')
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

let todoWindow = null;
let mainWindow = null;
let tray = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'customButtonsOnHover',
    title: 'Todo App',
    transparent: true,
    frame: false,
    vibrancy: 'fullscreen-ui',    // on MacOS
    backgroundMaterial: 'acrylic', // on Windows 11
    resizable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, '../preload/index.js')
    },
  })
  
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  //创建系统托盘
  tray = new Tray(path.join(__dirname, '../../resource/todo.png'))
  tray.setToolTip('Todo App');
  tray.on('click', (event, bounds) => {
    if (todoWindow && todoWindow.isVisible()) {
      todoWindow.hide();
    } else {
      createTodoWindow(bounds);
    }
  });

  // 创建应用菜单
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { label: '新建待办           [⌘R]' },
        { label: '拾取待办           [⌘G]' },
        { label: 'Exit', click: () => { app.quit(); } }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Learn More', click: () => { console.log('Learn More clicked'); } }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);

  mainWindow.webContents.on('message', (event, message) => {
    console.log(`Received message: ${message}`)
  })
}
const createTodoWindow = (trayBounds) => {
  if (todoWindow) {
    todoWindow.show();
    return;
  }

  const { x, y, width, height } = trayBounds;
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  todoWindow = new BrowserWindow({
    width: 300,
    height: 400,
    x: Math.min(x, screenWidth - 300),
    y: y + height,
    frame: false,
    show: false,
    transparent: true,
    vibrancy: 'ultra-dark',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  todoWindow.loadFile(path.join(__dirname, './todoWindow.html'));

  todoWindow.on('blur', () => {
    todoWindow.hide();
  });

  todoWindow.once('ready-to-show', () => {
    todoWindow.show();
  });
}
ipcMain.on('show-context-menu1', (event) => {
  const template = [
    {
      label: 'Menu Item 1',
      click: () => { event.sender.send('context-menu-command', 'menu-item-1') }
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  menu.popup({ window: BrowserWindow.fromWebContents(event.sender) })
})
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
