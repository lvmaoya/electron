// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow,Tray,Menu } = require('electron')
const NODE_ENV = process.env.env
const path = require('path')
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  }) 

  // 加载 index.html
  if (NODE_ENV === "development") {
    mainWindow.loadURL('http://localhost:3000/')
    // mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }else{
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
  if (NODE_ENV === "development") {
    mainWindow.webContents.openDevTools()
  }

  //创建系统托盘
  const tray = new Tray(path.join(__dirname, '../assets/todo.png'))

  // 托盘右键菜单
  const contextMenu = Menu.buildFromTemplate([
    { label: 'About', click: () => { console.log('About clicked') } },
    { type: 'separator' },
    { label: 'Quit', click: () => { app.quit() } }
  ])
  tray.setToolTip('Todo App');
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
  // 接收来自 renderer进程的消息
  mainWindow.webContents.on('message', (event, message) => {
    console.log(`Received message: ${message}`)
  })

}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。