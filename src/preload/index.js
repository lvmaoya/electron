
// 在上下文隔离启用的情况下使用预加载
const { contextBridge, ipcRenderer, ipcMain } = require('electron')

contextBridge.exposeInMainWorld('ContextMenu', {
    show: () => {
        ipcRenderer.send('show-context-menu')
    }
})