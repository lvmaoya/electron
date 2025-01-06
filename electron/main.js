// main.js

const { app, BrowserWindow, Tray, Menu, screen } = require('electron')
const NODE_ENV = process.env.env
const path = require('path')

let todoWindow = null;
let mainWindow = null;
let tray = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Todo App',
  })

  if (NODE_ENV === "development") {
    mainWindow.loadURL('http://localhost:3000/')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
  if (NODE_ENV === "development") {
    mainWindow.webContents.openDevTools()
  }

  //创建系统托盘
  tray = new Tray(path.join(__dirname, '../assets/todo.png'))
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
        { label: '新建待办',accelerator: 'Cmd+N', click: () => { console.log('New Todo clicked'); } },
        { label: '拾取待办',accelerator: 'Cmd+G', click: () => { console.log('New Todo clicked'); } },
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

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
